import { Play, Pause, RotateCcw } from 'lucide-react';
import { useReplay } from '@/hooks/useReplay';
import { Metric } from '@/store/metrics.store';
import clsx from 'clsx';

export interface ReplayControlsProps {
  metrics: Metric[];
  speed?: number;
  loop?: boolean;
  className?: string;
}

export function ReplayControls({
  metrics,
  speed = 1,
  loop = false,
  className,
}: ReplayControlsProps) {
  const { isPlaying, progress, play, pause, reset, seek } = useReplay(metrics, {
    speed,
    loop,
  });

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = parseFloat(e.target.value);
    seek(percentage);
  };

  return (
    <div className={clsx('flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg', className)}>
      <button
        onClick={reset}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Reset"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={isPlaying ? pause : play}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full"
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          {progress.toFixed(1)}%
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Velocidad: {speed}x
      </div>
    </div>
  );
}
