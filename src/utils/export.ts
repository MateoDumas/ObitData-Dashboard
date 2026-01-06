import { Metric } from '@/store/metrics.store';
import { ChartData } from '@/utils/dataParser';

/**
 * Export metrics to CSV format
 */
export function exportToCSV(metrics: Metric[], filename = 'metrics.csv'): void {
  if (metrics.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const headers = ['ID', 'Nombre', 'Valor', 'Unidad', 'Timestamp', 'Categoría'];
  const rows = metrics.map((m) => [
    m.id,
    m.name,
    m.value.toString(),
    m.unit || '',
    new Date(m.timestamp).toISOString(),
    m.category || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export metrics to JSON format
 */
export function exportToJSON(metrics: Metric[], filename = 'metrics.json'): void {
  if (metrics.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const jsonContent = JSON.stringify(metrics, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Export chart as PNG image
 */
export function exportChartAsPNG(
  svgElement: SVGSVGElement,
  filename = 'chart.png',
  backgroundColor = '#ffffff'
): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

/**
 * Export chart as SVG
 */
export function exportChartAsSVG(svgElement: SVGSVGElement, filename = 'chart.svg'): void {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(svgBlob, filename);
}

/**
 * Download file helper
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * Download blob helper
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export chart data for external analysis
 */
export function exportChartData(chartData: ChartData[], filename = 'chart-data.json'): void {
  const exportData = chartData.map((series) => ({
    id: series.id,
    name: series.name,
    unit: series.unit,
    color: series.color,
    dataPoints: series.data.length,
    data: series.data,
  }));

  exportToJSON(exportData as any, filename);
}
