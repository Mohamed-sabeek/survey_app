import { useState } from 'react';
import { Trash2, Eye, ClipboardList, Calendar, MapPin, User, Hash } from 'lucide-react';
import api from '../../api/axios';
import { questions } from '../../data/questions';

export default function DataTable({ data, onRefresh }) {
  const [viewingRow, setViewingRow] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('இந்தத் தகவலை நீக்க வேண்டுமா? (Are you sure you want to delete this response?)')) {
      try {
        await api.delete(`/admin/responses/${id}`);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error(error);
        alert('நீக்குவதில் தோல்வி. (Failed to delete response.)');
      }
    }
  };

  // ── Data Extraction Helper ──
  const getAnswer = (row, id) => {
    // 1. Check in the responses array (New Schema)
    const found = row.responses?.find(r => r.questionId === id);
    if (found && found.answer) {
      return Array.isArray(found.answer) ? found.answer.join(', ') : found.answer;
    }

    // 2. Check legacy fields (Old Schema mapping)
    const legacyMap = {
      'q_gender': row.q1,
      'q_age': row.q2,
      'q_area': row.q3,
      'q_occupation': row.q5
    };
    
    return legacyMap[id] || '-';
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-slate-100 text-center flex flex-col items-center gap-4">
        <ClipboardList className="mx-auto w-12 h-12 text-slate-200" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No responses found matching this category</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-20 animate-slideUp">
      <div className="px-10 py-7 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 w-2 h-8 rounded-full shadow-lg shadow-indigo-100"></div>
          <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Raw Submission Stream</h3>
        </div>
        <span className="bg-slate-900 text-white font-black px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase border border-slate-800 shadow-xl">
          {data.length} Logs Active
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-400 font-black border-b border-slate-100">
               <tr>
                 <th className="px-6 py-4 uppercase tracking-widest text-[9px]">Occupation</th>
                 <th className="px-6 py-4 uppercase tracking-widest text-[9px]"><div className="flex items-center gap-2"><User className="w-3 h-3" /> Gender</div></th>
                 <th className="px-6 py-4 uppercase tracking-widest text-[9px]"><div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Area</div></th>
                 <th className="px-6 py-4 uppercase tracking-widest text-[9px]"><div className="flex items-center gap-2"><Hash className="w-3 h-3" /> Age Range</div></th>
                 <th className="px-6 py-4 uppercase tracking-widest text-[9px]"><div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Date</div></th>
                 <th className="px-6 py-4 uppercase tracking-widest text-right text-[9px]">Manage</th>
               </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700">
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-indigo-50/20 transition-all group">
                {/* 1. Occupation */}
                <td className="px-6 py-4">
                   <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-black uppercase border border-indigo-100 shadow-sm">
                      {row.occupation || row.q5 || 'Other'}
                   </span>
                </td>
                
                {/* 2. Gender (q_gender) */}
                <td className="px-6 py-4">
                   <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase border border-slate-200">
                      {getAnswer(row, 'q_gender')}
                   </span>
                </td>

                {/* 3. Area (q_area) */}
                <td className="px-6 py-4 font-bold text-slate-500 max-w-[120px] truncate text-xs">
                   {getAnswer(row, 'q_area')}
                </td>

                {/* 4. Age Range (q_age) */}
                <td className="px-6 py-4">
                   <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase border border-slate-100 italic">
                      {getAnswer(row, 'q_age')}
                   </span>
                </td>

                {/* 5. Date (createdAt) */}
                <td className="px-6 py-4 text-[10px] font-bold text-slate-400">
                    {new Date(row.createdAt).toLocaleDateString()}
                </td>

                {/* 6. Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <button 
                      onClick={() => setViewingRow(row)}
                      className="text-slate-400 hover:text-indigo-600 transition-all p-2.5 bg-white rounded-lg hover:shadow-lg active:scale-90 border border-slate-100"
                      title="Inspect Log"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(row._id)}
                      className="text-rose-400 hover:text-rose-600 transition-all p-2.5 bg-white rounded-lg hover:shadow-lg active:scale-90 border border-slate-100"
                      title="Delete Log"
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

      {/* Row detail viewer (Premium Backdrop) */}
      {viewingRow && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-xl max-h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl animate-scaleIn flex flex-col border border-white/50">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Inspection Report</h3>
                  <p className="text-[9px] font-black text-indigo-500 tracking-[0.3em] mt-1.5 uppercase">ENTRY: {viewingRow._id.substring(0, 12)}...</p>
               </div>
               <button onClick={() => setViewingRow(null)} className="text-slate-300 hover:text-slate-900 text-3xl font-light transition-colors p-2">×</button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6 bg-slate-50/10">
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 pointer-events-none">Occupation</p>
                     <p className="text-base font-black text-indigo-600 uppercase leading-none">{viewingRow.occupation || viewingRow.q5 || 'Other'}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Logged</p>
                     <p className="text-base font-black text-slate-800 uppercase leading-none">{new Date(viewingRow.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>
               
               <div className="space-y-3">
                  {/* Detailed Log Section */}
                  {viewingRow.responses?.length > 0 ? (
                    viewingRow.responses.map((resp, i) => {
                      const q = questions.find(question => question.id === resp.questionId);
                      return (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                           <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                           
                           {/* Question Mapping */}
                           <div className="mb-4">
                              <p className="text-[9px] font-black text-slate-800 uppercase tracking-tighter leading-tight mb-1">{q?.question_ta || 'Unknown Question'}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">({q?.question_en || 'Question mapping unavailable'})</p>
                           </div>

                           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 shadow-inner">
                             {Array.isArray(resp.answer) ? (
                               <div className="flex flex-wrap gap-1.5">
                                  {resp.answer.map((a, j) => <span key={j} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase shadow-lg shadow-indigo-100">{a}</span>)}
                               </div>
                             ) : (
                               <p className="text-sm font-black text-slate-700 leading-tight uppercase tracking-tighter">{resp.answer}</p>
                             )}
                           </div>
                        </div>
                      );
                    })
                  ) : (
                    // Legacy Data Fallback List
                    Object.entries(viewingRow)
                      .filter(([key]) => key.startsWith('q') && !isNaN(key.slice(1)))
                      .map(([key, value], i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                           <div className="absolute left-0 top-0 w-1.5 h-full bg-slate-400"></div>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 truncate">ID: {key}</p>
                           <p className="text-lg font-black text-slate-600">{Array.isArray(value) ? value.join(', ') : value || '-'}</p>
                        </div>
                      ))
                  )}
               </div>
            </div>
             <div className="px-8 py-6 border-t border-slate-100 bg-white">
                <button onClick={() => setViewingRow(null)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-100">Return to Feed</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
