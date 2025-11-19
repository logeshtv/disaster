import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function DonationForm() {
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
    notes: ''
  });
  const [items, setItems] = useState([{ name: '', quantity: '' }]);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const commonItems = [
    'Water Bottles', 'Food Packets', 'Blankets', 'Medical Supplies',
    'Tents', 'Clothing', 'Flashlights', 'Batteries', 'First Aid Kits',
    'Baby Formula', 'Diapers', 'Hygiene Kits', 'Water Purification Tablets',
    'Portable Stoves', 'Fuel', 'Generators', 'Solar Chargers', 'Mattresses',
    'Pillows', 'Cooking Utensils', 'Bottled Medicine', 'Masks', 'Gloves',
    'Disinfectants', 'School Supplies', 'Pet Food', 'Wheelchairs', 'Crutches',
    'Sanitary Pads'
  ];

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', customName: '', quantity: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert items array to object (handle 'Other' custom names)
    const itemsObj = {};
    items.forEach(item => {
      const name = item.name === 'Other' ? (item.customName || '').trim() : item.name;
      if (name && item.quantity) {
        itemsObj[name] = (itemsObj[name] || 0) + parseInt(item.quantity);
      }
    });

    try {
      // Include payment info if donor opted to show it
      const payload = {
        ...formData,
        items: itemsObj,
        amount: parseFloat(formData.amount) || 0
      };

      if (showPayment) {
        payload.payment_info = {
          type: 'bank',
          account_name: 'Disaster Relief Fund',
          account_number: '1234567890123456',
          ifsc: 'FAKE0001234',
          qr: 'https://example.com/pay/ABCDEF' // dummy QR link
        };
      }

      await axios.post(`${API_BASE_URL}/api/donations`, payload);

      setSuccess(true);
      // Reset form
      setFormData({ donor_name: '', donor_email: '', donor_phone: '', amount: '', notes: '' });
      setItems([{ name: '', customName: '', quantity: '' }]);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('Failed to submit donation: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">💝</div>
        <h1 className="text-3xl font-bold text-gray-900">Make a Donation</h1>
        <p className="text-gray-600 mt-2">
          Your contribution helps disaster victims get the supplies they need
        </p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ✅ Thank you! Your donation has been recorded successfully.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Donor Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Donor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.donor_name}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.donor_email}
                onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.donor_phone}
                onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monetary Donation ($)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Items to Donate */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Items to Donate</h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <select
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
                    >
                      <option value="">-- Select item --</option>
                      {commonItems.map((ci) => (
                        <option key={ci} value={ci}>{ci}</option>
                      ))}
                      <option value="Other">Other (type below)</option>
                    </select>

                    {item.name === 'Other' && (
                      <input
                        type="text"
                        value={item.customName || ''}
                        onChange={(e) => handleItemChange(index, 'customName', e.target.value)}
                        className="w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                        placeholder="Type item name (e.g., 'baby blankets')"
                      />
                    )}
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Qty"
                      min="1"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 px-3 mt-2"
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

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            rows="3"
            placeholder="Any special instructions or preferences..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Submitting...' : '💝 Submit Donation'}
        </button>
      </form>

      {/* Payment / Bank Details (optional) */}
      <div className="mt-6">
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" checked={showPayment} onChange={(e) => setShowPayment(e.target.checked)} />
          <span className="text-sm">Show bank / QR details for donation (optional)</span>
        </label>

        {showPayment && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium">Bank / Payment Details (dummy)</p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="text-sm font-medium">Disaster Relief Fund</p>
                <p className="text-xs text-gray-500 mt-2">Account Number</p>
                <p className="text-sm">1234 5678 9012 3456</p>
                <p className="text-xs text-gray-500 mt-2">IFSC</p>
                <p className="text-sm">FAKE0001234</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-36 h-36 bg-white border rounded-md flex items-center justify-center">
                  <div className="text-xs text-gray-500 text-center">QR Placeholder\nScan to pay</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Your donation will be matched with victims in need and allocated to the nearest relief hub. You can track your donation impact on the Donor Dashboard.
        </p>
      </div>
    </div>
  );
}
