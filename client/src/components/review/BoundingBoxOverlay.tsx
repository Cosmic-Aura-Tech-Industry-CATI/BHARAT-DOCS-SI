'use client';

import React from 'react';
import { BoundingBox, ExtractedField } from '@/types/document';
import { getConfidenceTier } from '@/lib/utils';

interface BoundingBoxOverlayProps {
  fields: ExtractedField[];
  selectedFieldKey: string | null;
  hoveredFieldKey: string | null;
  currentPage: number;
  containerWidth: number;
  containerHeight: number;
  naturalWidth: number;
  naturalHeight: number;
  onSelectField: (fieldKey: string, bbox: BoundingBox) => void;
  onHoverField: (fieldKey: string | null) => void;
}

export function BoundingBoxOverlay({
  fields,
  selectedFieldKey,
  hoveredFieldKey,
  currentPage,
  containerWidth,
  containerHeight,
  naturalWidth,
  naturalHeight,
  onSelectField,
  onHoverField,
}: BoundingBoxOverlayProps) {
  if (!naturalWidth || !naturalHeight || !containerWidth || !containerHeight) {
    return null;
  }

  // Calculate scaling factor between natural media dimensions and rendered container
  const scaleX = containerWidth / naturalWidth;
  const scaleY = containerHeight / naturalHeight;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {fields.map((field) => {
        const bbox = field.bounding_box;
        if (!bbox || (bbox.page && bbox.page !== currentPage)) return null;

        const isSelected = selectedFieldKey === field.field_key;
        const isHovered = hoveredFieldKey === field.field_key;
        const tier = getConfidenceTier(field.confidence);

        // Convert coordinates
        const left = bbox.x_min * scaleX;
        const top = bbox.y_min * scaleY;
        const width = Math.max(16, (bbox.x_max - bbox.x_min) * scaleX);
        const height = Math.max(12, (bbox.y_max - bbox.y_min) * scaleY);

        let borderColor = 'border-emerald-500/80 bg-emerald-500/10';
        if (tier === 'medium') borderColor = 'border-amber-500/80 bg-amber-500/15';
        if (tier === 'low') borderColor = 'border-red-500/90 bg-red-500/20';

        if (isSelected) {
          borderColor = 'border-blue-600 bg-blue-500/25 ring-2 ring-blue-500 ring-offset-1 bbox-active shadow-lg shadow-blue-500/40 z-20';
        } else if (isHovered) {
          borderColor = 'border-blue-400 bg-blue-500/20 z-15';
        }

        return (
          <div
            key={field.field_key}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField(field.field_key, bbox);
            }}
            onMouseEnter={() => onHoverField(field.field_key)}
            onMouseLeave={() => onHoverField(null)}
            style={{
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
            }}
            className={`pointer-events-auto cursor-pointer rounded border-2 transition-all duration-150 ${borderColor}`}
            title={`${field.label}: ${field.normalized_value} (${field.confidence}% confidence)`}
          >
            {/* Field pill badge above or inside box */}
            {(isSelected || isHovered) && (
              <div className="absolute -top-6 left-0 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-md z-30 pointer-events-none flex items-center gap-1">
                <span>{field.label}</span>
                <span className="opacity-75">({field.confidence}%)</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
