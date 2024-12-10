import { GoogleGenerativeAI } from "@google/generative-ai";

interface Chat {
    role: "user" | "model";
    parts: string;
    image?: string;
}

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

export async function run(prompt: string, history: Chat[], image?: string | null) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    if (image) {
        // Convert base64 image to uint8array for Gemini
        async function fileToGenerativePart(base64Data: string) {
            const base64Content = base64Data.split(',')[1];
            const binaryContent = atob(base64Content);
            const bytes = new Uint8Array(binaryContent.length);
            for (let i = 0; i < binaryContent.length; i++) {
                bytes[i] = binaryContent.charCodeAt(i);
            }
            return {
                inlineData: {
                    data: base64Content,
                    mimeType: "image/jpeg"
                }
            };
        }

        const imagePart = await fileToGenerativePart(image);
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } else {
        // Regular text chat without image
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 11192,
                temperature: 1,
                topP: 1,
            }
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();
    }
}
