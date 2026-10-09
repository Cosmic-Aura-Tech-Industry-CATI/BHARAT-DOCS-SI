'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DocumentReviewRequest } from '@/types/document';
import { useReviewStore } from '@/stores/useReviewStore';
import { useAppStore } from '@/stores/useAppStore';
import { toast } from 'sonner';

export function useDocumentResults(documentId: string) {
  const isDemoMode = useAppStore((s) => s.isDemoMode);

  return useQuery({
    queryKey: ['document-results', documentId, isDemoMode],
    queryFn: () => api.getDocumentResults(documentId),
    enabled: Boolean(documentId),
    staleTime: 60 * 1000,
  });
}

export function useSubmitDocumentReview(documentId: string) {
  const queryClient = useQueryClient();
  const resetAllEdits = useReviewStore((s) => s.resetAllEdits);

  return useMutation({
    mutationFn: (payload: DocumentReviewRequest) =>
      api.submitReview(documentId, payload),
    onSuccess: (response) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['document-results', documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });

      resetAllEdits();
      toast.success('Document review submitted successfully', {
        description: response.message || 'Status and corrections updated.',
      });
    },
    onError: (err: any) => {
      toast.error('Failed to submit document review', {
        description: err.message || 'An unexpected error occurred.',
      });
    },
  });
}
