import { Metric } from '@/store/metrics.store';

/**
 * Generate mock metrics for testing/demo purposes
 */
export function generateMockMetrics(
  count: number = 50,
  metricId: string = 'cpu-usage',
  baseValue: number = 30,
  variance: number = 20
): Metric[] {
  const now = Date.now();
  const interval = 60000; // 1 minute intervals

  return Array.from({ length: count }, (_, i) => ({
    id: metricId,
    name: getMetricName(metricId),
    value: baseValue + Math.random() * variance,
    timestamp: now - (count - i) * interval,
    unit: getMetricUnit(metricId),
    category: getMetricCategory(metricId),
  }));
}

/**
 * Generate multiple mock metrics
 */
export function generateMultipleMockMetrics(
  metricIds: string[],
  count: number = 50
): Metric[] {
  return metricIds.flatMap((id) => {
    const config = getMetricConfig(id);
    return generateMockMetrics(count, id, config.baseValue, config.variance);
  });
}

function getMetricName(id: string): string {
  const names: Record<string, string> = {
    'cpu-usage': 'CPU Usage',
    'memory-usage': 'Memory Usage',
    'network-in': 'Network In',
    'network-out': 'Network Out',
    'disk-read': 'Disk Read',
    'disk-write': 'Disk Write',
  };
  return names[id] || 'Unknown Metric';
}

function getMetricUnit(id: string): string {
  const units: Record<string, string> = {
    'cpu-usage': '%',
    'memory-usage': '%',
    'network-in': 'MB/s',
    'network-out': 'MB/s',
    'disk-read': 'MB/s',
    'disk-write': 'MB/s',
  };
  return units[id] || '';
}

function getMetricCategory(id: string): string {
  if (id.includes('cpu') || id.includes('memory')) return 'system';
  if (id.includes('network')) return 'network';
  if (id.includes('disk')) return 'storage';
  return 'general';
}

function getMetricConfig(id: string): { baseValue: number; variance: number } {
  const configs: Record<string, { baseValue: number; variance: number }> = {
    'cpu-usage': { baseValue: 30, variance: 40 },
    'memory-usage': { baseValue: 50, variance: 30 },
    'network-in': { baseValue: 10, variance: 20 },
    'network-out': { baseValue: 5, variance: 15 },
    'disk-read': { baseValue: 20, variance: 25 },
    'disk-write': { baseValue: 15, variance: 20 },
  };
  return configs[id] || { baseValue: 0, variance: 10 };
}

/**
 * Simulate streaming data (for testing without WebSocket)
 */
export function startMockStream(
  callback: (metric: Metric) => void,
  interval: number = 2000
): () => void {
  const metricIds = ['cpu-usage', 'memory-usage', 'network-in', 'network-out'];
  let intervalId: number;

  const sendMetric = () => {
    const metricId = metricIds[Math.floor(Math.random() * metricIds.length)];
    const config = getMetricConfig(metricId);
    const metric: Metric = {
      id: metricId,
      name: getMetricName(metricId),
      value: config.baseValue + (Math.random() - 0.5) * config.variance * 2,
      timestamp: Date.now(),
      unit: getMetricUnit(metricId),
      category: getMetricCategory(metricId),
    };
    callback(metric);
  };

  intervalId = window.setInterval(sendMetric, interval);

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}
