import React, { createContext, useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      console.log('Token Decoded:', decoded); // Log decoded token for debugging
      return decoded.exp && decoded.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error); // Log decoding error
      return false;
    }
  };

  const login = (token) => {
    console.log('Logging in with token:', token); // Log the token for debugging
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);

    const email =
      decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ];
    const role =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    const id = decoded.ModelId;

    setUser({ email, role, id });

    if (role === 'Manager') {
      navigate('/manager', { replace: true });
    } else {
      navigate('/model', { replace: true });
    }
  };

  const logout = () => {
    console.log('Logging out'); // Log when logging out
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      console.log('Token is valid, logging in...');
      login(token);
    } else {
      console.log('Token invalid or expired, logging out...');
      logout(); // Clear invalid token
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
