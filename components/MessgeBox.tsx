import ReactMarkdown from 'react-markdown';
import { FiMessageSquare } from 'react-icons/fi';
import { TbFidgetSpinner } from 'react-icons/tb';
import CodeHighlighter from './CodeHighlighter';

interface ChatProps {
  chats: Chat;
}

interface Chat {
  role: "user" | "model";
  parts: string;
}

const MessgeBox = ({ chats }: ChatProps) => {
  return (
    <div className='flex gap-3'>
      <div className='h-10 w-10 rounded-full flex items-center justify-center text-white text-lg'>
        {chats.role === "user" ? (
          <FiMessageSquare />
        ) : (
          <img
            src='https://i.ibb.co/B2zTrYK/favicon-removebg-preview.png' // Replace with your image path
            alt='Model Avatar'
            className='h-10 w-10 rounded-full object-cover'
          />
        )}
      </div>

      <div>
        <span className='font-bold mb-1'>
          {chats.role === "user" ? "You" : "CoreX AI"}
        </span>
        <ReactMarkdown
          className="flex flex-col gap-4"
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
                <code className='bg-gray-800 text-white px-2 py-[1px] leading-loose rounded' {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {chats.parts}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MessgeBox;
