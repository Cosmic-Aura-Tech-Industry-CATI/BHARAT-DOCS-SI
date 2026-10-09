'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error: string | null;
  setError: (err: string | null) => void;
  isUploading?: boolean;
}

export function FileDropzone({
  onFileSelect,
  selectedFile,
  error,
  setError,
  isUploading,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError('Invalid file format. Only PDF, PNG, JPG, and JPEG documents are supported.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size (${formatFileSize(file.size)}) exceeds the maximum 20 MB limit.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
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

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer',
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/20'
            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/60',
          selectedFile && 'border-emerald-400 bg-emerald-50/30 dark:border-emerald-700 dark:bg-emerald-950/20',
          error && 'border-red-400 bg-red-50/30 dark:border-red-800 dark:bg-red-950/20',
          isUploading && 'pointer-events-none opacity-60'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shadow-sm">
              <File className="h-7 w-7" />
            </div>
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 text-sm">
                <span>{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={isUploading}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800"
                  title="Remove selected file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Size: {formatFileSize(selectedFile.size)} • Type: {selectedFile.type || 'Document'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> Ready for AI Extraction
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shadow-sm">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Drag and drop your document here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, PNG, JPG, JPEG (Up to 20 MB, max 10 pages)
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <span className="rounded bg-slate-200/60 px-2 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">GST Invoice</span>
              <span className="rounded bg-slate-200/60 px-2 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">Form-16</span>
              <span className="rounded bg-slate-200/60 px-2 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">Bank Statement</span>
              <span className="rounded bg-slate-200/60 px-2 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">Kachha Bill</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
