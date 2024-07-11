import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface ViolinChartProps {
  data: { names: string[]; ratings: number[][] };
}

const ViolinChart: React.FC<ViolinChartProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 400;
    const height = 500;
    const margin = { top: 20, right: 150, bottom: 30, left: 100 };

    svg.attr('width', width).attr('height', height);

    // Calculate average and variance
    const averages = data.ratings.map(d => d3.mean(d) ?? 0);
    const variances = data.ratings.map(d => d3.variance(d) ?? 0);

    const y = d3.scaleBand()
      .domain(data.names)
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const x = d3.scaleLinear()
      .domain([0, 10])
      .nice()
      .range([margin.left, width - margin.right]);

    svg.append("g")
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const kde = (kernel: any, thresholds: number[], data: number[]) => {
      return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    };

    const epanechnikov = (bandwidth: number) => {
      return (x: number) => Math.abs(x / bandwidth) <= 1 ? 0.75 * (1 - (x / bandwidth) ** 2) / bandwidth : 0;
    };

    const density = data.ratings.map(d => kde(epanechnikov(0.5), x.ticks(40), d));

    const maxDensity = d3.max(density.flatMap(d => d.map(([_, value]) => value)))!;

    const yNum = d3.scaleLinear()
      .domain([-maxDensity, maxDensity])
      .range([0, y.bandwidth()]);

    svg.append("g")
      .selectAll("g")
      .data(density)
      .join("g")
      .attr("transform", (d, i) => `translate(0,${y(data.names[i])})`)
      .append("path")
      .datum(d => d)
      .attr("fill", "#69b3a2")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("d", d3.line<any>()
        .curve(d3.curveCatmullRom)
        .x(d => x(d[0]))
        .y(d => yNum(d[1]))
      );

    // Add average and variance columns
    svg.append("g")
      .selectAll("text")
      .data(data.names)
      .join("text")
      .attr("x", width - margin.right + 5)
      .attr("y", (d, i) => y(d)! + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .text((d, i) => `Avg: ${averages[i]!.toFixed(2)} Var: ${variances[i]!.toFixed(2)}`);

  }, [data]);

  return <svg ref={ref}></svg>;
};

export default ViolinChart;

