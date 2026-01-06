import { useUIStore } from '@/store/ui.store';
import { useMetricsStore } from '@/store/metrics.store';
import { Card } from '@/components/ui/Card';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { AlertRulesManager } from '@/components/alerts/AlertRulesManager';
import { useLiveData } from '@/hooks/useLiveData';

export function Settings() {
  const { theme, setTheme, selectedTimeRange, setTimeRange } = useUIStore();
  const { maxDataPoints, setMaxDataPoints, clearMetrics } = useMetricsStore();
  const { connectionStatus } = useLiveData();

  const timeRanges: Array<{ value: typeof selectedTimeRange; label: string }> = [
    { value: '1h', label: '1 hora' },
    { value: '6h', label: '6 horas' },
    { value: '24h', label: '24 horas' },
    { value: '7d', label: '7 días' },
    { value: '30d', label: '30 días' },
    { value: 'all', label: 'Todo' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Configuración
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Personaliza el comportamiento del dashboard
        </p>
      </div>

      {/* Appearance */}
      <Card title="Apariencia">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tema
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Claro
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Oscuro
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Settings */}
      <Card title="Configuración de Datos">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rango de tiempo por defecto
            </label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof selectedTimeRange)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Máximo de puntos de datos por métrica
            </label>
            <input
              type="number"
              value={maxDataPoints}
              onChange={(e) => setMaxDataPoints(parseInt(e.target.value) || 1000)}
              min={100}
              max={10000}
              step={100}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Más puntos = más memoria, pero mejor resolución temporal
            </p>
          </div>
        </div>
      </Card>

      {/* Connection Status */}
      <Card title="Estado de Conexión">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Estado actual
            </span>
            <LiveIndicator />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Estado: <span className="font-medium">{connectionStatus}</span>
          </div>
        </div>
      </Card>

      {/* Alert Rules */}
      <AlertRulesManager />

      {/* Data Management */}
      <Card title="Gestión de Datos">
        <div className="space-y-4">
          <button
            onClick={() => {
              if (confirm('¿Estás seguro de que quieres limpiar todos los datos?')) {
                clearMetrics();
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Limpiar todos los datos
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Esto eliminará todos los datos almacenados localmente. Los datos se volverán a cargar desde el servidor.
          </p>
        </div>
      </Card>
    </div>
  );
}
