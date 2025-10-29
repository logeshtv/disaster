import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function VictimRequest() {
  const [formData, setFormData] = useState({
    victim_name: '',
    victim_phone: '',
    location_name: '',
    urgency: 'medium',
    notes: ''
  });
  const [items, setItems] = useState([{ name: '', quantity: '' }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ];

  const commonItems = [
    'Water Bottles', 'Food Packets', 'Blankets', 'Medical Supplies',
    'Tents', 'Clothing', 'Flashlights', 'Batteries', 'First Aid Kits'
  ];

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Convert items array to object
    const itemsObj = {};
    items.forEach(item => {
      if (item.name && item.quantity) {
        itemsObj[item.name] = parseInt(item.quantity);
      }
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/victim-requests`, {
        ...formData,
        requested_items: itemsObj
      });

      setResult(response.data);
      // Reset form
      setFormData({
        victim_name: '',
        victim_phone: '',
        location_name: '',
        urgency: 'medium',
        notes: ''
      });
      setItems([{ name: '', quantity: '' }]);
    } catch (err) {
      alert('Failed to submit request: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🆘</div>
        <h1 className="text-3xl font-bold text-gray-900">Request Help</h1>
        <p className="text-gray-600 mt-2">
          Let us know what you need and we'll match you with the nearest relief hub
        </p>
      </div>

      {result && result.success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-green-900 font-bold text-lg mb-2">
            ✅ Request Submitted Successfully!
          </h3>
          <p className="text-green-800 mb-4">
            We've received your request and are working to fulfill it.
          </p>
          
          {result.matched_hub && (
            <div className="bg-white rounded-lg p-4 border border-green-300">
              <p className="font-medium text-gray-900 mb-2">📍 Nearest Hub Matched:</p>
              <p className="text-lg font-bold text-green-700">{result.matched_hub.name}</p>
              <p className="text-gray-600">{result.matched_hub.location_name}</p>
              <p className="text-sm text-gray-500 mt-2">
                Distance: {result.matched_hub.distance_km} km | 
                Match Score: {result.matched_hub.match_score}%
              </p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Victim Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.victim_name}
                onChange={(e) => setFormData({ ...formData, victim_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.victim_phone}
                onChange={(e) => setFormData({ ...formData, victim_phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Location *
              </label>
              <input
                type="text"
                value={formData.location_name}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Tokyo, Japan or specific address"
                required
              />
            </div>
          </div>
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency Level *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {urgencyLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData({ ...formData, urgency: level.value })}
                className={`px-4 py-3 rounded-lg font-medium border-2 transition ${
                  formData.urgency === level.value
                    ? `${level.color} border-current`
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Needed */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Items Needed</h2>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Item name"
                    list="common-items"
                  />
                  <datalist id="common-items">
                    {commonItems.map((item, i) => (
                      <option key={i} value={item} />
                    ))}
                  </datalist>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Quantity"
                    min="1"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 px-3"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 text-red-600 hover:text-red-800 font-medium text-sm"
          >
            + Add Another Item
          </button>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Information
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            rows="3"
            placeholder="Special needs, medical conditions, or other important details..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Submitting...' : '🆘 Submit Request'}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>What happens next?</strong> Your request will be matched with the nearest relief hub and available donations. You'll be contacted once supplies are dispatched.
        </p>
      </div>
    </div>
  );
}
