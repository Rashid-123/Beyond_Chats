
'use client';

import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ role, message }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mx-auto max-w-4xl md:mb-8 mb-5 px-4 sm:px-6`}>
      <div
        className={`sm:max-w-3xl max-w-[300px]  px-4 py-3 rounded-2xl ${
          isUser ? 'rounded-br-none' : 'rounded-bl-none'
        }`}
        style={{
          backgroundColor: isUser ? 'var(--color-button-1)' : 'var(--color-background-3)',
          color: isUser ? 'white' : 'var(--color-text-1)',
        }}
      >
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-base font-bold mt-2 mb-2"
                  style={{ color: 'inherit' }}
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-sm font-bold mt-2 mb-1"
                  style={{ color: 'inherit' }}
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-sm my-1" style={{ color: 'inherit' }} {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside text-sm my-1"
                  style={{ color: 'inherit' }}
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="my-0" style={{ color: 'inherit' }} {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 pl-2 italic text-sm my-1"
                  style={{
                    borderColor: isUser ? 'rgba(255,255,255,0.3)' : 'var(--color-text-3)',
                    color: 'inherit',
                  }}
                  {...props}
                />
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code
                    className="px-1 py-0 rounded text-xs"
                    style={{
                      backgroundColor: isUser
                        ? 'rgba(255,255,255,0.2)'
                        : 'var(--color-background-2)',
                      color: 'inherit',
                    }}
                    {...props}
                  />
                ) : (
                  <pre
                    className="p-2 rounded text-xs my-1 overflow-x-auto"
                    style={{
                      backgroundColor: isUser
                        ? 'rgba(255,255,255,0.1)'
                        : 'var(--color-background-2)',
                      color: 'inherit',
                    }}
                    {...props}
                  />
                ),
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}