import React from 'react';
import { normalizeConfidence, getConfidenceTier } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  confidence: number;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export function ConfidenceBadge({
  confidence,
  className,
  showIcon = true,
  size = 'md',
}: ConfidenceBadgeProps) {
  const norm = normalizeConfidence(confidence);
  const tier = getConfidenceTier(norm);

  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  let Icon = ShieldCheck;

  if (tier === 'high') {
    bgClass = 'bg-emerald-50 dark:bg-emerald-950/40';
    textClass = 'text-emerald-700 dark:text-emerald-300';
    borderClass = 'border-emerald-200 dark:border-emerald-800';
    Icon = ShieldCheck;
  } else if (tier === 'medium') {
    bgClass = 'bg-amber-50 dark:bg-amber-950/40';
    textClass = 'text-amber-700 dark:text-amber-300';
    borderClass = 'border-amber-200 dark:border-amber-800';
    Icon = AlertTriangle;
  } else {
    bgClass = 'bg-red-50 dark:bg-red-950/40';
    textClass = 'text-red-700 dark:text-red-300';
    borderClass = 'border-red-200 dark:border-red-800';
    Icon = ShieldAlert;
  }

  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-md border',
        bgClass,
        textClass,
        borderClass,
        sizeClasses,
        className
      )}
      title={`Confidence score: ${norm}% (${tier.toUpperCase()})`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
      <span>{norm}%</span>
      {tier === 'low' && <span className="text-[10px] uppercase font-bold tracking-wider">(Review)</span>}
    </span>
  );
}
