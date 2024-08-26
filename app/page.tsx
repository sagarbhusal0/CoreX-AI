"use client";
import Chats from "@/components/Chats";
import InitialUI from "@/components/InitialUI";
import Typing from "@/components/Typing";
import { run } from "@/utils/action";
import { useState, useRef, useEffect } from "react";

interface Chat {
    role: "user" | "model";
    parts: string;
}

export default function Home() {
    const [userPrompt, setUserPrompt] = useState("");
    const [typing, setTyping] = useState(false);
    const [history, setHistory] = useState<Chat[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const addChat = (role: Chat["role"], parts: string) => {
        const newChat: Chat = { role, parts };
        setHistory((prevHistory) => [...prevHistory, newChat]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userPrompt.trim()) return; // Avoid empty submissions
        setTyping(true);
        addChat("user", userPrompt);
        try {
            const response = await run(userPrompt, history);
            addChat("model", response);
        } catch (error) {
            console.error("Error fetching response:", error);
            addChat("model", "An error occurred. Please try again.");
        } finally {
            setTyping(false);
            setUserPrompt(""); // Clear input after processing
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [userPrompt]);

    return (
        <div className="max-w-[80%] mx-auto h-screen relative flex flex-col bg-gray-900 text-white">
            <div className="flex-1 p-5 overflow-y-auto scroll-bar flex flex-col gap-4">
                {history.length > 0 ? <Chats history={history} /> : <InitialUI />}
                {typing && <Typing typing={typing} />}
            </div>

            <div className="w-full p-4 bg-[#1e1e1e] fixed bottom-0 left-0 flex items-center justify-center border-t border-gray-700">
                <form onSubmit={handleSubmit} className="w-full max-w-4xl flex items-center">
                    <div className="relative flex-grow">
                        <textarea
                            ref={textareaRef}
                            autoFocus
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="w-full p-3 pr-12 border rounded-lg bg-[#2c2c2c] text-white outline-none resize-none shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                            placeholder="Ask Me Anything [ © Sagar Bhusal]"
                            disabled={typing}
                            rows={1}
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                        />
                        <button
                            type="submit"
                            className={`absolute right-2 bottom-2 p-2 rounded-md flex items-center justify-center transition-all duration-300 ease-in-out 
                            ${typing || !userPrompt.trim() ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} shadow-md`}
                            disabled={typing || !userPrompt.trim()}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
