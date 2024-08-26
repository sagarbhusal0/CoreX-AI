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
        if (!userPrompt.trim()) return;
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
            setUserPrompt("");
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [userPrompt]);

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {history.length > 0 ? <Chats history={history} /> : <InitialUI />}
                {typing && <Typing typing={typing} />}
            </div>

            <div className="w-full p-4">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-2">
                    <div className="flex-grow">
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
                            className="w-full p-3 rounded-lg bg-[#2c2c2c] text-white outline-none resize-none shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                            placeholder="Ask Me Anything [ © Sagar Bhusal]"
                            disabled={typing}
                            rows={1}
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`p-3 rounded-md flex items-center justify-center transition-all duration-300 ease-in-out 
                        ${typing || !userPrompt.trim() ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} shadow-md`}
                        disabled={typing || !userPrompt.trim()}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
