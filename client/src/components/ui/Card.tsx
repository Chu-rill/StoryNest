import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-surface shadow-md border border-gray-200 dark:border-surface-light',
    elevated: 'bg-white dark:bg-surface shadow-lg shadow-primary/10 border-0',
    outlined: 'bg-white dark:bg-surface border-2 border-gray-200 dark:border-primary/20 shadow-none'
  };

  return (
    <div 
      className={`
        ${variantClasses[variant]}
        rounded-xl
        overflow-hidden 
        transition-all duration-300
        ${hoverable ? 'hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-6 border-b border-gray-100 dark:border-surface-light bg-gray-50/50 dark:bg-surface-light/50 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-6 border-t border-gray-100 dark:border-surface-light bg-gray-50/30 dark:bg-surface-light/30 ${className}`}>
      {children}
    </div>
  );
};

export default Card;