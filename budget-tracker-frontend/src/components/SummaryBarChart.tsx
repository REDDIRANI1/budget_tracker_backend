import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Summary {
  income: number;
  expenses: number;
  balance: number;
}

const SummaryBarChart = ({ data }: { data: Summary }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const chartData = [
      { label: "Income", value: Number(data.income) || 0 },
      { label: "Expenses", value: Number(data.expenses) || 0 },
      { label: "Balance", value: Number(data.balance) || 0 },
    ];

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const svg = d3
      .select(chartRef.current)
      .html("") // clear previous chart
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label)!)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.value))
      .attr("fill", "#5B8DEF");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <div ref={chartRef} />;
};

export default SummaryBarChart;
