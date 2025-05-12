// src/layouts/ProtectedLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar'; // Import Navbar
import { Outlet } from 'react-router-dom'; // Outlet is used to render child routes

export default function ProtectedLayout() {
  return (
    <div>
      <Navbar /> {/* The Navbar will appear on all protected routes */}
      <div className="p-6">
        <Outlet />{' '}
        {/* This will render the actual content of the protected route */}
      </div>
    </div>
  );
}
