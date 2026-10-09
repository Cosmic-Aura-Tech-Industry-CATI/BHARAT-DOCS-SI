'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DocumentStatus, SSEStatusUpdateEvent } from '@/types/document';
import { api } from '@/lib/api';

export interface DocumentProgressState {
  stage: string;
  progress: number;
  status: DocumentStatus;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  isComplete: boolean;
  failureReason: string | null;
  lastUpdated: string | null;
}

export function useDocumentProgress(documentId?: string | null) {
  const [progressState, setProgressState] = useState<DocumentProgressState>({
    stage: 'Initializing',
    progress: 0,
    status: 'QUEUED',
    connectionStatus: 'connecting',
    isComplete: false,
    failureReason: null,
    lastUpdated: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetState = useCallback(() => {
    setProgressState({
      stage: 'Initializing',
      progress: 0,
      status: 'QUEUED',
      connectionStatus: 'connecting',
      isComplete: false,
      failureReason: null,
      lastUpdated: null,
    });
  }, []);

  useEffect(() => {
    if (!documentId) return;

    // Handle Demo Mode simulated streaming
    if (api.isDemoMode()) {
      setProgressState({
        stage: 'Document Queued & Vectorizing',
        progress: 15,
        status: 'PROCESSING',
        connectionStatus: 'connected',
        isComplete: false,
        failureReason: null,
        lastUpdated: new Date().toISOString(),
      });

      const timer1 = setTimeout(() => {
        setProgressState((prev) => ({
          ...prev,
          stage: 'Indic Multilingual OCR & Layout Analysis',
          progress: 55,
          lastUpdated: new Date().toISOString(),
        }));
      }, 1500);

      const timer2 = setTimeout(() => {
        setProgressState((prev) => ({
          ...prev,
          stage: 'DeepSeek LLM Entity & Tax Parsing',
          progress: 85,
          lastUpdated: new Date().toISOString(),
        }));
      }, 3000);

      const timer3 = setTimeout(() => {
        setProgressState((prev) => ({
          ...prev,
          stage: 'Verification & Bounding Box Alignment Complete',
          progress: 100,
          status: 'VERIFIED',
          connectionStatus: 'disconnected',
          isComplete: true,
          lastUpdated: new Date().toISOString(),
        }));
      }, 4500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }

    // Real SSE streaming with fetch-based reader to support Bearer token
    let isCancelled = false;
    const streamUrl = api.getStreamUrl(documentId);

    async function startStream() {
      if (isCancelled) return;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setProgressState((prev) => ({ ...prev, connectionStatus: 'connecting' }));

        const token = typeof window !== 'undefined' ? localStorage.getItem('bharatdoc_access_token') : null;
        const headers: Record<string, string> = {
          Accept: 'text/event-stream',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(streamUrl, {
          headers,
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`SSE stream returned status ${response.status}`);
        }

        setProgressState((prev) => ({ ...prev, connectionStatus: 'connected' }));

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (!isCancelled) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const block of lines) {
            if (!block.trim()) continue;
            let currentEvent = 'message';
            let eventData = '';

            const subLines = block.split('\n');
            for (const line of subLines) {
              if (line.startsWith('event:')) {
                currentEvent = line.replace('event:', '').trim();
              } else if (line.startsWith('data:')) {
                eventData += line.replace('data:', '').trim();
              }
            }

            if (eventData) {
              try {
                const parsed: SSEStatusUpdateEvent = JSON.parse(eventData);

                const isDone =
                  parsed.status === 'VERIFIED' ||
                  parsed.status === 'NEEDS_REVIEW' ||
                  parsed.status === 'FAILED' ||
                  parsed.status === 'LLM_PARSE_FAILED' ||
                  parsed.status === 'FAILED_DLQ' ||
                  currentEvent === 'processing_complete';

                setProgressState({
                  stage: parsed.stage || (isDone ? 'Processing complete' : 'Processing'),
                  progress: parsed.progress ?? (isDone ? 100 : 50),
                  status: parsed.status,
                  connectionStatus: isDone ? 'disconnected' : 'connected',
                  isComplete: isDone,
                  failureReason: parsed.error || null,
                  lastUpdated: parsed.timestamp || new Date().toISOString(),
                });

                if (isDone) {
                  controller.abort();
                  return;
                }
              } catch {
                // Ignore malformed JSON chunks
              }
            }
          }
        }
      } catch (err: any) {
        if (!isCancelled && err.name !== 'AbortError') {
          setProgressState((prev) => ({
            ...prev,
            connectionStatus: 'error',
            failureReason: err.message,
          }));

          // Fallback check after disconnect
          try {
            const fallbackDoc = await api.getDocument(documentId!);
            const isDone =
              fallbackDoc.status === 'VERIFIED' ||
              fallbackDoc.status === 'NEEDS_REVIEW' ||
              fallbackDoc.status === 'FAILED';

            setProgressState((prev) => ({
              ...prev,
              status: fallbackDoc.status,
              isComplete: isDone,
              progress: isDone ? 100 : prev.progress,
            }));
          } catch {
            // Ignore fallback error
          }
        }
      }
    }

    startStream();

    return () => {
      isCancelled = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [documentId]);

  return {
    ...progressState,
    resetState,
  };
}
