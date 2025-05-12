// src/router/router.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import LoginPage from '../pages/LoginPage';
import ManagerDashboard from '../pages/ManagerDashboard';
import ModelDashboard from '../pages/ModelDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import ProtectedLayout from '../layouts/ProtectedLayout'; // Import the layout component
import CreateJobForm from '../components/Manager/CreateJobForm';
import CreateModel from '../components/Manager/CreateModel';
import CreateManager from '../components/Manager/CreateManager';
import AddExpenseForm from '../components/Model/AddExpenseForm';

function RootRedirect() {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // not logged in? send to /login
    return <Navigate to="/login" replace />;
  }

  // logged in → send to the correct dashboard
  return user.role === 'Manager' ? (
    <Navigate to="/manager" replace />
  ) : (
    <Navigate to="/model" replace />
  );
}

export default function Router() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<LoginPage />} />

      {/* ROOT: decide where to send the user */}
      <Route path="/" element={<RootRedirect />} />

      {/* PROTECTED */}
      <Route element={<ProtectedLayout />}>
        {' '}
        {/* Wrap protected routes in the layout */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="Manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/jobs/create"
          element={
            <ProtectedRoute role="Manager">
              <CreateJobForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/models/create"
          element={
            <ProtectedRoute role="Manager">
              <CreateModel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/managers/create"
          element={
            <ProtectedRoute role="Manager">
              <CreateManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/model"
          element={
            <ProtectedRoute role="Model">
              <ModelDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/model/expenses/create"
          element={
            <ProtectedRoute role={'Model'}>
              <AddExpenseForm />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* catch-all: redirect unknown URLs to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
