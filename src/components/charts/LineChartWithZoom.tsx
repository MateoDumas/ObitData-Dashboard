import { useEffect, useRef, useState } from 'react';
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

export interface LineChartWithZoomProps {
  data: ChartData[];
  dimensions?: Partial<ChartDimensions>;
  showGrid?: boolean;
  showArea?: boolean;
  animated?: boolean;
  className?: string;
}

export function LineChartWithZoom({
  data,
  dimensions = {},
  showGrid = true,
  showArea = false,
  className,
}: LineChartWithZoomProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResize(containerRef);
  const [zoomState, setZoomState] = useState<{ x: [number, number] | null; y: [number, number] | null }>({
    x: null,
    y: null,
  });

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

    const allDataPoints = data.flatMap((series) => series.data);
    if (allDataPoints.length === 0) return;

    // Create base scales
    const xScaleBase = createTimeScale(allDataPoints, innerWidth);
    const yScaleBase = createLinearScale(allDataPoints, innerHeight);

    // Create zoomable scales
    let xScale = xScaleBase.copy();
    let yScale = yScaleBase.copy();

    // Apply zoom state if exists
    if (zoomState.x) {
      xScale.domain(zoomState.x.map((d) => new Date(d)));
    }
    if (zoomState.y) {
      yScale.domain(zoomState.y);
    }

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(formatTimeAxis(xScale) as any);
    const yAxis = d3.axisLeft(yScale);

    // Add grid
    if (showGrid) {
      const xGrid = d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat('' as any);
      const yGrid = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat('' as any);
      
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xGrid)
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '3,3');

      g.append('g')
        .attr('class', 'grid')
        .call(yGrid)
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '3,3');
    }

    // Add axes
    const xAxisG = g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', 'currentColor')
      .attr('opacity', 0.7);

    const yAxisG = g
      .append('g')
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

    // Draw areas
    if (showArea && areaGenerator) {
      data.forEach((series) => {
        g.append('path')
          .datum(series.data)
          .attr('fill', series.color || '#0ea5e9')
          .attr('fill-opacity', 0.2)
          .attr('d', areaGenerator);
      });
    }

    // Draw lines
    data.forEach((series) => {
      g.append('path')
        .datum(series.data)
        .attr('fill', 'none')
        .attr('stroke', series.color || '#0ea5e9')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
    });

    // Add dots
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

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 20])
      .extent([
        [margin.left, margin.top],
        [chartDimensions.width - margin.right, chartDimensions.height - margin.bottom],
      ])
      .on('zoom', (event) => {
        const transform = event.transform;
        const newXScale = transform.rescaleX(xScaleBase);
        const newYScale = transform.rescaleY(yScaleBase);

        xScale = newXScale;
        yScale = newYScale;

        // Update axes
        xAxisG.call(xAxis.scale(xScale));
        yAxisG.call(yAxis.scale(yScale));

        // Update grid
        if (showGrid) {
          svg.selectAll('.grid').remove();
          const xGrid = d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat('' as any);
          const yGrid = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat('' as any);
          
          g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(xGrid)
            .attr('stroke-opacity', 0.1)
            .attr('stroke-dasharray', '3,3');

          g.append('g')
            .attr('class', 'grid')
            .call(yGrid)
            .attr('stroke-opacity', 0.1)
            .attr('stroke-dasharray', '3,3');
        }

        // Update lines
        g.selectAll('path')
          .attr('d', (d: any) => {
            if (showArea && areaGenerator) {
              return areaGenerator(d as { x: number; y: number }[]);
            }
            return lineGenerator(d as { x: number; y: number }[]);
          });

        // Update dots
        g.selectAll('circle').attr('cx', (d: any) => {
          const point = (d as { x: number; y: number });
          return xScale(point.x) as number;
        });
      })
      .on('end', () => {
        setZoomState({
          x: xScale.domain().map((d) => (d as Date).getTime()) as [number, number],
          y: yScale.domain() as [number, number],
        });
      });

    svg.call(zoom as any);

    // Add reset button
    const resetButton = g
      .append('g')
      .attr('class', 'reset-zoom')
      .attr('transform', `translate(${innerWidth - 40}, 10)`)
      .style('cursor', 'pointer')
      .on('click', () => {
        svg.transition().duration(750).call(
          zoom.transform as any,
          d3.zoomIdentity
        );
        setZoomState({ x: null, y: null });
      });

    resetButton
      .append('rect')
      .attr('width', 30)
      .attr('height', 20)
      .attr('fill', 'white')
      .attr('stroke', 'currentColor')
      .attr('rx', 4);

    resetButton
      .append('text')
      .attr('x', 15)
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text('Reset');
  }, [data, chartDimensions, showGrid, showArea, zoomState]);

  return (
    <div ref={containerRef} className={clsx('chart-container', className)}>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Usa la rueda del mouse para hacer zoom, arrastra para mover
      </div>
      <svg
        ref={svgRef}
        width={chartDimensions.width}
        height={chartDimensions.height}
        className="w-full h-full"
      />
    </div>
  );
}
