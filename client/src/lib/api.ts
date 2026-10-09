import {
  DocumentItem,
  DocumentResultsResponse,
  DocumentReviewRequest,
  DocumentReviewResponse,
  DocumentUploadResponse,
} from '@/types/document';
import { NaturalQueryRequest, NaturalQueryResponse } from '@/types/query';
import { AuditLog } from '@/types/audit';
import { parseApiResponseError, ApiError } from './error-handler';
import { DEMO_DOCUMENTS, DEMO_RESULTS, DEMO_AUDIT_LOGS } from './demo-mock-data';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private baseUrl: string;
  private demoMode: boolean = false;

  constructor() {
    this.baseUrl = BASE_URL;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bharatdoc_demo_mode');
      if (stored !== null) {
        this.demoMode = stored === 'true';
      } else {
        this.demoMode = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === 'true';
      }
    }
  }

  public isDemoMode(): boolean {
    return this.demoMode;
  }

  public setDemoMode(enabled: boolean): void {
    this.demoMode = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bharatdoc_demo_mode', String(enabled));
    }
  }

  private getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('bharatdoc_access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Central fetch wrapper with RFC 7807 error parsing and token forwarding
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const headers = new Headers(options.headers || {});
    const authHeaders = this.getAuthHeader();
    for (const [k, v] of Object.entries(authHeaders)) {
      if (!headers.has(k)) headers.set(k, v);
    }

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (err: any) {
      throw new ApiError(0, `Network error connecting to BharatDoc backend at ${this.baseUrl}: ${err.message}`);
    }

    if (!response.ok) {
      throw await parseApiResponseError(response);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  // --- Document Upload ---
  public async uploadDocument(
    file: File,
    documentType?: string,
    onProgress?: (percent: number) => void
  ): Promise<DocumentUploadResponse> {
    if (this.demoMode) {
      // Simulate demo processing delay
      await new Promise((r) => setTimeout(r, 1200));
      const newId = `doc-demo-${Date.now()}`;
      const docItem: DocumentItem = {
        id: newId,
        document_id: newId,
        filename: file.name,
        original_filename: file.name,
        document_type: documentType || 'Auto-detect',
        upload_date: new Date().toISOString(),
        status: 'PROCESSING',
        overall_confidence: 88,
        file_size: file.size,
        page_count: 1,
        uploaded_by: {
          id: 'usr-demo',
          name: 'Rajesh Sharma, FCA',
          email: 'rajesh.ca@sharmaassociates.in',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DEMO_DOCUMENTS.unshift(docItem);

      return {
        document_id: newId,
        filename: file.name,
        document_type: documentType,
        processing_status: 'PROCESSING',
        sse_status_stream_url: `/api/v1/documents/${newId}/stream`,
        message: 'Document successfully queued for multimodal extraction (HTTP 202 Accepted).',
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    if (documentType && documentType !== 'Auto-detect') {
      formData.append('document_type', documentType);
    }

    // Do NOT set multipart Content-Type header manually
    const headers = this.getAuthHeader();
    const url = `${this.baseUrl}/documents/upload`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch (err: any) {
      throw new ApiError(0, `Network error during upload: ${err.message}`);
    }

    if (!response.ok && response.status !== 202) {
      throw await parseApiResponseError(response);
    }

    return (await response.json()) as DocumentUploadResponse;
  }

  // --- Document List ---
  public async getDocuments(params?: {
    status?: string;
    type?: string;
    search?: string;
  }): Promise<DocumentItem[]> {
    if (this.demoMode) {
      let docs = [...DEMO_DOCUMENTS];
      if (params?.status && params.status !== 'ALL') {
        docs = docs.filter((d) => d.status.toUpperCase() === params.status?.toUpperCase());
      }
      if (params?.type && params.type !== 'ALL') {
        docs = docs.filter((d) => d.document_type.toLowerCase() === params.type?.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        docs = docs.filter(
          (d) =>
            d.filename.toLowerCase().includes(q) ||
            d.document_type.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q)
        );
      }
      return docs;
    }

    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.type && params.type !== 'ALL') query.set('document_type', params.type);
    if (params?.search) query.set('search', params.search);

    const queryString = query.toString();
    const endpoint = `/documents${queryString ? `?${queryString}` : ''}`;
    return this.request<DocumentItem[]>(endpoint);
  }

  // --- Single Document Details ---
  public async getDocument(id: string): Promise<DocumentItem> {
    if (this.demoMode) {
      const found = DEMO_DOCUMENTS.find((d) => d.id === id || d.document_id === id);
      if (found) return found;
      throw new ApiError(404, `Document ${id} not found in demo environment.`);
    }

    return this.request<DocumentItem>(`/documents/${id}`);
  }

  // --- Extraction Results ---
  public async getDocumentResults(id: string): Promise<DocumentResultsResponse> {
    if (this.demoMode) {
      const results = DEMO_RESULTS[id] || DEMO_RESULTS['doc-tata-steel-9041'];
      return {
        ...results,
        document_id: id,
      };
    }

    return this.request<DocumentResultsResponse>(`/documents/${id}/results`);
  }

  // --- Submit Review / Corrections ---
  public async submitReview(
    id: string,
    payload: DocumentReviewRequest
  ): Promise<DocumentReviewResponse> {
    if (this.demoMode) {
      await new Promise((r) => setTimeout(r, 800));
      // Update local demo data
      const doc = DEMO_DOCUMENTS.find((d) => d.id === id || d.document_id === id);
      if (doc) {
        if (payload.action === 'approve') {
          doc.status = 'VERIFIED';
        } else if (payload.action === 'reject') {
          doc.status = 'FAILED';
        }
        doc.updated_at = new Date().toISOString();
      }

      // Record audit log
      payload.corrections.forEach((c) => {
        DEMO_AUDIT_LOGS.unshift({
          id: `aud-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          timestamp: new Date().toISOString(),
          actor: {
            id: 'usr-demo',
            name: 'Rajesh Sharma, FCA',
            role: 'CHARTERED_ACCOUNTANT',
            email: 'rajesh.ca@sharmaassociates.in',
          },
          action: 'EDIT_FIELD',
          document_id: id,
          document_name: doc?.filename || id,
          field_key: c.field_key,
          after_value: c.corrected_value,
          reason: c.correction_reason,
          ip_address: '127.0.0.1',
        });
      });

      return {
        success: true,
        document_id: id,
        status: doc?.status || 'VERIFIED',
        message: 'Document corrections saved and review submitted successfully.',
      };
    }

    return this.request<DocumentReviewResponse>(`/documents/${id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  // --- AI Natural Language Query ---
  public async query(payload: NaturalQueryRequest): Promise<NaturalQueryResponse> {
    if (this.demoMode) {
      await new Promise((r) => setTimeout(r, 1000));
      const q = payload.query.toLowerCase();

      if (q.includes('gst') || q.includes('tax') || q.includes('tata')) {
        return {
          query: payload.query,
          summary:
            'Total GST tax paid across verified invoices for Tata Steel Processing & Distribution Ltd amounts to **₹37,890.00** (IGST @ 18%). All input tax credits are reconciled with GSTR-2B.',
          generated_sql:
            'SELECT supplier_name, SUM(igst_amount) AS total_igst, SUM(taxable_amount) AS total_taxable FROM invoices WHERE supplier_gstin = "27AAACT2727Q1ZB" AND status = "VERIFIED" GROUP BY supplier_name;',
          data_table: {
            columns: ['Supplier Name', 'GSTIN', 'Invoice No', 'Taxable Amount (₹)', 'IGST (₹)', 'Total (₹)'],
            rows: [
              ['Tata Steel Processing & Distribution Ltd', '27AAACT2727Q1ZB', 'TSPDL/MUM/2026/9041', '2,10,500.00', '37,890.00', '2,48,390.00'],
            ],
          },
          citations: [
            {
              document_id: 'doc-tata-steel-9041',
              filename: 'Tax_Invoice_Tata_Steel_INV9041.pdf',
              snippet: 'IGST 18% on Taxable Amt 2,10,500.00: ₹37,890.00',
              confidence: 96,
            },
          ],
          suggested_followups: [
            'Show ITC eligibility for September 2026',
            'Find invoices requiring manual verification',
            'List transactions above ₹50,000',
          ],
        };
      }

      if (q.includes('review') || q.includes('manual') || q.includes('low')) {
        return {
          query: payload.query,
          summary:
            'Found **1 document requiring human review**: Shree Ganesh Traders handwritten Kachha Bill. Reason: OCR confidence on total amount is 62% due to ambiguous Devanagari numerals (४ vs ९).',
          generated_sql:
            'SELECT id, filename, document_type, overall_confidence FROM documents WHERE status = "NEEDS_REVIEW" OR overall_confidence < 70;',
          data_table: {
            columns: ['Document ID', 'File Name', 'Type', 'Confidence', 'Flagged Field'],
            rows: [
              ['doc-ganesh-kachha-102', 'Kachha_Bill_Shree_Ganesh_Traders_Oct2026.png', 'Hindi Handwritten Receipt', '68%', 'total_amount (62%)'],
            ],
          },
          citations: [
            {
              document_id: 'doc-ganesh-kachha-102',
              filename: 'Kachha_Bill_Shree_Ganesh_Traders_Oct2026.png',
              snippet: 'कुल राशि १८,४५० / १८,९५० ? (Devanagari ambiguity)',
              confidence: 62,
            },
          ],
          suggested_followups: [
            'Open Kachha Bill review workspace',
            'List all handwritten slips this month',
          ],
        };
      }

      // Generic response
      return {
        query: payload.query,
        summary: `Query executed across 7 indexed documents in BharatDoc. Total ledger volume: **₹2,66,840.00**. 4 verified documents, 1 awaiting review, 1 processing.`,
        generated_sql: 'SELECT * FROM documents WHERE status IN ("VERIFIED", "NEEDS_REVIEW");',
        data_table: {
          columns: ['Type', 'Count', 'Total Volume (₹)', 'Verification Rate'],
          rows: [
            ['GST Invoices', '3', '₹2,48,390.00', '67%'],
            ['Handwritten Kachha Bills', '1', '₹18,450.00', '0% (Needs Review)'],
            ['Bank Statements', '1', '₹14,20,500.00', '100%'],
            ['Form-16', '1', '₹12,40,000.00', '100%'],
          ],
        },
        citations: [
          {
            document_id: 'doc-tata-steel-9041',
            filename: 'Tax_Invoice_Tata_Steel_INV9041.pdf',
            snippet: 'Verified tax invoice TSPDL/MUM/2026/9041',
            confidence: 96,
          },
        ],
        suggested_followups: [
          'Show total GST tax paid in October 2026',
          'Find invoices requiring manual review',
          'Show transactions above ₹50,000',
        ],
      };
    }

    return this.request<NaturalQueryResponse>('/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  // --- Audit Logs ---
  public async getAuditLogs(): Promise<AuditLog[]> {
    if (this.demoMode) {
      return [...DEMO_AUDIT_LOGS];
    }
    return this.request<AuditLog[]>('/audit-logs');
  }

  // --- Exports ---
  public getExportUrl(format: 'csv' | 'tally', documentIds?: string[]): string {
    const idsQuery = documentIds?.length ? `?ids=${documentIds.join(',')}` : '';
    return `${this.baseUrl}/exports/${format}${idsQuery}`;
  }

  // --- SSE Stream URL ---
  public getStreamUrl(documentId: string): string {
    return `${this.baseUrl}/documents/${documentId}/stream`;
  }
}

export const api = new ApiClient();
