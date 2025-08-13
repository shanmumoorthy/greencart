import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Simulation from './pages/Simulation';
import Dashboard from './pages/Dashboard';
import { setAuthToken } from './services/api';

function App() {
  const [tokenPresent, setTokenPresent] = useState(!!localStorage.getItem('token'));
  const [simResults, setSimResults] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) setAuthToken(token);
  }, []);

  if(!tokenPresent) return <Login onLogin={() => setTokenPresent(true)} />;

  return (
    <div style={{padding:20}}>
      <button onClick={() => { localStorage.removeItem('token'); setAuthToken(null); setTokenPresent(false); }}>Logout</button>
      <Simulation onResult={(r)=>setSimResults(r)} />
      <hr />
      <Dashboard simResults={simResults} />
    </div>
  );
}

export default App;
