"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { aiService } from "@/src/services/ai.service";
import { IAIChatHistoryItem, IAIStreamDoneMetadata } from "@/src/types/ai.type";

interface StartStreamOptions {
  query: string;
  history: IAIChatHistoryItem[];
  messageId: string;
  onToken: (token: string) => void;
  onDone: (data: IAIStreamDoneMetadata) => void;
  onError: (errorMessage: string) => void;
}

export function useAIStreamReader() {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setStreamingMessageId(null);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const startStream = useCallback(
    async ({ query, history, messageId, onToken, onDone, onError }: StartStreamOptions) => {
      stopStreaming();
      setError(null);
      setIsStreaming(true);
      setStreamingMessageId(messageId);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      await aiService.streamAIChat({
        payload: { query, history },
        signal: controller.signal,
        onToken,
        onDone: (data) => {
          onDone(data);
          setIsStreaming(false);
          setStreamingMessageId(null);
          abortControllerRef.current = null;
        },
        onError: (errMessage) => {
          setError(errMessage);
          onError(errMessage);
          setIsStreaming(false);
          setStreamingMessageId(null);
          abortControllerRef.current = null;
        },
      });
    },
    [stopStreaming]
  );

  return {
    isStreaming,
    streamingMessageId,
    error,
    setError,
    stopStreaming,
    startStream,
  };
}
