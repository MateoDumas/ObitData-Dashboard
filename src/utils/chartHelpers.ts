import * as d3 from 'd3';

export interface ChartDimensions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

export const defaultChartDimensions: ChartDimensions = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 20, bottom: 40, left: 60 },
};

/**
 * Calculate inner dimensions (excluding margins)
 */
export function getInnerDimensions(dimensions: ChartDimensions) {
  return {
    width: dimensions.width - dimensions.margin.left - dimensions.margin.right,
    height: dimensions.height - dimensions.margin.top - dimensions.margin.bottom,
  };
}

/**
 * Create time scale
 */
export function createTimeScale(
  data: { x: number }[],
  innerWidth: number
): d3.ScaleTime<number, number> {
  if (data.length === 0) {
    return d3.scaleTime().domain([Date.now(), Date.now()]).range([0, innerWidth]);
  }

  const extent = d3.extent(data, (d) => d.x) as [number, number];
  return d3.scaleTime().domain(extent).range([0, innerWidth]);
}

/**
 * Create linear scale
 */
export function createLinearScale(
  data: { y: number }[],
  innerHeight: number,
  padding = 0.1
): d3.ScaleLinear<number, number> {
  if (data.length === 0) {
    return d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
  }

  const extent = d3.extent(data, (d) => d.y) as [number, number];
  const [min, max] = extent;
  const paddingAmount = (max - min) * padding;
  
  return d3
    .scaleLinear()
    .domain([min - paddingAmount, max + paddingAmount])
    .range([innerHeight, 0])
    .nice();
}

/**
 * Create line generator
 */
export function createLineGenerator(
  xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>
): d3.Line<{ x: number; y: number }> {
  return d3
    .line<{ x: number; y: number }>()
    .x((d) => xScale(d.x) as number)
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);
}

/**
 * Create area generator
 */
export function createAreaGenerator(
  xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  y0: number
): d3.Area<{ x: number; y: number }> {
  return d3
    .area<{ x: number; y: number }>()
    .x((d) => xScale(d.x) as number)
    .y0(y0)
    .y1((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);
}

/**
 * Format time axis
 */
export function formatTimeAxis(scale: d3.ScaleTime<number, number>): string {
  const domain = scale.domain();
  const range = domain[1].getTime() - domain[0].getTime();
  
  if (range < 60 * 60 * 1000) {
    // Less than 1 hour
    return d3.timeFormat('%H:%M:%S');
  } else if (range < 24 * 60 * 60 * 1000) {
    // Less than 1 day
    return d3.timeFormat('%H:%M');
  } else {
    // More than 1 day
    return d3.timeFormat('%d/%m %H:%M');
  }
}

/**
 * Animate path transition
 */
export function animatePath(
  path: d3.Selection<SVGPathElement, unknown, null, undefined>,
  duration = 750
): void {
  const totalLength = path.node()?.getTotalLength() || 0;
  
  path
    .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);
}
