import { create } from 'zustand';
import { BoundingBox, ExtractedField } from '@/types/document';

export interface FieldEditState {
  field_key: string;
  original_value: string;
  current_value: string;
  reason: string;
}

interface ReviewStoreState {
  // Document context
  documentId: string | null;
  selectedPage: number;
  totalPages: number;

  // Viewer controls
  zoom: number; // 0.5 to 3.0
  rotation: number; // 0, 90, 180, 270
  fitMode: 'width' | 'page' | 'custom';

  // Selection & Highlighting
  selectedFieldKey: string | null;
  activeBoundingBox: BoundingBox | null;
  hoveredFieldKey: string | null;

  // Editing state
  editedFields: Record<string, FieldEditState>;
  isDirty: boolean;
  filterTier: 'all' | 'needs_review' | 'low' | 'medium' | 'high';
  searchFilter: string;

  // Actions
  setDocumentContext: (docId: string, totalPages: number) => void;
  setSelectedPage: (page: number) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  rotateClockwise: () => void;
  setFitMode: (mode: 'width' | 'page' | 'custom') => void;

  selectField: (fieldKey: string | null, bbox?: BoundingBox | null, page?: number) => void;
  setHoveredField: (fieldKey: string | null) => void;

  updateFieldValue: (fieldKey: string, originalValue: string, newValue: string, reason?: string) => void;
  resetFieldEdit: (fieldKey: string) => void;
  resetAllEdits: () => void;

  setFilterTier: (tier: 'all' | 'needs_review' | 'low' | 'medium' | 'high') => void;
  setSearchFilter: (query: string) => void;
}

export const useReviewStore = create<ReviewStoreState>((set) => ({
  documentId: null,
  selectedPage: 1,
  totalPages: 1,

  zoom: 1.0,
  rotation: 0,
  fitMode: 'width',

  selectedFieldKey: null,
  activeBoundingBox: null,
  hoveredFieldKey: null,

  editedFields: {},
  isDirty: false,
  filterTier: 'all',
  searchFilter: '',

  setDocumentContext: (docId, totalPages) =>
    set({
      documentId: docId,
      totalPages: Math.max(1, totalPages),
      selectedPage: 1,
      editedFields: {},
      isDirty: false,
      selectedFieldKey: null,
      activeBoundingBox: null,
    }),

  setSelectedPage: (page) =>
    set((state) => ({
      selectedPage: Math.max(1, Math.min(state.totalPages, page)),
    })),

  setZoom: (zoomOrFn) =>
    set((state) => {
      const newZoom = typeof zoomOrFn === 'function' ? zoomOrFn(state.zoom) : zoomOrFn;
      return {
        zoom: Math.max(0.5, Math.min(3.0, Number(newZoom.toFixed(2)))),
        fitMode: 'custom',
      };
    }),

  zoomIn: () =>
    set((state) => ({
      zoom: Math.min(3.0, Number((state.zoom + 0.15).toFixed(2))),
      fitMode: 'custom',
    })),

  zoomOut: () =>
    set((state) => ({
      zoom: Math.max(0.5, Number((state.zoom - 0.15).toFixed(2))),
      fitMode: 'custom',
    })),

  resetZoom: () =>
    set({
      zoom: 1.0,
      rotation: 0,
      fitMode: 'width',
    }),

  rotateClockwise: () =>
    set((state) => ({
      rotation: (state.rotation + 90) % 360,
    })),

  setFitMode: (mode) =>
    set({
      fitMode: mode,
    }),

  selectField: (fieldKey, bbox, page) =>
    set((state) => ({
      selectedFieldKey: fieldKey,
      activeBoundingBox: bbox || null,
      selectedPage: page ? page : bbox?.page ? bbox.page : state.selectedPage,
    })),

  setHoveredField: (fieldKey) =>
    set({
      hoveredFieldKey: fieldKey,
    }),

  updateFieldValue: (fieldKey, originalValue, newValue, reason = 'Manual verification edit') =>
    set((state) => {
      const updated = { ...state.editedFields };
      if (newValue === originalValue) {
        delete updated[fieldKey];
      } else {
        updated[fieldKey] = {
          field_key: fieldKey,
          original_value: originalValue,
          current_value: newValue,
          reason,
        };
      }
      return {
        editedFields: updated,
        isDirty: Object.keys(updated).length > 0,
      };
    }),

  resetFieldEdit: (fieldKey) =>
    set((state) => {
      const updated = { ...state.editedFields };
      delete updated[fieldKey];
      return {
        editedFields: updated,
        isDirty: Object.keys(updated).length > 0,
      };
    }),

  resetAllEdits: () =>
    set({
      editedFields: {},
      isDirty: false,
    }),

  setFilterTier: (tier) =>
    set({
      filterTier: tier,
    }),

  setSearchFilter: (query) =>
    set({
      searchFilter: query,
    }),
}));
