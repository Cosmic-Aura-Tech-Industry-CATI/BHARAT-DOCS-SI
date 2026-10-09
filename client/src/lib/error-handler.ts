export interface RFC7807Error {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  invalid_params?: Array<{
    name: string;
    reason: string;
  }>;
  code?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  public status: number;
  public rfcError?: RFC7807Error;
  public code?: string;

  constructor(status: number, message: string, rfcError?: RFC7807Error) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.rfcError = rfcError;
    this.code = rfcError?.code || `HTTP_${status}`;
  }
}

/**
 * Parses any response or error into a human-readable message and typed structure
 */
export async function parseApiResponseError(response: Response): Promise<ApiError> {
  const status = response.status;
  let errorData: any = null;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    } else {
      const text = await response.text();
      errorData = { detail: text };
    }
  } catch {
    errorData = {};
  }

  const detail =
    errorData?.detail ||
    errorData?.title ||
    errorData?.message ||
    getDefaultStatusMessage(status);

  return new ApiError(status, detail, errorData);
}

export function getDefaultStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Bad request. Please verify the submitted data.';
    case 401:
      return 'Session expired or unauthorized. Please log in again.';
    case 403:
      return 'Access forbidden. You do not have permission to perform this action.';
    case 404:
      return 'The requested document or resource was not found.';
    case 413:
      return 'File size exceeds maximum allowed limit (20 MB).';
    case 422:
      return 'Validation error. Please verify the document and extracted fields.';
    case 429:
      return 'Too many requests. Rate limit reached, please try again shortly.';
    case 500:
      return 'Internal server error. The document intelligence engine encountered an issue.';
    case 502:
      return 'Bad gateway. Document processing backend is temporarily unavailable.';
    case 503:
      return 'Service unavailable. OCR or LLM pipeline is currently busy.';
    case 504:
      return 'Gateway timeout. Document processing took longer than expected.';
    default:
      return `Server responded with status code ${status}.`;
  }
}
