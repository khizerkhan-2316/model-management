import { useState } from 'react';

function JobDetails({ job, allModels, onAddModel, onRemoveModel }) {
  const [selectedModelId, setSelectedModelId] = useState('');

  return (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">
        Job #{job.jobId} – {job.customer}
      </h2>
      <p>Location: {job.location}</p>
      <p>Start: {new Date(job.startDate).toLocaleString()}</p>
      <p>Days: {job.days}</p>
      <p className="mt-2 font-semibold">Modeller:</p>
      <ul className="list-disc list-inside">
        {job.models.map((model) => (
          <li key={model.modelId} className="flex justify-between">
            <span>
              {model.firstName} {model.lastName} ({model.email})
            </span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onRemoveModel(job.jobId, model.modelId)}
            >
              Fjern
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <select
          value={selectedModelId}
          onChange={(e) => setSelectedModelId(e.target.value)}
          className="border p-1 mr-2 rounded"
        >
          <option value="">Vælg model</option>
          {allModels
            .filter((m) => !job.models.some((jm) => jm.modelId === m.modelId))
            .map((model) => (
              <option key={model.modelId} value={model.modelId}>
                {model.firstName} {model.lastName}
              </option>
            ))}
        </select>
        <button
          onClick={() => {
            if (selectedModelId) {
              onAddModel(job.jobId, parseInt(selectedModelId));
              setSelectedModelId('');
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
        >
          Tilføj model
        </button>
      </div>
    </div>
  );
}

export default JobDetails;
