import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartData } from '@/utils/dataParser';
import {
  ChartDimensions,
  defaultChartDimensions,
  getInnerDimensions,
} from '@/utils/chartHelpers';
import { useResize } from '@/hooks/useResize';
import clsx from 'clsx';

export interface HeatMapProps {
  data: ChartData[];
  dimensions?: Partial<ChartDimensions>;
  cellSize?: number;
  animated?: boolean;
  className?: string;
}

export function HeatMap({
  data,
  dimensions = {},
  cellSize = 20,
  animated = true,
  className,
}: HeatMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResize(containerRef);

  const chartDimensions: ChartDimensions = {
    ...defaultChartDimensions,
    width: dimensions.width || width || defaultChartDimensions.width,
    height: dimensions.height || height || defaultChartDimensions.height,
    margin: { ...defaultChartDimensions.margin, ...dimensions.margin },
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width: innerWidth, height: innerHeight } = getInnerDimensions(chartDimensions);
    const { margin } = chartDimensions;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data: group by time buckets
    const allDataPoints = data.flatMap((series) => series.data);
    if (allDataPoints.length === 0) return;

    // Get time range
    const timeExtent = d3.extent(allDataPoints, (d) => d.x) as [number, number];
    const timeRange = timeExtent[1] - timeExtent[0];

    // Calculate buckets
    const bucketsPerRow = Math.floor(innerWidth / cellSize);
    const totalBuckets = Math.floor((timeRange / (1000 * 60)) / 5); // 5-minute buckets
    const rows = Math.ceil(totalBuckets / bucketsPerRow);
    const actualHeight = rows * cellSize;

    // Create color scale
    const values = allDataPoints.map((d) => d.y);
    const colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(values) as [number, number]);

    // Group data into buckets
    const bucketSize = timeRange / totalBuckets;
    const buckets = new Map<string, number[]>();

    allDataPoints.forEach((point) => {
      const bucketIndex = Math.floor((point.x - timeExtent[0]) / bucketSize);
      const key = `${bucketIndex}`;
      if (!buckets.has(key)) {
        buckets.set(key, []);
      }
      buckets.get(key)!.push(point.y);
    });

    // Calculate average for each bucket
    const heatmapData: Array<{ x: number; y: number; value: number }> = [];
    buckets.forEach((values, key) => {
      const index = parseInt(key);
      const avgValue = d3.mean(values) || 0;
      const row = Math.floor(index / bucketsPerRow);
      const col = index % bucketsPerRow;
      heatmapData.push({
        x: col * cellSize,
        y: row * cellSize,
        value: avgValue,
      });
    });

    // Draw cells
    const cells = g
      .selectAll('.heat-cell')
      .data(heatmapData)
      .enter()
      .append('rect')
      .attr('class', 'heat-cell')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', cellSize - 1)
      .attr('height', cellSize - 1)
      .attr('fill', (d) => colorScale(d.value))
      .attr('opacity', animated ? 0 : 1);

    if (animated) {
      cells
        .transition()
        .duration(500)
        .attr('opacity', 1);
    }

    // Add tooltip on hover
    cells
      .append('title')
      .text((d) => `Value: ${d.value.toFixed(2)}`);

    // Add legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legendX = innerWidth - legendWidth - 10;
    const legendY = 10;

    const legendScale = d3
      .scaleLinear()
      .domain(d3.extent(values) as [number, number])
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale).ticks(5);

    const legend = g.append('g').attr('transform', `translate(${legendX},${legendY})`);

    // Create gradient for legend
    const gradientId = 'heatmap-gradient';
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%');

    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      const value = d3.interpolate(
        d3.min(values) || 0,
        d3.max(values) || 100
      )(i / numStops);
      gradient
        .append('stop')
        .attr('offset', `${(i / numStops) * 100}%`)
        .attr('stop-color', colorScale(value));
    }

    legend
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', `url(#${gradientId})`);

    legend
      .append('g')
      .attr('transform', `translate(0,${legendHeight})`)
      .call(legendAxis)
      .attr('color', 'currentColor')
      .attr('opacity', 0.7);
  }, [data, chartDimensions, cellSize, animated]);

  return (
    <div ref={containerRef} className={clsx('chart-container', className)}>
      <svg
        ref={svgRef}
        width={chartDimensions.width}
        height={chartDimensions.height}
        className="w-full h-full"
      >
        {/* SVG content rendered by D3 */}
      </svg>
    </div>
  );
}
