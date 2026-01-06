import { useState, useEffect, useRef } from 'react';
import { Metric } from '@/store/metrics.store';
import { useMetricsStore } from '@/store/metrics.store';

export interface ReplayOptions {
  speed?: number; // Multiplier (1 = realtime, 2 = 2x speed, etc.)
  loop?: boolean;
  onComplete?: () => void;
}

/**
 * Hook for replaying historical metrics
 */
export function useReplay(metrics: Metric[], options: ReplayOptions = {}) {
  const { speed = 1, loop = false, onComplete } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const addMetric = useMetricsStore((state) => state.addMetric);

  const sortedMetrics = [...metrics].sort((a, b) => a.timestamp - b.timestamp);
  const totalMetrics = sortedMetrics.length;

  useEffect(() => {
    if (!isPlaying || totalMetrics === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (currentIndex >= totalMetrics) {
      if (loop) {
        setCurrentIndex(0);
        setProgress(0);
      } else {
        setIsPlaying(false);
        onComplete?.();
        return;
      }
    }

    // Calculate interval based on actual time differences
    const currentMetric = sortedMetrics[currentIndex];
    const nextMetric = sortedMetrics[currentIndex + 1];

    let interval = 1000; // Default 1 second
    if (nextMetric) {
      const timeDiff = nextMetric.timestamp - currentMetric.timestamp;
      interval = Math.max(50, timeDiff / speed); // Minimum 50ms
    }

    intervalRef.current = window.setTimeout(() => {
      if (currentIndex < totalMetrics) {
        addMetric(sortedMetrics[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        setProgress(((currentIndex + 1) / totalMetrics) * 100);
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentIndex, totalMetrics, speed, loop, sortedMetrics, addMetric, onComplete]);

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setProgress(0);
  };

  const seek = (percentage: number) => {
    const newIndex = Math.floor((percentage / 100) * totalMetrics);
    setCurrentIndex(newIndex);
    setProgress(percentage);
    if (isPlaying) {
      pause();
    }
  };

  return {
    isPlaying,
    progress,
    currentTime: sortedMetrics[currentIndex]?.timestamp || 0,
    totalTime: sortedMetrics[totalMetrics - 1]?.timestamp || 0,
    play,
    pause,
    reset,
    seek,
  };
}
