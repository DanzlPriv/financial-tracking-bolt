import { ReactNode } from 'react';

interface FABProps {
  onClick: () => void;
  icon: ReactNode;
  className?: string;
}

export function FAB({ onClick, icon, className = '' }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center ${className}`}
    >
      {icon}
    </button>
  );
}
