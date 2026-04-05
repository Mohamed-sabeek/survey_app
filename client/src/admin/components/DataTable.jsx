import { useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import api from '../../api/axios';
import EditModal from './EditModal';
import { questions } from '../../data/questions';

export default function DataTable({ data, onRefresh }) {
  const [editingRow, setEditingRow] = useState(null);
  const [viewingRow, setViewingRow] = useState(null);

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

  // Define which questions to show in the main table for overview
  const displayQuestions = questions.slice(0, 6); // Show first 6 questions

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
              {displayQuestions.map(q => (
                <th key={q.id} className="px-6 py-4 uppercase tracking-wider text-[10px]">
                  {q.question_en.split(' ').slice(0, 3).join(' ')}...
                </th>
              ))}
              <th className="px-6 py-4 uppercase tracking-wider text-right text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-green-50/50 transition-colors">
                {displayQuestions.map(q => {
                  const val = row[q.id];
                  return (
                    <td key={q.id} className="px-6 py-4 max-w-[150px] truncate">
                      {Array.isArray(val) ? (
                        <div className="flex flex-wrap gap-1">
                          {val.slice(0, 2).map((item, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] border border-blue-100">
                              {item}
                            </span>
                          ))}
                          {val.length > 2 && <span className="text-[10px] text-gray-400">+{val.length - 2}</span>}
                        </div>
                      ) : (
                        <span className="capitalize text-gray-600">{val || '-'}</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingRow(row)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 bg-gray-50 rounded-lg"
                      title="Edit Response"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(row._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1.5 bg-gray-50 rounded-lg"
                      title="Delete Response"
                    >
                      <Trash2 className="w-4 h-4" />
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
