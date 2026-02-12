import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary/50 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30',
    secondary: 'bg-secondary text-background hover:bg-secondary-600 focus:ring-secondary/50 shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary/10 focus:ring-primary/50 hover:border-primary-600',
    ghost: 'bg-transparent text-gray-300 hover:bg-surface-light focus:ring-primary/50 hover:text-white',
    danger: 'bg-accent text-white hover:bg-accent-600 focus:ring-accent/50 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm font-medium',
    md: 'px-5 py-2.5 text-base font-medium',
    lg: 'px-8 py-3.5 text-lg font-semibold',
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100';
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" color="white" className="mr-2" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;