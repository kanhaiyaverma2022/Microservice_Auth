import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [tenantId, setTenantId] = useState('');
  const [empId, setEmpId] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:4000/login', { tenantId, empId }, {
        withCredentials: true // This ensures cookies are sent and received
      });
      setError(null);
      alert('Login successful! Now go to the Dashboard frontend.');
      window.location.href = 'http://localhost:5173/';
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="Login">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Tenant ID"
        value={tenantId}
        onChange={(e) => setTenantId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Employee ID"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
