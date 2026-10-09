'use client';

import React, { useState } from 'react';
import { ExtractedField, LineItem } from '@/types/document';
import { FieldItem } from './FieldItem';
import { useReviewStore } from '@/stores/useReviewStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatCurrencyINR } from '@/lib/formatters';
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  List,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldExtractorPanelProps {
  fields: ExtractedField[];
  lineItems?: LineItem[];
}

export function FieldExtractorPanel({ fields, lineItems }: FieldExtractorPanelProps) {
  const {
    filterTier,
    setFilterTier,
    searchFilter,
    setSearchFilter,
    editedFields,
    isDirty,
    resetAllEdits,
  } = useReviewStore();

  const [activeTab, setActiveTab] = useState<'fields' | 'line_items'>('fields');

  const dirtyCount = Object.keys(editedFields).length;

  // Filter fields based on search and tier
  const filteredFields = fields.filter((f) => {
    // Search query match
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchLabel = f.label.toLowerCase().includes(q);
      const matchKey = f.field_key.toLowerCase().includes(q);
      const matchVal = String(f.normalized_value || '').toLowerCase().includes(q);
      if (!matchLabel && !matchKey && !matchVal) return false;
    }

    // Tier filter match
    if (filterTier === 'needs_review') {
      return f.confidence < 70 || Boolean(f.validation_message);
    }
    if (filterTier === 'low') return f.confidence < 70;
    if (filterTier === 'medium') return f.confidence >= 70 && f.confidence < 90;
    if (filterTier === 'high') return f.confidence >= 90;

    return true;
  });

  const needsReviewCount = fields.filter((f) => f.confidence < 70 || Boolean(f.validation_message)).length;

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Panel Top Header: Tabs & Dirty status */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fields')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'fields'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              Extracted Fields ({fields.length})
            </button>

            {lineItems && lineItems.length > 0 && (
              <button
                onClick={() => setActiveTab('line_items')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  activeTab === 'line_items'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                Line Items ({lineItems.length})
              </button>
            )}
          </div>

          {isDirty && (
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {dirtyCount} Unsaved Change{dirtyCount > 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllEdits}
                className="h-6 px-1.5 text-[10px] text-slate-500 hover:text-slate-900"
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Filter and Search controls */}
        {activeTab === 'fields' && (
          <div className="mt-3 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Filter extracted fields..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="h-7 pl-8 text-xs bg-white dark:bg-slate-950"
              />
            </div>

            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button
                onClick={() => setFilterTier('all')}
                className={cn(
                  'px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer',
                  filterTier === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilterTier('needs_review')}
                className={cn(
                  'px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition cursor-pointer',
                  filterTier === 'needs_review'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300'
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                <span>Needs Review ({needsReviewCount})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'fields' ? (
          filteredFields.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No fields match the active filter criteria.
            </div>
          ) : (
            filteredFields.map((field) => <FieldItem key={field.field_key} field={field} />)
          )
        ) : (
          /* Line Items Tab View */
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5">HSN/SAC</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Rate</th>
                    <th className="p-2.5 text-right">Taxable</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                  {lineItems?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                      <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-slate-100">
                        {item.description}
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">
                        {item.hsn_sac || '—'}
                      </td>
                      <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">
                        {item.quantity ?? '—'}
                      </td>
                      <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">
                        {formatCurrencyINR(item.unit_price)}
                      </td>
                      <td className="p-2.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrencyINR(item.taxable_amount)}
                      </td>
                      <td className="p-2.5 text-right font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrencyINR(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
