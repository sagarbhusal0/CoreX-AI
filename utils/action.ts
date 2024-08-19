import { GoogleGenerativeAI } from "@google/generative-ai";

interface Chat {
    role: "user" | "model";
    parts: string;
}
// api key here.
const genAI = new GoogleGenerativeAI("AIzaSyD9Uh5kLfyrYUS-FJzYCTG6ie0gz8x-Pvc");

export async function run(prompt: string, history: Chat[]) {
    // Chatbot model here
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 8192,
             temperature: 0.6,
             topP: 1,
        }
    })
// working method
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const output = response.text()

    return output
}
