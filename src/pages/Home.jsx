import { useState } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';
import API_BASE_URL from '../config';

export default function Home() {
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    
    if (!tweet.trim()) {
      setError('Please enter a tweet');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict-location`, {
        tweet: tweet
      });

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.message || 'Could not detect location');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-700 bg-red-100',
      high: 'text-orange-700 bg-orange-100',
      medium: 'text-yellow-700 bg-yellow-100',
      low: 'text-green-700 bg-green-100'
    };
    return colors[severity] || colors.medium;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Disaster Location Detector
        </h1>
        <p className="text-lg text-gray-600">
          Enter a disaster-related tweet to detect the affected location and nearby relief hubs
        </p>
      </div>

      {/* Tweet Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handlePredict}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disaster Tweet
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows="4"
            placeholder="e.g., Earthquake hits Tokyo causing widespread damage"
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            disabled={loading}
          />
          
          <div className="mt-4 flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                '🔍 Detect Location'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setTweet('');
                setResult(null);
                setError(null);
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Example Tweets */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Earthquake hits Tokyo causing widespread damage',
              'Severe flooding in Mumbai after heavy monsoon rains',
              'Hurricane heading towards Florida coast',
              'Wildfire spreading rapidly in California'
            ].map((example, idx) => (
              <button
                key={idx}
                onClick={() => setTweet(example)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <span className="text-red-600 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Detection Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📍 Detection Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Detected Location</p>
                <p className="text-2xl font-bold text-blue-900">{result.detected_location}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {result.latitude.toFixed(4)}°, {result.longitude.toFixed(4)}°
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium mb-1">Disaster Type</p>
                <p className="text-2xl font-bold text-purple-900 capitalize">{result.disaster_type}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                  {result.severity.toUpperCase()} Severity
                </span>
              </div>
            </div>

            {/* Nearby Hubs Info */}
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                🏥 Nearby Relief Hubs
              </h3>
              <p className="text-green-700">
                <span className="font-bold text-2xl">{result.nearby_hubs.length}</span> relief hubs found within 100km
              </p>
              
              {result.nearby_hubs.length > 0 && (
                <div className="mt-3 space-y-2">
                  {result.nearby_hubs.slice(0, 3).map((hub, idx) => (
                    <div key={hub.id} className="flex items-center justify-between bg-white p-3 rounded-md">
                      <div>
                        <p className="font-medium text-gray-900">{hub.name}</p>
                        <p className="text-sm text-gray-600">{hub.location_name}</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {hub.distance_km} km away
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🗺️ Location Map
            </h2>
            <MapView
              center={[result.latitude, result.longitude]}
              zoom={10}
              markers={[
                {
                  position: [result.latitude, result.longitude],
                  popup: `${result.detected_location} - ${result.disaster_type}`,
                  type: 'disaster'
                },
                ...result.nearby_hubs.map(hub => ({
                  position: [hub.latitude, hub.longitude],
                  popup: `${hub.name} (${hub.distance_km} km)`,
                  type: 'hub'
                }))
              ]}
            />
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">💝</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Donate</h3>
            <p className="text-gray-600 text-sm mb-4">
              Help victims by donating supplies or funds
            </p>
            <a
              href="/donate"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Make a Donation
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">🆘</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Request supplies if you're affected by a disaster
            </p>
            <a
              href="/request-help"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Request Help
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Track Impact</h3>
            <p className="text-gray-600 text-sm mb-4">
              See how your donations are making a difference
            </p>
            <a
              href="/donor-dashboard"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              View Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
