'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useReviewStore } from '@/stores/useReviewStore';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';
import { ExtractedField } from '@/types/document';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Scan,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DocumentViewerProps {
  documentId: string;
  documentType: string;
  filename: string;
  fileUrl?: string;
  fields: ExtractedField[];
  pageCount: number;
}

export function DocumentViewer({
  documentId,
  documentType,
  filename,
  fileUrl,
  fields,
  pageCount,
}: DocumentViewerProps) {
  const {
    zoom,
    rotation,
    fitMode,
    selectedPage,
    selectedFieldKey,
    hoveredFieldKey,
    zoomIn,
    zoomOut,
    resetZoom,
    rotateClockwise,
    setSelectedPage,
    selectField,
    setHoveredField,
  } = useReviewStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 620, height: 860 });
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 620, height: 860 });

  // Update container rendering dimensions based on zoom
  useEffect(() => {
    const baseW = 620;
    const baseH = 860;
    setNaturalDimensions({ width: baseW, height: baseH });
    setDimensions({
      width: Math.round(baseW * zoom),
      height: Math.round(baseH * zoom),
    });
  }, [zoom]);

  const isKachhaBill =
    documentType.toLowerCase().includes('hindi') ||
    documentType.toLowerCase().includes('kachha') ||
    filename.toLowerCase().includes('kachha') ||
    documentId.includes('ganesh');

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-200 bg-slate-900/5 dark:border-slate-800 dark:bg-slate-950/40 overflow-hidden shadow-inner">
      {/* Top Viewer Control Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 z-20">
        {/* Page Switcher */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 dark:text-slate-300"
            onClick={() => setSelectedPage(Math.max(1, selectedPage - 1))}
            disabled={selectedPage <= 1}
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Page {selectedPage} of {Math.max(1, pageCount)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 dark:text-slate-300"
            onClick={() => setSelectedPage(Math.min(pageCount, selectedPage + 1))}
            disabled={selectedPage >= pageCount}
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 dark:text-slate-300"
            onClick={zoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="w-12 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 dark:text-slate-300"
            onClick={zoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 dark:text-slate-300"
            onClick={rotateClockwise}
            title="Rotate Clockwise 90°"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 dark:text-slate-300"
            onClick={resetZoom}
            title="Reset Zoom to 100%"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Document Canvas & Highlighting Viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center relative select-none bg-slate-200/50 dark:bg-slate-950"
      >
        <div
          style={{
            width: `${dimensions.width}px`,
            minHeight: `${dimensions.height}px`,
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease, width 0.15s ease',
          }}
          className="relative bg-white shadow-2xl rounded-sm border border-slate-300/80 dark:border-slate-700 text-slate-900 overflow-hidden"
        >
          {/* Render Realistic High-Fidelity Indian Document Template */}
          {isKachhaBill ? (
            /* Hindi Mandi Handwritten Bill Simulation */
            <div className="p-8 font-serif select-none bg-[#fbf9f4] text-slate-900 min-h-[860px]">
              <div className="border-4 border-double border-red-800 p-6 rounded-md">
                <div className="text-center border-b-2 border-red-800 pb-3">
                  <div className="text-xs font-bold text-red-700 uppercase tracking-widest">
                    ॥ श्री गणेशाय नमः ॥
                  </div>
                  <h2 className="text-2xl font-black text-red-900 tracking-wide mt-1">
                    श्री गणेश ट्रेडर्स (Shree Ganesh Traders)
                  </h2>
                  <p className="text-xs text-slate-700 font-sans mt-0.5">
                    कृषि उपज मंडी समिति, नौबस्ता, कानपुर (उ.प्र.) • मो: 98390-XXXXX
                  </p>
                  <div className="flex justify-between text-xs mt-2 font-mono text-slate-600">
                    <span>मंडी अनुज्ञप्ति सं: UP/KNP/MND/4412</span>
                    <span>पर्चा सं: १०४८ (1048)</span>
                  </div>
                </div>

                <div className="flex justify-between text-xs py-3 border-b border-slate-400 font-sans">
                  <div>
                    <span className="font-bold">क्रेता / मेसर्स:</span> एपेक्स ट्रेडिंग, दिल्ली
                  </div>
                  <div>
                    <span className="font-bold">दिनांक:</span> ०८/१०/२०२६ (08-10-2026)
                  </div>
                </div>

                {/* Hand-styled Table */}
                <div className="mt-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-800 bg-amber-100/50">
                        <th className="py-2 px-2">क्र.</th>
                        <th className="py-2 px-2">विवरण (जिंस / माल)</th>
                        <th className="py-2 px-2 text-right">बोरी</th>
                        <th className="py-2 px-2 text-right">वजन (क्विंटल)</th>
                        <th className="py-2 px-2 text-right">दर (₹)</th>
                        <th className="py-2 px-2 text-right">रकम (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-mono text-xs">
                      <tr>
                        <td className="py-3 px-2">१</td>
                        <td className="py-3 px-2 font-serif font-bold text-slate-800">
                          सरसों दाना (Mustard Seeds)
                        </td>
                        <td className="py-3 px-2 text-right">१२</td>
                        <td className="py-3 px-2 text-right">६.००</td>
                        <td className="py-3 px-2 text-right">३,०२०</td>
                        <td className="py-3 px-2 text-right font-bold">१८,१२०.००</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2">२</td>
                        <td className="py-2 px-2 font-serif">हमाली / पल्लेदारी शुल्क</td>
                        <td className="py-2 px-2 text-right">—</td>
                        <td className="py-2 px-2 text-right">—</td>
                        <td className="py-2 px-2 text-right">—</td>
                        <td className="py-2 px-2 text-right">३५०.००</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Total Handwritten Amount with Highlight Callout */}
                <div className="mt-12 flex justify-end">
                  <div className="w-64 border-2 border-red-800 p-3 bg-red-50/50 rounded">
                    <div className="flex justify-between text-xs font-bold text-red-950">
                      <span>कुल देय राशि:</span>
                      <span className="text-base font-black text-red-900 underline decoration-wavy">
                        ₹ १८,४५०.००
                      </span>
                    </div>
                    <div className="text-[10px] text-red-700 mt-1 italic font-sans">
                      (अठारह हजार चार सौ पचास रुपये मात्र)
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex justify-between text-[11px] text-slate-500 pt-4 border-t border-dashed border-slate-400">
                  <span>हस्ताक्षर मुनीम / विक्रेता</span>
                  <span>भूल-चूक लेनी-देनी</span>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Indian GST Tax Invoice Simulation */
            <div className="p-8 font-sans select-none min-h-[860px] text-slate-900 bg-white">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-950">
                      TATA STEEL PROCESSING & DISTRIBUTION LTD
                    </h1>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Plot No. 42, Steel Complex, Taloja MIDC, Navi Mumbai, Maharashtra - 410208
                    </p>
                    <div className="mt-2 text-xs font-mono font-semibold text-slate-800">
                      GSTIN: <span className="bg-blue-50 px-1 py-0.5 rounded border border-blue-200">27AAACT2727Q1ZB</span> • PAN: AAACT2727Q
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded border border-slate-900 bg-slate-900 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                      TAX INVOICE
                    </span>
                    <div className="mt-2 text-xs font-mono">
                      <div><span className="text-slate-500">Invoice No:</span> TSPDL/MUM/2026/9041</div>
                      <div><span className="text-slate-500">Invoice Date:</span> 04-Oct-2026</div>
                      <div><span className="text-slate-500">Place of Supply:</span> 07 - Delhi</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billed To / Shipped To */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
                <div>
                  <div className="font-bold uppercase tracking-wider text-[11px] text-slate-500">BILLED TO (BUYER):</div>
                  <div className="font-bold text-slate-900 mt-1">Apex Precision Engineering Solutions Pvt Ltd</div>
                  <div className="text-slate-600">B-14, Okhla Industrial Area, Phase-I, New Delhi - 110020</div>
                  <div className="font-mono font-semibold text-slate-800 mt-1">
                    GSTIN: <span className="bg-blue-50 px-1 py-0.5 rounded border border-blue-200">07AABCA1234D1ZP</span> • State Code: 07
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase tracking-wider text-[11px] text-slate-500">DISPATCH DETAILS:</div>
                  <div className="text-slate-700 mt-1">Vehicle No: MH-04-GP-8812</div>
                  <div className="text-slate-700">LR No: VRL-894102 / 04-10-2026</div>
                  <div className="text-slate-700">Payment Terms: 30 Days Net</div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mt-4">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-[11px] font-semibold text-slate-700">
                    <tr>
                      <th className="p-2 border border-slate-300">#</th>
                      <th className="p-2 border border-slate-300">Item Description</th>
                      <th className="p-2 border border-slate-300">HSN/SAC</th>
                      <th className="p-2 border border-slate-300 text-right">Qty (MT)</th>
                      <th className="p-2 border border-slate-300 text-right">Rate (₹)</th>
                      <th className="p-2 border border-slate-300 text-right">Taxable Amt (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-xs">
                    <tr>
                      <td className="p-2 border border-slate-300">1</td>
                      <td className="p-2 border border-slate-300 font-sans font-semibold">
                        HR Steel Coils 2.5mm Grade IS 2062 E250
                      </td>
                      <td className="p-2 border border-slate-300">72083840</td>
                      <td className="p-2 border border-slate-300 text-right">3.500</td>
                      <td className="p-2 border border-slate-300 text-right">60,142.86</td>
                      <td className="p-2 border border-slate-300 text-right font-bold">2,10,500.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tax Breakdowns */}
              <div className="mt-6 flex justify-end">
                <div className="w-72 border border-slate-300 p-3 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Amount:</span>
                    <span className="font-semibold text-slate-900">₹2,10,500.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Integrated Tax (IGST @ 18%):</span>
                    <span className="font-semibold text-slate-900">₹37,890.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Central Tax (CGST @ 0%):</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>State Tax (SGST @ 0%):</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-950">
                    <span>Total Invoice Value:</span>
                    <span className="text-blue-700">₹2,48,390.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-[11px] text-slate-500 border-t border-slate-200 pt-4 flex justify-between">
                <span>E-Invoice IRN: 8a7f...2d1 (Generated & Verified)</span>
                <span>For Tata Steel Processing & Distribution Ltd</span>
              </div>
            </div>
          )}

          {/* Canvas-aligned Bounding Box Interactive Overlay */}
          <BoundingBoxOverlay
            fields={fields}
            selectedFieldKey={selectedFieldKey}
            hoveredFieldKey={hoveredFieldKey}
            currentPage={selectedPage}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            naturalWidth={naturalDimensions.width}
            naturalHeight={naturalDimensions.height}
            onSelectField={(key, bbox) => selectField(key, bbox, selectedPage)}
            onHoverField={setHoveredField}
          />
        </div>
      </div>
    </div>
  );
}
