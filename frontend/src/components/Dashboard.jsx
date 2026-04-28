import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import InsightsFeed from './InsightsFeed';
import TransactionForm from './TransactionForm';
import GoalForm from './GoalForm';
import ExcelImport from './ExcelImport';

export default function Dashboard({ user }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl min-w-[200px]">
          <p className="text-gray-400 text-xs mb-2 font-medium uppercase tracking-wider">{data.rawDate}</p>
          <p className="text-teal-400 font-bold text-xl mb-3">Balance: ₹{data.spend.toFixed(2)}</p>
          <div className="border-t border-gray-700/50 pt-3 space-y-1">
            <p className="text-white text-sm flex justify-between">
              <span className="text-gray-400 mr-4">{data.amount < 0 ? 'Income:' : 'Expense:'}</span> 
              <span className={`font-medium ${data.amount < 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.amount < 0 ? '+' : '+'}₹{Math.abs(data.amount).toFixed(2)}
              </span>
            </p>
            <p className="text-white text-sm flex justify-between">
              <span className="text-gray-400 mr-4">Category:</span> 
              <span className="font-medium">{data.category}</span>
            </p>
            {data.description && (
              <p className="text-gray-300 text-sm italic mt-2 border-l-2 border-teal-500 pl-2">"{data.description}"</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const [velocityData, setVelocityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('ALL');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let token = "";
      if (user && user.getIdToken) {
        token = await user.getIdToken();
      }
      
      const res = await fetch("http://localhost:8000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data && data.length > 0) {
        let cumulative = 0;
        const mappedData = data.map((tx) => {
          cumulative -= tx.amount; // Inverted math: Expense (+amount) subtracts from balance, Income (-amount) adds to balance.
          const dateObj = new Date(tx.transaction_date);
          const dd = String(dateObj.getUTCDate()).padStart(2, '0');
          const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
          const yyyy = dateObj.getUTCFullYear();
          
          return {
            day: `${dd}-${mm}`, 
            spend: cumulative,
            amount: tx.amount,
            category: tx.category,
            description: tx.description,
            rawDate: `${dd}-${mm}-${yyyy}`,
            isoDate: tx.transaction_date
          };
        });
        setVelocityData(mappedData);
      } else {
        setVelocityData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const getFilteredData = () => {
    if (timeFilter === 'ALL' || velocityData.length === 0) return velocityData;
    
    const now = new Date();
    let cutoff = new Date();
    
    if (timeFilter === '1W') cutoff.setDate(now.getDate() - 7);
    if (timeFilter === '1M') cutoff.setMonth(now.getMonth() - 1);
    if (timeFilter === '3M') cutoff.setMonth(now.getMonth() - 3);
    if (timeFilter === '6M') cutoff.setMonth(now.getMonth() - 6);
    
    return velocityData.filter(d => new Date(d.isoDate) >= cutoff);
  };

  const displayData = getFilteredData();

  return (
    <div className="space-y-8">
      {/* Top Row: Visualizer & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700/50 relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
               <div className="w-32 h-32 bg-teal-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-white tracking-tight">Net Balance</h3>
              <div className="flex bg-gray-900/80 p-1 rounded-lg">
                {['1W', '1M', '3M', '6M', 'ALL'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setTimeFilter(f)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeFilter === f ? 'bg-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow min-h-[300px] relative z-10">
              {loading ? (
                 <div className="h-full flex items-center justify-center">
                   <p className="text-gray-400">Loading live data...</p>
                 </div>
               ) : displayData.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-8">
                   <p className="text-gray-400 mb-2">No transactions in this timeframe.</p>
                 </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9ca3af" 
                      axisLine={false} 
                      tickLine={false} 
                      minTickGap={30}
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                    />
                    <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={2000} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'top', value: 'Monthly Limit', fill: '#ef4444', fontSize: '14px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="spend" 
                      stroke="#34d399" 
                      strokeWidth={4}
                      dot={{ fill: '#064e3b', stroke: '#34d399', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8, fill: '#34d399' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700/50 h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">Actionable Insights</h3>
            <InsightsFeed user={user} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Data Entry Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TransactionForm user={user} onSuccess={fetchTransactions} />
        <ExcelImport user={user} onSuccess={fetchTransactions} />
        <GoalForm user={user} onSuccess={() => {}} />
      </div>
    </div>
  );
}
