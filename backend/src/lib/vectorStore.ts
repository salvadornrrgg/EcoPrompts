import { OllamaEmbeddings } from "@langchain/ollama";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";

const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large",
  baseUrl: process.env.OLLAMA_BASE_URL,
});


//foi preciso optar por esta abordagem pois se for chamado o "await PGVectorStore.initialize(..." dá erro de top-lever await
//--> Singleton
let vectorStoreInstance: PGVectorStore;

export const getVectorStore = async () => {
    if (!vectorStoreInstance) {
        vectorStoreInstance = await PGVectorStore.initialize(embeddings, {
            postgresConnectionOptions: {
                connectionString: process.env.DATABASE_URL,
            },
            tableName: "documents",
            columns: {
                idColumnName: "id",
                vectorColumnName: "embedding",
                contentColumnName: "content",
                metadataColumnName: "metadata",
            },
        });
    }
    return vectorStoreInstance;
};




