"use client";
import Chats from "@/components/Chats";
import InitialUI from "@/components/InitialUI";
import Typing from "@/components/Typing";
import { run } from "@/utils/action";
import { useState, useRef, useEffect } from "react";
import ImageUpload from '@/components/ImageUpload';
import { Chat } from "@/types/chat";
import { FiX, FiImage, FiClipboard } from 'react-icons/fi';

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

    const handlePaste = async () => {
        try {
            // First try to read image from clipboard
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                const imageType = item.types.find(type => type.startsWith('image/'));
                if (imageType) {
                    const blob = await item.getType(imageType);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setSelectedImage(reader.result as string);
                    };
                    reader.readAsDataURL(blob);
                    return; // Exit if we found and handled an image
                }
            }

            // If no image found, try to read text
            const text = await navigator.clipboard.readText();
            if (text) {
                setUserPrompt(prev => prev + text);
            }
        } catch (err) {
            // Fallback to legacy clipboard API
            try {
                const items = (await navigator.clipboard.read())[0].types;
                const hasImage = items.some(type => type.startsWith('image/'));
                
                if (hasImage) {
                    // Trigger paste event for image
                    document.execCommand('paste');
                } else {
                    // Try to get text
                    const text = await navigator.clipboard.readText();
                    if (text) {
                        setUserPrompt(prev => prev + text);
                    }
                }
            } catch (fallbackErr) {
                console.error('Clipboard access failed:', fallbackErr);
            }
        }
    };

    // Add a paste event listener for handling images
    useEffect(() => {
        const handleGlobalPaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setSelectedImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                        break;
                    }
                }
            }
        };

        document.addEventListener('paste', handleGlobalPaste);
        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
        };
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [userPrompt]);

    return (
        <div className="h-screen w-screen flex flex-col bg-[#111827] text-white">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                <div className="animate-fade-in">
                    {history.length > 0 ? <Chats history={history} /> : <InitialUI />}
                    {typing && <Typing typing={typing} />}
                </div>
            </div>

            <div className="w-full p-4 bg-[#111827] backdrop-blur-lg border-t border-gray-800">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                        <ImageUpload 
                            onImageSelect={setSelectedImage} 
                            selectedImage={selectedImage}
                        />
                        <div className="flex-grow relative group">
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
                                className="w-full p-3 rounded-lg bg-[#2c2c2c] text-white outline-none resize-none transition-all duration-300 ease-in-out pr-10
                                         border border-gray-700 focus:border-blue-500 hover:border-gray-600
                                         shadow-inner group-hover:shadow-lg"
                                placeholder="Ask Me Anything [ © Sagar Bhusal]"
                                disabled={typing}
                                rows={1}
                                style={{ maxHeight: "200px", overflowY: "auto" }}
                            />
                            <button
                                type="button"
                                onClick={handlePaste}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
                                         transition-all duration-300 ease-in-out p-1.5 rounded-md
                                         opacity-50 group-hover:opacity-100 
                                         hover:text-white hover:scale-110 hover:rotate-6
                                         hover:bg-gray-700/30 active:scale-95
                                         transform origin-center
                                         animate-pulse-slow group-hover:animate-none"
                                title="Paste Text (Ctrl/Cmd + V)"
                            >
                                <FiClipboard className="text-xl transition-transform" />
                            </button>
                        </div>
                        <button
                            type="submit"
                            className={`p-3 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out 
                            transform hover:scale-105 active:scale-95 hover:shadow-lg
                            ${typing || (!userPrompt.trim() && !selectedImage) 
                                ? "bg-red-300 cursor-not-allowed opacity-50" 
                                : "bg-red-600 hover:bg-red-700 shadow-red-500/20"}`}
                            disabled={typing || (!userPrompt.trim() && !selectedImage)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                 className="transform transition-transform duration-200 hover:rotate-12">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    {selectedImage && (
                        <div className="mt-2 flex items-start gap-2 animate-slide-up">
                            <div className="h-8 w-8 rounded-full bg-[#2c2c2c] flex items-center justify-center
                                        transform hover:scale-105 transition-transform duration-200">
                                <FiImage className="text-lg text-gray-400" />
                            </div>
                            <div className="relative w-fit group">
                                <img 
                                    src={selectedImage} 
                                    alt="Selected" 
                                    className="max-h-32 rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
                                />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-1.5 -right-1.5 bg-[#111827] rounded-full p-1.5
                                             hover:bg-[#2c2c2c] transition-all duration-200
                                             opacity-0 group-hover:opacity-100 hover:scale-110
                                             transform hover:rotate-90"
                                    aria-label="Remove image"
                                >
                                    <FiX className="text-gray-400 text-sm" />
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
