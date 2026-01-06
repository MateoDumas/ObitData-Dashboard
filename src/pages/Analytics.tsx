import { useMetrics } from '@/hooks/useMetrics';
import { LineChart } from '@/components/charts/LineChart';
import { HeatMap } from '@/components/charts/HeatMap';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { useUIStore } from '@/store/ui.store';
import { formatValue, aggregateMetrics } from '@/utils/dataParser';

export function Analytics() {
  const { chartData, metrics, hasData } = useMetrics();
  const selectedTimeRange = useUIStore((state) => state.selectedTimeRange);

  const avgValue = hasData && metrics.length > 0
    ? aggregateMetrics(metrics, 'avg')
    : 0;

  const maxValue = hasData && metrics.length > 0
    ? aggregateMetrics(metrics, 'max')
    : 0;

  const minValue = hasData && metrics.length > 0
    ? aggregateMetrics(metrics, 'min')
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Análisis detallado de métricas históricas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Promedio" subtitle="Valor promedio">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {formatValue(avgValue, '', 2)}
          </div>
        </Card>

        <Card title="Máximo" subtitle="Valor máximo">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatValue(maxValue, '', 2)}
          </div>
        </Card>

        <Card title="Mínimo" subtitle="Valor mínimo">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {formatValue(minValue, '', 2)}
          </div>
        </Card>
      </div>

      {/* Heat Map */}
      <Card
        title="Heat Map de Métricas"
        subtitle={`Rango: ${selectedTimeRange}`}
        className="h-96"
      >
        {hasData && chartData.length > 0 ? (
          <HeatMap data={chartData} animated />
        ) : (
          <Loader text="Cargando datos..." />
        )}
      </Card>

      {/* Multiple Line Charts */}
      <div className="grid grid-cols-1 gap-6">
        {chartData.slice(0, 3).map((data) => (
          <Card
            key={data.id}
            title={data.name}
            subtitle={`Rango: ${selectedTimeRange}`}
            className="h-80"
          >
            <LineChart data={[data]} showArea animated />
          </Card>
        ))}
      </div>
    </div>
  );
}
