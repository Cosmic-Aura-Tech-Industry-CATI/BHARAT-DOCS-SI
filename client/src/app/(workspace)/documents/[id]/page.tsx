'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDocumentDetails } from '@/hooks/useDocuments';
import { StatusBadge } from '@/components/documents/StatusBadge';
import { ConfidenceBadge } from '@/components/documents/ConfidenceBadge';
import { formatDate, formatDateTime, formatFileSize } from '@/lib/formatters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  ArrowLeft,
  Edit3,
  Download,
  Calendar,
  User,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export default function DocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const { data: doc, isLoading, error } = useDocumentDetails(documentId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-800">
        <h3>Document not found</h3>
        <Link href="/documents" className="mt-2 inline-block">
          <Button size="sm">Back to Documents</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/documents">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Documents</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/documents/${doc.id}/review`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium text-xs shadow-sm">
              <Edit3 className="h-4 w-4" />
              <span>Open Verification Workspace</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Document Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {doc.filename}
                </CardTitle>
                <CardDescription className="font-mono text-xs mt-0.5">
                  ID: {doc.id} • {doc.document_type}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={doc.status} />
              <ConfidenceBadge confidence={doc.overall_confidence} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Upload Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {formatDateTime(doc.upload_date)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">File Size & Pages</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {formatFileSize(doc.file_size)} • {doc.page_count || 1} pages
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Uploaded By</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {doc.uploaded_by?.name || 'Authorized CA'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Reconciliation</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> GSTR-2B Matched
              </span>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Last updated: {formatDateTime(doc.updated_at)}
            </span>

            <div className="flex items-center gap-2">
              <Link href="/exports">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Export to Tally XML</span>
                </Button>
              </Link>

              <Link href={`/documents/${doc.id}/review`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs">
                  <span>Enter Review Workspace</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
