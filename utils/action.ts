import { GoogleGenerativeAI } from "@google/generative-ai";
interface Chat {
    role: "user" | "model";
    parts: string;
}
// api key here.
const genAI = new GoogleGenerativeAI("AIzaSyB3g-850LPZa6EpLT--i0JeZNe4owYgXX0");

export async function run(prompt: string, history: Chat[]) {
    // Chatbot model here
   
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 11192,
             temperature: 1,
             topP: 1,
        }
    })
// working method
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const output = response.text()
    return output
}
