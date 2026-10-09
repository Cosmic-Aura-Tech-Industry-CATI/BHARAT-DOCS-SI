import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes confidence value from decimal (0-1) or percentage (0-100) to standard 0-100 integer
 */
export function normalizeConfidence(value?: number | null): number {
  if (value === undefined || value === null || isNaN(value)) return 0;
  if (value <= 1.0 && value > 0) {
    return Math.round(value * 100);
  }
  return Math.min(100, Math.max(0, Math.round(value)));
}

export type ConfidenceTier = 'high' | 'medium' | 'low';

export function getConfidenceTier(confidence: number): ConfidenceTier {
  const norm = normalizeConfidence(confidence);
  if (norm >= 90) return 'high';
  if (norm >= 70) return 'medium';
  return 'low';
}

export function getConfidenceBadgeProps(confidence: number): {
  tier: ConfidenceTier;
  textClass: string;
  bgClass: string;
  borderClass: string;
  label: string;
} {
  const tier = getConfidenceTier(confidence);
  if (tier === 'high') {
    return {
      tier: 'high',
      textClass: 'text-emerald-700 dark:text-emerald-300',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/50',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      label: 'High Confidence',
    };
  }
  if (tier === 'medium') {
    return {
      tier: 'medium',
      textClass: 'text-amber-700 dark:text-amber-300',
      bgClass: 'bg-amber-50 dark:bg-amber-950/50',
      borderClass: 'border-amber-200 dark:border-amber-800',
      label: 'Review Recommended',
    };
  }
  return {
    tier: 'low',
    textClass: 'text-red-700 dark:text-red-300',
    bgClass: 'bg-red-50 dark:bg-red-950/50',
    borderClass: 'border-red-200 dark:border-red-800',
    label: 'Needs Review',
  };
}
