import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartData } from '@/utils/dataParser';
import {
  ChartDimensions,
  defaultChartDimensions,
  getInnerDimensions,
  createTimeScale,
  createLinearScale,
  createLineGenerator,
  formatTimeAxis,
  animatePath,
} from '@/utils/chartHelpers';
import { useResize } from '@/hooks/useResize';
import clsx from 'clsx';

export interface LineChartProps {
  data: ChartData[];
  dimensions?: Partial<ChartDimensions>;
  showGrid?: boolean;
  showArea?: boolean;
  animated?: boolean;
  className?: string;
}

export function LineChart({
  data,
  dimensions = {},
  showGrid = true,
  showArea = false,
  animated = true,
  className,
}: LineChartProps) {
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

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Flatten all data points for scales
    const allDataPoints = data.flatMap((series) => series.data);

    if (allDataPoints.length === 0) return;

    // Create scales
    const xScale = createTimeScale(allDataPoints, innerWidth);
    const yScale = createLinearScale(allDataPoints, innerHeight);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(formatTimeAxis(xScale) as any);
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

    // Create line/area generators
    const lineGenerator = createLineGenerator(xScale, yScale);
    const areaGenerator = showArea
      ? d3
          .area<{ x: number; y: number }>()
          .x((d) => xScale(d.x) as number)
          .y0(innerHeight)
          .y1((d) => yScale(d.y))
          .curve(d3.curveMonotoneX)
      : null;

    // Draw areas first (if enabled)
    if (showArea && areaGenerator) {
      data.forEach((series) => {
        const area = g
          .append('path')
          .datum(series.data)
          .attr('fill', series.color || '#0ea5e9')
          .attr('fill-opacity', 0.2)
          .attr('d', areaGenerator);

        if (animated) {
          animatePath(area as any, 750);
        }
      });
    }

    // Draw lines
    data.forEach((series) => {
      const line = g
        .append('path')
        .datum(series.data as any)
        .attr('fill', 'none')
        .attr('stroke', series.color || '#0ea5e9')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator as any);

      if (animated) {
        animatePath(line as any, 750);
      }
    });

    // Add dots for latest points
    data.forEach((series) => {
      if (series.data.length > 0) {
        const lastPoint = series.data[series.data.length - 1];
        g.append('circle')
          .attr('cx', xScale(lastPoint.x) as number)
          .attr('cy', yScale(lastPoint.y))
          .attr('r', 4)
          .attr('fill', series.color || '#0ea5e9')
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
      }
    });
  }, [data, chartDimensions, showGrid, showArea, animated]);

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
