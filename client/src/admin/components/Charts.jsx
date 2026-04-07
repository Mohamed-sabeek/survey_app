import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Charts({ data, onSelectCategory, onViewFull }) {
  
  // ── Occupation Distribution (Always Global) ──
  const occCounts = useMemo(() => {
    return data.reduce((acc, curr) => {
      const rawOcc = curr.occupation || curr.q5 || 'uncategorized';
      const occ = rawOcc.toLowerCase();
      acc[occ] = (acc[occ] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  const occPieData = {
    labels: Object.keys(occCounts).map(o => o.toUpperCase()),
    datasets: [
      {
        data: Object.values(occCounts),
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const rawLabel = chart.data.labels[index];
        if (rawLabel) {
          onSelectCategory(rawLabel.toLowerCase());
          // Open Modal with Full View
          onViewFull({
            title: 'Global Response Analysis',
            data: occPieData
          });
        }
      }
    },
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          font: { weight: 'black', size: 9 }, 
          padding: 20, 
          usePointStyle: true, 
          boxWidth: 6, 
          boxHeight: 6 
        } 
      },
      tooltip: { 
        padding: 12, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        titleColor: '#000', 
        bodyColor: '#6366F1', 
        bodyFont: { weight: 'bold' }, 
        borderColor: '#E2E8F0', 
        borderWidth: 1 
      }
    }
  };

  return (
    <div className="bg-slate-50 p-5 lg:p-6 rounded-3xl border border-slate-100 flex flex-col items-center group transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-indigo-100 rounded-full blur-[60px] opacity-20"></div>
      
      <div className="w-full relative z-10">
        <div className="flex items-center justify-between mb-6 overflow-hidden">
           <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-100"></div>
              Global Response Mix
           </h3>
           <button 
             onClick={() => onViewFull({ title: 'Global Response Analysis', data: occPieData })}
             className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
           >
              View Full
           </button>
        </div>
        <div className="w-full h-64 flex items-center justify-center cursor-pointer">
           {data.length > 0 ? (
             <Pie data={occPieData} options={pieOptions} />
           ) : (
             <div className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Insufficient Data</div>
           )}
        </div>
      </div>
    </div>
  );
}
