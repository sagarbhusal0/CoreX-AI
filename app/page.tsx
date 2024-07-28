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
        <div className="max-w-[50%] mx-auto h-screen relative flex flex-col">
            <div className="p-5 w-full max-h-[calc(100vh-100px)] overflow-y-auto scroll-bar flex flex-col gap-4">
                {
                    history.length > 0 ? (
                        <Chats history={history} />
                    ) : (
                        <InitialUI />
                    )
                }
                {typing && <Typing typing={typing} />}
            </div>
            <div className="w-[50%] h-20 fixed bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        autoFocus
                        type="text"
                        value={userPrompt}
                        onChange={e => setUserPrompt(e.target.value)}
                        className="w-full p-2 border rounded bg-[#212121] outline-none"
                        placeholder="Type here..."
                        disabled={typing}
                    />
                </form>
            </div>
        </div>
    );
}
