import Image from 'next/image'
import React from 'react'

const InitialUI = () => {
    return (
        <div className='h-full w-full flex items-center justify-center flex-col gap-5 text-white'>
            <Image className='h-auto w-96 object-cover' src="/logo.png" alt='Image' height={400} width={400} />
            <h1 className='text-4xl text-center font-bold gradient-text'>Meet CoreX AI</h1>
            
            <p className='text-lg text-gray-400 text-center'>Welcome to CoreX AI, your smart chatbot designed to make conversations easy and helpful. Like ChatGPT, CoreX AI can chat with you, answer questions, and provide support. Our goal is to make interacting with technology simple and enjoyable. Whether you need information, help, or just a friendly chat, CoreX AI is here for you. Experience the future of chatting with CoreX AI!.</p>
            <p>© Sagar Bhusal</p>
        </div>
    ) 
}

export default InitialUI
