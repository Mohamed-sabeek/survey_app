import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { questions } from '../../data/questions';

export default function EditModal({ responseData, onClose, onUpdateSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial Form State dynamically based on questions
  const [formData, setFormData] = useState(() => {
    const initial = {};
    questions.forEach(q => {
      const val = responseData[q.id];
      if (Array.isArray(val)) {
        initial[q.id] = val.join(', ');
      } else {
        initial[q.id] = val || '';
      }
    });
    return initial;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = { ...responseData, ...formData };
    
    // Convert comma-separated strings back to arrays for checkbox fields
    questions.forEach(q => {
      if (q.type === 'checkbox') {
        payload[q.id] = formData[q.id].split(',').map(s => s.trim()).filter(Boolean);
      }
    });

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Edit Response</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {responseData._id.slice(-8)}</p>
          </div>
          <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto relative flex-1 space-y-8 custom-scrollbar">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-2">
              <X className="w-4 h-4" /> {error}
            </div>
          )}
          
          <form className="space-y-6" id="edit-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((q) => (
                <div key={q.id} className={`${q.type === 'text' ? 'md:col-span-2' : ''}`}>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    {q.question_en}
                    {q.type === 'checkbox' && <span className="ml-2 text-blue-400 normal-case font-bold">(comma separated)</span>}
                  </label>
                  {q.type === 'text' ? (
                    <textarea
                      name={q.id}
                      value={formData[q.id]}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none transition-all resize-none text-gray-700 font-medium"
                    />
                  ) : (
                    <input
                      type="text"
                      name={q.id}
                      value={formData[q.id]}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none transition-all text-gray-700 font-medium"
                    />
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4 sticky bottom-0 backdrop-blur-sm">
          <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
            Cancel
          </button>
          <button type="submit" form="edit-form" disabled={loading} className="px-8 py-3 bg-gray-900 hover:bg-black text-white text-sm font-black rounded-2xl shadow-xl shadow-gray-200 flex items-center transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-3" />} Save Response
          </button>
        </div>
      </div>
    </div>
  );
}
