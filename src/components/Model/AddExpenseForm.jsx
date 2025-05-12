import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';

const AddExpenseForm = () => {
  // Access the user from AuthContext
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  // State for expense details
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(''); // For selected job

  // State for handling form submission status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // State for storing fetched jobs
  const [jobs, setJobs] = useState([]);

  // Fetch the jobs when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token'); // Replace 'token' with your actual token key

        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await fetch('http://localhost:8080/api/Jobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Attach token to Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const jobData = await response.json();
        setJobs(jobData); // Store the jobs in state
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs');
      }
    };

    fetchJobs();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('User is not logged in');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token'); // Replace 'token' with your actual token key

      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Prepare expense data
      const expenseData = {
        modelId: user.id, // Use the user ModelId from the context
        jobId: selectedJobId, // Use the selected job ID
        date: date,
        text: text,
        amount: parseFloat(amount),
      };

      // Send POST request to create a new expense using fetch with Authorization header
      const response = await fetch('http://localhost:8080/api/Expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token to Authorization header
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      // If successful, update state
      setSuccess(true);
      setDate('');
      setText('');
      setAmount('');
      setSelectedJobId(''); // Reset the selected job
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Tilbage
      </button>

      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Add Expense</h2>

        {/* Error and Success Messages */}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {success && (
          <div className="text-green-500 mb-4 text-center">
            Expense added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Dropdown */}
          <div>
            <label htmlFor="job" className="block text-lg font-medium">
              Select Job:
            </label>
            <select
              id="job"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">--Select a Job--</option>
              {jobs.map((job) => (
                <option
                  key={job.id}
                  value={job.jobId}
                  className="text-gray-800"
                >
                  {`${job.customer} -- ${job.location}`}
                </option>
              ))}
            </select>
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="date" className="block text-lg font-medium">
              Date:
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="text" className="block text-lg font-medium">
              Description:
            </label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-lg font-medium">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              {loading ? 'Submitting...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddExpenseForm;
