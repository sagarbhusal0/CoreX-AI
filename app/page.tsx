"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CodeProps } from "react-markdown/lib/ast-to-react";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

const Message: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "model",
        content: `AI Response to: "${newMessage.content}"`,
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const CodeBlock: React.FC<CodeProps> = ({ inline, className, children }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter style={xonokai} language={match[1]} PreTag="div">
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className="bg-gray-800 text-white px-2 py-[1px] rounded">
        {children}
      </code>
    );
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-lg max-w-2xl shadow-md ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              <ReactMarkdown components={{ code: CodeBlock }}>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-gray-500">CoreX AI is typing...</div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full p-4 bg-[#1e1e1e] flex items-center"
      >
        <textarea
          className="flex-1 p-3 border rounded-lg bg-[#2c2c2c] text-white outline-none resize-none shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          placeholder="Ask Me Anything [ © Sagar Bhusal]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          style={{ maxHeight: "100px", overflowY: "auto" }}
        />
        <button
          type="submit"
          className={`ml-4 p-3 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out 
          ${isTyping ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} shadow-md`}
          disabled={isTyping}
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
  );
};

export default Message;
