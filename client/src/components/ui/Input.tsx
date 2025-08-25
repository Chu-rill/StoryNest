import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, fullWidth = false, icon, className = "", ...props },
    ref
  ) => {
    return (
      <div className={`mb-6 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              px-4 py-3 bg-white dark:bg-gray-800 border-2
              ${
                error
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-600"
              }
              text-gray-900 dark:text-gray-100 rounded-lg shadow-sm
              focus:outline-none focus:ring-4
              transition-all duration-200
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              ${icon ? "pl-10" : ""}
              ${fullWidth ? "w-full" : ""}
              ${className}
            `}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 flex items-center space-x-1">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
