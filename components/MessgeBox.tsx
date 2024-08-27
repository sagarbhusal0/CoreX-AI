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
    <div className={`flex gap-4 p-4 rounded-lg transition-all duration-300 ease-in-out 
        ${chats.role === "user" ? "bg-gray-250 hover:shadow-lg" : "bg-purple-300 hover:shadow-lg"}`}>
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
          {chats.parts}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MessgeBox;
