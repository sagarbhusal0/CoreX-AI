import React, { useState, useEffect } from 'react'



interface TypingProps {
    typing: boolean
}

const Typing = ({ typing }: TypingProps) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (typing) {
            const interval = setInterval(() => {
                setDots(prevDots => (prevDots.length >= 3 ? '' : prevDots + '.'));
            }, 500);

            return () => clearInterval(interval);
        }
    }, [typing]);

    return (
        <>
            {typing && (
                <div className='w-[70%] flex gap-3'>
                    <div className='h-10 w-10 rounded-full bg-green-500 flex items-center justify-center'>
                        {/* Replace with your image */}
                        <img src='https://i.ibb.co/B2zTrYK/favicon-removebg-preview.png' alt='Loading...' className='animate-spin h-full w-full' />
                    </div>
                    <p className='flex-1 flex items-center'>
                        <span className='mr-1'>Typing</span>
                        <span className='typing-dots'>{dots}</span>
                    </p>
                </div>
            )}
        </>
    )
}

export default Typing
