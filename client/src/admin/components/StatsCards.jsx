import { Users, AlertCircle, ShoppingBag } from 'lucide-react';

export default function StatsCards({ data }) {
  if (!data || data.length === 0) return null;

  // Calculate stats
  const total = data.length;

  // Most common problem (q9 or q13 or q14)
  const allProblems = data.flatMap(d => {
    const p9 = d.q9 ? [d.q9] : [];
    const p13 = d.q13 ? [d.q13] : [];
    const p14 = d.q14 ? [d.q14] : [];
    return [...p9, ...p13, ...p14];
  });
  
  const problemCounts = {};
  allProblems.forEach(p => {
    if (typeof p === 'string') {
      problemCounts[p] = (problemCounts[p] || 0) + 1;
    } else if (Array.isArray(p)) {
      p.forEach(item => {
        problemCounts[item] = (problemCounts[item] || 0) + 1;
      });
    }
  });
  const commonProblem = Object.keys(problemCounts).sort((a,b) => problemCounts[b] - problemCounts[a])[0] || 'No data available';

  // Most common product (q7 or q12)
  const allProducts = data.flatMap(d => {
    const p7 = d.q7 ? [d.q7] : [];
    const p12 = d.q12 || []; // q12 is an array
    return [...p7, ...p12];
  });
  
  const productCounts = {};
  allProducts.forEach(p => {
    productCounts[p] = (productCounts[p] || 0) + 1;
  });
  const commonProduct = Object.keys(productCounts).sort((a,b) => productCounts[b] - productCounts[a])[0] || 'No data available';

  const stats = [
    { label: 'Total Responses', value: total, icon: Users, color: 'bg-blue-600' },
    { label: 'Top Demand Product', value: commonProduct.replace(/_/g, ' '), icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Major Core Problem', value: commonProblem.replace(/_/g, ' '), icon: AlertCircle, color: 'bg-rose-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center gap-6 hover:shadow-xl transition-all duration-300 border-b-4 border-b-transparent hover:border-b-green-500 group">
          <div className={`${s.color} text-white p-5 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
            <s.icon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">{s.label}</p>
            <p className="text-3xl font-black text-gray-900 capitalize mt-1 tracking-tight">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
