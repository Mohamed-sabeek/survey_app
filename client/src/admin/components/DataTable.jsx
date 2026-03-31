import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../utils/api';
import EditModal from './EditModal';

export default function DataTable({ data, onRefresh }) {
  const [editingRow, setEditingRow] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      try {
        await api.delete(`/admin/responses/${id}`);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error(error);
        alert('Failed to delete response.');
      }
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500 font-medium">No survey data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Recent Submissions</h3>
        <span className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-xs">
          {data.length} Total
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-4 uppercase tracking-wider">Age</th>
              <th className="px-6 py-4 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 uppercase tracking-wider">Occupation</th>
              <th className="px-6 py-4 uppercase tracking-wider">Buy Items</th>
              <th className="px-6 py-4 uppercase tracking-wider">Buying Probs</th>
              <th className="px-6 py-4 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-green-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 capitalize">{row.gender || '-'}</td>
                <td className="px-6 py-4">{row.age || '-'}</td>
                <td className="px-6 py-4 capitalize text-gray-600">{row.location || '-'}</td>
                <td className="px-6 py-4 capitalize text-indigo-600">{row.occupation || '-'}</td>
                <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(row.buyItems || []).slice(0, 2).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs border border-blue-100">
                              {item.replace(/_/g, ' ')}
                          </span>
                      ))}
                      {(row.buyItems || []).length > 2 && <span className="text-xs text-gray-400">+{row.buyItems.length - 2}</span>}
                    </div>
                    {(!row.buyItems || row.buyItems.length === 0) && <span className="text-gray-400">-</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                      {(row.buyingProblems || []).slice(0, 2).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-md text-xs border border-red-100">
                              {item.replace(/_/g, ' ')}
                          </span>
                      ))}
                      {(row.buyingProblems || []).length > 2 && <span className="text-xs text-gray-400">+{row.buyingProblems.length - 2}</span>}
                  </div>
                  {(!row.buyingProblems || row.buyingProblems.length === 0) && <span className="text-gray-400">-</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => setEditingRow(row)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                      title="Edit Response"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(row._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Response"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <EditModal 
          responseData={editingRow}
          onClose={() => setEditingRow(null)}
          onUpdateSuccess={() => {
            setEditingRow(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}
