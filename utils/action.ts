import { GoogleGenerativeAI } from "@google/generative-ai";

interface Chat {
    role: "user" | "model";
    parts: string;
}

const genAI = new GoogleGenerativeAI("AIzaSyD9Uh5kLfyrYUS-FJzYCTG6ie0gz8x-Pvc");

export async function run(prompt: string, history: Chat[]) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 1000,
        }
    })

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const output = response.text()

    return output
}
