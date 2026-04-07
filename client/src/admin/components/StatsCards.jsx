import { useMemo } from 'react';
import { Users, Wheat, Hammer, ShoppingBag, GraduationCap, Home } from 'lucide-react';

export default function StatsCards({ data }) {
  
  // ── Global Stats Map (Memoized) ──
  const stats = useMemo(() => {
    if (!data || data.length === 0) return [];

    const total = data.length;
    const getCount = (occ) => data.filter(d => 
      (d.occupation?.toLowerCase() === occ.toLowerCase()) || 
      (d.q5?.toLowerCase() === occ.toLowerCase())
    ).length;

    return [
      { 
        label: 'Total Responses', 
        value: total, 
        icon: Users, 
        color: 'bg-indigo-600', 
        shadow: 'shadow-indigo-100',
        border: 'border-indigo-100'
      },
      { 
        label: 'Farming', 
        value: getCount('farming'), 
        icon: Wheat, 
        color: 'bg-emerald-600', 
        shadow: 'shadow-emerald-100',
        border: 'border-emerald-100'
      },
      { 
        label: 'Labour', 
        value: getCount('labour'), 
        icon: Hammer, 
        color: 'bg-amber-600', 
        shadow: 'shadow-amber-100',
        border: 'border-amber-100'
      },
      { 
        label: 'Business', 
        value: getCount('business'), 
        icon: ShoppingBag, 
        color: 'bg-blue-600', 
        shadow: 'shadow-blue-100',
        border: 'border-blue-100'
      },
      { 
        label: 'Student', 
        value: getCount('student'), 
        icon: GraduationCap, 
        color: 'bg-purple-600', 
        shadow: 'shadow-purple-100',
        border: 'border-purple-100'
      },
      { 
        label: 'Homemaker', 
        value: getCount('homemaker'), 
        icon: Home, 
        color: 'bg-rose-600', 
        shadow: 'shadow-rose-100',
        border: 'border-rose-100'
      },
    ];
  }, [data]);

  if (!stats.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 animate-fadeIn">
      {stats.map((s, i) => (
        <div key={i} className={`bg-white rounded-3xl shadow-xl ${s.shadow} border ${s.border} p-5 flex flex-col items-center group hover:scale-[1.03] transition-all duration-500 relative overflow-hidden`}>
          {/* Progress circle decor */}
          <div className="absolute top-[-20%] right-[-10%] w-16 h-16 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
          
          <div className={`${s.color} text-white p-3 rounded-2xl shadow-lg mb-4 transform group-hover:rotate-12 transition-transform relative z-10`}>
             <s.icon className="h-5 w-5" />
          </div>
          
          <div className="text-center relative z-10">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</h4>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">
              {s.value}
            </p>
            {s.label !== 'Total Responses' && (
              <div className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-md">
                 {data.length > 0 ? Math.round((s.value / data.length) * 100) : 0}% of all
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
