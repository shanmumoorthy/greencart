import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [name, setName] = useState('');
  const [shiftHours, setShiftHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
    } catch (err) {
      setError('Failed to fetch drivers');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAdd = async () => {
    setError('');
    try {
      await api.post('/drivers', { name, currentShiftHours: Number(shiftHours) });
      setName('');
      setShiftHours('');
      fetchDrivers();
    } catch {
      setError('Failed to add driver');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/drivers/${id}`);
      fetchDrivers();
    } catch {
      setError('Failed to delete driver');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Drivers</h2>

      <div>
        <input
          placeholder="Driver Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Current Shift Hours"
          value={shiftHours}
          onChange={(e) => setShiftHours(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAdd}>Add Driver</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading drivers...</p>
      ) : (
        <ul>
          {drivers.map((d) => (
            <li key={d._id}>
              {d.name} — Shift Hours: {d.currentShiftHours}{' '}
              <button onClick={() => handleDelete(d._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
