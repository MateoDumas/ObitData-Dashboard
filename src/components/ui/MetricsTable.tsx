import { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useMetricsStore } from '@/store/metrics.store';
import { formatValue, formatTimestamp } from '@/utils/dataParser';
import { Card } from './Card';
import clsx from 'clsx';

type SortField = 'name' | 'value' | 'timestamp';
type SortDirection = 'asc' | 'desc';

export function MetricsTable() {
  const { getAllLatestMetrics } = useMetricsStore();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const metrics = getAllLatestMetrics();

  const sortedMetrics = useMemo(() => {
    const sorted = [...metrics].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'timestamp':
          comparison = a.timestamp - b.timestamp;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [metrics, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (metrics.length === 0) {
    return (
      <Card title="Métricas">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No hay métricas disponibles
        </p>
      </Card>
    );
  }

  return (
    <Card title="Tabla de Métricas" subtitle={`${metrics.length} métricas`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Nombre
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center gap-2">
                  Valor
                  <SortIcon field="value" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Unidad
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Categoría
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-2">
                  Última actualización
                  <SortIcon field="timestamp" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMetrics.map((metric, index) => (
              <tr
                key={metric.id}
                className={clsx(
                  'border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                  index % 2 === 0 && 'bg-gray-50/50 dark:bg-gray-900/50'
                )}
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {metric.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {metric.id}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatValue(metric.value, metric.unit)}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {metric.unit || '-'}
                </td>
                <td className="py-3 px-4">
                  {metric.category && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                      {metric.category}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatTimestamp(metric.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
