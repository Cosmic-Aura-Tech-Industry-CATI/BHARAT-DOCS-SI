'use client';

import React from 'react';
import Link from 'next/link';
import { useDocuments } from '@/hooks/useDocuments';
import { useDocumentProgress } from '@/hooks/useDocumentProgress';
import { StatusBadge } from '@/components/documents/StatusBadge';
import { ConfidenceBadge } from '@/components/documents/ConfidenceBadge';
import { formatDate } from '@/lib/formatters';
import {
  CheckSquare,
  Loader2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  FileText,
  Sparkles,
  Edit3,
} from 'lucide-react';

function ActiveJobCard({ docId, filename }: { docId: string; filename: string }) {
  const { stage, progress, connectionStatus, isComplete, status } = useDocumentProgress(docId);

  return (
    <div className="rounded-2xl border border-blue-200 bg-[#FAFBFD] p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="font-semibold text-slate-900 text-xs">{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
            SSE: {connectionStatus}
          </span>
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span>{stage}</span>
          <span className="font-bold text-slate-800">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-[#9C4B27] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isComplete && (
        <div className="pt-1 flex justify-end">
          <Link href={`/documents/${docId}/review`}>
            <button className="h-7 px-3 bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer">
              <span>Open Results</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function QueuePage() {
  const { data: documents, refetch } = useDocuments();

  const flaggedDocs = [
    {
      id: 'doc-ganesh-kachha-102',
      filename: 'Receipt_Handwritten.jpg',
      type: 'Hindi Handwritten Receipt',
      status: 'NEEDS_REVIEW',
      confidence: 72,
      reason: 'Low confidence in Hindi handwritten line totals (Devanagari Mandi cess)',
      uploadedOn: '14 Sep 2026, 02:18 PM',
    },
    {
      id: 'doc-tata-steel-9041',
      filename: 'Invoice_INV-2026-001.pdf',
      type: 'GST Invoice',
      status: 'VERIFIED',
      confidence: 98,
      reason: 'Auto-reconciled against GSTR-2B (Ready for Tally export)',
      uploadedOn: '15 Sep 2026, 10:24 AM',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 font-sans">
            Human-in-the-Loop Review
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-0.5">
            Review & Verify Queue
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Documents paused for CA verification, arithmetic discrepancy reconciliation, and OCR confidence checks.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="h-9 px-3 rounded-lg border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs self-start md:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Flagged / Exception Queue Section */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E8E4DA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Flagged for Human Verification (12 Total)
              </h3>
              <p className="text-[11px] text-slate-500">
                Requires Chartered Accountant sign-off before statutory filing
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-[#E8E4DA]">
              <tr>
                <th className="px-5 py-3">Document Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Exception / Reason</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {flaggedDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FAF8F5]/80 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#FDF3EC] text-[#9C4B27]">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <Link
                          href={`/documents/${doc.id}/review`}
                          className="font-semibold text-slate-900 hover:text-[#9C4B27] transition"
                        >
                          {doc.filename}
                        </Link>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Uploaded: {doc.uploadedOn}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-[#FDF3EC] px-2 py-0.5 text-[10px] font-semibold text-[#9C4B27]">
                      {doc.type}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    {doc.status === 'VERIFIED' ? (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Completed
                      </span>
                    ) : (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Needs Review
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="w-24 space-y-1">
                      <span className="text-[11px] font-bold text-slate-800">
                        {doc.confidence}%
                      </span>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            doc.confidence >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${doc.confidence}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 text-[11px] max-w-xs">
                    {doc.reason}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/documents/${doc.id}/review`}>
                      <button className="h-7 px-3 bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 ml-auto transition cursor-pointer">
                        <Edit3 className="h-3 w-3" />
                        <span>Verify & Review</span>
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
