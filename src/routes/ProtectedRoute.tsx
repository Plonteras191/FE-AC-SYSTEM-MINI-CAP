import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const authContext = useContext(AuthContext);
  
  // Handle case where context is undefined
  if (!authContext) {
    return <Navigate to="/admin/login" replace />;
  }
  
  const { isAuthenticated, loading } = authContext;

  if (loading) {
    // You could render a loading spinner here
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render children routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;