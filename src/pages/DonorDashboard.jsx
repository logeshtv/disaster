import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsRes, requestsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/donations`),
        axios.get(`${API_BASE_URL}/api/victim-requests`),
        axios.get(`${API_BASE_URL}/api/dashboard/stats`)
      ]);

      setDonations(donationsRes.data.donations || []);
      setRequests(requestsRes.data.requests || []);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      allocated: 'bg-blue-100 text-blue-800',
      fulfilled: 'bg-green-100 text-green-800',
      in_progress: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const allocatedCount = donations.filter(d => d.allocated_status === 'allocated').length;
  const fulfilledCount = donations.filter(d => d.allocated_status === 'fulfilled').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your donations and their impact</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-2">💝</div>
          <p className="text-gray-600 text-sm">Total Donations</p>
          <p className="text-3xl font-bold text-gray-900">{donations.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-2">💰</div>
          <p className="text-gray-600 text-sm">Amount Donated</p>
          <p className="text-3xl font-bold text-green-600">${totalDonated.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-2">📦</div>
          <p className="text-gray-600 text-sm">Allocated</p>
          <p className="text-3xl font-bold text-blue-600">{allocatedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-gray-600 text-sm">Fulfilled</p>
          <p className="text-3xl font-bold text-green-600">{fulfilledCount}</p>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Donations</h2>
        
        {donations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-600 mb-4">No donations yet</p>
            <a
              href="/donate"
              className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Make Your First Donation
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.slice(0, 10).map((donation) => (
              <div key={donation.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{donation.donor_name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.allocated_status)}`}>
                    {donation.allocated_status?.toUpperCase()}
                  </span>
                </div>
                
                {donation.amount > 0 && (
                  <p className="text-lg font-bold text-green-600 mb-2">
                    ${donation.amount.toFixed(2)}
                  </p>
                )}
                
                {donation.items && Object.keys(donation.items).length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(donation.items).map(([item, qty]) => (
                        <span key={item} className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {item}: {qty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {donation.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Note:</strong> {donation.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Help Requests</h2>
        
        {requests.filter(r => r.fulfilled_status === 'pending').length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-gray-600">All current requests have been fulfilled!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.filter(r => r.fulfilled_status === 'pending').slice(0, 5).map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{request.victim_name}</h3>
                    <p className="text-sm text-gray-600">{request.location_name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                    request.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.urgency?.toUpperCase()}
                  </span>
                </div>
                
                {request.requested_items && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Needs:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(request.requested_items).map(([item, qty]) => (
                        <span key={item} className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-800">
                          {item}: {qty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Impact Message */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You for Making a Difference! 🙏
        </h3>
        <p className="text-gray-700">
          Your donations have helped {fulfilledCount} people in need. 
          {requests.filter(r => r.fulfilled_status === 'pending').length > 0 && (
            <span> There are still {requests.filter(r => r.fulfilled_status === 'pending').length} pending requests that need your support.</span>
          )}
        </p>
      </div>
    </div>
  );
}
