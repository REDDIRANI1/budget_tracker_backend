import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './dashboard/Dashboard';
import AddTransaction from './transactions/AddTransaction';
import TransactionList from './transactions/TransactionList';
import BudgetPage from './budget/BudgetPage';
import CategoryPage from './categories/CategoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import EditTransaction from "./transactions/EditTransaction";


const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions/overview" element={<TransactionList />} />
      <Route path="/transactions/add" element={<AddTransaction />} />
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/transactions/edit/:id" element={<EditTransaction />} />
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
