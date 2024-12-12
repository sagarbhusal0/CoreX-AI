"use client";
import Chats from "@/components/Chats";
import InitialUI from "@/components/InitialUI";
import Typing from "@/components/Typing";
import { run } from "@/utils/action";
import { useState, useRef, useEffect } from "react";
import ImageUpload from '@/components/ImageUpload';
import { Chat } from "@/types/chat";
import { FiX } from 'react-icons/fi';

export default function Home() {
    const [userPrompt, setUserPrompt] = useState("");
    const [typing, setTyping] = useState(false);
    const [history, setHistory] = useState<Chat[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const addChat = (role: Chat["role"], parts: string, image?: string | null) => {
        const newChat: Chat = { 
            role, 
            parts, 
            image: image || undefined 
        };
        setHistory((prevHistory) => [...prevHistory, newChat]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userPrompt.trim() && !selectedImage) return;

        setTyping(true);
        
        // Prepare the current prompt
        const currentPrompt = userPrompt.trim() || (selectedImage ? "What's in this image?" : "");

        // Add user message first
        addChat("user", currentPrompt, selectedImage);

        try {
            // Get AI response
            const response = await run(currentPrompt, history, selectedImage);
            
            // Add AI response
            if (response) {
                addChat("model", response);
            } else {
                throw new Error("No response received");
            }
        } catch (error) {
            console.error("Chat error:", error);
            addChat("model", "I apologize, but I encountered an error. Please try again.");
        } finally {
            setTyping(false);
            setUserPrompt("");
            setSelectedImage(null); // Clear the selected image after sending
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
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                        <ImageUpload 
                            onImageSelect={setSelectedImage} 
                            selectedImage={selectedImage}
                        />
                        <div className="flex-grow relative">
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
                            ${typing || (!userPrompt.trim() && !selectedImage) ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} shadow-md`}
                            disabled={typing || (!userPrompt.trim() && !selectedImage)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    {selectedImage && (
                        <div className="mt-2 relative inline-block">
                            <img 
                                src={selectedImage} 
                                alt="Selected" 
                                className="max-h-40 rounded-lg"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                                aria-label="Remove image"
                            >
                                <FiX className="text-white text-lg" />
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
