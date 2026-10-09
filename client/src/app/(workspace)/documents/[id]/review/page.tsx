'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDocumentResults, useSubmitDocumentReview } from '@/hooks/useDocumentResults';
import { useReviewStore } from '@/stores/useReviewStore';
import { DocumentViewer } from '@/components/review/DocumentViewer';
import { FieldExtractorPanel } from '@/components/review/FieldExtractorPanel';
import { SubmitConfirmationModal } from '@/components/review/SubmitConfirmationModal';
import { StatusBadge } from '@/components/documents/StatusBadge';
import { ConfidenceBadge } from '@/components/documents/ConfidenceBadge';
import { Button } from '@/components/ui/Button';
import { ExtractedField } from '@/types/document';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentReviewWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const documentId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const { data: results, isLoading, error, refetch } = useDocumentResults(documentId);
  const submitReviewMutation = useSubmitDocumentReview(documentId);

  const {
    isDirty,
    editedFields,
    setDocumentContext,
    resetAllEdits,
  } = useReviewStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'save' | 'approve' | 'reject'>('approve');

  // Sync document context with store
  useEffect(() => {
    if (results) {
      setDocumentContext(results.document_id, results.page_count || 1);
    }
  }, [results, setDocumentContext]);

  // Transform fields into an array if backend returns a key-value map
  const rawFields = results?.fields;
  const fieldsArray: ExtractedField[] = Array.isArray(rawFields)
    ? rawFields
    : rawFields
    ? Object.entries(rawFields).map(([key, val]) => ({
        ...val,
        field_key: val.field_key || key,
      }))
    : [];

  const handleOpenModal = (action: 'save' | 'approve' | 'reject') => {
    setModalAction(action);
    setModalOpen(true);
  };

  const handleConfirmReview = async () => {
    const corrections = Object.values(editedFields).map((item) => ({
      field_key: item.field_key,
      corrected_value: item.current_value,
      correction_reason: item.reason || 'Verified by CA in review workspace',
    }));

    await submitReviewMutation.mutateAsync({
      corrections,
      action: modalAction,
    });

    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center space-y-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Loading BharatDoc HITL Workspace & Bounding Box Vectors...
          </p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-600" />
        <h3 className="mt-2 text-sm font-bold">Failed to load extraction results</h3>
        <p className="mt-1">{error?.message || 'Document results not available.'}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/documents">
            <Button size="sm" variant="outline">
              Back to Documents
            </Button>
          </Link>
          <Button size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-3">
      {/* Top Workspace Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 rounded-xl shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Link href="/documents">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {results.document_id}
              </h2>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {results.document_type}
              </span>
              <StatusBadge status={results.status} showIcon={false} />
              <ConfidenceBadge confidence={results.overall_confidence} size="sm" />
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Multimodal Model: {results.metadata?.model_version || 'Indic Multimodal v2.6'} • OCR Engine: {results.metadata?.ocr_engine || 'DeepVision OCR'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllEdits}
              className="h-8 text-xs text-slate-600 hover:text-slate-900 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Discard Changes</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenModal('save')}
            isLoading={submitReviewMutation.isPending}
            className="h-8 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40 gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Draft Edits</span>
          </Button>

          <Button
            size="sm"
            onClick={() => handleOpenModal('approve')}
            isLoading={submitReviewMutation.isPending}
            className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approve & Verify</span>
          </Button>
        </div>
      </div>

      {/* Split-Screen Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left Panel: Document Viewer (PDF/Image Canvas with Bounding Boxes) */}
        <div className="lg:col-span-7 h-full min-h-[450px]">
          <DocumentViewer
            documentId={results.document_id}
            documentType={results.document_type}
            filename={results.document_id}
            fileUrl={results.file_url}
            fields={fieldsArray}
            pageCount={results.page_count || 1}
          />
        </div>

        {/* Right Panel: Dynamic Extracted Fields with Validation & Editing */}
        <div className="lg:col-span-5 h-full min-h-[450px]">
          <FieldExtractorPanel
            fields={fieldsArray}
            lineItems={results.line_items}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmReview}
        actionType={modalAction}
        editedFields={editedFields}
        isLoading={submitReviewMutation.isPending}
      />
    </div>
  );
}
