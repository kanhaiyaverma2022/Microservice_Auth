import React, { useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const getDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard', {
        withCredentials: true // Ensure the cookie (authToken) is sent
      });
      setDashboardData(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data. Unauthorized.');
    }
  };

  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>
      <button onClick={getDashboardData}>Get Dashboard Data</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {dashboardData && <p>{dashboardData}</p>}
    </div>
  );
}

export default Dashboard;

