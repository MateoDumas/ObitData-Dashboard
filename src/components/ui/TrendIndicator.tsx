import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import clsx from 'clsx';

export interface TrendIndicatorProps {
  current: number;
  previous: number;
  className?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TrendIndicator({
  current,
  previous,
  className,
  showPercentage = true,
  size = 'md',
}: TrendIndicatorProps) {
  const diff = current - previous;
  const percentage = previous !== 0 ? ((diff / previous) * 100) : 0;
  const isPositive = diff > 0;
  const isNegative = diff < 0;
  const isNeutral = diff === 0;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1',
        isPositive && 'text-green-600 dark:text-green-400',
        isNegative && 'text-red-600 dark:text-red-400',
        isNeutral && 'text-gray-500 dark:text-gray-400',
        sizeClasses[size],
        className
      )}
    >
      {isPositive && <ArrowUp className="w-4 h-4" size={iconSizes[size]} />}
      {isNegative && <ArrowDown className="w-4 h-4" size={iconSizes[size]} />}
      {isNeutral && <Minus className="w-4 h-4" size={iconSizes[size]} />}
      {showPercentage && (
        <span className="font-medium">
          {isPositive && '+'}
          {percentage.toFixed(1)}%
        </span>
      )}
    </div>
  );
}
