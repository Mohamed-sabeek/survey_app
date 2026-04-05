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

  // Aggregate Product Demands (q7)
  const productCounts = {};
  data.forEach((d) => {
    const val = d.q7;
    if (val) {
      productCounts[val] = (productCounts[val] || 0) + 1;
    }
  });

  const pieData = {
    labels: Object.keys(productCounts).map(l => l.toUpperCase()),
    datasets: [
      {
        data: Object.values(productCounts),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderWidth: 0,
        hoverOffset: 20,
      },
    ],
  };

  // Aggregate Problems (q9)
  const problemCounts = {};
  data.forEach((d) => {
    const val = d.q9;
    if (val) {
      problemCounts[val] = (problemCounts[val] || 0) + 1;
    }
  });

  const barData = {
    labels: Object.keys(problemCounts).map(l => l.toUpperCase()),
    datasets: [
      {
        label: 'Problem Density',
        data: Object.values(problemCounts),
        backgroundColor: '#6366F1',
        borderRadius: 12,
        barThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { weight: 'bold', size: 11 },
          color: '#94a3b8',
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 12,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { weight: 'bold' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { weight: 'bold' } }
      }
    }
  };

  const hasPieData = Object.keys(productCounts).length > 0;
  const hasBarData = Object.keys(problemCounts).length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 flex flex-col items-center group transition-all duration-500 hover:shadow-2xl">
        <h3 className="text-xl font-black text-gray-900 mb-8 w-full text-left tracking-tight">Product Demand <span className="text-sm font-bold text-gray-300 ml-2">(Q7)</span></h3>
        <div className="w-full max-w-sm h-72 flex items-center justify-center relative">
          {hasPieData ? (
             <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          ) : (
             <div className="text-gray-300 font-bold p-12 bg-gray-50 rounded-full w-48 h-48 flex items-center justify-center text-center leading-tight">No data detected in Q7</div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 flex flex-col items-center group transition-all duration-500 hover:shadow-2xl">
        <h3 className="text-xl font-black text-gray-900 mb-8 w-full text-left tracking-tight">Buying Problems <span className="text-sm font-bold text-gray-300 ml-2">(Q9)</span></h3>
        <div className="w-full h-72 flex items-center justify-center">
          {hasBarData ? (
            <Bar data={barData} options={options} />
          ) : (
            <div className="text-gray-300 font-bold p-12 bg-gray-50 rounded-full w-48 h-48 flex items-center justify-center text-center leading-tight">No data detected in Q9</div>
          )}
        </div>
      </div>
    </div>
  );
}
