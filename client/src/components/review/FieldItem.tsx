'use client';

import React, { useState, useEffect } from 'react';
import { ExtractedField } from '@/types/document';
import { useReviewStore } from '@/stores/useReviewStore';
import { ConfidenceBadge } from '@/components/documents/ConfidenceBadge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Crosshair,
  AlertTriangle,
  Check,
  Undo2,
  FileEdit,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldItemProps {
  field: ExtractedField;
}

export function FieldItem({ field }: FieldItemProps) {
  const {
    selectedFieldKey,
    selectField,
    setHoveredField,
    editedFields,
    updateFieldValue,
    resetFieldEdit,
  } = useReviewStore();

  const isSelected = selectedFieldKey === field.field_key;
  const isEdited = Boolean(editedFields[field.field_key]);
  const currentVal = isEdited
    ? editedFields[field.field_key].current_value
    : String(field.normalized_value ?? '');

  const [editValue, setEditValue] = useState(currentVal);
  const [reason, setReason] = useState(
    editedFields[field.field_key]?.reason || 'Corrected OCR digit recognition'
  );
  const [isPromptingReason, setIsPromptingReason] = useState(false);

  useEffect(() => {
    setEditValue(currentVal);
  }, [currentVal]);

  const originalVal = String(field.normalized_value ?? '');
  const hasChanged = editValue !== originalVal;
  const isLowConfidence = field.confidence < 70;

  const handleApplyChange = () => {
    updateFieldValue(field.field_key, originalVal, editValue, reason);
    setIsPromptingReason(false);
  };

  const handleReset = () => {
    resetFieldEdit(field.field_key);
    setEditValue(originalVal);
    setIsPromptingReason(false);
  };

  return (
    <div
      onClick={() => selectField(field.field_key, field.bounding_box, field.page)}
      onMouseEnter={() => setHoveredField(field.field_key)}
      onMouseLeave={() => setHoveredField(null)}
      className={cn(
        'group relative rounded-xl border p-3.5 transition-all cursor-pointer',
        isSelected
          ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30 shadow-md ring-1 ring-blue-500'
          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900',
        isLowConfidence && !isSelected && 'border-amber-300/80 bg-amber-50/30 dark:border-amber-900/60'
      )}
    >
      {/* Top Header: Label, Indicators & Confidence Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            {field.label}
          </span>

          {field.bounding_box && (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded"
              title="Bounding box synced with viewer canvas"
            >
              <Crosshair className="h-2.5 w-2.5" />
              <span>Pg {field.bounding_box.page || 1}</span>
            </span>
          )}

          {isEdited && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.2 rounded">
              <FileEdit className="h-2.5 w-2.5" />
              <span>Modified</span>
            </span>
          )}

          {field.is_human_corrected && !isEdited && (
            <span className="inline-flex items-center text-[10px] font-medium text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded">
              CA Verified
            </span>
          )}
        </div>

        <ConfidenceBadge confidence={field.confidence} size="sm" />
      </div>

      {/* Editable Normalized Value Input */}
      <div className="mt-2.5 flex items-center gap-2">
        <Input
          type="text"
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            if (e.target.value !== originalVal) {
              setIsPromptingReason(true);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'h-8 text-xs font-medium',
            isEdited ? 'border-amber-400 bg-amber-50/20 text-amber-900 dark:text-amber-200' : 'text-slate-900 dark:text-slate-100'
          )}
        />

        {hasChanged && (
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              onClick={handleApplyChange}
              className="h-8 px-2 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1"
              title="Save correction"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="h-8 px-2 text-slate-500 hover:text-slate-800 text-xs"
              title="Revert to original OCR extraction"
            >
              <Undo2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Correction Reason Input (prompted when edited) */}
      {isPromptingReason && hasChanged && (
        <div
          className="mt-2 rounded-lg border border-amber-200 bg-amber-50/70 p-2 text-xs dark:border-amber-900/60 dark:bg-amber-950/30 space-y-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
            Audit Reason for Correction:
          </label>
          <Input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Corrected Devanagari digit recognition"
            className="h-7 text-xs bg-white dark:bg-slate-900"
          />
        </div>
      )}

      {/* Raw OCR Value & Warning Messages */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[10px] uppercase font-bold text-slate-400">OCR Raw:</span>
          <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
            {field.original_ocr_value || String(field.normalized_value) || '—'}
          </span>
        </div>
      </div>

      {/* Validation Message if Warning or Low Confidence */}
      {field.validation_message && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 p-2 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 mt-0.5" />
          <span>{field.validation_message}</span>
        </div>
      )}

      {isLowConfidence && !field.validation_message && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400 font-medium">
          <ShieldAlert className="h-3 w-3 shrink-0" />
          <span>Low OCR confidence ({field.confidence}%). CA inspection required.</span>
        </div>
      )}
    </div>
  );
}
