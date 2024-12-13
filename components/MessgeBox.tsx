import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiMessageSquare } from 'react-icons/fi';
import CodeHighlighter from './CodeHighlighter';
import { Chat } from "@/types/chat";

interface ChatProps {
  chats: Chat;
  isLatestMessage?: boolean;
}

const MessgeBox = ({ chats, isLatestMessage }: ChatProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingSpeed = 15; // Faster typing speed (was 30)
  
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
      }, typingSpeed * 15); // Adjust timing for word-by-word typing

      return () => clearInterval(typingInterval);
    } else {
      setDisplayText(chats.parts);
    }
  }, [chats.parts, chats.role, isLatestMessage]);

  return (
    <div className={`flex gap-4 p-4 rounded-lg transition-all duration-300 ease-in-out 
        ${chats.role === "user" ? "bg-green-200 hover:shadow-lg" : "bg-purple-300 hover:shadow-lg"}`}>
      <div className='h-12 w-12 rounded-full flex items-center justify-center text-white text-lg shadow-md'>
        {chats.role === "user" ? (
          <FiMessageSquare className="text-gray-500" />
        ) : (
          <img
            src='https://i.ibb.co/B2zTrYK/favicon-removebg-preview.png'
            alt='Model Avatar'
            className='h-12 w-12 rounded-full object-cover transition-transform duration-300 hover:scale-110'
          />
        )}
      </div>

      <div>
        <span className='font-semibold text-gray-700 mb-2 block'>
          {chats.role === "user" ? "You" : "CoreX AI"}
        </span>
        {chats.image && (
          <img 
            src={chats.image} 
            alt="Uploaded content"
            className="max-w-sm rounded-lg mb-4 shadow-lg"
          />
        )}
        <ReactMarkdown
          className="flex flex-col gap-4 text-gray-800"
          components={{
            code({ children, inline, className, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              let language;

              if (match && match[1]) {
                language = match[1];
              } else {
                language = "jsx";
              }

              return !inline && match ? (
                <CodeHighlighter language={language}>
                  {children}
                </CodeHighlighter>
              ) : (
                <code className='bg-gray-800 text-white px-2 py-[1px] rounded'>
                  {children}
                </code>
              );
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
