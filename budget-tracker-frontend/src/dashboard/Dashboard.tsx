import { useEffect, useState } from "react";
import SummaryBarChart from "../components/SummaryBarChart";

interface Summary {
  income: number;
  expenses: number;
  balance: number;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/summary/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary({
          income: data.total_income,
          expenses: data.total_expenses,
          balance: data.balance,
        });
      })
      .catch((err) => console.error("Failed to fetch summary:", err));
  }, []);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="mb-4">
        <p><strong>Total Income:</strong> ₹{summary.income}</p>
        <p><strong>Total Expenses:</strong> ₹{summary.expenses}</p>
        <p><strong>Balance:</strong> ₹{summary.balance}</p>
      </div>
      <SummaryBarChart data={summary} />
    </div>
  );
};

export default Dashboard;
