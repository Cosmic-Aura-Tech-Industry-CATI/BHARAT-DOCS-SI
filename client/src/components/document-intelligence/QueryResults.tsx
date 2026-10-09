'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Code,
  FileText,
  Quote,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  ArrowRight,
  Database,
} from 'lucide-react';
import { NaturalQueryResponse } from '@/types/query';

interface QueryResultsProps {
  result: NaturalQueryResponse;
  onFollowUpClick?: (prompt: string) => void;
}

export function QueryResults({ result, onFollowUpClick }: QueryResultsProps) {
  const [showSql, setShowSql] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Executive AI Synthesis Summary */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-7 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F0EB]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9C4B27] flex items-center gap-1.5 font-sans">
            <Sparkles className="h-4 w-4" /> AI Synthesis Summary
          </span>

          {result.generated_sql && (
            <button
              type="button"
              onClick={() => setShowSql(!showSql)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition cursor-pointer font-medium"
            >
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>{showSql ? 'Hide SQL Query' : 'View Analytical SQL'}</span>
              {showSql ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        <div className="text-sm leading-relaxed text-slate-800 font-serif">
          {result.summary.split(/(\*\*.*?\*\*)/g).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={index} className="font-bold text-slate-950 font-sans">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </div>

        {/* Informational SQL Code Block */}
        {showSql && result.generated_sql && (
          <div className="rounded-xl bg-[#13191D] p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800 space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Generated Analytical SQL (Read-Only Informational):
            </div>
            <pre className="text-emerald-300 whitespace-pre-wrap leading-normal font-mono">
              {result.generated_sql}
            </pre>
          </div>
        )}

        {/* Suggested Follow-up Questions */}
        {result.suggested_followups && result.suggested_followups.length > 0 && (
          <div className="pt-2 border-t border-[#F3F0EB]">
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#9C4B27]" /> Suggested follow-up questions:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.suggested_followups.map((followUp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onFollowUpClick && onFollowUpClick(followUp)}
                  className="rounded-full border border-[#E8E4DA] bg-[#FAF8F5] hover:bg-[#FDF3EC] hover:border-[#F5DFD0] hover:text-[#9C4B27] px-3 py-1 text-[11px] text-slate-600 transition cursor-pointer shadow-2xs"
                >
                  {followUp}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Structured Data Table */}
      {result.data_table && result.data_table.rows && result.data_table.rows.length > 0 && (
        <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E8E4DA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-[#9C4B27]" />
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Tabular Extraction Results
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {result.data_table.rows.length} {result.data_table.rows.length === 1 ? 'row' : 'rows'} synthesized
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-slate-600 border-b border-[#E8E4DA]">
                <tr>
                  {result.data_table.columns.map((col, idx) => (
                    <th key={idx} className="px-4 py-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] text-xs">
                {result.data_table.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#FAF8F5]/80 transition">
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="px-4 py-3.5 text-slate-800 font-mono text-[11px]">
                        {String(val ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Source Document Citations */}
      {result.citations && result.citations.length > 0 && (
        <div className="rounded-2xl border border-[#E8E4DA] bg-[#FAF7F2] p-5 sm:p-6 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Quote className="h-3.5 w-3.5 text-[#9C4B27]" /> Source Document Citations
            </span>
            <span className="text-[11px] text-slate-500">
              {result.citations.length} verified {result.citations.length === 1 ? 'citation' : 'citations'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.citations.map((cite, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#E8E4DA] bg-white p-3.5 text-xs shadow-2xs space-y-2 hover:border-[#9C4B27]/40 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                    <FileText className="h-4 w-4 text-[#9C4B27] shrink-0" />
                    <span className="truncate">{cite.filename}</span>
                  </div>

                  {cite.confidence && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {cite.confidence}% match
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 italic bg-[#FAF8F5] p-2 rounded-lg border border-[#EFECE6]">
                  &ldquo;{cite.snippet}&rdquo;
                </p>

                {cite.document_id && (
                  <div className="pt-1 flex justify-end">
                    <Link
                      href={`/documents/${cite.document_id}/review`}
                      className="text-[11px] font-semibold text-[#9C4B27] hover:text-[#853D1C] flex items-center gap-1 transition hover:underline"
                    >
                      <span>View Source in Review Workspace</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
