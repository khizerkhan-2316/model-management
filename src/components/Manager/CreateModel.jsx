// src/pages/CreateModel.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateModel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    addressLine1: '',
    addressLine2: '',
    zip: '',
    city: '',
    country: '',
    birthDate: '',
    nationality: '',
    height: '',
    shoeSize: '',
    hairColor: '',
    eyeColor: '',
    comments: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8080/api/Models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to create model');
      }

      navigate('/manager'); // Adjust as needed
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Tilbage
      </button>

      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Opret ny model</h2>
        {error && <p className="text-red-500">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { name: 'firstName', label: 'Fornavn' },
            { name: 'lastName', label: 'Efternavn' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phoneNo', label: 'Telefon' },
            { name: 'addressLine1', label: 'Adresse 1' },
            { name: 'addressLine2', label: 'Adresse 2' },
            { name: 'zip', label: 'Postnr.' },
            { name: 'city', label: 'By' },
            { name: 'country', label: 'Land' },
            { name: 'birthDate', label: 'Fødselsdato', type: 'date' },
            { name: 'nationality', label: 'Nationalitet' },
            { name: 'height', label: 'Højde (cm)' },
            { name: 'shoeSize', label: 'Skostørrelse' },
            { name: 'hairColor', label: 'Hårfarve' },
            { name: 'eyeColor', label: 'Øjenfarve' },
            { name: 'comments', label: 'Kommentarer' },
            { name: 'password', label: 'Adgangskode', type: 'password' },
          ].map(({ name, label, type = 'text' }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="text-sm font-medium mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required={name !== 'addressLine2' && name !== 'comments'}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Opret model
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateModel;
