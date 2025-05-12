// src/pages/ModelDashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ModelDashboard() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext); // Corrected here

  const [jobs, setJobs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobsForModel = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Ingen adgangstoken fundet.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Kunne ikke hente jobs');
        }

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsForModel();
  }, []);

  // Fetch expenses for each job
  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Ingen adgangstoken fundet.');
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/api/Expenses/model/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        } else {
          throw new Error('Kunne ikke hente udgifter');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (jobs.length > 0) {
      fetchExpenses();
    }
  }, [jobs, user.id]); // Add user.id as dependency to avoid stale closures

  if (loading) return <div>Indlæser...</div>;
  if (error) return <div>Fejl: {error}</div>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/model/expenses/create')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tilføj udgift til job
      </button>
      <h1 className="text-2xl font-semibold mb-4">Mine Jobs</h1>

      {jobs.length === 0 ? (
        <p>Du har ingen jobs.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Job ID</th>
              <th className="px-4 py-2 border">Kunde</th>
              <th className="px-4 py-2 border">Startdato</th>
              <th className="px-4 py-2 border">Dage</th>
              <th className="px-4 py-2 border">Lokation</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.jobId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{job.jobId}</td>
                <td className="px-4 py-2 border">{job.customer}</td>
                <td className="px-4 py-2 border">
                  {new Date(job.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{job.days}</td>
                <td className="px-4 py-2 border">{job.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Expenses Table */}
      <h2 className="text-xl font-semibold mb-4">Udgifter</h2>
      {expenses.length === 0 ? (
        <p>Der er ingen udgifter.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Expense ID</th>
              <th className="px-4 py-2 border">Job ID</th>
              <th className="px-4 py-2 border">Dato</th>
              <th className="px-4 py-2 border">Beskrivelse</th>
              <th className="px-4 py-2 border">Beløb</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.expenseId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{expense.expenseId}</td>
                <td className="px-4 py-2 border">{expense.jobId}</td>
                <td className="px-4 py-2 border">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{expense.text}</td>
                <td className="px-4 py-2 border">{expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ModelDashboard;
