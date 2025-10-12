import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

import PDF from '../models/PDF.js';
import { config } from '../config/config.js';

class EmbeddingService {
  constructor() {
    this.pinecone = new Pinecone({
      apiKey: config.pinecone.apiKey
    });

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: config.openai.apiKey,
      modelName: config.openai.embeddingModel
    });
  }

  async createEmbeddingsForPDF(pdfId) {
    try {
      // Get PDF from database
      console.log("in side the service")
      const pdf = await PDF.findById(pdfId);
      console.log("after pdf")
      if (!pdf) {
        throw new Error('PDF not found');
      }

      if (pdf.isEmbedded) {
        return {
          success: true,
          message: 'Embeddings already created for this PDF.',
          alreadyEmbedded: true
        };
      }

      
      // Initialize Pinecone index
      const index = this.pinecone.Index(config.pinecone.indexName);

      // Create text splitter
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: config.chunking.chunkSize,
        chunkOverlap: config.chunking.chunkOverlap,
      });

      // Process each page
      const documents = [];

      for (const page of pdf.pages) {
        const pageText = page.text;

        // Split page into chunks if needed
        if (pageText.length > config.chunking.chunkSize) {
          const chunks = await splitter.splitText(pageText);

          chunks.forEach((chunk, chunkIndex) => {
            documents.push({
              pageContent: chunk,
              metadata: {
                pdfId: pdfId.toString(),
                userId: pdf.userId.toString(),
                pageNumber: page.pageNumber,
                chunkIndex: chunkIndex,
                totalChunks: chunks.length,
                fileName: pdf.fileName
              }
            });
          });
        } else {
          // Page is small enough to be one chunk
          documents.push({
            pageContent: pageText,
            metadata: {
              pdfId: pdfId.toString(),
              userId: pdf.userId.toString(),
              pageNumber: page.pageNumber,
              chunkIndex: 0,
              totalChunks: 1,
              fileName: pdf.fileName
            }
          });
        }
      }

    
      await PineconeStore.fromDocuments(
        documents,
        this.embeddings,
        {
          pineconeIndex: index,
          namespace: pdfId.toString(),
        }
      );

      // Update PDF status
      pdf.isEmbedded = true;
      pdf.status = 'ready';
      await pdf.save();

      return {
        success: true,
        documentCount: documents.length,
        pageCount: pdf.pages.length
      };

    } catch (error) {
      console.error('Error creating embeddings:', error);

      // Update PDF with error status
      await PDF.findByIdAndUpdate(pdfId, {
        status: 'error',
        errorMessage: error.message
      });

      throw error;
    }
  }

  async getVectorStore(pdfId) {
    const index = this.pinecone.Index(config.pinecone.indexName);

    return new PineconeStore(this.embeddings, {
      pineconeIndex: index,
      namespace: pdfId.toString(),
    });
  }
}

export default new EmbeddingService();
