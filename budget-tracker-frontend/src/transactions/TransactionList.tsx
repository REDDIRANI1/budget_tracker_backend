import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: {
    id: number;
    name: string;
  };
}

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    category: searchParams.get("category") || "",
    amount: searchParams.get("amount") || "",
    date: searchParams.get("date") || "",
  }), [searchParams]);

  const fetchCategories = () => {
    fetch("http://127.0.0.1:8000/api/categories/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.results)) {
          setCategories(data.results);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  };

  const fetchTransactions = () => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.amount) params.append("amount", filters.amount);
    if (filters.date) params.append("date", filters.date);
    params.append("page", page.toString());

    fetch(`http://127.0.0.1:8000/api/expenses/?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.results || data);
        if (data.count && data.results) {
          const limit = data.results.length || 1;
          setTotalPages(Math.ceil(data.count / limit));
        }
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters, page]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    const res = await fetch(`http://127.0.0.1:8000/api/expenses/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      alert("Transaction deleted");
      fetchTransactions();
    } else {
      alert("Failed to delete transaction");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Transaction Overview</h2>

      {/* Filters */}
      <div className="max-w-md space-y-4 mb-6">
        <div>
          <label htmlFor="category" className="block font-medium mb-1">Filter by Category:</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-2 border rounded w-full"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block font-medium mb-1">Filter by Amount:</label>
          <input
            id="amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            value={filters.amount}
            onChange={handleFilterChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="date" className="block font-medium mb-1">Filter by Date:</label>
          <input
            id="date"
            name="date"
            type="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.map((txn) => (
          <div key={txn.id} className="border p-4 rounded shadow-sm">
            <p><strong>Date:</strong> {txn.date}</p>
            <p><strong>Amount:</strong> ₹{txn.amount}</p>
            <p><strong>Category:</strong> {txn.category?.name}</p>
            <p><strong>Description:</strong> {txn.description}</p>
            <div className="mt-2 space-x-4">
              <button
                onClick={() => navigate(`/transactions/edit/${txn.id}`)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(txn.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6 max-w-md">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionList;
