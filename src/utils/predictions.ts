import { Metric } from '@/store/metrics.store';

export interface Prediction {
  timestamp: number;
  value: number;
  confidence: number;
}

/**
 * Simple linear regression for trend prediction
 */
export function linearRegression(
  metrics: Metric[],
  futurePoints: number = 10,
  interval: number = 60000
): Prediction[] {
  if (metrics.length < 2) return [];

  const sorted = [...metrics].sort((a, b) => a.timestamp - b.timestamp);
  const n = sorted.length;
  
  // Calculate linear regression
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  sorted.forEach((metric, index) => {
    const x = index;
    const y = metric.value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared for confidence
  let ssRes = 0;
  let ssTot = 0;
  const meanY = sumY / n;

  sorted.forEach((metric, index) => {
    const predicted = slope * index + intercept;
    ssRes += Math.pow(metric.value - predicted, 2);
    ssTot += Math.pow(metric.value - meanY, 2);
  });

  const rSquared = 1 - ssRes / ssTot;
  const confidence = Math.max(0, Math.min(1, rSquared));

  // Generate predictions
  const lastTimestamp = sorted[n - 1].timestamp;
  const predictions: Prediction[] = [];

  for (let i = 1; i <= futurePoints; i++) {
    const futureIndex = n + i - 1;
    const predictedValue = slope * futureIndex + intercept;
    predictions.push({
      timestamp: lastTimestamp + i * interval,
      value: predictedValue,
      confidence,
    });
  }

  return predictions;
}

/**
 * Moving average prediction
 */
export function movingAveragePrediction(
  metrics: Metric[],
  window: number = 5,
  futurePoints: number = 10,
  interval: number = 60000
): Prediction[] {
  if (metrics.length < window) return [];

  const sorted = [...metrics].sort((a, b) => a.timestamp - b.timestamp);
  const predictions: Prediction[] = [];

  // Calculate recent moving average
  const recent = sorted.slice(-window);
  const avg = recent.reduce((sum, m) => sum + m.value, 0) / window;

  // Calculate variance for confidence
  const variance =
    recent.reduce((sum, m) => sum + Math.pow(m.value - avg, 2), 0) / window;
  const stdDev = Math.sqrt(variance);
  const confidence = Math.max(0, Math.min(1, 1 - stdDev / (avg || 1)));

  const lastTimestamp = sorted[sorted.length - 1].timestamp;

  for (let i = 1; i <= futurePoints; i++) {
    predictions.push({
      timestamp: lastTimestamp + i * interval,
      value: avg,
      confidence,
    });
  }

  return predictions;
}

/**
 * Exponential smoothing prediction
 */
export function exponentialSmoothingPrediction(
  metrics: Metric[],
  alpha: number = 0.3,
  futurePoints: number = 10,
  interval: number = 60000
): Prediction[] {
  if (metrics.length < 2) return [];

  const sorted = [...metrics].sort((a, b) => a.timestamp - b.timestamp);
  let smoothed = sorted[0].value;

  // Calculate smoothed values
  for (let i = 1; i < sorted.length; i++) {
    smoothed = alpha * sorted[i].value + (1 - alpha) * smoothed;
  }

  // Simple confidence based on variance
  const values = sorted.map((m) => m.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const confidence = Math.max(0, Math.min(1, 1 - Math.sqrt(variance) / (mean || 1)));

  const lastTimestamp = sorted[sorted.length - 1].timestamp;
  const predictions: Prediction[] = [];

  for (let i = 1; i <= futurePoints; i++) {
    predictions.push({
      timestamp: lastTimestamp + i * interval,
      value: smoothed,
      confidence,
    });
  }

  return predictions;
}
