import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Eye, Edit, FileText, HelpCircle } from 'lucide-react';
import 'highlight.js/styles/github.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  error,
  placeholder = "Write your post in markdown...",
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showGuide, setShowGuide] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const markdownGuide = `
# Markdown Guide

## Headers
# H1 Header
## H2 Header
### H3 Header

## Text Formatting
**Bold text**
*Italic text*
~~Strikethrough~~
\`Inline code\`

## Lists
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

## Links and Images
[Link text](https://example.com)
![Alt text](image-url.jpg)

## Code Blocks
\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Tables
| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |

## Blockquotes
> This is a blockquote
> It can span multiple lines

## Horizontal Rule
---
  `;

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
                activeTab === 'edit'
                  ? 'text-blue-600 border-blue-600 bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Edit size={16} className="inline mr-1" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'text-blue-600 border-blue-600 bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Eye size={16} className="inline mr-1" />
              Preview
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded"
            title="Markdown Guide"
          >
            <HelpCircle size={16} />
          </button>
        </div>

        <div
          className={`border rounded-md overflow-hidden ${
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
          }`}
        >
          {activeTab === 'edit' ? (
            <textarea
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`w-full h-80 px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-none resize-none focus:outline-none font-mono text-sm leading-relaxed ${
                error ? 'border-red-500' : ''
              }`}
              style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
            />
          ) : (
            <div className="h-80 overflow-y-auto px-4 py-3 bg-gray-50 dark:bg-gray-900">
              {value ? (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-blue prose-code:text-blue-600 dark:prose-code:text-blue-400">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <FileText size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Nothing to preview yet...</p>
                    <p className="text-sm">Start writing to see a preview</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>

      {showGuide && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Markdown Quick Reference
          </h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {markdownGuide}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
