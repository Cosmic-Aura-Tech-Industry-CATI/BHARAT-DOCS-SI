export type DocumentStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'VERIFIED'
  | 'NEEDS_REVIEW'
  | 'FAILED'
  | 'LLM_PARSE_FAILED'
  | 'FAILED_DLQ'
  | string;

export type DocumentType =
  | 'GST Invoice'
  | 'Form-16'
  | 'Bank Statement'
  | 'Hindi Handwritten Receipt / Kachha Bill'
  | 'Auto-detect'
  | string;

export interface BoundingBox {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
  page: number;
}

export interface ExtractedField {
  field_key: string;
  label: string;
  normalized_value: string | number | boolean | null;
  original_ocr_value?: string | null;
  confidence: number; // 0 to 1 or 0 to 100. We will normalize to 0-100 percentage.
  validation_state?: 'valid' | 'warning' | 'error';
  validation_message?: string;
  bounding_box?: BoundingBox | null;
  is_human_corrected?: boolean;
  correction_reason?: string | null;
  page?: number;
  category?: 'general' | 'party' | 'tax' | 'totals' | 'line_items' | 'custom';
}

export interface LineItem {
  id: string;
  description: string;
  hsn_sac?: string;
  quantity?: number;
  unit_price?: number;
  taxable_amount?: number;
  cgst_rate?: number;
  sgst_rate?: number;
  igst_rate?: number;
  total?: number;
  confidence?: number;
}

export interface DocumentItem {
  id: string;
  document_id?: string;
  filename: string;
  original_filename?: string;
  document_type: DocumentType;
  upload_date: string;
  status: DocumentStatus;
  overall_confidence: number;
  file_size?: number;
  file_url?: string;
  page_count?: number;
  uploaded_by?: {
    id: string;
    name: string;
    email: string;
  };
  review_notes?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentResultsResponse {
  document_id: string;
  document_type: DocumentType;
  overall_confidence: number;
  status: DocumentStatus;
  file_url: string;
  mime_type?: string;
  page_count: number;
  fields: Record<string, ExtractedField> | ExtractedField[];
  line_items?: LineItem[];
  raw_ocr_text?: string;
  metadata?: {
    processing_time_ms?: number;
    model_version?: string;
    ocr_engine?: string;
    detected_language?: string;
  };
}

export interface DocumentUploadResponse {
  document_id: string;
  filename: string;
  document_type?: string;
  processing_status: DocumentStatus;
  sse_status_stream_url?: string;
  message?: string;
}

export interface DocumentReviewCorrection {
  field_key: string;
  corrected_value: string;
  correction_reason: string;
}

export interface DocumentReviewRequest {
  corrections: DocumentReviewCorrection[];
  notes?: string;
  action?: 'save' | 'approve' | 'reject';
}

export interface DocumentReviewResponse {
  success: boolean;
  document_id: string;
  status: DocumentStatus;
  message: string;
  updated_fields?: Record<string, ExtractedField>;
}

export interface SSEStatusUpdateEvent {
  stage: string;
  progress: number; // 0 to 100
  status: DocumentStatus;
  message?: string;
  error?: string;
  timestamp?: string;
}
