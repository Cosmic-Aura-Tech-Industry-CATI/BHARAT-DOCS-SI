'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDocuments } from '@/hooks/useDocuments';
import { StatusBadge } from '@/components/documents/StatusBadge';
import { ConfidenceBadge } from '@/components/documents/ConfidenceBadge';
import { formatDate, formatFileSize } from '@/lib/formatters';
import {
  FileText,
  Search,
  Upload,
  Eye,
  Edit3,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  Filter,
} from 'lucide-react';

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'VERIFIED', label: 'Completed / Verified' },
  { value: 'NEEDS_REVIEW', label: 'Needs Review' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'QUEUED', label: 'Queued' },
  { value: 'FAILED', label: 'Failed' },
];

const TYPE_FILTERS = [
  { value: 'ALL', label: 'All Document Types' },
  { value: 'GST Invoice', label: 'GST Invoices' },
  { value: 'Form-16', label: 'Form-16 (TDS)' },
  { value: 'Bank Statement', label: 'Bank Statements' },
  { value: 'Hindi Handwritten Receipt / Kachha Bill', label: 'Hindi Handwritten Receipts' },
];

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const { data: documents, isLoading, refetch } = useDocuments({
    search: search.trim() || undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    type: typeFilter !== 'ALL' ? typeFilter : undefined,
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 font-sans">
            Central Repository
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-0.5">
            Document Library
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Search, filter, and inspect verified tax invoices, bank statements, and handwritten vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="h-9 px-3 rounded-lg border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>

          <Link href="/documents/upload">
            <button className="h-9 px-4 bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition cursor-pointer">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Document</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by filename, invoice number, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-[#E2DDD3] bg-white text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9C4B27] focus:border-[#9C4B27] transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-xl border border-[#E2DDD3] bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs focus:border-[#9C4B27] focus:outline-none cursor-pointer"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-xl border border-[#E2DDD3] bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs focus:border-[#9C4B27] focus:outline-none cursor-pointer"
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : !documents || documents.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900 font-sans">
              No matching documents found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try modifying your search query or clear the filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-[#E8E4DA]">
                <tr>
                  <th className="px-5 py-3.5">Document Details</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Uploaded By</th>
                  <th className="px-4 py-3.5">Upload Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Confidence</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {documents.map((doc) => {
                  const isNeedsReview = doc.status === 'NEEDS_REVIEW';

                  return (
                    <tr key={doc.id} className="hover:bg-[#FAF8F5]/80 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDF3EC] text-[#9C4B27]">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <Link
                              href={`/documents/${doc.id}/review`}
                              className="font-semibold text-slate-900 hover:text-[#9C4B27] transition"
                            >
                              {doc.filename}
                            </Link>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              ID: <span className="font-mono">{doc.id}</span> • {formatFileSize(doc.file_size)} • {doc.page_count || 1} pg
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-[#FDF3EC] px-2 py-0.5 text-[10px] font-semibold text-[#9C4B27]">
                          {doc.document_type}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 text-[11px]">
                        {doc.uploaded_by?.name || 'System Operator'}
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 font-medium">
                        {formatDate(doc.upload_date)}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={doc.status} />
                      </td>

                      <td className="px-4 py-3.5">
                        <ConfidenceBadge confidence={doc.overall_confidence} />
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isNeedsReview ? (
                            <Link href={`/documents/${doc.id}/review`}>
                              <button className="h-7 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition cursor-pointer">
                                <Edit3 className="h-3 w-3" />
                                <span>Review Now</span>
                              </button>
                            </Link>
                          ) : (
                            <Link href={`/documents/${doc.id}/review`}>
                              <button className="h-7 px-2.5 rounded-lg border border-[#E2DDD3] bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer">
                                View
                              </button>
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
        )}
      </div>
    </div>
  );
}
