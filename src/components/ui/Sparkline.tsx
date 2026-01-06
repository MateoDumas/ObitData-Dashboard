import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartData } from '@/utils/dataParser';
import clsx from 'clsx';

export interface SparklineProps {
  data: ChartData;
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 30,
  color,
  showArea = false,
  className,
}: SparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 2, right: 2, bottom: 2, left: 2 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data.data, (d) => d.x) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data.data, (d) => d.y) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x) as number)
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    if (showArea) {
      const area = d3
        .area<{ x: number; y: number }>()
        .x((d) => xScale(d.x) as number)
        .y0(innerHeight)
        .y1((d) => yScale(d.y))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data.data)
        .attr('fill', color || data.color || '#0ea5e9')
        .attr('fill-opacity', 0.2)
        .attr('d', area);
    }

    g.append('path')
      .datum(data.data)
      .attr('fill', 'none')
      .attr('stroke', color || data.color || '#0ea5e9')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }, [data, width, height, color, showArea]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={clsx('sparkline', className)}
    />
  );
}
