export interface NaturalQueryRequest {
  query: string;
  context_filters?: {
    document_type?: string;
    date_from?: string;
    date_to?: string;
  };
}

export interface NaturalQueryResponse {
  query: string;
  summary: string;
  generated_sql?: string;
  data_table?: {
    columns: string[];
    rows: (string | number | boolean | null)[][];
  };
  total_count?: number;
  citations?: Array<{
    document_id: string;
    filename: string;
    snippet: string;
    confidence?: number;
  }>;
  suggested_followups?: string[];
}
