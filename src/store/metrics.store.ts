import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Metric {
  id: string;
  name: string;
  value: number;
  timestamp: number;
  unit?: string;
  category?: string;
}

export interface MetricState {
  metrics: Map<string, Metric[]>;
  latestMetrics: Map<string, Metric>;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastUpdate: number | null;
  maxDataPoints: number;
  
  // Actions
  addMetric: (metric: Metric) => void;
  addMetrics: (metrics: Metric[]) => void;
  clearMetrics: (metricId?: string) => void;
  setConnectionStatus: (status: MetricState['connectionStatus']) => void;
  setMaxDataPoints: (max: number) => void;
  
  // Selectors
  getMetricHistory: (metricId: string) => Metric[];
  getLatestMetric: (metricId: string) => Metric | undefined;
  getAllLatestMetrics: () => Metric[];
}

export const useMetricsStore = create<MetricState>()(
  subscribeWithSelector((set, get) => ({
    metrics: new Map(),
    latestMetrics: new Map(),
    connectionStatus: 'disconnected',
    lastUpdate: null,
    maxDataPoints: 1000,

    addMetric: (metric) => {
      set((state) => {
        const newMetrics = new Map(state.metrics);
        const metricHistory = newMetrics.get(metric.id) || [];
        
        // Add new metric and keep only last maxDataPoints
        const updatedHistory = [...metricHistory, metric].slice(-state.maxDataPoints);
        newMetrics.set(metric.id, updatedHistory);
        
        const newLatestMetrics = new Map(state.latestMetrics);
        newLatestMetrics.set(metric.id, metric);
        
        return {
          metrics: newMetrics,
          latestMetrics: newLatestMetrics,
          lastUpdate: Date.now(),
        };
      });
    },

    addMetrics: (metrics) => {
      set((state) => {
        const newMetrics = new Map(state.metrics);
        const newLatestMetrics = new Map(state.latestMetrics);
        
        metrics.forEach((metric) => {
          const metricHistory = newMetrics.get(metric.id) || [];
          const updatedHistory = [...metricHistory, metric].slice(-state.maxDataPoints);
          newMetrics.set(metric.id, updatedHistory);
          newLatestMetrics.set(metric.id, metric);
        });
        
        return {
          metrics: newMetrics,
          latestMetrics: newLatestMetrics,
          lastUpdate: Date.now(),
        };
      });
    },

    clearMetrics: (metricId) => {
      set((state) => {
        if (metricId) {
          const newMetrics = new Map(state.metrics);
          const newLatestMetrics = new Map(state.latestMetrics);
          newMetrics.delete(metricId);
          newLatestMetrics.delete(metricId);
          return {
            metrics: newMetrics,
            latestMetrics: newLatestMetrics,
          };
        } else {
          return {
            metrics: new Map(),
            latestMetrics: new Map(),
          };
        }
      });
    },

    setConnectionStatus: (status) => {
      set({ connectionStatus: status });
    },

    setMaxDataPoints: (max) => {
      set({ maxDataPoints: max });
    },

    getMetricHistory: (metricId) => {
      return get().metrics.get(metricId) || [];
    },

    getLatestMetric: (metricId) => {
      return get().latestMetrics.get(metricId);
    },

    getAllLatestMetrics: () => {
      return Array.from(get().latestMetrics.values());
    },
  }))
);
