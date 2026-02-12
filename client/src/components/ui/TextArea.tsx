import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    return (
      <div className={`mb-6 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={`
              px-4 py-3 bg-white dark:bg-surface border-2
              ${
                error
                  ? 'border-accent focus:ring-accent/20 focus:border-accent bg-accent/5 dark:bg-accent/10'
                  : 'border-gray-200 dark:border-surface-light focus:ring-primary/20 focus:border-primary hover:border-gray-300 dark:hover:border-primary/40'
              }
              text-gray-900 dark:text-gray-100 rounded-lg shadow-sm
              focus:outline-none focus:ring-4
              transition-all duration-200
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              min-h-[120px] resize-y
              ${fullWidth ? 'w-full' : ''}
              ${className}
            `}
            {...props}
          />
          {error && (
            <div className="absolute top-3 right-3">
              <AlertCircle className="h-5 w-5 text-accent" />
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 flex items-center space-x-1">
            <AlertCircle size={14} className="text-accent flex-shrink-0" />
            <p className="text-sm text-accent dark:text-accent-300">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;