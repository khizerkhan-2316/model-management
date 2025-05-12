import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function CreateJobForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer: '',
    startDate: '',
    days: '',
    location: '',
    comments: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8080/api/Jobs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert('Fejl ved oprettelse af job');
      } else {
        navigate('/manager');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        type="button"
        className="mb-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => navigate(-1)}
      >
        Tilbage
      </button>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
        <h2 className="text-lg font-semibold">Opret nyt job</h2>
        <input
          type="text"
          name="customer"
          placeholder="Kunde"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          type="datetime-local"
          name="startDate"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          type="number"
          name="days"
          placeholder="Antal dage"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          type="text"
          name="location"
          placeholder="Lokation"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <textarea
          name="comments"
          placeholder="Kommentarer"
          onChange={handleChange}
          className="w-full border p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Opret Job
        </button>
      </form>
    </>
  );
}

export default CreateJobForm;
