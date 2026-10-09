import React from 'react';
import { DocumentStatus } from '@/types/document';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Loader2,
  HelpCircle,
  AlertOctagon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const normStatus = (status || '').toUpperCase();

  switch (normStatus) {
    case 'VERIFIED':
      return (
        <Badge
          variant="success"
          className={cn('gap-1 font-medium bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800', className)}
        >
          {showIcon && <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
          <span>Verified</span>
        </Badge>
      );

    case 'NEEDS_REVIEW':
      return (
        <Badge
          variant="warning"
          className={cn('gap-1 font-medium bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800', className)}
        >
          {showIcon && <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />}
          <span>Needs Review</span>
        </Badge>
      );

    case 'PROCESSING':
      return (
        <Badge
          variant="info"
          className={cn('gap-1 font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800', className)}
        >
          {showIcon && <Loader2 className="h-3 w-3 text-blue-600 animate-spin dark:text-blue-400" />}
          <span>Processing</span>
        </Badge>
      );

    case 'QUEUED':
      return (
        <Badge
          variant="secondary"
          className={cn('gap-1 font-medium bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300', className)}
        >
          {showIcon && <Clock className="h-3 w-3 text-slate-500" />}
          <span>Queued</span>
        </Badge>
      );

    case 'FAILED':
      return (
        <Badge
          variant="destructive"
          className={cn('gap-1 font-medium bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800', className)}
        >
          {showIcon && <XCircle className="h-3 w-3 text-red-600" />}
          <span>Failed</span>
        </Badge>
      );

    case 'LLM_PARSE_FAILED':
      return (
        <Badge
          variant="destructive"
          className={cn('gap-1 font-medium bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300', className)}
        >
          {showIcon && <AlertOctagon className="h-3 w-3 text-rose-600" />}
          <span>LLM Parse Failed</span>
        </Badge>
      );

    case 'FAILED_DLQ':
      return (
        <Badge
          variant="destructive"
          className={cn('gap-1 font-medium bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300', className)}
        >
          {showIcon && <AlertOctagon className="h-3 w-3 text-purple-600" />}
          <span>Dead Letter (DLQ)</span>
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className={cn('gap-1 font-medium text-slate-600', className)}>
          {showIcon && <HelpCircle className="h-3 w-3 text-slate-400" />}
          <span>{status || 'Unknown'}</span>
        </Badge>
      );
  }
}
