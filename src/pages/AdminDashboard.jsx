import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { spotifyApi } from '../redux/services/spotifyApi';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalTracks: 0, totalAlbums: 0 });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin role
  const userRole = localStorage.getItem('userRole');
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/'); // Redirect to home if not admin
    }
  }, [userRole, navigate]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const tracksResponse = await spotifyApi.getTotalTracks();
        const albumsResponse = await spotifyApi.getTotalAlbums();

        if (tracksResponse.error || albumsResponse.error) {
          throw new Error('Failed to fetch statistics');
        }

        setStats({
          totalTracks: tracksResponse.data.totalTracks,
          totalAlbums: albumsResponse.data.totalAlbums,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userRole === 'admin') {
      fetchStats();
    }
  }, [userRole]);

  // Chart data
  const chartData = {
    labels: ['Tracks', 'Albums'],
    datasets: [
      {
        label: 'Count',
        data: [stats.totalTracks, stats.totalAlbums],
        backgroundColor: ['#1db954', '#191414'],
        borderColor: ['#1db954', '#191414'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#ffffff' },
      },
      title: {
        display: true,
        text: 'Music Statistics',
        color: '#ffffff',
        font: { size: 18 },
      },
    },
    scales: {
      x: { ticks: { color: '#ffffff' }, grid: { color: '#3f3f3f' } },
      y: {
        beginAtZero: true,
        ticks: { color: '#ffffff', stepSize: 1 },
        grid: { color: '#3f3f3f' },
      },
    },
  };

  if (isLoading) return <div className="text-white text-center p-6">Loading...</div>;
  if (error) return <div className="text-[#ef4444] text-center p-6">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#121212] rounded-lg shadow-lg text-white mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
      
      {/* Statistics Chart */}
      <div className="bg-[#181818] p-4 rounded-lg mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Statistics Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#242424] p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Tổng số bài hát</h2>
          <p className="text-3xl font-bold text-[#1db954]">{stats.totalTracks}</p>
        </div>
        <div className="bg-[#242424] p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Tổng số album</h2>
          <p className="text-3xl font-bold text-[#1db954]">{stats.totalAlbums}</p>
        </div>
      </div>

      {/* Create Track Button */}
      <div className="text-center">
        <button
          onClick={() => navigate('/admin/create-track')}
          className="px-6 py-3 bg-[#1db954] text-white rounded-lg hover:bg-[#1ed760] transition-colors"
        >
          Tạo Bài Hát Mới
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;