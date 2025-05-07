import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/add-transaction">Add Transaction</Link>
      <Link to="/budget">Budget</Link>
      <Link to="/categories">Categories</Link>
      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}>Logout</button>
    </nav>
  );
};

export default Navbar;
