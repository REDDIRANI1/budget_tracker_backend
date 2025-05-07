import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); // Ensure you store token as 'accessToken' after login
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
