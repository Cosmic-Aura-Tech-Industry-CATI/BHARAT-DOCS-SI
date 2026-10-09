'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  theme?: 'dark' | 'light';
  href?: string;
  onClick?: () => void;
}

export const LOGO_IMAGE_URL = '/logo.jpg';
export const LOGO_FALLBACK_URL = 'https://i.ibb.co/84TH5pqD/Whats-App-Image-2026-10-09-at-10-39-27-AM.jpg';

export function BrandLogo({
  className,
  size = 'md',
  showText = true,
  theme = 'dark',
  href,
  onClick,
}: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const subtitleSizeClasses = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
  };

  const content = (
    <div
      onClick={onClick}
      className={cn('flex items-center gap-2.5 group select-none', className)}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl bg-white flex items-center justify-center shrink-0 shadow-2xs border transition-transform duration-200 group-hover:scale-105',
          sizeClasses[size],
          theme === 'dark' ? 'border-white/20' : 'border-[#E8E4DA]'
        )}
      >
        <img
          src={LOGO_IMAGE_URL}
          alt="BharatDoc Logo"
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== LOGO_FALLBACK_URL) {
              target.src = LOGO_FALLBACK_URL;
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div
            className={cn(
              'font-bold tracking-tight font-serif flex items-center',
              textSizeClasses[size],
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            )}
          >
            <span>Bharat</span>
            <span className={theme === 'dark' ? 'text-[#B85D36]' : 'text-[#9C4B27]'}>
              Doc
            </span>
            <span
              className={cn(
                'ml-1 text-[10px] font-sans font-normal opacity-70 tracking-normal',
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              )}
            >
              (भारतDoc)
            </span>
          </div>
          <div
            className={cn(
              'uppercase tracking-widest font-mono mt-1',
              subtitleSizeClasses[size],
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            )}
          >
            AI DOCUMENT INTELLIGENCE
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
