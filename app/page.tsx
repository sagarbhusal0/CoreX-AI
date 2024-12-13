"use client";
import Chats from "@/components/Chats";
import InitialUI from "@/components/InitialUI";
import Typing from "@/components/Typing";
import { run } from "@/utils/action";
import { useState, useRef, useEffect } from "react";
import ImageUpload from '@/components/ImageUpload';
import { Chat } from "@/types/chat";
import { FiX, FiImage, FiClipboard, FiSend } from 'react-icons/fi';

export default function Home() {
    const [userPrompt, setUserPrompt] = useState("");
    const [typing, setTyping] = useState(false);
    const [history, setHistory] = useState<Chat[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isApiResponding, setIsApiResponding] = useState(false);

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
        if (isApiResponding) return;

        setTyping(true);
        setIsApiResponding(true);
        
        const currentPrompt = userPrompt.trim() || (selectedImage ? "What's in this image?" : "");

        addChat("user", currentPrompt, selectedImage);

        try {
            const response = await run(currentPrompt, history, selectedImage);
            
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
            setIsApiResponding(false);
            setUserPrompt("");
            setSelectedImage(null);
        }
    };

    const handlePaste = async () => {
        try {
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
                    return;
                }
            }

            const text = await navigator.clipboard.readText();
            if (text) {
                setUserPrompt(prev => prev + text);
            }
        } catch (err) {
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    setUserPrompt(prev => prev + text);
                }
            } catch (fallbackErr) {
                console.error('Clipboard access failed:', fallbackErr);
            }
        }
    };

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isApiResponding) {
                const textarea = textareaRef.current;
                if (textarea) {
                    textarea.classList.add('shake-animation');
                    setTimeout(() => {
                        textarea.classList.remove('shake-animation');
                    }, 500);
                }
                return;
            }
            handleSubmit(e);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-[#111827] text-white">
            <div className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6 scroll-smooth">
                <div className="animate-fade-in max-w-4xl mx-auto">
                    {history.length > 0 ? <Chats history={history} /> : <InitialUI />}
                    {typing && <Typing typing={typing} />}
                </div>
            </div>

            <div className="w-full bg-[#111827] border-t border-gray-800/40">
                <div className="max-w-4xl mx-auto p-2 md:p-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
                                    onKeyDown={handleKeyDown}
                                    className={`w-full p-3 bg-[#2c2c2c] text-white outline-none resize-none 
                                            transition-all duration-200 pr-10
                                            border border-gray-700/50 focus:border-blue-500/50 hover:border-gray-600/50
                                            text-sm md:text-base rounded-lg
                                            ${isApiResponding ? 'opacity-50 cursor-not-allowed' : ''}
                                            shake-animation-container`}
                                    placeholder={isApiResponding ? "Please wait for response..." : "Ask Me Anything [ © Sagar Bhusal]"}
                                    disabled={isApiResponding}
                                    rows={1}
                                    style={{ 
                                        maxHeight: "200px", 
                                        overflowY: "auto",
                                        minHeight: "44px" 
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handlePaste}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
                                            transition-all duration-200 p-1.5 rounded-md
                                            opacity-50 group-hover:opacity-100 
                                            hover:text-white hover:scale-110
                                            hover:bg-gray-700/30 active:scale-95
                                            transform origin-center"
                                    title="Paste Text (Ctrl/Cmd + V)"
                                >
                                    <FiClipboard className="text-xl" />
                                </button>
                            </div>
                            <button
                                type="submit"
                                className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200 
                                    ${isApiResponding || (!userPrompt.trim() && !selectedImage)
                                        ? "bg-gray-600 cursor-not-allowed" 
                                        : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95"}
                                    relative overflow-hidden group`}
                                disabled={isApiResponding || (!userPrompt.trim() && !selectedImage)}
                                onClick={(e) => {
                                    if (isApiResponding) {
                                        e.preventDefault();
                                        const button = e.currentTarget;
                                        button.classList.add('shake-animation');
                                        setTimeout(() => {
                                            button.classList.remove('shake-animation');
                                        }, 500);
                                    }
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 
                                    transition-opacity duration-200 opacity-0 group-hover:opacity-100`} />
                                
                                <FiSend 
                                    className={`text-xl relative z-10 transform transition-all duration-200
                                        ${isApiResponding 
                                            ? 'opacity-50' 
                                            : 'group-hover:rotate-12 group-hover:scale-110'}`}
                                />
                                
                                {isApiResponding && (
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                )}
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
                                                opacity-100 group-hover:opacity-100 hover:scale-110
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
        </div>
    );
}
