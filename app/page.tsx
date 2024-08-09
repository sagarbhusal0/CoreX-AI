"use client"

import Chats from "@/components/Chats";
import InitialUI from "@/components/InitialUI";
import Typing from "@/components/Typing";
import { run } from "@/utils/action";
import { useState } from "react";

interface Chat {
    role: "user" | "model";
    parts: string;
}

export default function Home() {
    const [userPrompt, setUserPrompt] = useState("");
    const [typing, setTyping] = useState(false);
    const [history, setHistory] = useState<Chat[]>([]);

    const addChat = (role: Chat["role"], parts: string) => {
        const newChat: Chat = { role, parts };
        setHistory((prevHistory) => [...prevHistory, newChat]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTyping(true)
        addChat("user", userPrompt)
        const response = await run(userPrompt, history)
        console.log(response);

        setUserPrompt("")
        addChat("model", response)

        setTyping(false)
    }
 return (
        <div className="w-[50%] fixed bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full flex items-center">
                <textarea
                    autoFocus
                    value={userPrompt}
                    onChange={e => {
                        setUserPrompt(e.target.value);
                        e.target.style.height = 'auto'; // Reset the height
                        e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height to scrollHeight
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { // Detect Enter key press without Shift
                            e.preventDefault(); // Prevent default newline behavior
                            handleSubmit(e); // Trigger form submission
                        }
                    }}
                    className="w-full p-2 border rounded bg-[#212121] outline-none resize-none"
                    placeholder="Ask Me Anything [ © Sagar Bhusal]"
                    disabled={typing}
                    rows={1}
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                />

                <button
                    type="submit"
                    className="ml-2 p-2 rounded-full bg-gray-600 flex items-center justify-center send-button"
                    style={{
                        backgroundImage: 'url("/path/to/your/uploaded/icon.png")', // Update with the correct path
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        width: '40px', // Adjust the size as needed
                        height: '40px',
                    }}
                    onClick={e => {
                        e.currentTarget.classList.add('animate-send');
                        setTimeout(() => {
                            e.currentTarget.classList.remove('animate-send');
                        }, 500); // Duration of animation (match with CSS)
                    }}
                    disabled={typing}
                >
                </button>
            </form>

            <style jsx>{`
                @keyframes sendAnimation {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                .send-button.animate-send {
                    animation: sendAnimation 0.5s ease;
                }
            `}</style>
        </div>
    );
}
