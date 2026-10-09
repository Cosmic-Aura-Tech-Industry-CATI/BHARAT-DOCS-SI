'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  BarChart2,
} from 'lucide-react';

export default function ExportsPage() {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (format: 'csv' | 'tally') => {
    setIsExporting(format);

    setTimeout(() => {
      setIsExporting(null);

      // Create a simulated client-side download for evaluation
      const filename =
        format === 'tally'
          ? `BharatDoc_Tally_PurchaseVouchers_${new Date().toISOString().slice(0, 10)}.xml`
          : `BharatDoc_Verified_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;

      const content =
        format === 'tally'
          ? `<?xml version="1.0" encoding="UTF-8"?>\n<ENVELOPE>\n  <HEADER>\n    <TALLYREQUEST>Import Data</TALLYREQUEST>\n  </HEADER>\n  <BODY>\n    <IMPORTDATA>\n      <REQUESTDESC>\n        <REPORTNAME>Vouchers</REPORTNAME>\n      </REQUESTDESC>\n      <REQUESTDATA>\n        <TALLYMESSAGE xmlns:UDF="TallyUDF">\n          <VOUCHER VCHTYPE="Purchase" ACTION="Create">\n            <DATE>20261004</DATE>\n            <VOUCHERNUMBER>INV9041</VOUCHERNUMBER>\n            <PARTYLEDGERNAME>Tata Steel Processing &amp; Distribution Limited</PARTYLEDGERNAME>\n            <AMOUNT>-248390.00</AMOUNT>\n          </VOUCHER>\n        </TALLYMESSAGE>\n      </REQUESTDATA>\n    </IMPORTDATA>\n  </BODY>\n</ENVELOPE>`
          : `DocumentID,Type,InvoiceNo,SupplierName,SupplierGSTIN,Date,TaxableAmount,IGST,TotalAmount,Status\ndoc-tata-steel-9041,GST Invoice,TSPDL/MUM/2026/9041,Tata Steel Processing & Distribution Ltd,27AAACT2727Q1ZB,2026-10-04,210500.00,37890.00,248390.00,VERIFIED\ndoc-ganesh-kachha-102,Hindi Handwritten Receipt,1048,Shree Ganesh Traders,NA,2026-10-08,18120.00,0.00,18450.00,NEEDS_REVIEW\n`;

      const blob = new Blob([content], {
        type: format === 'tally' ? 'application/xml' : 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        format === 'tally'
          ? 'Tally Prime XML Vouchers Exported'
          : 'CSV Ledger Exported',
        {
          description: `Downloaded ${filename} successfully.`,
        }
      );
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="text-[11px] font-semibold text-slate-500 font-sans">
          Accounting Bridges & Vouchers
        </div>
        <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-0.5">
          Reports & ERP Exports
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Export verified tax vouchers and inward supply registers directly to Tally Prime XML, Excel, or CSV formats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tally Prime XML Export Card */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDF3EC] text-[#9C4B27]">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Tally Prime XML Vouchers
                </h3>
                <p className="text-[11px] text-slate-500">
                  Native Tally XML format with ledger mappings
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-4">
              Generates compliant Tally Purchase Voucher XML containing Supplier details, GSTIN, HSN classification, and split IGST/CGST/SGST ledger postings.
            </p>

            <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside mt-3">
              <li>Automatic Ledger Party creation</li>
              <li>Pre-filled Voucher Type: Purchase / Journal</li>
              <li>Tax rounding off matching Indian accounting standards</li>
            </ul>
          </div>

          <button
            onClick={() => handleExport('tally')}
            disabled={isExporting !== null}
            className="w-full h-10 px-4 bg-[#9C4B27] hover:bg-[#853D1C] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting === 'tally' ? 'Generating XML...' : 'Export Verified to Tally XML'}</span>
          </button>
        </div>

        {/* CSV / Excel Ledger Card */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Unified CSV / Excel Ledger
                </h3>
                <p className="text-[11px] text-slate-500">
                  Complete normalized invoice dataset
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-4">
              Export all verified and flagged documents in a structured CSV tabular format for import into Excel, Zoho Books, Busy, or Marg ERP.
            </p>

            <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside mt-3">
              <li>Includes confidence metrics per field</li>
              <li>Devanagari OCR raw vs normalized values</li>
              <li>Timestamped compliance audit trail references</li>
            </ul>
          </div>

          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting !== null}
            className="w-full h-10 px-4 border border-[#E2DDD3] bg-white hover:bg-[#FAF8F5] text-slate-700 font-semibold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting === 'csv' ? 'Generating CSV...' : 'Export Inward Supplies CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
