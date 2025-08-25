import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  return (
    <div
      className={`
        prose prose-lg max-w-none 
        dark:prose-invert
        prose-headings:text-gray-900 dark:prose-headings:text-white
        prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
        prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8
        prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
        prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800
        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
        prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20
        prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
        prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-1
        prose-table:w-full prose-table:border-collapse
        prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700
        prose-th:px-4 prose-th:py-2 prose-th:font-medium prose-th:text-left
        prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:px-4 prose-td:py-2
        prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8
        ${className}
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom link component for external links
          a: ({ node, href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          // Custom code block component
          pre: ({ node, children, ...props }) => (
            <div className="relative group">
              <pre {...props} className="overflow-x-auto">
                {children}
              </pre>
              <button
                onClick={() => {
                  const code = node?.children?.[0];
                  if (code && 'children' in code && code.children?.[0] && 'value' in code.children[0]) {
                    navigator.clipboard.writeText(code.children[0].value as string);
                  }
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                  bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                title="Copy code"
              >
                Copy
              </button>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
