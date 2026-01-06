import { useEffect, useMemo } from 'react';
import { useMetricsStore, Metric, MetricState } from '@/store/metrics.store';
import { useUIStore, UIState } from '@/store/ui.store';
import { parseMetricsForChart, filterByTimeRange } from '@/utils/dataParser';
import { metricsApi } from '@/api/metrics.api';

export interface UseMetricsOptions {
  metricId?: string;
  autoFetch?: boolean;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d' | 'all';
}

/**
 * Hook to access and manage metrics
 */
export function useMetrics(options: UseMetricsOptions = {}) {
  const {
    metricId,
    autoFetch = false,
    timeRange: optionTimeRange,
  } = options;

  const selectedTimeRange = useUIStore((state: UIState) => state.selectedTimeRange);
  const timeRange = optionTimeRange || selectedTimeRange;

  const metrics = useMetricsStore((state: MetricState) => state.metrics);
  const latestMetrics = useMetricsStore((state: MetricState) => state.latestMetrics);
  const getMetricHistory = useMetricsStore((state: MetricState) => state.getMetricHistory);
  const getLatestMetric = useMetricsStore((state: MetricState) => state.getLatestMetric);
  const getAllLatestMetrics = useMetricsStore((state: MetricState) => state.getAllLatestMetrics);

  // Fetch historical data on mount if autoFetch is enabled
  useEffect(() => {
    if (autoFetch && metricId) {
      const fetchHistorical = async () => {
        try {
          const historical = await metricsApi.getHistoricalMetrics(metricId);
          // Convert API response to Metric format and add to store
          const metrics: Metric[] = historical.map((m) => ({
            id: m.id,
            name: m.name,
            value: m.value,
            timestamp: m.timestamp,
            unit: m.unit,
            category: m.category,
          }));
          useMetricsStore.getState().addMetrics(metrics);
        } catch (error) {
          console.error('Failed to fetch historical metrics:', error);
        }
      };
      fetchHistorical();
    }
  }, [autoFetch, metricId]);

  // Get metrics for specific ID or all
  const metricHistory = useMemo(() => {
    if (metricId) {
      return getMetricHistory(metricId);
    }
    return Array.from(metrics.values()).flat();
  }, [metricId, metrics, getMetricHistory]);

  // Filter by time range
  const filteredMetrics = useMemo(() => {
    return filterByTimeRange(metricHistory, timeRange);
  }, [metricHistory, timeRange]);

  // Parse for charts
  const chartData = useMemo(() => {
    return parseMetricsForChart(filteredMetrics, metricId);
  }, [filteredMetrics, metricId]);

  // Get latest metric
  const latestMetric = useMemo(() => {
    if (metricId) {
      return getLatestMetric(metricId);
    }
    return undefined;
  }, [metricId, latestMetrics, getLatestMetric]);

  return {
    // Raw data
    metrics: filteredMetrics,
    allMetrics: metricHistory,
    latestMetrics: getAllLatestMetrics(),
    
    // Specific metric
    metricHistory: metricId ? getMetricHistory(metricId) : [],
    latestMetric,
    
    // Chart-ready data
    chartData,
    
    // Helpers
    hasData: filteredMetrics.length > 0,
    dataCount: filteredMetrics.length,
  };
}
