import { useEffect } from 'react';
import { Cpu, HardDrive, Network, Activity } from 'lucide-react';
import { useLiveData } from '@/hooks/useLiveData';
import { useMetrics } from '@/hooks/useMetrics';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { MetricsTable } from '@/components/ui/MetricsTable';
import { Loader } from '@/components/ui/Loader';
import { useUIStore } from '@/store/ui.store';
import { useMetricsStore } from '@/store/metrics.store';
import { generateMultipleMockMetrics, startMockStream } from '@/utils/mockData';
import { useToastStore } from '@/store/toast.store';

export function Dashboard() {
  // Don't auto-connect to WebSocket - use mock data instead
  const { isConnected } = useLiveData({ autoConnect: false });
  const { chartData, latestMetrics, hasData } = useMetrics();
  const selectedTimeRange = useUIStore((state) => state.selectedTimeRange);
  const { success } = useToastStore();

  // Generate mock data if no real data is available (for demo/testing)
  useEffect(() => {
    if (!hasData) {
      // Generate initial historical data
      const mockMetrics = generateMultipleMockMetrics(
        ['cpu-usage', 'memory-usage', 'network-in', 'network-out'],
        50
      );
      useMetricsStore.getState().addMetrics(mockMetrics);
      success('Datos mock generados correctamente');

      // Start mock stream if not connected to real WebSocket
      if (!isConnected) {
        const stopStream = startMockStream((metric) => {
          useMetricsStore.getState().addMetric(metric);
        }, 2000);

        return () => {
          stopStream();
        };
      }
    }
  }, [hasData, isConnected, success]);

  const cpuData = chartData.find((d) => d.id === 'cpu-usage') || chartData[0];
  const memoryData = chartData.find((d) => d.id === 'memory-usage') || chartData[1];
  const networkInData = chartData.find((d) => d.id === 'network-in');
  const latestCpu = latestMetrics.find((m) => m.id === 'cpu-usage');
  const latestMemory = latestMetrics.find((m) => m.id === 'memory-usage');
  const latestNetworkIn = latestMetrics.find((m) => m.id === 'network-in');

  // Get previous values for trend indicators
  const getPreviousValue = (metricId: string) => {
    const history = useMetricsStore.getState().getMetricHistory(metricId);
    if (history.length > 1) {
      return history[history.length - 2].value;
    }
    return undefined;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitoreo en tiempo real de métricas del sistema
          </p>
        </div>
        <div className="w-full md:w-auto">
          <SearchBar
            onSelect={(metricId) => {
              success(`Métrica seleccionada: ${metricId}`);
            }}
          />
        </div>
      </div>

      {/* Stats Cards with Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Usage"
          subtitle="Uso actual del procesador"
          value={latestCpu?.value || 0}
          unit={latestCpu?.unit}
          previousValue={latestCpu ? getPreviousValue('cpu-usage') : undefined}
          sparklineData={cpuData}
          icon={<Cpu className="w-5 h-5" />}
          color="primary"
          className="hover-lift"
        />

        <MetricCard
          title="Memory Usage"
          subtitle="Uso actual de memoria"
          value={latestMemory?.value || 0}
          unit={latestMemory?.unit}
          previousValue={latestMemory ? getPreviousValue('memory-usage') : undefined}
          sparklineData={memoryData}
          icon={<HardDrive className="w-5 h-5" />}
          color="green"
          className="hover-lift"
        />

        <MetricCard
          title="Network In"
          subtitle="Entrada de red"
          value={latestNetworkIn?.value || 0}
          unit={latestNetworkIn?.unit}
          previousValue={latestNetworkIn ? getPreviousValue('network-in') : undefined}
          sparklineData={networkInData}
          icon={<Network className="w-5 h-5" />}
          color="amber"
          className="hover-lift"
        />

        <MetricCard
          title="Status"
          subtitle="Estado de conexión"
          value={isConnected ? 100 : 0}
          unit="%"
          icon={<Activity className="w-5 h-5" />}
          color={isConnected ? 'green' : 'red'}
          className="hover-lift"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="CPU Usage Over Time"
          subtitle={`Rango: ${selectedTimeRange}`}
          className="h-96"
        >
          {hasData && cpuData ? (
            <LineChart data={[cpuData]} showArea animated />
          ) : (
            <Loader text="Cargando datos..." />
          )}
        </Card>

        <Card
          title="Memory Usage Over Time"
          subtitle={`Rango: ${selectedTimeRange}`}
          className="h-96"
        >
          {hasData && memoryData ? (
            <LineChart data={[memoryData]} showArea animated />
          ) : (
            <Loader text="Cargando datos..." />
          )}
        </Card>
      </div>

      {/* Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Métricas Comparativas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Vista de barras</p>
          <div className="h-96">
            {hasData && chartData.length > 0 ? (
              <BarChart data={chartData.slice(0, 3)} animated />
            ) : (
              <Loader text="Cargando datos..." />
            )}
          </div>
        </div>

        {/* Metrics Table */}
        <MetricsTable />
      </div>
    </div>
  );
}
