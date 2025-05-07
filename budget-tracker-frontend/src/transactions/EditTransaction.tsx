import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

const EditTransaction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.results)) {
          setCategories(data.results);
        } else {
          console.error("Expected categories to be an array, got:", data);
        }
      });

    fetch(`http://127.0.0.1:8000/api/expenses/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setAmount(data.amount.toString());
        setDescription(data.description);
        setDate(data.date);
        setCategory(data.category.toString());
      });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/expenses/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name,
        amount: parseFloat(amount),
        description,
        date,
        category: parseInt(category),
      }),
    }).then((res) => {
      if (res.ok) {
        alert("Transaction updated");
        navigate("/transactions/overview");
      } else {
        alert("Failed to update transaction");
      }
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f7f7f7',
      zIndex: 9999
    }}>
      <div style={{
        padding: '40px',
        borderRadius: '8px',
        background: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Transaction</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ marginBottom: '12px', padding: '10px' }}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ marginBottom: '12px', padding: '10px' }}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ marginBottom: '12px', padding: '10px' }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ marginBottom: '12px', padding: '10px' }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit" style={{ padding: '10px' }}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;
