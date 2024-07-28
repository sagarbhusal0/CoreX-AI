"use client"

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeHighlighterProps {
    language: string;
    children: string;
}

const CodeHighlighter = ({ language, children }: CodeHighlighterProps) => {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = (textToCopy: string) => {
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => {
                        setCopied(false);
                    }, 3000)
                })
                .catch(err => {
                    console.error("Something went wrong")
                })
        }
    }
    return (
        <div className='bg-[#1e1e1e] my-2 overflow-hidden w-full'>
            <div className='rounded-t-lg flex items-center justify-between p-3 bg-[#1e1e1e] border border-white text-white'>
                <span>{language}</span>
                <button onClick={() => copyToClipboard(children)} disabled={copied}>
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className='-mt-1'>
                <SyntaxHighlighter style={xonokai} language={language}>
                    {children}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

export default CodeHighlighter
