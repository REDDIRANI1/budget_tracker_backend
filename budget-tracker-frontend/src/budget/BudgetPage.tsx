import { useEffect } from "react";
import * as d3 from "d3";

interface BudgetItem {
  category: string;
  limit: number;
  actual: number;
}

const BudgetPage = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/budget-summary/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch budgets");
        }
        return res.json();
      })
      .then((data) => {
        // If it's a single object, wrap it into an array with a dummy category
        const cleaned = [
          {
            category: "",
            limit: Number(data.limit) || 0,
            actual: Number(data.actual) || 0,
          },
        ];
        drawChart(cleaned);
      })
      
      .catch((err) => {
        console.error("Error fetching budget data:", err);
      });
  }, []);

  const drawChart = (data: BudgetItem[]) => {
    d3.select("#budget-chart").selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 70, left: 60 };

    const svg = d3
      .select("#budget-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => Math.max(d.limit, d.actual)) || 0,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "5px 10px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Chart Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")

    // Budget bars
    // Limit labels
svg
.append("g")
.selectAll("text.limit-label")
.data(data)
.enter()
.append("text")
.attr("class", "limit-label")
.attr("x", (d) => x(d.category)! + x.bandwidth() / 4)
.attr("y", height - margin.bottom + 15)
.attr("text-anchor", "middle")
.style("font-size", "10px")
.text("Budget per Month");

// Actual labels
svg
.append("g")
.selectAll("text.actual-label")
.data(data)
.enter()
.append("text")
.attr("class", "actual-label")
.attr("x", (d) => x(d.category)! + (3 * x.bandwidth()) / 4)
.attr("y", height - margin.bottom + 15)
.attr("text-anchor", "middle")
.style("font-size", "10px")
.text("Actual Expense");

    svg
      .append("g")
      .selectAll("rect.limit")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "limit")
      .attr("x", (d) => x(d.category)!)
      .attr("y", (d) => y(d.limit))
      .attr("width", x.bandwidth() / 2)
      .attr("height", (d) => height - margin.bottom - y(d.limit))
      .attr("fill", "#4CAF50")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Budget: ₹${d.limit}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Actual bars
    svg
      .append("g")
      .selectAll("rect.actual")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "actual")
      .attr("x", (d) => x(d.category)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.actual))
      .attr("width", x.bandwidth() / 2)
      .attr("height", (d) => height - margin.bottom - y(d.actual))
      .attr("fill", "#F44336")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Spent: ₹${d.actual}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    // Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Axis Labels
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - 20)
     

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
      <div id="budget-chart"></div>
    </div>
  );
};

export default BudgetPage;
