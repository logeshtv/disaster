import { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';
import API_BASE_URL from '../config';

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [hubs, setHubs] = useState([]);
  const [showAddHub, setShowAddHub] = useState(false);
  const [newHub, setNewHub] = useState({
    name: '',
    location_name: '',
    contact: '',
    inventory: {}
  });
  const [loading, setLoading] = useState(false);

  const adminKey = localStorage.getItem('adminKey') || 'admin123';

  useEffect(() => {
    fetchStats();
    fetchHubs();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/stats`);
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchHubs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/hubs`);
      setHubs(response.data.hubs);
    } catch (err) {
      console.error('Failed to fetch hubs:', err);
    }
  };

  const handleAddHub = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/hubs`,
        newHub,
        { headers: { 'X-Admin-Key': adminKey } }
      );
      
      alert('Hub added successfully!');
      setShowAddHub(false);
      setNewHub({ name: '', location_name: '', contact: '', inventory: {} });
      fetchHubs();
    } catch (err) {
      alert('Failed to add hub: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHub = async (hubId) => {
    if (!confirm('Are you sure you want to delete this hub?')) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/hubs/${hubId}`,
        { headers: { 'X-Admin-Key': adminKey } }
      );
      
      alert('Hub deleted successfully!');
      fetchHubs();
    } catch (err) {
      alert('Failed to delete hub: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage relief operations and hubs</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('adminKey');
            onLogout();
          }}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🏥</div>
            <p className="text-gray-600 text-sm">Total Hubs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_hubs}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">💝</div>
            <p className="text-gray-600 text-sm">Donations</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_donations}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🆘</div>
            <p className="text-gray-600 text-sm">Requests</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_requests}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🚨</div>
            <p className="text-gray-600 text-sm">Events</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_events}</p>
          </div>
        </div>
      )}

      {/* Hub Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Relief Hubs</h2>
          <button
            onClick={() => setShowAddHub(!showAddHub)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {showAddHub ? 'Cancel' : '+ Add Hub'}
          </button>
        </div>

        {/* Add Hub Form */}
        {showAddHub && (
          <form onSubmit={handleAddHub} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hub Name *
                </label>
                <input
                  type="text"
                  value={newHub.name}
                  onChange={(e) => setNewHub({ ...newHub, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={newHub.location_name}
                  onChange={(e) => setNewHub({ ...newHub, location_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Tokyo, Japan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={newHub.contact}
                  onChange={(e) => setNewHub({ ...newHub, contact: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Phone or email"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Hub'}
            </button>
          </form>
        )}

        {/* Hubs List */}
        <div className="space-y-4">
          {hubs.map((hub) => (
            <div key={hub.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{hub.name}</h3>
                  <p className="text-gray-600">{hub.location_name}</p>
                  {hub.contact && (
                    <p className="text-sm text-gray-500 mt-1">📞 {hub.contact}</p>
                  )}
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Coordinates:</p>
                    <p className="text-sm text-gray-700">
                      {hub.latitude?.toFixed(4)}, {hub.longitude?.toFixed(4)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteHub(hub.id)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map of All Hubs */}
      {hubs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hubs Map</h2>
          <MapView
            center={[hubs[0].latitude, hubs[0].longitude]}
            zoom={6}
            markers={hubs.map(hub => ({
              position: [hub.latitude, hub.longitude],
              popup: `${hub.name} - ${hub.location_name}`,
              type: 'hub'
            }))}
          />
        </div>
      )}
    </div>
  );
}
