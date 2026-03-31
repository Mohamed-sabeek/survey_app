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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Charts({ data }) {
  if (!data || data.length === 0) return null;

  // Aggregate Product Demands
  const productCounts = {};
  data.forEach((d) => {
    (d.buyItems || []).forEach((p) => {
      productCounts[p] = (productCounts[p] || 0) + 1;
    });
  });

  const pieData = {
    labels: Object.keys(productCounts).map(l => l.replace(/_/g, ' ').toUpperCase()),
    datasets: [
      {
        data: Object.values(productCounts),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderWidth: 1,
      },
    ],
  };

  // Aggregate Problems
  const problemCounts = {};
  data.forEach((d) => {
    (d.buyingProblems || []).forEach((p) => {
      problemCounts[p] = (problemCounts[p] || 0) + 1;
    });
  });

  const barData = {
    labels: Object.keys(problemCounts).map(l => l.replace(/_/g, ' ').toUpperCase()),
    datasets: [
      {
        label: 'Buying Problems Density',
        data: Object.values(problemCounts),
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
    ],
  };

  const hasPieData = Object.keys(productCounts).length > 0;
  const hasBarData = Object.keys(problemCounts).length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-800 mb-4 w-full text-left">Product Demand (Buy Items)</h3>
        <div className="w-full max-w-sm h-64 flex items-center justify-center">
          {hasPieData ? (
             <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          ) : (
             <p className="text-gray-400 italic">No data to display</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-800 mb-4 w-full text-left">Reported Buying Problems</h3>
        <div className="w-full h-64 flex items-center justify-center">
          {hasBarData ? (
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          ) : (
            <p className="text-gray-400 italic">No data to display</p>
          )}
        </div>
      </div>
    </div>
  );
}
