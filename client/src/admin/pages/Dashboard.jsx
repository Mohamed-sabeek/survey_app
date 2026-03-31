import { useEffect, useState } from 'react';
import { LogOut, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StatsCards from '../components/StatsCards';
import Charts from '../components/Charts';
import DataTable from '../components/DataTable';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/responses');
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch survey responses.');
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navbar Minimal */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="bg-green-100 text-green-700 p-2 rounded-lg mr-3 shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </span>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Survey Analytics</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="text-gray-500 hover:text-green-600 transition-colors bg-gray-50 p-2 rounded-full cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-green-500' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
             <p className="text-gray-500 font-medium animate-pulse">Loading secure insights...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 shadow-sm">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white rounded-2xl shadow-sm border border-gray-100">
             <div className="bg-gray-50 rounded-full p-4 mb-2">
                 <RefreshCw className="w-8 h-8 text-gray-400" />
             </div>
             <p className="text-gray-500 font-medium tracking-wide">No data yet. Waiting for survey responses.</p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <StatsCards data={data} />
            <Charts data={data} />
            <DataTable data={data} onRefresh={fetchData} />
          </div>
        )}
      </main>
    </div>
  );
}
