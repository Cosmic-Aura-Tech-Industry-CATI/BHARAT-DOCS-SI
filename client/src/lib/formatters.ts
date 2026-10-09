/**
 * Formats a number or string amount in Indian Rupee format (en-IN)
 * e.g., 1250000 -> ₹12,50,000.00
 */
export function formatCurrencyINR(amount?: number | string | null): string {
  if (amount === undefined || amount === null || amount === '') return '₹0.00';
  const numeric = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(numeric)) return '₹0.00';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(numeric);
}

/**
 * Formats numbers in standard Indian numbering system (e.g., 1,50,000)
 */
export function formatNumberIndian(val?: number | string | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const numeric = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(numeric)) return '0';
  return new Intl.NumberFormat('en-IN').format(numeric);
}

/**
 * Formats file size in B, KB, MB
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formats ISO date to readable string, e.g. "09 Oct 2026, 02:45 PM"
 */
export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Formats ISO date to short date "09 Oct 2026"
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Masks sensitive Indian tax identifiers like PAN or Aadhaar for secure display
 * ABCDE1234F -> ABCDE****F
 */
export function maskPAN(pan?: string | null): string {
  if (!pan || pan.length < 10) return pan || '—';
  return `${pan.slice(0, 5)}****${pan.slice(9)}`;
}

/**
 * Masks GSTIN: 27AAGCS5678Q1Z2 -> 27AAG****8Q1Z2
 */
export function maskGSTIN(gstin?: string | null): string {
  if (!gstin || gstin.length < 15) return gstin || '—';
  return `${gstin.slice(0, 5)}****${gstin.slice(11)}`;
}
