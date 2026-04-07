import { useEffect, useState, useMemo, useRef } from 'react';
import { LogOut, Loader2, RefreshCw, LayoutDashboard, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StatsCards from '../components/StatsCards';
import DataTable from '../components/DataTable';
import Charts from '../components/Charts';
import InsightsSection from '../components/InsightsSection';
import ChartModal from '../components/ChartModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOccupation, setSelectedOccupation] = useState('all');
  const [activeChart, setActiveChart] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/responses');
      console.log('SURVEY_RESPONSES:', response.data);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch survey responses. (தகவல்களைப் பெற முடியவில்லை)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login', { replace: true });
  };

  // ── Memoized Filtering Logic ──
  const filteredData = useMemo(() => {
    if (selectedOccupation === 'all') return data;
    return data.filter(d => d.occupation === selectedOccupation);
  }, [data, selectedOccupation]);

  const occupations = ['farming', 'labour', 'business', 'student', 'homemaker'];
  const submissionsRef = useRef(null);

  const scrollToSubmissions = () => {
    submissionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Dynamic Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 px-4 lg:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between h-16 items-center py-3">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg shadow-indigo-100">
               <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 uppercase leading-none">Intelligence Dashboard</h1>
              <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">Survey Control Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button
               onClick={fetchData}
               disabled={loading}
               className="group flex items-center gap-2 bg-slate-100 font-bold text-xs text-slate-500 py-2.5 px-4 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-50"
             >
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
               <span className="hidden sm:inline uppercase tracking-widest">Refresh Data</span>
             </button>
             <button
               onClick={handleLogout}
               className="flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg text-white bg-slate-900 hover:bg-rose-600 transition-all shadow-xl active:scale-95"
             >
               <LogOut className="h-3.5 w-3.5 mr-2" /> Logout
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
             <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 animate-ping rounded-full opacity-20 scale-150"></div>
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Aggregating Statistics...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 text-rose-600 rounded-[2rem] border border-rose-100 shadow-xl flex items-center gap-6 animate-shake">
            <div className="bg-rose-500 text-white p-3 rounded-xl shadow-lg"><PieChart className="w-6 h-6" /></div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight">System Outage</h3>
              <p className="font-bold text-xs opacity-80">{error}</p>
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn space-y-8">
            
            {/* 1. Global Summary Grid (Current 6-Card Grid) */}
            <section className="space-y-3">
               <div className="flex items-center gap-2.5">
                  <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                  <h2 className="text-base font-black text-slate-800 uppercase tracking-tighter">Performance Summary</h2>
               </div>
               <StatsCards data={data} />
            </section>
 
            {/* 2. Deep Intelligence Section (Filter Driven) */}
            <section className="space-y-6 bg-white border border-slate-200 rounded-[2rem] p-4 lg:p-6 shadow-xl shadow-slate-200/40">
               {/* Advanced Filter Tabs */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Deep Analytics</h3>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Filter by category</p>
                  </div>
                  <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl">
                    <button
                      onClick={() => setSelectedOccupation('all')}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] transition-all
                        ${selectedOccupation === 'all' ? 'bg-white text-indigo-600 shadow-md transform -translate-y-0.5' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      All ({data.length})
                    </button>
                    {occupations.map(occ => (
                      <button
                        key={occ}
                        onClick={() => setSelectedOccupation(occ)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] transition-all capitalize
                          ${selectedOccupation === occ ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform -translate-y-0.5' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {occ} ({data.filter(d => 
                          (d.occupation?.toLowerCase() === occ.toLowerCase()) || 
                          (d.q5?.toLowerCase() === occ.toLowerCase())
                        ).length})
                      </button>
                    ))}
                  </div>
               </div>

                {/* Visualization Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Pie Chart: Global Spread */}
                    <Charts 
                      data={data} 
                      onSelectCategory={setSelectedOccupation} 
                      onViewFull={(chart) => setActiveChart({ ...chart, type: 'pie' })}
                    />
                    
                    {/* Category Insights Section: Dynamic */}
                    <InsightsSection 
                      data={filteredData} 
                      selectedOccupation={selectedOccupation} 
                      onViewFull={(chart) => setActiveChart({ ...chart, type: 'bar' })}
                    />
                 </div>
             </section>
 
             {/* 3. Raw Data Feed */}
             <section ref={submissionsRef} className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5">
                   <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                   <h2 className="text-base font-black text-slate-800 uppercase tracking-tighter">Submission Stream</h2>
                </div>
                <DataTable data={filteredData} onRefresh={fetchData} />
             </section>
 
             {/* Full Chart View Modal */}
             <ChartModal 
               isOpen={!!activeChart} 
               onClose={() => setActiveChart(null)} 
               chartData={activeChart?.data} 
               title={activeChart?.title} 
               type={activeChart?.type} 
             />
           </div>
        )}
      </main>
    </div>
  );
}
