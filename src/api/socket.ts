import { useMetricsStore, Metric } from '@/store/metrics.store';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface SocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private reconnectAttempts = 0;
  private config: SocketConfig;
  private isManualClose = false;

  constructor(config: SocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isManualClose = false;
    useMetricsStore.getState().setConnectionStatus('connecting');

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        useMetricsStore.getState().setConnectionStatus('connected');
        this.config.onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        // Silently handle connection errors - don't log to console
        // The error event doesn't provide detailed error info, so we check onclose
        useMetricsStore.getState().setConnectionStatus('error');
        // Don't call onError for connection refused errors
        const shouldNotify = !this.ws || this.ws.readyState === WebSocket.CLOSED;
        if (shouldNotify && this.config.onError) {
          // Only notify for unexpected errors
          try {
            this.config.onError(error);
          } catch (e) {
            // Silently ignore
          }
        }
      };

      this.ws.onclose = (event) => {
        // Only log if it's a clean close or unexpected error (not connection refused)
        const isConnectionRefused = event.code === 1006 || event.code === 1000;
        
        if (import.meta.env.DEV && !isConnectionRefused) {
          console.log('WebSocket disconnected');
        }
        
        useMetricsStore.getState().setConnectionStatus('disconnected');
        
        // Only call onDisconnect if it's not a connection refused
        if (!isConnectionRefused) {
          this.config.onDisconnect?.();
        }
        
        this.ws = null;

        if (!this.isManualClose) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      // Only log unexpected errors
      const errorMessage = (error as any).message || String(error);
      if (!errorMessage.includes('ERR_CONNECTION_REFUSED') && import.meta.env.DEV) {
        console.error('Error creating WebSocket:', error);
      }
      useMetricsStore.getState().setConnectionStatus('error');
      this.scheduleReconnect();
    }
  }

  private handleMessage(data: any): void {
    // Support multiple message formats
    if (Array.isArray(data)) {
      // Batch of metrics
      const metrics: Metric[] = data.map(this.parseMetric);
      useMetricsStore.getState().addMetrics(metrics);
      // Check alerts for each metric
      metrics.forEach((metric) => {
        this.checkAlerts(metric);
      });
    } else if (data.metric) {
      // Single metric
      const metric = this.parseMetric(data.metric || data);
      useMetricsStore.getState().addMetric(metric);
      this.checkAlerts(metric);
    } else {
      // Direct metric object
      const metric = this.parseMetric(data);
      useMetricsStore.getState().addMetric(metric);
      this.checkAlerts(metric);
    }
  }

  private checkAlerts(metric: Metric): void {
    // Dynamically import to avoid circular dependency
    import('@/store/alerts.store').then(({ useAlertsStore }) => {
      useAlertsStore.getState().checkMetric(metric.id, metric.value, metric.name);
    });
  }

  private parseMetric(data: any): Metric {
    return {
      id: data.id || data.metricId || 'unknown',
      name: data.name || data.metricName || 'Unknown Metric',
      value: typeof data.value === 'number' ? data.value : parseFloat(data.value) || 0,
      timestamp: data.timestamp || data.time || Date.now(),
      unit: data.unit || '',
      category: data.category || data.type || 'general',
    };
  }

  private scheduleReconnect(): void {
    if (this.isManualClose) return;

    // Stop after fewer attempts if no server is available
    const maxAttempts = this.config.maxReconnectAttempts || 5;
    
    if (this.reconnectAttempts >= maxAttempts) {
      // Silently stop reconnecting after max attempts
      useMetricsStore.getState().setConnectionStatus('disconnected');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min((this.config.reconnectInterval || 3000) * this.reconnectAttempts, 10000);

    // Don't log reconnection attempts - they're expected when no server is running
    this.reconnectTimer = window.setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect(): void {
    this.isManualClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  getStatus(): ConnectionStatus {
    if (!this.ws) return 'disconnected';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'disconnected';
    }
  }
}

// Singleton instance
let socketManager: WebSocketManager | null = null;

export const initWebSocket = (config: SocketConfig): WebSocketManager => {
  if (socketManager) {
    socketManager.disconnect();
  }
  socketManager = new WebSocketManager(config);
  socketManager.connect();
  return socketManager;
};

export const getWebSocket = (): WebSocketManager | null => {
  return socketManager;
};

export const disconnectWebSocket = (): void => {
  if (socketManager) {
    socketManager.disconnect();
    socketManager = null;
  }
};
