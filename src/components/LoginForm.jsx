import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8080/api/Account/login';

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const token = await res.text(); // Plain string
        localStorage.setItem('token', token);
        onLogin(token); // pass it up
      } else {
        alert('Login failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full mb-3 p-2 border rounded"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full mb-3 p-2 border rounded"
        onChange={handleChange}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}
