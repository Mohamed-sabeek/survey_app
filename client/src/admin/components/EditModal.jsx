import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function EditModal({ responseData, onClose, onUpdateSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial Form State matching survey schemas
  // Arrays are joined by comma for simple text editing
  const [formData, setFormData] = useState({
    gender: responseData.gender || '',
    age: responseData.age || '',
    location: responseData.location || '',
    occupation: responseData.occupation || '',
    buyItems: (responseData.buyItems || []).join(', '),
    buyingProblems: (responseData.buyingProblems || []).join(', '),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Parse CSV inputs back into Arrays securely
    const payload = { ...responseData, ...formData };
    payload.buyItems = formData.buyItems.split(',').map(s => s.trim()).filter(Boolean);
    payload.buyingProblems = formData.buyingProblems.split(',').map(s => s.trim()).filter(Boolean);

    try {
      await api.put(`/admin/responses/${responseData._id}`, payload);
      onUpdateSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Edit Response</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto overflow-x-hidden relative flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-4" id="edit-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                 <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" />
              </div>
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                 <input type="text" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" />
              </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
               <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
               <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Buy Items <span className="text-gray-400 font-normal">(comma-separated)</span></label>
               <input type="text" name="buyItems" value={formData.buyItems} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Buying Problems <span className="text-gray-400 font-normal">(comma-separated)</span></label>
               <input type="text" name="buyingProblems" value={formData.buyingProblems} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-form" disabled={loading} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-sm flex items-center transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
