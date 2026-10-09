'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Clock, ArrowRight, CheckCircle2, AlertTriangle, Eye, Edit3 } from 'lucide-react';
import { formatFileSize } from '@/lib/formatters';
import { StatusBadge } from '@/components/documents/StatusBadge';

export interface SessionDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: string;
  size?: number;
}

interface RecentSessionUploadsProps {
  documents: SessionDocument[];
}

export function RecentSessionUploads({ documents }: RecentSessionUploadsProps) {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#EFECE6]">
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-[#9C4B27]" />
          <h3 className="text-sm font-bold text-slate-900 font-sans">
            Recently Ingested Documents (This Session)
          </h3>
        </div>

        <Link
          href="/documents"
          className="text-xs text-[#9C4B27] font-semibold hover:underline flex items-center gap-1"
        >
          <span>Full Document Library</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-[#EFECE6]">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FAF8F5] -mx-2 px-2 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDF3EC] text-[#9C4B27] shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="truncate max-w-[280px] sm:max-w-xs">{doc.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF7F2] text-slate-600 border border-[#E8E4DA]">
                    {doc.type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  ID: <span className="font-mono">{doc.id}</span> • {doc.size ? formatFileSize(doc.size) : 'Uploaded'} • {doc.uploadedAt}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <StatusBadge status={doc.status as any} />

              <Link href={`/documents/${doc.id}/review`}>
                <button className="h-7 px-2.5 rounded-lg border border-[#E2DDD3] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer">
                  <Eye className="h-3 w-3" />
                  <span>Review</span>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
