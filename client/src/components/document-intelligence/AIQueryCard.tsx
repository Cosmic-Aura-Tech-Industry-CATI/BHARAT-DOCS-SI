'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Loader2,
  AlertCircle,
  History,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { NaturalQueryResponse } from '@/types/query';
import { QueryResults } from './QueryResults';

const EXAMPLE_PROMPTS = [
  'Show total GST tax paid to Tata Steel in September 2026',
  'Find invoices requiring manual human review',
  'List verified invoices for this month',
  'Show transactions above ₹50,000 with HSN codes',
];

interface AIQueryCardProps {
  initialQuery?: string;
  onQueryExecuted?: (query: string, result: NaturalQueryResponse) => void;
}

export function AIQueryCard({ initialQuery = '', onQueryExecuted }: AIQueryCardProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NaturalQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleExecuteQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleExecuteQuery = async (queryText?: string) => {
    const finalQ = (queryText ?? query).trim();
    if (!finalQ) return;

    try {
      setIsLoading(true);
      setError(null);
      setQuery(finalQ);

      const response = await api.query({ query: finalQ });
      setResult(response);

      // Add to session query history if not already present
      setQueryHistory((prev) => {
        const filtered = prev.filter((q) => q.toLowerCase() !== finalQ.toLowerCase());
        return [finalQ, ...filtered].slice(0, 6);
      });

      if (onQueryExecuted) {
        onQueryExecuted(finalQ, response);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute query on document repository.');
      toast.error('Query execution failed', {
        description: err.message || 'Please check your connection and query parameters.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setQuery(prompt);
    handleExecuteQuery(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Query Search Card */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-card p-6 sm:p-7 space-y-4">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFECE6]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF3EC] text-[#9C4B27] border border-[#F5DFD0]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-slate-900">
                2. AI Repository Query
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Ask questions in natural English or Hinglish over your ingested tax invoices, bank ledgers, and receipts.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Copilot Active</span>
          </span>
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteQuery();
          }}
          className="space-y-3"
        >
          <div className="relative flex items-center shadow-2xs rounded-xl group focus-within:ring-2 focus-within:ring-[#9C4B27]/30 transition">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#9C4B27] transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Show total GST tax paid to Tata Steel in September 2026, or find pending reviews..."
              className="w-full h-11 pl-10 pr-28 rounded-xl border border-[#E2DDD3] bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#9C4B27] transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-1.5 h-8 px-4 bg-[#9C4B27] hover:bg-[#853D1C] disabled:bg-[#9C4B27]/50 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </div>

          {/* Suggested Example Prompts */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#9C4B27]" /> Examples:
            </span>
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                disabled={isLoading}
                className="rounded-full border border-[#E8E4DA] bg-[#FAF8F5] hover:bg-[#FDF3EC] hover:border-[#F5DFD0] hover:text-[#9C4B27] px-3 py-1 text-[11px] text-slate-600 transition cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Session Query History */}
          {queryHistory.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F3F0EB]">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <History className="h-3 w-3" /> Recent:
              </span>
              {queryHistory.slice(0, 4).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handlePromptClick(h)}
                  disabled={isLoading}
                  className="text-[11px] text-slate-500 hover:text-[#9C4B27] hover:underline transition cursor-pointer truncate max-w-[220px]"
                  title={h}
                >
                  &ldquo;{h}&rdquo;
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>
                <strong>Query Error:</strong> {error}
              </span>
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

      {/* Query Results Section */}
      {result && <QueryResults result={result} onFollowUpClick={handlePromptClick} />}
    </div>
  );
}
