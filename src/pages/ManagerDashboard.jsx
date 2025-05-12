// src/pages/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ManagerDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [models, setModels] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClick = () => {
    navigate('/manager/jobs/create');
  };

  const handleModelClick = () => {
    navigate('/manager/models/create');
  };

  const handleAddModel = async (jobId, modelId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `http://localhost:8080/api/Jobs/${jobId}/model/${modelId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ modelId }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to add model');
      }

      // Opdater jobs efter tilføjelse
      const updatedJob = await res.json();
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.jobId === jobId ? updatedJob : job))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveModel = async (jobId, modelId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `http://localhost:8080/api/Jobs/${jobId}/model/${modelId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to remove model');
      }

      // Opdater jobs efter fjernelse

      // Refetch all jobs or update state manually
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.jobId === jobId
            ? {
                ...job,
                models: job.models.filter((m) => m.modelId !== modelId),
              }
            : job
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchJobsAndModels = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const [jobsRes, modelsRes, managerRes] = await Promise.all([
          fetch('http://localhost:8080/api/Jobs', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('http://localhost:8080/api/Models', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),

          fetch('http://localhost:8080/api/Managers', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!jobsRes.ok || !modelsRes.ok || !managerRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [jobsData, modelsData, managersData] = await Promise.all([
          jobsRes.json(),
          modelsRes.json(),
          managerRes.json(),
        ]);

        setJobs(jobsData);
        setModels(modelsData);
        setManagers(managersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndModels();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Manager Dashboard</h1>

        <h2 className="text-xl mb-4">Jobs Overview</h2>

        <button
          onClick={handleClick}
          className="mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Opret nyt job
        </button>

        {jobs.length === 0 ? (
          <p>No jobs available</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Job ID</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">Days</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Models</th>
                <th className="px-4 py-2 border">
                  Tilføj og slet model til job
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.jobId}>
                  <td className="px-4 py-2 border">{job.jobId}</td>
                  <td className="px-4 py-2 border">{job.customer}</td>
                  <td className="px-4 py-2 border">
                    {new Date(job.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{job.days}</td>
                  <td className="px-4 py-2 border">{job.location}</td>
                  <td className="px-4 py-2 border">
                    {job.models.length > 0 ? (
                      job.models.map((model) => (
                        <div key={model.modelId}>
                          {model.firstName} {model.lastName}
                        </div>
                      ))
                    ) : (
                      <span>No models assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {job.models.length > 0 ? (
                      job.models.map((model) => (
                        <div
                          key={model.modelId}
                          className="flex items-center justify-between"
                        >
                          <span>
                            {model.firstName} {model.lastName}
                          </span>
                          <button
                            onClick={() =>
                              handleRemoveModel(job.jobId, model.modelId)
                            }
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            Fjern
                          </button>
                        </div>
                      ))
                    ) : (
                      <span>No models assigned</span>
                    )}
                    <div className="mt-2">
                      <select
                        onChange={(e) =>
                          handleAddModel(job.jobId, parseInt(e.target.value))
                        }
                        defaultValue=""
                        className="border p-1 rounded"
                      >
                        <option value="" disabled>
                          Tilføj model
                        </option>
                        {models
                          .filter(
                            (m) =>
                              !job.models.some((jm) => jm.modelId === m.modelId)
                          )
                          .map((model) => (
                            <option key={model.modelId} value={model.modelId}>
                              {model.firstName} {model.lastName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Manageroversigt</h2>
        <button
          onClick={() => navigate('/manager/managers/create')}
          className="mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Opret ny manager
        </button>

        {managers.length === 0 ? (
          <p>Ingen managers fundet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Navn</th>
                  <th className="px-4 py-2 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager) => (
                  <tr key={manager.managerId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">
                      {manager.firstName} {manager.lastName}
                    </td>
                    <td className="px-4 py-2 border">{manager.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Modeloversigt</h2>
        <button
          onClick={handleModelClick}
          className="mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Opret ny model
        </button>

        {models.length === 0 ? (
          <p>Ingen modeller fundet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Navn</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Telefon</th>
                  <th className="px-4 py-2 border">By</th>
                  <th className="px-4 py-2 border">Fødselsdato</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.modelId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">
                      {model.firstName} {model.lastName}
                    </td>
                    <td className="px-4 py-2 border">{model.email}</td>
                    <td className="px-4 py-2 border">{model.phoneNo}</td>
                    <td className="px-4 py-2 border">{model.city}</td>
                    <td className="px-4 py-2 border">
                      {new Date(model.birthDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default ManagerDashboard;
