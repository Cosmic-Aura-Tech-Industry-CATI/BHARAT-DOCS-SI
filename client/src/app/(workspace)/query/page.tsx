'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { NaturalQueryResponse } from '@/types/query';
import {
  Sparkles,
  Send,
  Code,
  FileText,
  Quote,
  ArrowRight,
  Search,
  Loader2,
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  'Show total GST tax paid to Tata Steel in September 2026',
  'Find invoices requiring manual human review',
  'List verified invoices for this month',
  'Show transactions above ₹50,000 with HSN codes',
];

function QueryConsoleContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NaturalQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSubmit(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = async (qText?: string) => {
    const finalQuery = qText || query;
    if (!finalQuery.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setQuery(finalQuery);

      const res = await api.query({ query: finalQuery });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to execute query on document repository.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="text-[11px] font-semibold text-slate-500 font-sans">
          Natural Language Intelligence
        </div>
        <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-0.5">
          Search & Query Console
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Ask questions in plain English or Hinglish over your ingested tax invoices, bank ledgers, and handwritten receipts.
        </p>
      </div>

      {/* Query Input Card */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-2xs space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-3"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Show total GST tax paid to Tata Steel in September 2026..."
              className="w-full h-11 pl-10 pr-28 rounded-xl border border-[#E2DDD3] bg-white text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9C4B27] focus:border-[#9C4B27] transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-1.5 h-8 px-4 bg-[#9C4B27] hover:bg-[#853D1C] disabled:bg-[#9C4B27]/50 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isLoading ? 'Thinking...' : 'Ask AI'}</span>
            </button>
          </div>

          {/* Example Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#9C4B27]" /> Examples:
            </span>
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSubmit(prompt)}
                disabled={isLoading}
                className="rounded-full border border-[#E8E4DA] bg-[#FAF8F5] px-3 py-1 text-[11px] text-slate-600 hover:border-[#9C4B27] hover:text-[#9C4B27] transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          <strong>Query Error:</strong> {error}
        </div>
      )}

      {/* Query Result Section */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Executive Natural Summary */}
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F0EB]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9C4B27] flex items-center gap-1.5 font-sans">
                <Sparkles className="h-3.5 w-3.5" /> AI Synthesis Summary
              </span>

              {result.generated_sql && (
                <button
                  type="button"
                  onClick={() => setShowSql(!showSql)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <Code className="h-3.5 w-3.5" />
                  <span>{showSql ? 'Hide SQL' : 'View Analytical SQL'}</span>
                </button>
              )}
            </div>

            <p className="text-sm leading-relaxed text-slate-800 font-serif">
              {result.summary}
            </p>

            {/* Informational SQL */}
            {showSql && result.generated_sql && (
              <div className="rounded-xl bg-[#13191D] p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase mb-1">Generated Analytical SQL (Informational):</div>
                {result.generated_sql}
              </div>
            )}
          </div>

          {/* Structured Data Table */}
          {result.data_table && result.data_table.rows.length > 0 && (
            <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-[#E8E4DA]">
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  Tabular Results
                </h3>
                <p className="text-[11px] text-slate-500">Synthesized from verified document extractions</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-slate-500 border-b border-[#E8E4DA]">
                    <tr>
                      {result.data_table.columns.map((col, idx) => (
                        <th key={idx} className="px-4 py-3">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6] font-mono text-xs">
                    {result.data_table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[#FAF8F5]/80 transition">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 text-slate-800">
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

          {/* Document Citations */}
          {result.citations && result.citations.length > 0 && (
            <div className="rounded-2xl border border-[#E8E4DA] bg-[#FAF7F2] p-5 shadow-2xs space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Quote className="h-3.5 w-3.5" /> Source Document Citations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.citations.map((cite, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#E8E4DA] bg-white p-3 text-xs shadow-2xs"
                  >
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-[#9C4B27]" />
                      <span>{cite.filename}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 italic">
                      &ldquo;{cite.snippet}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QueryConsolePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#9C4B27]" />
          <span className="text-xs">Loading query console...</span>
        </div>
      }
    >
      <QueryConsoleContent />
    </Suspense>
  );
}
