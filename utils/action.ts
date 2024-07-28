import { GoogleGenerativeAI } from "@google/generative-ai";

interface Chat {
    role: "user" | "model";
    parts: string;
}

const genAI = new GoogleGenerativeAI("AIzaSyCNxL1UQlsV8ojQNJO4ViU3SyjqrVrr7Yw");

export async function run(prompt: string, history: Chat[]) {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.0-pro-001" })

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
