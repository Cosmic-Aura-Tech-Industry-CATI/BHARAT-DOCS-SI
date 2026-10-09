'use client';

import React from 'react';
import { FieldEditState } from '@/stores/useReviewStore';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, AlertTriangle, X } from 'lucide-react';

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: 'save' | 'approve' | 'reject';
  editedFields: Record<string, FieldEditState>;
  isLoading?: boolean;
}

export function SubmitConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  editedFields,
  isLoading,
}: SubmitConfirmationModalProps) {
  if (!isOpen) return null;

  const editedList = Object.values(editedFields);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {actionType === 'approve' ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {actionType === 'approve'
                  ? 'Confirm Document Approval & Verification'
                  : actionType === 'reject'
                  ? 'Confirm Document Rejection'
                  : 'Save Field Corrections'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Permanent ledger entry will be created in compliance audit log.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Changed Fields Summary */}
        <div className="py-4 space-y-3">
          {editedList.length > 0 ? (
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Modified Fields for Human-in-the-Loop Submission ({editedList.length}):
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-950/40">
                {editedList.map((edit) => (
                  <div key={edit.field_key} className="rounded border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span>{edit.field_key}</span>
                      <span className="text-[10px] text-blue-600 font-mono">
                        {edit.original_value} → {edit.current_value}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Reason: <span className="italic">{edit.reason || 'Verified by CA'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              No fields have been manually modified. The original OCR and LLM extractions will be accepted as verified.
            </p>
          )}

          <div className="rounded-lg bg-blue-50/70 p-3 text-[11px] text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
            <strong>Auditor Note:</strong> Submitting will lock the verified values into your GSTR-2B reconciliation ledger and prepare the voucher for Tally XML export.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className={
              actionType === 'approve'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : actionType === 'reject'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          >
            {actionType === 'approve'
              ? 'Approve & Finalize'
              : actionType === 'reject'
              ? 'Reject Document'
              : 'Save Corrections'}
          </Button>
        </div>
      </div>
    </div>
  );
}
