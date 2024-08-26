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
                    setTimeout(() => {
                        setCopied(false);
                    }, 3000);
                })
                .catch(err => {
                    console.error("Something went wrong");
                });
        }
    };

    return (
        <div className='bg-[#1e1e1e] my-4 overflow-hidden w-full rounded-lg shadow-lg'>
            <div className='rounded-t-lg flex items-center justify-between p-3 bg-[#1e1e1e] border-b border-gray-700'>
                <span className='text-gray-400 text-sm'>{language}</span>
                <button
                    onClick={() => copyToClipboard(children)}
                    disabled={copied}
                    className={`text-sm px-4 py-2 rounded transition-all duration-300 ease-in-out 
                        ${copied ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
                >
                    {copied ? (
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied
                        </span>
                    ) : 'Copy'}
                </button>
            </div>
            <div className='-mt-1'>
                <SyntaxHighlighter style={xonokai} language={language} className="rounded-b-lg">
                    {children}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeHighlighter;
