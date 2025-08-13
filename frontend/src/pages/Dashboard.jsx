import React, { useEffect, useState } from 'react';
import api from '../api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    async function fetchKpi() {
      try {
        const res = await api.get('/simulation/latest');
        setKpi(res.data);
      } catch (error) {
        console.error('Failed to load KPIs:', error);
      }
    }
    fetchKpi();
  }, []);

  if (!kpi) return <div>Loading KPIs...</div>;

  const onTimeLateData = {
    labels: ['On Time', 'Late'],
    datasets: [
      {
        label: 'Deliveries',
        data: [kpi.onTimeDeliveries, kpi.totalDeliveries - kpi.onTimeDeliveries],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const fuelCostData = {
    labels: ['Base Cost', 'Traffic Surcharge'],
    datasets: [
      {
        label: 'Fuel Cost Breakdown',
        data: [kpi.baseFuelCost, kpi.trafficFuelSurcharge],
        backgroundColor: ['#2196f3', '#ff9800'],
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Total Profit: ₹{kpi.totalProfit}</p>
      <p>Efficiency Score: {kpi.efficiency.toFixed(2)}%</p>

      <div style={{ maxWidth: 600, marginBottom: 40 }}>
        <h3>On-Time vs Late Deliveries</h3>
        <Pie data={onTimeLateData} />
      </div>

      <div style={{ maxWidth: 600 }}>
        <h3>Fuel Cost Breakdown</h3>
        <Bar data={fuelCostData} options={{ indexAxis: 'y' }} />
      </div>
    </div>
  );
}
