import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartData } from '@/utils/dataParser';
import {
  ChartDimensions,
  defaultChartDimensions,
  getInnerDimensions,
  createTimeScale,
  createLinearScale,
} from '@/utils/chartHelpers';
import { useResize } from '@/hooks/useResize';
import clsx from 'clsx';

export interface BarChartProps {
  data: ChartData[];
  dimensions?: Partial<ChartDimensions>;
  showGrid?: boolean;
  animated?: boolean;
  className?: string;
}

export function BarChart({
  data,
  dimensions = {},
  showGrid = true,
  animated = true,
  className,
}: BarChartProps) {
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

    // Flatten all data points
    const allDataPoints = data.flatMap((series) => series.data);

    if (allDataPoints.length === 0) return;

    // Create scales
    const xScale = createTimeScale(allDataPoints, innerWidth);
    const yScale = createLinearScale(allDataPoints, innerHeight, 0);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M') as any);
    const yAxis = d3.axisLeft(yScale);

    // Add grid
    if (showGrid) {
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
          xAxis
            .tickSize(-innerHeight)
            .tickFormat('' as any)
        )
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '3,3');

      g.append('g')
        .attr('class', 'grid')
        .call(
          yAxis
            .tickSize(-innerWidth)
            .tickFormat('' as any)
        )
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '3,3');
    }

    // Add axes
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', 'currentColor')
      .attr('opacity', 0.7);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .attr('color', 'currentColor')
      .attr('opacity', 0.7);

    // Calculate bar width
    const barWidth = Math.max(2, innerWidth / allDataPoints.length / data.length - 2);

    // Draw bars
    data.forEach((series, seriesIndex) => {
      const bars = g
        .selectAll(`.bar-${seriesIndex}`)
        .data(series.data)
        .enter()
        .append('rect')
        .attr('class', `bar-${seriesIndex}`)
        .attr('x', (d) => (xScale(d.x) as number) + (barWidth * seriesIndex))
        .attr('y', innerHeight)
        .attr('width', barWidth)
        .attr('height', 0)
        .attr('fill', series.color || '#0ea5e9')
        .attr('opacity', 0.8);

      if (animated) {
        bars
          .transition()
          .duration(750)
          .ease(d3.easeCubicOut)
          .attr('y', (d) => yScale(d.y))
          .attr('height', (d) => innerHeight - yScale(d.y));
      } else {
        bars
          .attr('y', (d) => yScale(d.y))
          .attr('height', (d) => innerHeight - yScale(d.y));
      }
    });
  }, [data, chartDimensions, showGrid, animated]);

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
