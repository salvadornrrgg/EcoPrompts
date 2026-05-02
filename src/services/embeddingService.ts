import { getVectorStore } from "../lib/vectorStore";
import { Document } from "@langchain/core/documents";


// é preciso chamar o getVectorStore dentro de cada funcao pelo mesmo erro de top-level await!
export const indexPrompt = async (conteudo: string, metadata: number) => {
    const vectorStore = await getVectorStore();

    const docs: Document[] = [
        new Document({
            pageContent: conteudo,
            metadata: { promptId: metadata }
        }),
    ];

    await vectorStore.addDocuments(docs);
}

export const searchEmbeddedPrompts = async (conteudo: string) => {
    const vectorStore = await getVectorStore();

    const resultados = await vectorStore.similaritySearchWithScore(conteudo, 100);  //100 é o numero de resultados que esta pesquisa retorna

    resultados.forEach(([doc, score]: [Document, number]) => {
        console.log(score, doc.pageContent);
    });

    const filtrados = resultados.filter(([doc, score]: [Document, number]) => score < 0.4);
    
    const promptIds = filtrados.map(([doc, score]: [Document, number]) => doc.metadata.promptId);
    
    return promptIds;
}