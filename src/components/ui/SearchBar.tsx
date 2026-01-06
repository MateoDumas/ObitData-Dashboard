import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useMetricsStore } from '@/store/metrics.store';
import clsx from 'clsx';

export interface SearchBarProps {
  onSelect?: (metricId: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSelect, placeholder = 'Buscar métricas...', className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { getAllLatestMetrics } = useMetricsStore();

  const allMetrics = getAllLatestMetrics();

  const filteredMetrics = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return allMetrics.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.id.toLowerCase().includes(lowerQuery) ||
        m.category?.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limit to 10 results
  }, [query, allMetrics]);

  return (
    <div className={clsx('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {query && filteredMetrics.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {filteredMetrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => {
                onSelect?.(metric.id);
                setQuery('');
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {metric.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {metric.id} {metric.category && `• ${metric.category}`}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
