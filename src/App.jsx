import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './index.css'; // assuming this has @tailwind directives

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center gap-10 p-6">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="h-20 hover:scale-110 transition"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="h-20 hover:scale-110 transition"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
        Vite + React
      </h1>
      <div className="card text-center p-6 bg-gray-100 rounded-lg shadow-md">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-700">
          Edit <code className="bg-white px-1 py-0.5 rounded">src/App.jsx</code>{' '}
          and save to test HMR
        </p>
      </div>
      <p className="mt-6 text-center text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
