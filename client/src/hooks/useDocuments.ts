'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DocumentItem } from '@/types/document';
import { useAppStore } from '@/stores/useAppStore';

export function useDocuments(filters?: {
  status?: string;
  type?: string;
  search?: string;
}) {
  const isDemoMode = useAppStore((s) => s.isDemoMode);

  return useQuery({
    queryKey: ['documents', filters, isDemoMode],
    queryFn: () => api.getDocuments(filters),
    staleTime: 30 * 1000,
  });
}

export function useDocumentDetails(id: string) {
  const isDemoMode = useAppStore((s) => s.isDemoMode);

  return useQuery({
    queryKey: ['document', id, isDemoMode],
    queryFn: () => api.getDocument(id),
    enabled: Boolean(id),
  });
}

export function useDocumentStats() {
  const { data: documents, isLoading, error, refetch } = useDocuments();

  const stats = {
    total: documents?.length || 0,
    queued: documents?.filter((d) => d.status === 'QUEUED').length || 0,
    processing: documents?.filter((d) => d.status === 'PROCESSING').length || 0,
    verified: documents?.filter((d) => d.status === 'VERIFIED').length || 0,
    needsReview: documents?.filter((d) => d.status === 'NEEDS_REVIEW').length || 0,
    failed:
      documents?.filter(
        (d) =>
          d.status === 'FAILED' ||
          d.status === 'LLM_PARSE_FAILED' ||
          d.status === 'FAILED_DLQ'
      ).length || 0,
    averageConfidence:
      documents && documents.length > 0
        ? Math.round(
            documents.reduce((acc, d) => acc + (d.overall_confidence || 0), 0) /
              documents.length
          )
        : 0,
  };

  return {
    stats,
    isLoading,
    error,
    refetch,
    documents,
  };
}
