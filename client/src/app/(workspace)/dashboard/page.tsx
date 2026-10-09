'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Search,
  BarChart2,
  LayoutGrid,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Receipt,
  Landmark,
  FileSpreadsheet,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';

export default function DashboardPage() {
  const recentDocs = [
    {
      id: 'doc-1',
      name: 'Invoice_INV-2026-001.pdf',
      type: 'GST Invoice',
      uploadedOn: '15 Sep 2026, 10:24 AM',
      status: 'Completed',
      confidence: 98,
      iconColor: 'text-red-500 bg-red-50',
      typeBadgeColor: 'bg-[#FDF3EC] text-[#9C4B27]',
      reviewUrl: '/documents/doc-tata-steel-9041/review',
    },
    {
      id: 'doc-2',
      name: 'Form16_ABC_Pvt_Ltd.pdf',
      type: 'Form-16',
      uploadedOn: '15 Sep 2026, 09:12 AM',
      status: 'Processing',
      confidence: null,
      iconColor: 'text-blue-500 bg-blue-50',
      typeBadgeColor: 'bg-[#FDF3EC] text-[#9C4B27]',
      reviewUrl: '/queue',
    },
    {
      id: 'doc-3',
      name: 'HDFC_Statement_Oct2026.pdf',
      type: 'Bank Statement',
      uploadedOn: '14 Sep 2026, 06:45 PM',
      status: 'Completed',
      confidence: 96,
      iconColor: 'text-emerald-500 bg-emerald-50',
      typeBadgeColor: 'bg-slate-100 text-slate-700',
      reviewUrl: '/documents/doc-tata-steel-9041/review',
    },
    {
      id: 'doc-4',
      name: 'Receipt_Handwritten.jpg',
      type: 'Handwritten Receipt',
      uploadedOn: '14 Sep 2026, 02:18 PM',
      status: 'Needs Review',
      confidence: 72,
      iconColor: 'text-purple-500 bg-purple-50',
      typeBadgeColor: 'bg-slate-100 text-slate-700',
      reviewUrl: '/documents/doc-ganesh-kachha-102/review',
    },
    {
      id: 'doc-5',
      name: 'Invoice_StarTech.pdf',
      type: 'GST Invoice',
      uploadedOn: '14 Sep 2026, 11:03 AM',
      status: 'Completed',
      confidence: 94,
      iconColor: 'text-red-500 bg-red-50',
      typeBadgeColor: 'bg-[#FDF3EC] text-[#9C4B27]',
      reviewUrl: '/documents/doc-tata-steel-9041/review',
    },
  ];

  const supportedTypes = [
    {
      title: 'GST Invoices',
      desc: 'Auto-extract vendor, GSTIN, amounts...',
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-600',
      href: '/documents?type=GST+Invoice',
    },
    {
      title: 'Form-16 (Part A/B)',
      desc: 'Extract salary, TDS, employer details...',
      icon: FileSpreadsheet,
      color: 'bg-rose-50 text-rose-500',
      href: '/documents?type=Form-16',
    },
    {
      title: 'Bank Statements',
      desc: 'Transactions, balances, merchant details...',
      icon: Landmark,
      color: 'bg-blue-50 text-blue-600',
      href: '/documents?type=Bank+Statement',
    },
    {
      title: 'Handwritten Receipts',
      desc: 'AI-powered handwritten text extraction...',
      icon: Receipt,
      color: 'bg-amber-50 text-amber-600',
      href: '/documents?type=Handwritten',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 leading-tight">
            Welcome back, Shikhar
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Upload, process and extract insights from your documents with BharatDoc.
          </p>
        </div>

        {/* Date + System Operational Badge */}
        <div className="flex flex-col items-start md:items-end gap-1.5 self-start md:self-auto">
          <div className="text-[11px] font-semibold text-slate-500 font-sans">
            Thursday, 15 September 2026
          </div>
          <div className="flex items-center gap-2.5 bg-[#EBF7EE] border border-[#C5E8CC] rounded-xl px-3.5 py-2 shadow-2xs">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-slate-900">System Operational</div>
              <div className="text-[10px] text-slate-600">All services are running smoothly.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Documents */}
        <Link href="/documents" className="block group">
          <div className="bg-white border border-[#E8E4DA] rounded-xl p-4 shadow-2xs hover:shadow-xs hover:border-[#D5CFBF] transition">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF3EC] text-[#9C4B27]">
                <FileText className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
                <span>12%</span>
                <span className="font-normal text-emerald-600 ml-0.5">vs last week</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
                248
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Total Documents
              </div>
            </div>
          </div>
        </Link>

        {/* Card 2: Processing */}
        <Link href="/queue" className="block group">
          <div className="bg-white border border-[#E8E4DA] rounded-xl p-4 shadow-2xs hover:shadow-xs hover:border-[#D5CFBF] transition">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
                36
              </div>
              <div className="text-xs text-slate-900 font-medium mt-0.5">
                Processing
              </div>
              <div className="text-[10px] text-slate-400">
                In queue / AI analysis
              </div>
            </div>
          </div>
        </Link>

        {/* Card 3: Completed */}
        <Link href="/documents?status=VERIFIED" className="block group">
          <div className="bg-white border border-[#E8E4DA] rounded-xl p-4 shadow-2xs hover:shadow-xs hover:border-[#D5CFBF] transition">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
                201
              </div>
              <div className="text-xs text-slate-900 font-medium mt-0.5">
                Completed
              </div>
              <div className="text-[10px] text-slate-400">
                Successfully processed
              </div>
            </div>
          </div>
        </Link>

        {/* Card 4: Needs Review */}
        <Link href="/queue" className="block group">
          <div className="bg-white border border-[#E8E4DA] rounded-xl p-4 shadow-2xs hover:shadow-xs hover:border-[#D5CFBF] transition">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
                11
              </div>
              <div className="text-xs text-slate-900 font-medium mt-0.5">
                Needs Review
              </div>
              <div className="text-[10px] text-slate-400">
                Human verification required
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Grid: Left 8 Columns vs Right 4 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upload Documents Hero Box */}
          <div className="bg-[#FAF7F2] border border-[#E8E4DA] rounded-2xl p-8 text-center shadow-2xs relative">
            <div className="max-w-md mx-auto space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFE9DF] text-slate-700 mx-auto">
                <Upload className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Upload Documents
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Drag and drop your files here, or{' '}
                  <Link
                    href="/documents/upload"
                    className="text-[#9C4B27] font-semibold underline underline-offset-2 hover:text-[#853D1C]"
                  >
                    click to browse
                  </Link>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports PDF, JPG, PNG (Invoices, Form-16, Bank Statements, Handwritten Receipts)
                </p>
              </div>

              <div className="pt-2">
                <Link href="/documents/upload">
                  <button className="h-9 px-6 bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 mx-auto transition cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Files</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Documents Table Card */}
          <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-[#E8E4DA] flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Recent Documents
              </h3>
              <Link
                href="/documents"
                className="text-xs text-[#9C4B27] font-semibold hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-[#E8E4DA]">
                  <tr>
                    <th className="px-5 py-3">Document Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Uploaded On</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {recentDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#FAF8F5]/80 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${doc.iconColor}`}>
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                          <Link
                            href={doc.reviewUrl}
                            className="font-semibold text-slate-900 hover:text-[#9C4B27] transition"
                          >
                            {doc.name}
                          </Link>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${doc.typeBadgeColor}`}>
                          {doc.type}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 font-medium">
                        {doc.uploadedOn}
                      </td>

                      <td className="px-4 py-3.5">
                        {doc.status === 'Completed' ? (
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Completed
                          </span>
                        ) : doc.status === 'Processing' ? (
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                            Processing
                          </span>
                        ) : (
                          <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Needs Review
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        {doc.confidence !== null ? (
                          <div className="w-28 space-y-1">
                            <span className="text-[11px] font-bold text-slate-800">
                              {doc.confidence}%
                            </span>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  doc.confidence >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${doc.confidence}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={doc.reviewUrl}>
                            <button className="h-7 px-2.5 rounded-lg border border-[#E2DDD3] bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer">
                              View
                            </button>
                          </Link>
                          <Link href={doc.reviewUrl}>
                            <button className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Banner: Ask Questions About Your Documents */}
          <div className="rounded-2xl border border-[#E8E4DA] bg-[#FAF7F2] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden relative">
            <div className="flex items-center gap-3 relative z-10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FDF3EC] text-[#9C4B27]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-serif">
                  Ask Questions About Your Documents
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Find insights, extract information and get answers in natural language.
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link href="/query">
                <button className="h-9 px-4 bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer">
                  <span>Try Natural Language Search</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>

            {/* Peeking Invoice graphic on right */}
            <div className="hidden md:block absolute -right-6 -bottom-6 w-36 h-28 bg-white border border-slate-200 rounded-lg shadow-md rotate-[-8deg] pointer-events-none p-2 text-[7px] font-mono text-slate-400 select-none">
              <div className="font-bold text-slate-700 text-[8px]">TAX INVOICE</div>
              <div className="mt-1 h-1 bg-slate-200 rounded w-20" />
              <div className="mt-1 h-1 bg-slate-200 rounded w-16" />
              <div className="mt-2 h-1 bg-slate-300 rounded w-24" />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Supported Document Types Card */}
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFECE6]">
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Supported Document Types
              </h3>
              <Link href="/templates" className="text-xs text-[#9C4B27] font-semibold hover:underline">
                View all
              </Link>
            </div>

            <div className="divide-y divide-[#F3F0EB]">
              {supportedTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="py-3 flex items-center justify-between group hover:bg-[#FAF8F5] -mx-2 px-2 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#9C4B27] transition">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Processing Status Donut Chart Card */}
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFECE6]">
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Processing Status
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>Last 7 days</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-5">
              {/* Donut Chart SVG */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Completed: 81% (Emerald) */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="81, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Processing: 15% (Blue) */}
                  <path
                    className="text-blue-500"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-81"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Needs Review: 4% (Amber) */}
                  <path
                    className="text-amber-500"
                    strokeDasharray="4, 100"
                    strokeDashoffset="-96"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute text-center leading-tight">
                  <span className="text-base font-bold text-slate-900 block font-sans">
                    248
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">
                    Total
                  </span>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex-1 space-y-2 text-xs">
                <Link href="/documents?status=VERIFIED" className="flex items-center justify-between hover:text-[#9C4B27] transition">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600">Completed</span>
                  </div>
                  <span className="font-semibold text-slate-800">201 (81%)</span>
                </Link>

                <Link href="/queue" className="flex items-center justify-between hover:text-[#9C4B27] transition">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-slate-600">Processing</span>
                  </div>
                  <span className="font-semibold text-slate-800">36 (15%)</span>
                </Link>

                <Link href="/queue" className="flex items-center justify-between hover:text-[#9C4B27] transition">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-slate-600">Needs Review</span>
                  </div>
                  <span className="font-semibold text-slate-800">11 (4%)</span>
                </Link>

                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span>Failed</span>
                  </div>
                  <span>0 (0%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions 2x2 Grid Card */}
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 font-sans mb-3">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/documents/upload">
                <button className="w-full h-10 px-3 rounded-xl border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs">
                  <Upload className="h-3.5 w-3.5 text-slate-500" />
                  <span>Upload Documents</span>
                </button>
              </Link>

              <Link href="/query">
                <button className="w-full h-10 px-3 rounded-xl border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs">
                  <Search className="h-3.5 w-3.5 text-slate-500" />
                  <span>Search Documents</span>
                </button>
              </Link>

              <Link href="/exports">
                <button className="w-full h-10 px-3 rounded-xl border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs">
                  <BarChart2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>View Reports</span>
                </button>
              </Link>

              <Link href="/templates">
                <button className="w-full h-10 px-3 rounded-xl border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs">
                  <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
                  <span>Manage Templates</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
