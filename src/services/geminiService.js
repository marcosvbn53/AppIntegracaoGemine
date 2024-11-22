
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINE_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Função assíncrona que gera uma descrição textual para uma imagem utilizando o modelo Gemini
export default async function gerarDescricaoComGemini(promptComplemento,imageBuffer) {
    // Define o prompt que será enviado para o modelo, solicitando a geração de um alt text em português
    const prompt = `Gere uma descrição em português do brasil para ${promptComplemento} ` ;

    // Bloco try-catch para tratar possíveis erros durante a execução
    try {
        // Prepara a imagem para ser enviada ao modelo, convertendo-a para base64
        const image = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/png"
            }
        };

        // Envia o prompt e a imagem para o modelo e aguarda a resposta
        const res = await model.generateContent([prompt, image]);

        // Extrai o texto gerado pelo modelo e o retorna. Se não houver texto, retorna uma mensagem padrão
        res.response.text() || "Alt-text não disponível.";
        return res.response.text() || "Alt-text não disponível"
    } catch (erro) {
        // Caso ocorra um erro, registra-o no console e lança uma nova exceção com uma mensagem mais amigável
        console.error("Erro ao obter alt-text:", erro.message, erro);
        throw new Error("Erro ao obter o alt-text do Gemine.");
    }
}


