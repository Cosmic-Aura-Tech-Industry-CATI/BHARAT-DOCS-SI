'use client';

import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block ${
        disabled
          ? 'text-slate-500'
          : 'bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-slate-100 dark:via-blue-400 dark:to-slate-100 animate-shine'
      } ${className}`}
      style={{
        backgroundSize: '200% auto',
        animationDuration: disabled ? 'none' : animationDuration,
      }}
    >
      {text}
    </span>
  );
};
export default ShinyText;
