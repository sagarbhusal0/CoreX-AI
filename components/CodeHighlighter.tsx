"use client"

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeHighlighterProps {
    language: string;
    children: string;
}

const CodeHighlighter = ({ language, children }: CodeHighlighterProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (textToCopy: string) => {
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                })
                .catch(err => console.error("Failed to copy:", err));
        }
    };

    return (
        <div className='bg-[#1e1e1e] my-4 rounded-lg shadow-lg overflow-hidden w-full'>
            <div className='flex items-center justify-between p-2 bg-[#1e1e1e] border-b border-gray-700'>
                <span className='text-gray-400 text-sm'>{language}</span>
                <button
                    onClick={() => copyToClipboard(children)}
                    disabled={copied}
                    className={`text-sm px-3 py-1 rounded transition-all duration-300 ease-in-out 
                        ${copied ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className='overflow-x-auto'>
                <SyntaxHighlighter 
                    style={xonokai} 
                    language={language} 
                    className="rounded-b-lg"
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.9rem',
                    }}
                    wrapLongLines={true}
                >
                    {children}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeHighlighter;
