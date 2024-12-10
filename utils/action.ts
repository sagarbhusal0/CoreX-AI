import { GoogleGenerativeAI } from "@google/generative-ai";
import { Chat } from "@/types/chat";

const genAI = new GoogleGenerativeAI("AIzaSyD9Uh5kLfyrYUS-FJzYCTG6ie0gz8x-Pvc");

export async function run(prompt: string, history: Chat[], image?: string | null) {
    if (image) {
        // Use Gemini Pro Vision for image analysis
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        try {
            const imagePart = {
                inlineData: {
                    data: image.split(',')[1],
                    mimeType: "image/jpeg"
                }
            };
            
            const result = await model.generateContent([
                { text: prompt },
                imagePart
            ]);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Error processing image:", error);
            throw new Error("Failed to process image");
        }
    } else {
        // Use Gemini Pro for text chat
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        try {
            const chat = model.startChat({
                history: history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts }]
                })),
                generationConfig: {
                    maxOutputTokens: 11192,
                    temperature: 0.7,
                    topP: 1,
                }
            });

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Error in chat:", error);
            throw new Error("Failed to get response");
        }
    }
}