'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ConfidenceBadge } from '@/components/documents/ConfidenceBadge';
import { FileText, Receipt, Landmark, FileSpreadsheet } from 'lucide-react';

interface TypeDistItem {
  type: string;
  count: number;
  share: number;
  avgConfidence: number;
  icon: any;
  color: string;
}

const distribution: TypeDistItem[] = [
  {
    type: 'GST Invoices',
    count: 1,
    share: 50,
    avgConfidence: 96,
    icon: FileText,
    color: 'bg-blue-600',
  },
  {
    type: 'Hindi Kachha Bills',
    count: 1,
    share: 50,
    avgConfidence: 68,
    icon: Receipt,
    color: 'bg-amber-500',
  },
];

export function DocumentTypeDistribution() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Document Type Distribution & Model Accuracy
        </CardTitle>
        <CardDescription>Breakdown by Indian statutory and commercial document format</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {distribution.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.type} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.type}</span>
                  <span className="text-[11px] text-slate-400">({item.count} docs)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.share}%</span>
                  <ConfidenceBadge confidence={item.avgConfidence} size="sm" />
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            Avinya 2K26 Indic OCR Engine:
          </span>{' '}
          Handwritten Hindi receipts route to the Devanagari handwriting specialized model with human-in-the-loop fallback when confidence drops below 70%.
        </div>
      </CardContent>
    </Card>
  );
}
