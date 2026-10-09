'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  FileText,
  FileSpreadsheet,
  Landmark,
  Receipt,
  FileCheck,
  Truck,
  ArrowRight,
  Download,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const templates = [
    {
      id: 'gst-invoice',
      category: 'TAX',
      title: 'GST Tax Invoice (B2B / B2C)',
      docType: 'GST Invoice',
      desc: 'Standard tax invoice schema with multi-tier GST rates, HSN/SAC classification, and reverse-charge rules.',
      icon: FileText,
      iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      badge: 'Statutory GST',
      fieldsCount: 18,
      keyFields: ['Supplier GSTIN', 'Buyer GSTIN', 'Invoice No', 'HSN/SAC Code', 'Taxable Value', 'CGST / SGST / IGST'],
      validationRules: 'GSTIN Luhn algorithm, Math cross-verification, Section 16 compliance',
    },
    {
      id: 'form-16',
      category: 'INCOME_TAX',
      title: 'Form-16 (Part A & B TDS Certificate)',
      docType: 'Form-16',
      desc: 'Salary certificate issued under Section 203 of the Income-tax Act, 1961 for tax deducted at source.',
      icon: FileSpreadsheet,
      iconColor: 'bg-rose-50 text-rose-500 border-rose-200/60',
      badge: 'TRACES Compliant',
      fieldsCount: 24,
      keyFields: ['Employer TAN', 'Employee PAN', 'Assessment Year', 'Gross Salary', 'Total TDS Deducted', 'Chapter VI-A Deductions'],
      validationRules: 'TAN/PAN formatting, Quarter-wise tax credit checksum',
    },
    {
      id: 'bank-statement',
      category: 'BANKING',
      title: 'Bank Statement & Transaction Ledger',
      docType: 'Bank Statement',
      desc: 'Automated multi-bank parser supporting HDFC, SBI, ICICI, Axis, Kotak, and PNB statements with running balance checks.',
      icon: Landmark,
      iconColor: 'bg-blue-50 text-blue-600 border-blue-200/60',
      badge: 'Universal Banking',
      fieldsCount: 14,
      keyFields: ['Account Number', 'IFSC Code', 'Value Date', 'Txn Description / UPI Ref', 'Debit / Credit', 'Running Balance'],
      validationRules: 'Continuous balance arithmetic reconciliation',
    },
    {
      id: 'hindi-receipt',
      category: 'HANDWRITTEN',
      title: 'Hindi Handwritten Bill / Kachha Parcha',
      docType: 'Hindi Handwritten Receipt / Kachha Bill',
      desc: 'Indic handwriting extraction template tuned for Indian Mandi, Krishi Upaj, and local merchant bills in Devanagari.',
      icon: Receipt,
      iconColor: 'bg-amber-50 text-amber-600 border-amber-200/60',
      badge: 'Indic Multimodal OCR',
      fieldsCount: 12,
      keyFields: ['Vyapari / Firm Name', 'Date (Hindi/English)', 'Mandi Bori / Quantity', 'Rate per Qtl', 'Dhalta / Commission', 'Final Amount'],
      validationRules: 'Devanagari numeral mapping, Mandi cess check',
    },
    {
      id: 'eway-bill',
      category: 'LOGISTICS',
      title: 'E-Way Bill (Form GST EWB-01)',
      docType: 'E-Way Bill',
      desc: 'Electronic way bill required under Rule 138 of CGST Rules for consignment transport above ₹50,000.',
      icon: Truck,
      iconColor: 'bg-purple-50 text-purple-600 border-purple-200/60',
      badge: 'NIC Portal Schema',
      fieldsCount: 16,
      keyFields: ['E-Way Bill No', 'Generated Date', 'Valid Till', 'Transporter ID', 'Vehicle Number', 'Approx Distance (KM)'],
      validationRules: 'EWB validity duration check, Pincode distance ratio',
    },
    {
      id: 'bill-of-entry',
      category: 'CUSTOMS',
      title: 'Customs Bill of Entry (ICEGATE)',
      docType: 'Bill of Entry',
      desc: 'Legal declaration by importer/customs broker for clearance of imported cargo under Customs Act, 1962.',
      icon: FileCheck,
      iconColor: 'bg-teal-50 text-teal-600 border-teal-200/60',
      badge: 'ICEGATE Compatible',
      fieldsCount: 20,
      keyFields: ['BoE Number & Date', 'Port Code', 'IEC Code', 'BCD (Basic Duty)', 'Social Welfare Surcharge', 'IGST Assessment'],
      validationRules: 'Customs tariff verification, Exchange rate parity',
    },
  ];

  const filtered = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.keyFields.some((f) => f.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = activeCategory === 'ALL' || t.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleExportSchema = (templateTitle: string) => {
    toast.success('Schema Definition Downloaded', {
      description: `${templateTitle} JSON schema exported for programmatic validation.`,
    });
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 font-sans">
            Extraction Blueprints & Schemas
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-0.5">
            Document Templates
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Pre-configured schema rules, validation constraints, and field extractors tailored for Indian financial documents.
          </p>
        </div>

        <Link href="/document-intelligence">
          <button className="h-9 px-5 bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition cursor-pointer">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Upload with Template</span>
          </button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by document type, field name, or standard..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-[#E2DDD3] bg-white text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9C4B27] focus:border-[#9C4B27] transition"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'TAX', 'INCOME_TAX', 'BANKING', 'HANDWRITTEN', 'LOGISTICS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#281B15] text-white font-semibold'
                  : 'bg-[#FAF8F5] text-slate-600 hover:bg-[#EFECE6]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2.5 rounded-xl border ${item.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-[#FAF7F2] border border-[#E8E4DA] px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-slate-900 font-serif mt-3.5 group-hover:text-[#9C4B27] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>

                {/* Key Fields */}
                <div className="mt-4 pt-3 border-t border-[#F3F0EB]">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-2">
                    <span>Extracted Fields</span>
                    <span className="text-[#9C4B27] font-bold">{item.fieldsCount} Fields</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.keyFields.map((field, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#FAF8F5] text-slate-600 border border-[#EBE7DF] px-2 py-0.5 rounded-md"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Validation Rules */}
                <div className="mt-3 bg-[#FAF8F5] rounded-xl p-2.5 border border-[#EFECE6] text-[11px] text-slate-600">
                  <strong className="text-slate-800 block text-[10px] uppercase tracking-wider font-semibold">
                    Automated Rules:
                  </strong>
                  <span>{item.validationRules}</span>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-5 pt-3 border-t border-[#F3F0EB] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleExportSchema(item.title)}
                  className="h-8 px-2.5 rounded-lg border border-[#E2DDD3] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Download JSON Schema"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Schema</span>
                </button>

                <Link
                  href="/document-intelligence"
                  className="flex-1"
                >
                  <button className="w-full h-8 px-3 rounded-lg bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs">
                    <span>Use Template</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
