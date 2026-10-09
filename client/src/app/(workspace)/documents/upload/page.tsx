'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '@/components/upload/FileDropzone';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Upload,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';

const DOCUMENT_TYPES = [
  { value: 'Auto-detect', label: 'Auto-detect Document Type (Recommended)' },
  { value: 'GST Invoice', label: 'GST Tax Invoice / Bill of Supply' },
  { value: 'Form-16', label: 'Form-16 / TDS Certificate (Salary & Non-Salary)' },
  { value: 'Bank Statement', label: 'Bank Account Statement (PDF/Image)' },
  { value: 'Hindi Handwritten Receipt / Kachha Bill', label: 'Hindi Handwritten Receipt / Kachha Bill (कच्चा बिल)' },
];

export default function DocumentUploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('Auto-detect');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStage, setUploadStage] = useState<string>('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(20);
      setUploadStage('Uploading payload to BharatDoc ingestion API...');

      const res = await api.uploadDocument(selectedFile, documentType);

      setUploadProgress(70);
      setUploadStage('Multimodal pipeline initialized (HTTP 202 Accepted)...');

      await new Promise((r) => setTimeout(r, 600));
      setUploadProgress(100);

      toast.success('Document uploaded successfully!', {
        description: res.message || `Queued with ID: ${res.document_id}`,
      });

      router.push(`/documents/${res.document_id}/review`);
    } catch (err: any) {
      setError(err.message || 'Failed to upload document. Please verify connection and retry.');
      toast.error('Upload failed', {
        description: err.message,
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <div className="text-[11px] font-semibold text-slate-500 font-sans">
          Multimodal Ingestion
        </div>
        <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-0.5">
          Upload Documents
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Upload GST invoices, Form-16, bank statements, or handwritten Hindi receipts. AI bounding boxes and confidence scores are generated automatically.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-2xs space-y-6">
        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Dropzone */}
          <FileDropzone
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            error={error}
            setError={setError}
            isUploading={isUploading}
          />

          {/* Document Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Document Classification
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              disabled={isUploading}
              className="w-full rounded-xl border border-[#E2DDD3] bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-[#9C4B27] focus:outline-none cursor-pointer"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Leaving as &apos;Auto-detect&apos; allows BharatDoc&apos;s multimodal classifier to determine whether the document is a GST Tax Invoice, Form-16, or Devanagari handwritten receipt.
            </p>
          </div>

          {/* Ingestion Progress State */}
          {isUploading && (
            <div className="space-y-2 rounded-xl border border-[#E8E4DA] bg-[#FAF7F2] p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>{uploadStage}</span>
                <span className="text-[#9C4B27]">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-[#9C4B27] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setError(null);
              }}
              disabled={isUploading || !selectedFile}
              className="h-9 px-4 rounded-lg border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-slate-700 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="h-9 px-5 bg-[#9C4B27] hover:bg-[#853D1C] disabled:bg-[#9C4B27]/50 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Submit & Begin Processing</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Verification Guidelines / Compliance Box */}
      <div className="rounded-2xl border border-[#E8E4DA] bg-[#FAF7F2] p-5 shadow-2xs text-xs text-slate-600 space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 font-serif">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Statutory Compliance & Security Guarantees</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] list-disc list-inside text-slate-600">
          <li>Encrypted in-transit using 256-bit TLS</li>
          <li>Compliant with Indian IT Act & DPDP Act 2023</li>
          <li>Automated 3-way reconciliation against GSTR-2B</li>
          <li>Devanagari OCR for Mandi & Krishi Upaj bills</li>
        </ul>
      </div>
    </div>
  );
}
