import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${
        onClick ? 'cursor-pointer hover:shadow-lg transition' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
