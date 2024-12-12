import { GoogleGenerativeAI } from "@google/generative-ai";
import { Chat } from "@/types/chat";

const genAI = new GoogleGenerativeAI("AIzaSyB3g-850LPZa6EpLT--i0JeZNe4owYgXX0");

export async function run(prompt: string, history: Chat[] = [], image?: string | null) {
    try {
        if (image) {
            // Use Gemini Pro Vision for image analysis
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const imagePart = {
                inlineData: {
                    data: image.split(',')[1],
                    mimeType: "image/jpeg"
                }
            };
            
            const result = await model.generateContent([
                { text: prompt || "What's in this image?" },
                imagePart
            ]);
            
            if (!result.response) throw new Error("No response from model");
            return result.response.text();
            
        } else {
            // Use Gemini Pro for text chat
            const model = genAI.getGenerativeModel({ model: "tunedModels/core-x-ai-svs1m92we74u" });
            
            // Format history for the API
            const formattedHistory = history.map(msg => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.parts }]
            }));
            
            const chat = model.startChat({
                history: formattedHistory,
                generationConfig: {
                    maxOutputTokens: 4096,
                    temperature: 0.8,
                    topP: 0.8,
                    topK: 40
                }
            });

            const result = await chat.sendMessage(prompt);
            if (!result.response) throw new Error("No response from model");
            return result.response.text();
        }
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}
