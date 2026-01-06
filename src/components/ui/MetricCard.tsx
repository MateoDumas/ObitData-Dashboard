import { ReactNode } from 'react';
import { Card } from './Card';
import { Sparkline } from './Sparkline';
import { TrendIndicator } from './TrendIndicator';
import { ChartData } from '@/utils/dataParser';
import { formatValue } from '@/utils/dataParser';
import clsx from 'clsx';

export interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: number;
  unit?: string;
  previousValue?: number;
  sparklineData?: ChartData;
  icon?: ReactNode;
  color?: 'primary' | 'green' | 'amber' | 'red' | 'purple';
  className?: string;
  onClick?: () => void;
}

const colorClasses = {
  primary: 'text-primary-600 dark:text-primary-400',
  green: 'text-green-600 dark:text-green-400',
  amber: 'text-amber-600 dark:text-amber-400',
  red: 'text-red-600 dark:text-red-400',
  purple: 'text-purple-600 dark:text-purple-400',
};

export function MetricCard({
  title,
  subtitle,
  value,
  unit,
  previousValue,
  sparklineData,
  icon,
  color = 'primary',
  className,
  onClick,
}: MetricCardProps) {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      className={clsx('hover:shadow-md transition-all duration-200', className)}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={clsx('text-3xl font-bold', colorClasses[color])}>
              {formatValue(value, unit)}
            </div>
            {previousValue !== undefined && (
              <div className="mt-2">
                <TrendIndicator current={value} previous={previousValue} size="sm" />
              </div>
            )}
          </div>
          {icon && (
            <div className={clsx('p-2 rounded-lg bg-opacity-10', colorClasses[color])}>
              {icon}
            </div>
          )}
        </div>
        {sparklineData && sparklineData.data.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <Sparkline data={sparklineData} width={200} height={40} showArea />
          </div>
        )}
      </div>
    </Card>
  );
}
