import { ChatOpenAI } from '@langchain/openai';
//
// import { ConversationalRetrievalQAChain } from 'langchain/chains';
// import { BufferWindowMemory } from 'langchain/memory';
import { ConversationalRetrievalQAChain } from '@langchain/community/chains/conversational_retrieval_qa';
import { BufferWindowMemory } from '@langchain/community/memory/buffer_window_memory';
//

import { ChatMessage } from '../models/ChatMessage.js';
import { ChatSession } from '../models/ChatSession.js';
import embeddingService from './embeddingService.js';
import { config } from '../config/config.js';

class ChatService {
  constructor() {
    this.llm = new ChatOpenAI({
      openAIApiKey: config.openai.apiKey,
      modelName: config.openai.chatModel,
      temperature: config.openai.temperature,
      maxTokens: config.openai.maxTokens
    });
  }

  async createSession(userId, pdfId, title = 'New Chat') {
    const session = await ChatSession.create({
      userId,
      pdfId,
      title
    });

    return session;
  }

  async sendMessage(sessionId, userMessage) {
  try {
    // 1️⃣ Get chat session and verify embedding state
    const session = await ChatSession.findById(sessionId).populate('pdfId');
    if (!session) {
      throw new Error('Session not found');
    }

    if (!session.pdfId.isEmbedded) {
      throw new Error('PDF embeddings not ready. Please create embeddings first.');
    }

    // 2️⃣ Load vector store for this PDF
    const vectorStore = await embeddingService.getVectorStore(session.pdfId._id.toString());

    // 3️⃣ Load recent chat history for context memory
    const previousMessages = await ChatMessage.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    const memory = new BufferWindowMemory({
      k: 5,
      memoryKey: 'chat_history',
      inputKey: 'question',
      outputKey: 'text',
      returnMessages: true,
    });

    for (const msg of previousMessages.reverse()) {
      if (msg.role === 'user') {
        await memory.chatHistory.addUserMessage(msg.message);
      } else {
        await memory.chatHistory.addAIChatMessage(msg.message);
      }
    }

    // 4️⃣ Retrieve relevant chunks from Pinecone manually
    const retriever = vectorStore.asRetriever({ k: 5 });
    const docs = await retriever.getRelevantDocuments(userMessage);

    // 5️⃣ Manually format context with page numbers
    const formattedContext = docs
      .map(
        (d) =>
          `----Page: ${d.metadata.pageNumber}----:\n${d.pageContent.trim()}`
      )
      .join("\n\n---\n\n");

    // 6️⃣ Build the chain with updated template
    const chain = ConversationalRetrievalQAChain.fromLLM(
      this.llm,
      vectorStore.asRetriever({ k: 5 }),
      {
        memory,
        returnSourceDocuments: true,

       questionGeneratorTemplate: `
Given the following chat history and the user's latest message,
rephrase the follow-up question into a standalone question that can be understood without the previous context.

Chat History:
{chat_history}

Follow-up Question:
{question}

Rephrased Standalone Question:`, 

qaTemplate: `
You are an expert AI assistant helping users understand their PDF document.

You are given multiple text excerpts, each labeled with a "----Page:X----" prefix.
Use these page numbers naturally in your explanation (for example: "As explained on page 3...").

Follow these rules when writing your answer:
1️. Organize your answer using **markdown-style headers** for clarity.  
2️. Write clear, concise **paragraphs** to explain concepts — avoid bullet points.  
3️. At the end, include a separate paragraph titled "📄 Page References" listing all pages that directly support your answer.  
4️. Do **not** make up page numbers or information not found in the provided context.
5. only provide page number in you explanation if you saw "----page:x----" in the provided context, otherwise avoid 

If the answer cannot be found in the provided context, say:
> "I couldn’t find enough information in the provided pages to answer this question."

---
Context (each section starts with "Page X:"):
{context}

Question:
{question}

---
Helpful Answer (well-structured markdown + verified page references):`


      }
    );

    // 7️⃣ Call the LLM chain with custom formatted context
    const response = await chain.call({
      question: userMessage,
      context: formattedContext,
    });

    // 8️⃣ Collect actual page references from retrieved docs
    const pageReferences = [
      ...new Set(docs.map((d) => d.metadata.pageNumber)),
    ].sort((a, b) => a - b);

    // 9️⃣ Save user message
    await ChatMessage.create({
      sessionId,
      role: 'user',
      message: userMessage,
      pageReferences: [],
    });

    // 1️⃣0️⃣ Save assistant message
    await ChatMessage.create({
      sessionId,
      role: 'assistant',
      message: response.text,
      pageReferences,
    });

    // 1️⃣1️⃣ Update session activity timestamp
    session.lastActivityAt = new Date();
    await session.save();

    // 1️⃣2️⃣ Return final formatted response
    return {
      message: response.text,
      pageReferences,
      sourceChunks: docs.map((doc) => ({
        pageNumber: doc.metadata.pageNumber,
        chunkIndex: doc.metadata.chunkIndex,
        text: doc.pageContent.substring(0, 200) + "...", // Preview
      })),
    };
  } catch (error) {
    console.error("Error in chat service:", error);
    throw error;
  }
}


  
  formatResponseWithPages(response, pageNumbers) {
    if (pageNumbers.length === 0) return response;

    const pageRefs = pageNumbers.length === 1
      ? `(Page ${pageNumbers[0]})`
      : `(Pages ${pageNumbers.join(', ')})`;

    // Add page references to response if not already present
    if (!response.includes('Page') && !response.includes('page')) {
      return `${response}\n\n${pageRefs}`;
    }

    return response;
  }

  async getChatHistory(sessionId, limit = 50, skip = 0) {
    const messages = await ChatMessage.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return messages;
  }

  async getSessionsForPDF(pdfId, userId) {
    const sessions = await ChatSession.find({ pdfId, userId })
      .sort({ lastActivityAt: -1 })
      .lean();

    return sessions;
  }

  
  async getAllSessionsForUser(userId) {
    const sessions = await ChatSession.find({ userId })
      .populate("pdfId", "fileName s3Url pageCount") 
      .sort({ lastActivityAt: -1 })
      .lean();

    return sessions.map(session => ({
      _id: session._id,
      title: session.title,
      pdfId: session.pdfId._id,
      pdfName: session.pdfId.fileName,
      pdfUrl: session.pdfId.s3Url,
      lastActivityAt: session.lastActivityAt,
      createdAt: session.createdAt
    }));
  }

}

export default new ChatService();



