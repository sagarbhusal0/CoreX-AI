"use client";
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

    return (
        <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
            <div className="flex-1 p-5 overflow-y-auto scroll-bar flex flex-col gap-4">
                {history.length > 0 ? <Chats history={history} /> : <InitialUI />}
                {typing && <Typing typing={typing} />}
            </div>

            <div className="w-full p-4 bg-[#1e1e1e] fixed bottom-0 left-0 flex items-center justify-center border-t border-gray-700">
                <form onSubmit={handleSubmit} className="w-full max-w-4xl flex items-center gap-4">
                    <textarea
                        autoFocus
                        value={userPrompt}
                        onChange={(e) => {
                            setUserPrompt(e.target.value);
                            e.target.style.height = "auto"; // Reset the height
                            e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height to scrollHeight
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // Prevent default newline behavior
                                handleSubmit(e); // Trigger form submission
                            }
                        }}
                        className="flex-1 p-3 border rounded-lg bg-[#2c2c2c] text-white outline-none resize-none shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        placeholder="Ask Me Anything [ © Sagar Bhusal]"
                        disabled={typing}
                        rows={1}
                        style={{ maxHeight: "75px", overflowY: "auto" }}
                    />

                    <button
                        type="submit"
                        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out 
                        ${typing ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} shadow-md`}
                        disabled={typing}
                        style={{
                            backgroundImage:
                                'url("https://static.thenounproject.com/png/1054386-200.png")',
                            backgroundSize: "50%",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            width: "48px",
                            height: "48px",
                        }}
                    ></button>
                </form>
            </div>
        </div>
    );
}
