import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function InsightsSection({ data, selectedOccupation }) {
  
  if (selectedOccupation === 'all') {
    return (
      <div className="bg-slate-50 p-8 lg:p-12 rounded-[3.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100">
           <Lightbulb className="w-10 h-10 text-amber-500 animate-pulse" />
        </div>
        <div>
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Deep Category Insights</h3>
           <p className="text-sm font-bold text-slate-400 mt-1 max-w-xs mx-auto">Select a specific occupation filter (e.g. Farming) to unlock detailed trend analysis and challenges.</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-[3rem] text-center">
        <AlertTriangle className="w-10 h-10 text-slate-300 mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">No data collected yet for this category</p>
      </div>
    );
  }

  // ── Calculation Logic (Memoized) ──
  const analytics = useMemo(() => {
    const getCountsMap = (id) => {
      const counts = {};
      data.forEach(row => {
        const resp = row.responses?.find(r => r.questionId === id);
        if (!resp || !resp.answer) return;
        const val = resp.answer;
        if (Array.isArray(val)) {
          val.forEach(v => { if(v) counts[v] = (counts[v] || 0) + 1; });
        } else {
          counts[val] = (counts[val] || 0) + 1;
        }
      });
      return counts;
    };

    const formatChartData = (counts, color = '#6366F1') => {
      const labels = Object.keys(counts).map(l => l.replace(/_/g, ' ').toUpperCase());
      return {
        labels,
        datasets: [{
          data: Object.values(counts),
          backgroundColor: color,
          borderRadius: 8,
          barThickness: 20,
        }]
      };
    };

    // ── Pre-process Charts based on Occupation ──
    const branchConfig = {
      farming: [
        { id: 'q_farm_5', title: 'Major Farmer Challenges', color: '#10B981' },
        { id: 'q_farm_3', title: 'Irrigation Issues', color: '#3B82F6' },
        { id: 'q_farm_6', title: 'Gov Subsidy Access', color: '#F59E0B' },
        { id: 'q_farm_9', title: 'Market Sales Type', color: '#8B5CF6' }
      ],
      labour: [
        { id: 'q_lab_5', title: 'Work-Related Problems', color: '#F59E0B' },
        { id: 'q_lab_3', title: 'Job Regularity', color: '#10B981' },
        { id: 'q_lab_6', title: 'Safety Gear Access', color: '#EF4444' },
        { id: 'q_lab_9', title: 'Interest in Training', color: '#6366F1' }
      ],
      business: [
        { id: 'q_biz_4', title: 'Top Challenges', color: '#3B82F6' },
        { id: 'q_biz_3', title: 'Income Distribution', color: '#10B981' },
        { id: 'q_biz_5', title: 'Digital Usage', color: '#8B5CF6' },
        { id: 'q_biz_8', title: 'Business Growth', color: '#06B6D4' }
      ],
      student: [
        { id: 'q_stu_4', title: 'Education Challenges', color: '#8B5CF6' },
        { id: 'q_stu_3', title: 'Education Satisfaction', color: '#10B981' },
        { id: 'q_stu_5', title: 'Digital Access', color: '#6366F1' },
        { id: 'q_stu_9', title: 'Stress Level', color: '#EF4444' }
      ],
      homemaker: [
        { id: 'q_home_5', title: 'Household Problems', color: '#EF4444' },
        { id: 'q_home_3', title: 'Water Availability', color: '#3B82F6' },
        { id: 'q_home_6', title: 'Healthcare Access', color: '#10B981' },
        { id: 'q_home_9', title: 'Safety', color: '#F43F5E' }
      ]
    };

    return branchConfig[selectedOccupation]?.map(cfg => ({
      ...cfg,
      chartData: formatChartData(getCountsMap(cfg.id), cfg.color)
    })) || [];

  }, [data, selectedOccupation]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { cornerRadius: 8, padding: 12 } },
    scales: { 
      y: { beginAtZero: true, grid: { display: false }, ticks: { font: { weight: 'black', size: 10 } } },
      x: { grid: { display: false }, ticks: { font: { weight: 'black', size: 9 } } }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
       {analytics.map((chart, i) => (
         <div key={i} className="bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 hover:border-slate-200 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                 <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: chart.chartData.datasets[0].backgroundColor }}></span>
                 {chart.title}
              </h4>
              <div className="bg-white p-2 rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
                 <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
            
            <div className="w-full h-48">
               {Object.keys(chart.chartData.labels).length > 0 ? (
                 <Bar data={chart.chartData} options={barOptions} />
               ) : (
                 <div className="h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-[9px] border-2 border-dashed border-slate-200 rounded-3xl">No Data Feed</div>
               )}
            </div>
         </div>
       ))}
    </div>
  );
}
