import { Download, FileText, Image, FileJson } from 'lucide-react';
import { useState } from 'react';
import { Metric } from '@/store/metrics.store';
import { ChartData } from '@/utils/dataParser';
import { exportToCSV, exportToJSON, exportChartAsPNG, exportChartAsSVG, exportChartData } from '@/utils/export';
import clsx from 'clsx';

export interface ExportButtonProps {
  metrics?: Metric[];
  chartData?: ChartData[];
  svgElement?: SVGSVGElement | null;
  className?: string;
}

export function ExportButton({ metrics, chartData, svgElement, className }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportCSV = () => {
    if (metrics && metrics.length > 0) {
      exportToCSV(metrics);
    }
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    if (metrics && metrics.length > 0) {
      exportToJSON(metrics);
    }
    setIsOpen(false);
  };

  const handleExportChartPNG = () => {
    if (svgElement) {
      const isDark = document.documentElement.classList.contains('dark');
      exportChartAsPNG(svgElement, 'chart.png', isDark ? '#111827' : '#ffffff');
    }
    setIsOpen(false);
  };

  const handleExportChartSVG = () => {
    if (svgElement) {
      exportChartAsSVG(svgElement, 'chart.svg');
    }
    setIsOpen(false);
  };

  const handleExportChartData = () => {
    if (chartData && chartData.length > 0) {
      exportChartData(chartData);
    }
    setIsOpen(false);
  };

  const hasData = (metrics && metrics.length > 0) || (chartData && chartData.length > 0);
  const hasChart = svgElement !== null && svgElement !== undefined;

  if (!hasData && !hasChart) {
    return null;
  }

  return (
    <div className={clsx('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        <Download className="w-4 h-4" />
        Exportar
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-2">
              {metrics && metrics.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Datos
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Exportar CSV
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm"
                  >
                    <FileJson className="w-4 h-4" />
                    Exportar JSON
                  </button>
                </>
              )}

              {hasChart && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-2">
                    Gráfico
                  </div>
                  <button
                    onClick={handleExportChartPNG}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm"
                  >
                    <Image className="w-4 h-4" />
                    Exportar PNG
                  </button>
                  <button
                    onClick={handleExportChartSVG}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm"
                  >
                    <Image className="w-4 h-4" />
                    Exportar SVG
                  </button>
                </>
              )}

              {chartData && chartData.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-2">
                    Datos del Gráfico
                  </div>
                  <button
                    onClick={handleExportChartData}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm"
                  >
                    <FileJson className="w-4 h-4" />
                    Exportar Datos JSON
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
