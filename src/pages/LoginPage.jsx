// src/pages/LoginPage.js
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (jwt) => {
    login(jwt);
    const decoded = jwtDecode(jwt);

    const roleClaim =
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const userRole = decoded[roleClaim];

    if (userRole === 'Manager') {
      navigate('/manager');
    } else {
      navigate('/model');
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}
