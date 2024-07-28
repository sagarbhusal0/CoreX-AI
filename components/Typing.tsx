import React from 'react'
import { TbFidgetSpinner } from 'react-icons/tb'

interface TypingProps {
    typing: boolean
}

const Typing = ({ typing }: TypingProps) => {
    return (
        <>
            {
                typing ? (
                    <div className='w-[70%] flex gap-3'>
                        <div className='h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg'>
                            <TbFidgetSpinner className='animate-spin' />
                        </div>
                        <p className='flex-1'>Typing...</p>
                    </div>
                ) : null
            }
        </>
    )
}

export default Typing
