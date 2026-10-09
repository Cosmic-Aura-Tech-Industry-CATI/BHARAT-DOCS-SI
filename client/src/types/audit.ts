export interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    role: string;
    email: string;
  };
  action: 'UPLOAD' | 'EDIT_FIELD' | 'APPROVE_DOCUMENT' | 'REJECT_DOCUMENT' | 'EXPORT_TALLY' | 'EXPORT_CSV' | 'DELETE' | 'LOGIN';
  document_id?: string;
  document_name?: string;
  field_key?: string;
  before_value?: string | number | null;
  after_value?: string | number | null;
  reason?: string;
  notes?: string;
  ip_address?: string;
}
