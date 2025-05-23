import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  error,
  placeholder = 'Write something amazing...',
}) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'indent',
    'align',
    'link', 'image',
  ];

  return (
    <div className="mb-4">
      <div 
        className={`
          bg-white dark:bg-gray-800 rounded-md border
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
          overflow-hidden transition duration-200
        `}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="h-64 text-gray-900 dark:text-gray-100" // Base height which will expand
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
      <style jsx>{`
        .ql-toolbar {
          border-color: inherit !important;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f8fafc;
        }
        
        .ql-container {
          border-color: inherit !important;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-family: inherit;
          min-height: 160px;
        }

        /* Dark mode overrides */
        :global(.dark) .ql-toolbar {
          background-color: #1e293b;
          border-color: #475569 !important;
        }

        :global(.dark) .ql-container {
          border-color: #475569 !important;
        }

        :global(.dark) .ql-toolbar .ql-stroke {
          stroke: #cbd5e1;
        }

        :global(.dark) .ql-toolbar .ql-fill {
          fill: #cbd5e1;
        }

        :global(.dark) .ql-editor.ql-blank::before {
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;