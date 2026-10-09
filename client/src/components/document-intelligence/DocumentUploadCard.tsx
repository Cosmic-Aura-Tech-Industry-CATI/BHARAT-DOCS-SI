'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Upload,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
  Landmark,
  Receipt,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatFileSize } from '@/lib/formatters';

const DOCUMENT_TYPES = [
  { value: 'Auto-detect', label: 'Auto-detect Document Type (Recommended)' },
  { value: 'GST Invoice', label: 'GST Tax Invoice / Bill of Supply' },
  { value: 'Form-16', label: 'Form-16 / TDS Certificate (Salary & Non-Salary)' },
  { value: 'Bank Statement', label: 'Bank Statement (PDF/Image)' },
  { value: 'Hindi Handwritten Receipt / Kachha Bill', label: 'Hindi Handwritten Receipt / Kachha Bill (कच्चा बिल)' },
];

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

interface DocumentUploadCardProps {
  onUploadSuccess?: (doc: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    status: string;
    size: number;
  }) => void;
}

export function DocumentUploadCard({ onUploadSuccess }: DocumentUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('Auto-detect');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<{
    id: string;
    name: string;
    type: string;
    message?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);
    setUploadedDoc(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError('Invalid file format. Only PDF, PNG, JPG, and JPEG documents are supported.');
      toast.error('Unsupported file format', {
        description: 'Please select a PDF or Image (PNG, JPG) document.',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size (${formatFileSize(file.size)}) exceeds the maximum 20 MB limit.`);
      toast.error('File size too large', {
        description: 'Maximum allowed upload size is 20 MB.',
      });
      return;
    }

    setSelectedFile(file);
    toast.success('Document attached', {
      description: `${file.name} (${formatFileSize(file.size)}) ready for processing.`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a document to upload.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(20);
      setUploadStage('Uploading payload to BharatDoc ingestion pipeline...');

      const res = await api.uploadDocument(selectedFile, documentType);

      setUploadProgress(70);
      setUploadStage('Multimodal classification & entity extraction in progress...');

      await new Promise((r) => setTimeout(r, 600));
      setUploadProgress(100);

      const docInfo = {
        id: res.document_id,
        name: selectedFile.name,
        type: documentType !== 'Auto-detect' ? documentType : res.document_type || 'Auto-detect',
        message: res.message || `Queued with ID: ${res.document_id}`,
      };

      setUploadedDoc(docInfo);

      if (onUploadSuccess) {
        onUploadSuccess({
          id: res.document_id,
          name: selectedFile.name,
          type: docInfo.type,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'PROCESSING',
          size: selectedFile.size,
        });
      }

      toast.success('Document uploaded successfully!', {
        description: res.message || `Document ID: ${res.document_id}`,
      });

      // Reset file input state for next upload
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to upload document. Please check connection and retry.');
      toast.error('Upload failed', {
        description: err.message,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    setUploadedDoc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-card p-6 sm:p-7 space-y-5">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFECE6]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF3EC] text-[#9C4B27] border border-[#F5DFD0]">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-slate-900">
              1. Document Ingestion
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Upload GST tax invoices, Form-16 certificates, bank statements, or handwritten Hindi vouchers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8E4DA] self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Max 20 MB • Up to 10 pages</span>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {/* Dropzone Area */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-7 sm:p-9 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${isDragging
                ? 'border-[#9C4B27] bg-[#FDF3EC]/60 shadow-inner'
                : 'border-[#E2DDD3] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] hover:border-[#9C4B27]/60 shadow-2xs'
              }`}
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#9C4B27] border border-[#F2E5D6] shadow-2xs">
              <Upload className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900 font-sans">
                Drag and drop your document here, or{' '}
                <span className="text-[#9C4B27] underline underline-offset-2 hover:text-[#853D1C]">
                  browse files
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports PDF, JPG, PNG (up to 20 MB) • Auto-classification & Multimodal OCR
              </p>
            </div>

            {/* Document Type Tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                <FileText className="h-3 w-3 text-emerald-600" /> GST Invoices
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200/50">
                <FileSpreadsheet className="h-3 w-3 text-rose-600" /> Form-16 (TDS)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/50">
                <Landmark className="h-3 w-3 text-blue-600" /> Bank Statements
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
                <Receipt className="h-3 w-3 text-amber-600" /> Handwritten Bills
              </span>
            </div>
          </div>
        ) : (
          /* File Selected Details State */
          <div className="bg-[#FAF8F5] border border-[#E8E4DA] rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFECE6]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 line-clamp-1">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
                  </div>
                </div>
              </div>

              {!isUploading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-8 px-3 rounded-lg border border-[#E2DDD3] bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* Document Classification Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 block">
                Document Classification
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                disabled={isUploading}
                className="w-full rounded-xl border border-[#E2DDD3] bg-white px-3.5 py-2 text-xs font-medium text-slate-800 shadow-2xs focus-terracotta cursor-pointer"
              >
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                &apos;Auto-detect&apos; dynamically classifies invoices, Form-16 TDS certificates, and Hindi handwritten bills.
              </p>
            </div>

            {/* Ingestion Progress State */}
            {isUploading && (
              <div className="space-y-2 rounded-xl border border-[#E8E4DA] bg-white p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#9C4B27]" />
                    {uploadStage}
                  </span>
                  <span className="text-[#9C4B27] font-bold">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-[#9C4B27] transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={isUploading}
                className="h-9 px-4 rounded-xl border border-[#E2DDD3] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={isUploading}
                className="h-9 px-6 bg-[#9C4B27] hover:bg-[#853D1C] disabled:bg-[#9C4B27]/60 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing Document...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>Submit & Begin Processing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Success Notification Banner */}
      {uploadedDoc && !selectedFile && (
        <div className="rounded-xl border border-emerald-200 bg-[#EBF7EE] p-4 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">
                {uploadedDoc.name} ({uploadedDoc.type}) successfully uploaded!
              </div>
              <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                Document ID: {uploadedDoc.id} • Available for natural language querying below
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setUploadedDoc(null);
                fileInputRef.current?.click();
              }}
              className="h-8 px-3 rounded-lg border border-emerald-300 bg-white text-emerald-900 text-xs font-semibold hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Upload Another</span>
            </button>

            <Link href={`/documents/${uploadedDoc.id}/review`}>
              <button className="h-8 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1">
                <span>Open Verification Review</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
