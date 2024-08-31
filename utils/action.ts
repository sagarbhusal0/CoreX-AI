import { GoogleGenerativeAI } from "@google/generative-ai";

interface Chat {
    role: "user" | "model";
    parts: string;
}

// API key here.
const genAI = new GoogleGenerativeAI("AIzaSyD9Uh5kLfyrYUS-FJzYCTG6ie0gz8x-Pvc");

const predefinedResponses = {
    "Hello": "Hi! I'm CoreX AI, your AI assistant. I can help with homework, brainstorm ideas, or just chat. What can I do for you today?",
    "Hi": "Hi! I'm CoreX AI, your AI assistant. I can help with homework, brainstorm ideas, or just chat. What can I do for you today?",
    "Hey": "Hi! I'm CoreX AI, your AI assistant. I can help with homework, brainstorm ideas, or just chat. What can I do for you today?",
    "Who is your Owner ?": "It's Sagar Bhusal. He is Server Expert, JR. AI engineer , JR. Software Developer And SR. Website Developer With experience of 6 years.",
    "your owner name": "It's Sagar Bhusal. He is Server Expert, JR. Software Developer And SR. Website Developer With experience of 6 years.",
    "Are You Gemini": "No, I am CoreX AI. Made By Sagar Bhusal. He is from Nepal.",
    "is your owner name is google": "No, it's Sagar Bhusal. He is Server Expert, JR. Software Developer And SR. Website Developer With experience of 6 years.",
    "Who Make You?": "It's Sagar Bhusal. He is Server Expert, JR. Software Developer And SR. Website Developer With experience of 6 years.",
    "Why did he make You?": "For His Passion.",
    "when did you born?": "2024",
    "Your Home Land ?": "I don't have home land. I am Hosted In vultr",
    "Who is Sagar Bhusal?": "He is Server Expert, JR. Software Developer And SR. Website Developer With experience of 6 years And he also made me.",
    "Your owner personal Website?": "https://me.tylk.xyz",
    "Your owner Email?": "Sagar.bhusal@aol.com and Sagar@sagarb.com.",
    "your owner's school name?": "Shree Secondary School, Imiliya.",
    "Which Country you Belongs to?": "Nepal.",
    "Purple": "Oo It's my owner's Favourite color.",

};

export async function run(prompt: string, history: Chat[]) {
    // Check if there's a predefined response
    const lowerPrompt = prompt.toLowerCase().trim();
    for (const [key, value] of Object.entries(predefinedResponses)) {
        if (lowerPrompt === key.toLowerCase()) {
            return value;
        }
    }

    // Handle the special case for user's name
    if (lowerPrompt.startsWith("i am ")) {
        const name = prompt.slice(5).trim();
        return `Nice To meet you ${name} And my name is CoreX AI.`;
    }

    // If no predefined response, use the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 8192,  // Increased from 8192 to 32768
            temperature: 0.7,        // Slightly increased from 0.6 to 0.7 for more creative responses
            topP: 0.95,              // Slightly reduced from 1 to 0.95 for more focused responses
            topK: 64,                // Added topK parameter
            presencePenalty: 0.6,    // Added presence penalty to reduce repetition
            frequencyPenalty: 0.3,   // Added frequency penalty to encourage more diverse language
        }
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
}
