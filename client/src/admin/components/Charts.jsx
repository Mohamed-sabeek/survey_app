import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Charts({ data }) {
  
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
    <div className="bg-slate-50 p-8 lg:p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center group transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-indigo-100 rounded-full blur-[80px] opacity-20"></div>
      
      <div className="w-full relative z-10">
        <h3 className="text-xl font-black text-slate-900 mb-8 w-full text-left tracking-tight flex items-center gap-2">
           <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-lg shadow-indigo-100"></div>
           Global Response Mix
        </h3>
        <div className="w-full h-80 flex items-center justify-center">
           {data.length > 0 ? (
             <Pie data={occPieData} options={pieOptions} />
           ) : (
             <div className="text-slate-300 font-bold uppercase tracking-widest text-xs">No enough data</div>
           )}
        </div>
      </div>
    </div>
  );
}
