import { Metric } from '@/store/metrics.store';

export interface ParsedDataPoint {
  x: number; // timestamp
  y: number; // value
  raw: Metric;
}

export interface ChartData {
  id: string;
  name: string;
  data: ParsedDataPoint[];
  color?: string;
  unit?: string;
}

/**
 * Parse metrics into chart-ready format
 */
export function parseMetricsForChart(
  metrics: Metric[],
  metricId?: string
): ChartData[] {
  if (metrics.length === 0) return [];

  // Group by metric ID if not specified
  const grouped = new Map<string, Metric[]>();
  
  metrics.forEach((metric) => {
    const id = metricId || metric.id;
    if (!grouped.has(id)) {
      grouped.set(id, []);
    }
    grouped.get(id)!.push(metric);
  });

  return Array.from(grouped.entries()).map(([id, metricList]) => {
    const sorted = [...metricList].sort((a, b) => a.timestamp - b.timestamp);
    
    return {
      id,
      name: sorted[0]?.name || id,
      data: sorted.map((m) => ({
        x: m.timestamp,
        y: m.value,
        raw: m,
      })),
      unit: sorted[0]?.unit,
      color: getColorForMetric(id),
    };
  });
}

/**
 * Filter metrics by time range
 */
export function filterByTimeRange(
  metrics: Metric[],
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d' | 'all'
): Metric[] {
  if (timeRange === 'all') return metrics;

  const now = Date.now();
  const ranges: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  };

  const cutoff = now - ranges[timeRange];
  return metrics.filter((m) => m.timestamp >= cutoff);
}

/**
 * Aggregate metrics (e.g., average, min, max)
 */
export function aggregateMetrics(
  metrics: Metric[],
  aggregation: 'avg' | 'min' | 'max' | 'sum' | 'count'
): number {
  if (metrics.length === 0) return 0;

  switch (aggregation) {
    case 'avg':
      return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    case 'min':
      return Math.min(...metrics.map((m) => m.value));
    case 'max':
      return Math.max(...metrics.map((m) => m.value));
    case 'sum':
      return metrics.reduce((sum, m) => sum + m.value, 0);
    case 'count':
      return metrics.length;
    default:
      return 0;
  }
}

/**
 * Get color for a metric (consistent across charts)
 */
const colorPalette = [
  '#0ea5e9', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

const colorCache = new Map<string, string>();

export function getColorForMetric(metricId: string): string {
  if (colorCache.has(metricId)) {
    return colorCache.get(metricId)!;
  }

  const index = colorCache.size % colorPalette.length;
  const color = colorPalette[index];
  colorCache.set(metricId, color);
  return color;
}

/**
 * Format value with unit
 */
export function formatValue(value: number, unit?: string, decimals = 2): string {
  const formatted = value.toFixed(decimals);
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
