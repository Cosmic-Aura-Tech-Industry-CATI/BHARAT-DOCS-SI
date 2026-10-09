'use client';

import React from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, AlertCircle, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function QuickActions({ needsReviewCount }: { needsReviewCount: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Link href="/documents/upload">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium shadow-sm">
          <UploadCloud className="h-4 w-4" />
          <span>Upload Document</span>
        </Button>
      </Link>

      <Link href="/query">
        <Button variant="outline" className="gap-2 font-medium border-slate-300 dark:border-slate-700">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Natural Language Query</span>
        </Button>
      </Link>

      {needsReviewCount > 0 && (
        <Link href="/documents?status=NEEDS_REVIEW">
          <Button
            variant="outline"
            className="gap-2 font-medium border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
          >
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span>Verify Pending ({needsReviewCount})</span>
          </Button>
        </Link>
      )}

      <Link href="/exports">
        <Button variant="secondary" className="gap-2 font-medium">
          <FileSpreadsheet className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          <span>Tally / Excel Export</span>
        </Button>
      </Link>
    </div>
  );
}
