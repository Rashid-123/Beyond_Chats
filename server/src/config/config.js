export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    embeddingModel: 'text-embedding-3-large',
    chatModel: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    indexName: process.env.PINECONE_INDEX_NAME
  },
  chunking: {
    chunkSize: 1000,
    chunkOverlap: 200
  }
};