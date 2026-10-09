'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DocumentUploadCard } from '@/components/document-intelligence/DocumentUploadCard';
import { AIQueryCard } from '@/components/document-intelligence/AIQueryCard';
import { RecentSessionUploads, SessionDocument } from '@/components/document-intelligence/RecentSessionUploads';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Layers,
  Database,
  ShieldCheck,
} from 'lucide-react';

function DocumentIntelligenceContent() {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  const [sessionDocs, setSessionDocs] = useState<SessionDocument[]>([]);

  const handleUploadSuccess = (newDoc: SessionDocument) => {
    setSessionDocs((prev) => [newDoc, ...prev]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#9C4B27] uppercase tracking-wider font-sans flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#9C4B27]" />
            <span>AI Document Intelligence</span>
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-1">
            Document Intelligence
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Upload business documents, extract structured data, and ask questions across your document repository in a single unified workspace.
          </p>
        </div>

        {/* Live System Status Badge */}
        <div className="flex items-center gap-2.5 bg-[#EBF7EE] border border-[#C5E8CC] rounded-xl px-3.5 py-2 shadow-2xs self-start md:self-auto">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-white">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-bold text-slate-900">Multimodal Engine Active</div>
            <div className="text-[10px] text-slate-600">OCR & Natural Query Online</div>
          </div>
        </div>
      </div>

      {/* ── Section A: Document Upload Card (TOP / UP) ── */}
      <DocumentUploadCard onUploadSuccess={handleUploadSuccess} />

      {/* ── Section B: AI Query Card (BOTTOM / DOWN) ── */}
      <AIQueryCard initialQuery={searchFromUrl} />

      {/* ── Section C: Recent Session Uploads (Context) ── */}
      <RecentSessionUploads documents={sessionDocs} />
    </div>
  );
}

export default function DocumentIntelligencePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#9C4B27]" />
          <span className="text-xs font-medium">Loading Document Intelligence workspace...</span>
        </div>
      }
    >
      <DocumentIntelligenceContent />
    </Suspense>
  );
}
