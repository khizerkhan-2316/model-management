// src/router/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // send unauthenticated users to /login
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // you can also send unauthorized roles to /login or to a custom page
    return <Navigate to="/login" replace />;
  }

  return children;
}
