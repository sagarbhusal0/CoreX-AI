import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiMessageSquare, FiCopy, FiCheck } from 'react-icons/fi';
import CodeHighlighter from './CodeHighlighter';
import { Chat } from "@/types/chat";

interface ChatProps {
  chats: Chat;
  isLatestMessage?: boolean;
}

const MessgeBox = ({ chats, isLatestMessage }: ChatProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const typingSpeed = 5; // Reduced from 15 to 5 for faster typing
  
  useEffect(() => {
    if (chats.role === 'model' && isLatestMessage) {
      setIsTyping(true);
      setDisplayText(''); // Clear previous text
      let currentText = '';
      const words = chats.parts.split(' ');
      let currentWordIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
          currentText += words[currentWordIndex] + ' ';
          setDisplayText(currentText);
          currentWordIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed * 5); // Reduced multiplier from 15 to 5 for faster word-by-word typing

      return () => clearInterval(typingInterval);
    } else {
      setDisplayText(chats.parts);
    }
  }, [chats.parts, chats.role, isLatestMessage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chats.parts);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`flex gap-4 p-4 rounded-lg transition-all duration-300 ease-in-out 
        ${chats.role === "user" ? "bg-green-200 hover:shadow-lg" : "bg-purple-300 hover:shadow-lg"}`}>
      <div className='min-w-[48px] h-12 rounded-full flex items-center justify-center text-white text-lg shadow-md
          overflow-hidden bg-white'>
        {chats.role === "user" ? (
          <div className="h-full w-full flex items-center justify-center bg-green-200">
            <FiMessageSquare className="text-gray-500 text-xl" />
          </div>
        ) : (
          <img
            src='https://i.ibb.co/B2zTrYK/favicon-removebg-preview.png'
            alt='Model Avatar'
            className='h-full w-full object-contain p-1 transition-transform duration-300 
              hover:scale-110'
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-2">
          <span className='font-semibold text-gray-700'>
            {chats.role === "user" ? "You" : "CoreX AI"}
          </span>
          {chats.role === "model" && !isTyping && (
            <button
              onClick={handleCopy}
              className={`p-2 rounded-md transition-all duration-200 shrink-0 ml-2
                ${copied 
                  ? 'bg-green-500 text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'}`}
              title={copied ? "Copied!" : "Copy response"}
            >
              {copied ? <FiCheck /> : <FiCopy />}
            </button>
          )}
        </div>
        {chats.image && (
          <img 
            src={chats.image} 
            alt="Uploaded content"
            className="max-w-full rounded-lg mb-4 shadow-lg"
          />
        )}
        <ReactMarkdown
          className="flex flex-col gap-4 text-gray-800 overflow-hidden"
          components={{
            code({ children, inline, className, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              let language = match?.[1] || "jsx";

              return !inline ? (
                <div className="max-w-full overflow-x-auto">
                  <CodeHighlighter language={language}>
                    {children}
                  </CodeHighlighter>
                </div>
              ) : (
                <code className='bg-gray-800 text-white px-2 py-[1px] rounded'>
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return <div className="max-w-full overflow-x-auto">{children}</div>;
            }
          }}
        >
          {displayText}
        </ReactMarkdown>
        {isTyping && (
          <div className="mt-2">
            <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-pulse mr-1"></span>
            <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-pulse mr-1" style={{ animationDelay: '0.2s' }}></span>
            <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessgeBox;
