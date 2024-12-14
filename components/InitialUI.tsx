import Image from 'next/image'
import React from 'react'

const InitialUI = () => {
    return (
        <div className='h-full w-full flex items-center justify-center flex-col gap-5 text-white'>
            <Image 
                className='h-auto w-96 object-cover' 
                src="/logo.png" 
                alt='CoreX AI Logo - Advanced AI Chat Assistant' 
                height={400} 
                width={400}
                priority
            />
            <h1 className='text-4xl text-center font-bold gradient-text'>
                Meet CoreX AI - Your Advanced AI Chat Assistant
            </h1>
            
            <div className='max-w-2xl text-center'>
                <h2 className='text-2xl font-semibold mb-4'>
                    Experience the Future of AI Communication
                </h2>
                <p className='text-lg text-gray-400'>
                    Welcome to CoreX AI, your intelligent chatbot powered by advanced machine learning. 
                    Like ChatGPT, CoreX AI excels in natural conversations, providing instant answers, 
                    code assistance, and image analysis. Our mission is to make AI interaction intuitive 
                    and productive.
                </p>
                <div className='mt-6'>
                    <h3 className='text-xl font-semibold mb-2'>Key Features:</h3>
                    <ul className='text-gray-400'>
                        <li>✨ Instant, accurate responses</li>
                        <li>🖼️ Advanced image analysis</li>
                        <li>💻 Expert code assistance</li>
                        <li>🤝 Natural conversation flow</li>
                    </ul>
                </div>
            </div>
            <p className='mt-8'>© 2024 Sagar Bhusal - All rights reserved</p>
        </div>
    ) 
}

export default InitialUI
