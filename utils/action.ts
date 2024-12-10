import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD9Uh5kLfyrYUS-FJzYCTG6ie0gz8x-Pvc");

export async function run(prompt: string) {
    try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}