import { XCircle } from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';

export default function ChartModal({ isOpen, onClose, chartData, title, type }) {
  if (!isOpen) return null;

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { font: { weight: 'black', size: 12 }, padding: 30, usePointStyle: true } 
      },
      tooltip: { padding: 16, bodyFont: { size: 14, weight: 'bold' } }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { padding: 16 } },
    scales: { 
      y: { beginAtZero: true, ticks: { font: { weight: 'black', size: 12 } } },
      x: { ticks: { font: { weight: 'black', size: 11 } } }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto border border-white/20 animate-slideUp flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100"></div>
             <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{title}</h2>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1.5 leading-none">Category Insight Explorer</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all rounded-xl group"
          >
            <XCircle className="w-8 h-8 group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Chart Viewport */}
        <div className="min-h-[300px] sm:min-h-[400px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-100">
           <div className="w-full h-full min-h-[300px] sm:min-h-[400px]">
             {type === 'pie' ? (
               <Pie data={chartData} options={pieOptions} />
             ) : (
               <Bar data={chartData} options={barOptions} />
             )}
           </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex justify-center shrink-0">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Analytics Engine &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}
