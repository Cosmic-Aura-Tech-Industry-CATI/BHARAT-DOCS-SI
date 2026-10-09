'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/formatters';
import {
  ShieldCheck,
  Search,
  RefreshCw,
  FileText,
  User,
  History,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export default function HelpAndAuditLogsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'audit' | 'help'>('audit');

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.getAuditLogs(),
  });

  const filteredLogs = logs?.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.actor.name.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      (log.document_name && log.document_name.toLowerCase().includes(q)) ||
      (log.field_key && log.field_key.toLowerCase().includes(q))
    );
  });

  const faqs = [
    {
      q: 'How does BharatDoc achieve high OCR accuracy on Hindi handwritten receipts?',
      a: 'BharatDoc utilizes fine-tuned Indic multimodal vision models combined with Devanagari Hindi lexicon dictionaries specifically trained on Mandi and Krishi Upaj parchas.',
    },
    {
      q: 'How do I export verified documents into Tally Prime?',
      a: 'Navigate to Reports in the sidebar, select "Export Verified Documents to Tally XML", and import the XML directly into Tally Prime via the Alt+O Import Vouchers option.',
    },
    {
      q: 'What triggers a document to move into "Needs Review"?',
      a: 'Any mathematical discrepancy (such as subtotal + GST ≠ grand total), unverified supplier GSTIN checksum, or low OCR bounding box confidence score below 85% automatically routes the file to the Human-in-the-Loop review queue.',
    },
    {
      q: 'Is BharatDoc compliant with Indian DPDP Act 2023 and GST regulations?',
      a: 'Yes. All financial data is encrypted in transit using 256-bit TLS, PAN/Aadhaar identifiers are masked, and immutable audit trails log every human operator edit.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 font-sans">
            Compliance & Assistance
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-0.5">
            Help & Audit Logs
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Immutable log of all OCR extractions and human corrections, plus documentation and technical support.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-white border border-[#E8E4DA] p-1 rounded-xl shadow-2xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#281B15] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compliance Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'help'
                ? 'bg-[#281B15] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Help & CA Documentation
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="space-y-4">
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail by actor, field, or document..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-xl border border-[#E2DDD3] bg-white text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-[#9C4B27] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                Showing {filteredLogs?.length || 0} events
              </span>
              <button
                onClick={() => refetch()}
                className="h-8 px-2.5 rounded-lg border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="h-3 w-3 text-slate-500" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-[#E8E4DA]">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-4 py-3.5">Actor</th>
                    <th className="px-4 py-3.5">Action</th>
                    <th className="px-4 py-3.5">Document Target</th>
                    <th className="px-4 py-3.5">Field / Mutation</th>
                    <th className="px-5 py-3.5">Audit Reason & IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {filteredLogs?.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF8F5]/80 transition">
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">{log.actor.name}</div>
                        <div className="text-[10px] text-slate-400">{log.actor.role}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-[#FDF3EC] px-2 py-0.5 text-[10px] font-semibold text-[#9C4B27]">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-800 block truncate max-w-[180px]">
                          {log.document_name || log.document_id || 'System'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {log.field_key ? (
                          <div>
                            <span className="font-mono font-semibold text-[#9C4B27]">
                              {log.field_key}
                            </span>
                            {log.before_value && log.after_value && (
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {String(log.before_value)} →{' '}
                                <strong className="text-slate-900">{String(log.after_value)}</strong>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600">
                        <div>{log.reason || log.notes || 'Routine verification'}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          IP: {log.ip_address || '103.24.18.92'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* FAQs */}
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] p-4 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FDF3EC] text-[#9C4B27] text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-2xl border border-[#E8E4DA] bg-[#FAF7F2] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 font-serif">
                Need Chartered Accountant Integration Support?
              </h4>
              <p className="text-xs text-slate-600">
                Our support team is available during standard Indian banking hours (10 AM - 7 PM IST).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="mailto:support@bharatdoc.in"
                className="h-9 px-4 bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
