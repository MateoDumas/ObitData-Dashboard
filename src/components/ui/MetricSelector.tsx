import { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { useMetricsStore } from '@/store/metrics.store';
import clsx from 'clsx';

export interface MetricSelectorProps {
  selectedMetrics: string[];
  onSelectionChange: (metricIds: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

export function MetricSelector({
  selectedMetrics,
  onSelectionChange,
  multiSelect = true,
  className,
}: MetricSelectorProps) {
  const { getAllLatestMetrics } = useMetricsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const allMetrics = getAllLatestMetrics();
  
  const filteredMetrics = useMemo(() => {
    if (!searchQuery) return allMetrics;
    const query = searchQuery.toLowerCase();
    return allMetrics.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.id.toLowerCase().includes(query) ||
        m.category?.toLowerCase().includes(query)
    );
  }, [allMetrics, searchQuery]);

  const toggleMetric = (metricId: string) => {
    if (multiSelect) {
      if (selectedMetrics.includes(metricId)) {
        onSelectionChange(selectedMetrics.filter((id) => id !== metricId));
      } else {
        onSelectionChange([...selectedMetrics, metricId]);
      }
    } else {
      onSelectionChange([metricId]);
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  const selectedMetricsData = allMetrics.filter((m) => selectedMetrics.includes(m.id));

  return (
    <div className={clsx('relative', className)}>
      <div className="flex items-center gap-2 flex-wrap">
        {selectedMetricsData.length > 0 ? (
          <>
            {selectedMetricsData.map((metric) => (
              <span
                key={metric.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-sm"
              >
                {metric.name}
                <button
                  onClick={() => toggleMetric(metric.id)}
                  className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearSelection}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Limpiar
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            No hay métricas seleccionadas
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
        >
          {isOpen ? 'Cerrar' : 'Seleccionar métricas'}
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar métricas..."
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredMetrics.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron métricas
                </div>
              ) : (
                <div className="p-2">
                  {filteredMetrics.map((metric) => {
                    const isSelected = selectedMetrics.includes(metric.id);
                    return (
                      <button
                        key={metric.id}
                        onClick={() => toggleMetric(metric.id)}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                          isSelected && 'bg-primary-50 dark:bg-primary-900/20'
                        )}
                      >
                        <div>
                          <div className="font-medium text-sm">{metric.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {metric.id} {metric.category && `• ${metric.category}`}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              {selectedMetrics.length} de {allMetrics.length} seleccionadas
            </div>
          </div>
        </>
      )}
    </div>
  );
}
