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
} from '@/utils/chartHelpers';
import { useResize } from '@/hooks/useResize';
import clsx from 'clsx';

export interface ComparisonChartProps {
  data1: ChartData[];
  data2: ChartData[];
  label1?: string;
  label2?: string;
  dimensions?: Partial<ChartDimensions>;
  className?: string;
}

export function ComparisonChart({
  data1,
  data2,
  label1 = 'Período 1',
  label2 = 'Período 2',
  dimensions = {},
  className,
}: ComparisonChartProps) {
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
    if (!svgRef.current || (data1.length === 0 && data2.length === 0)) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width: innerWidth, height: innerHeight } = getInnerDimensions(chartDimensions);
    const { margin } = chartDimensions;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Combine all data for scale calculation
    const allDataPoints = [
      ...data1.flatMap((s) => s.data),
      ...data2.flatMap((s) => s.data),
    ];

    if (allDataPoints.length === 0) return;

    // Create scales
    const xScale = createTimeScale(allDataPoints, innerWidth);
    const yScale = createLinearScale(allDataPoints, innerHeight);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(formatTimeAxis(xScale) as any);
    const yAxis = d3.axisLeft(yScale);

    // Add grid
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        xAxis
          .copy()
          .tickSize(-innerHeight)
          .tickFormat('' as any)
      )
      .attr('stroke-opacity', 0.1)
      .attr('stroke-dasharray', '3,3');

    g.append('g')
      .attr('class', 'grid')
      .call(
        yAxis
          .copy()
          .tickSize(-innerWidth)
          .tickFormat('' as any)
      )
      .attr('stroke-opacity', 0.1)
      .attr('stroke-dasharray', '3,3');

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

    // Create line generators
    const lineGenerator = createLineGenerator(xScale, yScale);
    const lineGeneratorDashed = createLineGenerator(xScale, yScale);

    // Draw period 1 (solid lines)
    data1.forEach((series) => {
      g.append('path')
        .datum(series.data)
        .attr('fill', 'none')
        .attr('stroke', series.color || '#0ea5e9')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
    });

    // Draw period 2 (dashed lines)
    data2.forEach((series) => {
      g.append('path')
        .datum(series.data)
        .attr('fill', 'none')
        .attr('stroke', series.color || '#10b981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.8)
        .attr('d', lineGeneratorDashed);
    });

    // Add legend
    const legend = g.append('g').attr('class', 'legend').attr('transform', 'translate(10, 10)');

    if (data1.length > 0) {
      legend
        .append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', data1[0]?.color || '#0ea5e9')
        .attr('stroke-width', 2);

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('fill', 'currentColor')
        .attr('font-size', '12px')
        .text(label1);
    }

    if (data2.length > 0) {
      legend
        .append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 15)
        .attr('y2', 15)
        .attr('stroke', data2[0]?.color || '#10b981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 15)
        .attr('dy', '0.35em')
        .attr('fill', 'currentColor')
        .attr('font-size', '12px')
        .text(label2);
    }
  }, [data1, data2, label1, label2, chartDimensions]);

  return (
    <div ref={containerRef} className={clsx('chart-container', className)}>
      <svg
        ref={svgRef}
        width={chartDimensions.width}
        height={chartDimensions.height}
        className="w-full h-full"
      />
    </div>
  );
}
