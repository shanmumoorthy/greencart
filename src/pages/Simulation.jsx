import React, { useState } from 'react';
import api from '../api';

export default function Simulation() {
  const [inputs, setInputs] = useState({
    availableDrivers: '',
    routeStartTime: '',
    maxHoursPerDriver: '',
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);
    try {
      const res = await api.post('/simulation/run', {
        numberOfDrivers: parseInt(inputs.availableDrivers, 10),
        routeStartTime: inputs.routeStartTime,
        maxHoursPerDriver: parseInt(inputs.maxHoursPerDriver, 10),
      });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Simulation failed');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', paddingTop: 40 }}>
      <h2>Run Delivery Simulation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Number of Available Drivers:
          <input
            type="number"
            name="availableDrivers"
            value={inputs.availableDrivers}
            onChange={handleChange}
            required
            min={1}
          />
        </label>
        <br />
        <label>
          Route Start Time (HH:MM):
          <input
            type="time"
            name="routeStartTime"
            value={inputs.routeStartTime}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Max Hours per Driver per Day:
          <input
            type="number"
            name="maxHoursPerDriver"
            value={inputs.maxHoursPerDriver}
            onChange={handleChange}
            required
            min={1}
            max={24}
          />
        </label>
        <br />
        <button type="submit">Run Simulation</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results && (
        <div style={{ marginTop: 20 }}>
          <h3>Simulation Results:</h3>
          <p>Total Profit: ₹{results.totalProfit}</p>
          <p>Efficiency Score: {results.efficiency.toFixed(2)}%</p>
          <p>On-time Deliveries: {results.onTimeDeliveries}</p>
          <p>Total Deliveries: {results.totalDeliveries}</p>
        </div>
      )}
    </div>
  );
}
