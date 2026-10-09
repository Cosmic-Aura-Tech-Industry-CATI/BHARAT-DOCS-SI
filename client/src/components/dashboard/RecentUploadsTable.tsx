'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '@/types/document';
import { StatusBadge } from '@/components/documents/StatusBadge';
import { ConfidenceBadge } from '@/components/documents/ConfidenceBadge';
import { formatDate, formatFileSize } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { Eye, Edit3, ArrowUpRight, FileText, ArrowRight } from 'lucide-react';

interface RecentUploadsTableProps {
  documents: DocumentItem[];
  isLoading?: boolean;
}

export function RecentUploadsTable({ documents, isLoading }: RecentUploadsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto h-8 w-8 text-slate-400" />
        <h4 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">No documents yet</h4>
        <p className="text-xs text-slate-500">Upload your first GST invoice or bank statement to get started.</p>
        <Link href="/document-intelligence" className="mt-3 inline-block">
          <Button size="sm">Upload Document</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Document Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Uploaded</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Confidence</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {documents.slice(0, 6).map((doc) => {
            const isNeedsReview = doc.status === 'NEEDS_REVIEW';

            return (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-900/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <Link
                        href={`/documents/${doc.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 dark:text-slate-100 transition-colors"
                      >
                        {doc.filename}
                      </Link>
                      <div className="text-[10px] text-slate-400">
                        {formatFileSize(doc.file_size)} • {doc.page_count || 1} pages
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium">
                  {doc.document_type}
                </td>

                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {formatDate(doc.upload_date)}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={doc.status} />
                </td>

                <td className="px-4 py-3">
                  <ConfidenceBadge confidence={doc.overall_confidence} size="sm" />
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {isNeedsReview ? (
                      <Link href={`/documents/${doc.id}/review`}>
                        <Button
                          size="sm"
                          className="h-7 px-2.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium gap-1 shadow-sm"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Review</span>
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/documents/${doc.id}/review`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-slate-600 hover:text-blue-600 gap-1 dark:text-slate-400"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Inspect</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
