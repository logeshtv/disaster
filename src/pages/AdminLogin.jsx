import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function AdminLogin({ onLogin }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/auth`, { key });
      
      if (response.data.success) {
        localStorage.setItem('adminKey', key);
        onLogin();
      } else {
        setError(response.data.message || 'Invalid admin key');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="text-gray-600 mt-2">Enter admin key to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Enter admin key"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Hint: Default key is "admin123"
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
