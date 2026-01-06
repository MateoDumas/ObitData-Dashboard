export interface MetricResponse {
  id: string;
  name: string;
  value: number;
  timestamp: number;
  unit?: string;
  category?: string;
}

export interface HistoricalMetricsResponse {
  metrics: MetricResponse[];
  startTime: number;
  endTime: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const metricsApi = {
  /**
   * Fetch historical metrics for a specific metric ID
   */
  async getHistoricalMetrics(
    metricId: string,
    startTime?: number,
    endTime?: number
  ): Promise<MetricResponse[]> {
    const params = new URLSearchParams();
    params.append('metricId', metricId);
    if (startTime) params.append('startTime', startTime.toString());
    if (endTime) params.append('endTime', endTime.toString());

    const response = await fetch(`${API_BASE_URL}/metrics/historical?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch historical metrics: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Fetch all available metrics
   */
  async getAllMetrics(): Promise<MetricResponse[]> {
    const response = await fetch(`${API_BASE_URL}/metrics`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Fetch metrics for multiple metric IDs
   */
  async getMultipleMetrics(
    metricIds: string[],
    startTime?: number,
    endTime?: number
  ): Promise<Record<string, MetricResponse[]>> {
    const params = new URLSearchParams();
    params.append('metricIds', metricIds.join(','));
    if (startTime) params.append('startTime', startTime.toString());
    if (endTime) params.append('endTime', endTime.toString());

    const response = await fetch(`${API_BASE_URL}/metrics/batch?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch batch metrics: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Get current snapshot of all metrics
   */
  async getCurrentSnapshot(): Promise<MetricResponse[]> {
    const response = await fetch(`${API_BASE_URL}/metrics/snapshot`);
    if (!response.ok) {
      throw new Error(`Failed to fetch snapshot: ${response.statusText}`);
    }
    return response.json();
  },
};
