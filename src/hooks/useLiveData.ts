import { useEffect, useRef } from 'react';
import { useMetricsStore } from '@/store/metrics.store';
import { initWebSocket, disconnectWebSocket } from '@/api/socket';

export interface UseLiveDataOptions {
  wsUrl?: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  silent?: boolean; // Don't log errors to console
}

/**
 * Hook to manage live data streaming via WebSocket
 */
export function useLiveData(options: UseLiveDataOptions = {}) {
  const {
    wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
    autoConnect = false, // Changed: Don't auto-connect by default
    onConnect,
    silent = true, // Default to silent mode
  } = options;

  const connectionStatus = useMetricsStore((state) => state.connectionStatus);
  const initialized = useRef(false);

  useEffect(() => {
    // Don't auto-connect unless explicitly enabled
    if (!autoConnect || initialized.current) {
      return;
    }

    initialized.current = true;

    // Suppress WebSocket errors in console
    const originalError = console.error;
    if (silent) {
      console.error = (...args: any[]) => {
        const message = args[0]?.toString() || '';
        // Filter out WebSocket connection errors
        if (
          message.includes('WebSocket') ||
          message.includes('ERR_CONNECTION_REFUSED') ||
          message.includes('ws://localhost:8000')
        ) {
          return; // Don't log
        }
        originalError.apply(console, args);
      };
    }

    initWebSocket({
      url: wsUrl,
      maxReconnectAttempts: 2, // Fail fast
      reconnectInterval: 5000,
      onConnect: () => {
        if (!silent && import.meta.env.DEV) {
          console.log('✅ Live data connected');
        }
        onConnect?.();
      },
      onDisconnect: () => {
        // Don't log
      },
      onError: () => {
        // Don't log
      },
    });

    return () => {
      if (silent) {
        console.error = originalError; // Restore original
      }
      disconnectWebSocket();
      initialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, autoConnect, silent]);

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    isDisconnected: connectionStatus === 'disconnected',
    hasError: connectionStatus === 'error',
  };
}
