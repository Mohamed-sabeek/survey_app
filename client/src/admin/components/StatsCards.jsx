import { Users, AlertCircle, ShoppingBag } from 'lucide-react';

export default function StatsCards({ data }) {
  if (!data || data.length === 0) return null;

  // Calculate stats
  const total = data.length;

  // Most common problem
  const allProblems = data.flatMap(d => (d.buyingProblems || []).concat(d.sellingProblems || []));
  const problemCounts = {};
  allProblems.forEach(p => {
    problemCounts[p] = (problemCounts[p] || 0) + 1;
  });
  const commonProblem = Object.keys(problemCounts).sort((a,b) => problemCounts[b] - problemCounts[a])[0] || 'No data available';

  // Most common product
  const allProducts = data.flatMap(d => (d.buyItems || []).concat(d.sellItems || []));
  const productCounts = {};
  allProducts.forEach(p => {
    productCounts[p] = (productCounts[p] || 0) + 1;
  });
  const commonProduct = Object.keys(productCounts).sort((a,b) => productCounts[b] - productCounts[a])[0] || 'No data available';

  const stats = [
    { label: 'Total Responses', value: total, icon: Users, color: 'bg-blue-500' },
    { label: 'Top Demand Product', value: commonProduct.replace(/_/g, ' '), icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Major Core Problem', value: commonProblem.replace(/_/g, ' '), icon: AlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className={`${s.color} text-white p-4 rounded-xl shadow-inner flex items-center justify-center`}>
            <s.icon className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 tracking-wide uppercase">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 capitalize mt-1">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
