'use client';

import React from 'react';
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard';

interface MetricCardsProps {
  stats: {
    total: number;
    queued: number;
    processing: number;
    verified: number;
    needsReview: number;
    failed: number;
    averageConfidence: number;
  };
  isLoading?: boolean;
}

export function MetricCards({ stats, isLoading }: MetricCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: 'Total Documents',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800/60',
      badge: 'All Ingested',
    },
    {
      label: 'Queued',
      value: stats.queued,
      icon: Clock,
      color: 'text-slate-600',
      bg: 'bg-slate-50 dark:bg-slate-800/40',
      border: 'border-slate-200 dark:border-slate-800',
      badge: 'Waiting OCR',
    },
    {
      label: 'Processing',
      value: stats.processing,
      icon: Loader2,
      color: 'text-sky-600',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-200 dark:border-sky-800/60',
      animateIcon: true,
      badge: 'Multimodal AI',
    },
    {
      label: 'Verified',
      value: stats.verified,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      badge: `${stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}% Rate`,
    },
    {
      label: 'Needs Review',
      value: stats.needsReview,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800/60',
      badge: 'Action Required',
      highlight: stats.needsReview > 0,
    },
    {
      label: 'Failed / DLQ',
      value: stats.failed,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950/40',
      border: 'border-red-200 dark:border-red-800/60',
      badge: 'Dead Letter',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <SpotlightCard
            key={idx}
            className={`p-4 border transition-all hover:shadow-md ${item.border} ${
              item.highlight ? 'ring-1 ring-amber-400 dark:ring-amber-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-lg ${item.bg}`}>
                <Icon
                  className={`h-4 w-4 ${item.color} ${item.animateIcon ? 'animate-spin' : ''}`}
                />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {item.value}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {item.badge}
              </span>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
}
