import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import InsightsFeed from './InsightsFeed';
import TransactionForm from './TransactionForm';
import GoalForm from './GoalForm';

export default function Dashboard({ user }) {
  const [velocityData, setVelocityData] = useState([]);
  const [loading, setLoading] = useState(true);

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
          cumulative += tx.amount;
          return {
            day: tx.transaction_date.substring(8, 10), 
            spend: cumulative
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
              <h3 className="text-2xl font-bold text-white tracking-tight">Velocity Visualizer</h3>
            </div>

            <div className="flex-grow min-h-[300px] relative z-10">
              {loading ? (
                 <div className="h-full flex items-center justify-center">
                   <p className="text-gray-400">Loading live data...</p>
                 </div>
              ) : velocityData.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-8">
                   <p className="text-gray-400 mb-2">No transactions yet.</p>
                   <p className="text-sm text-gray-500">Log an expense below to start tracking.</p>
                 </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={velocityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="day" stroke="#9ca3af" axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.75rem', color: '#fff' }}
                      itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                    />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TransactionForm user={user} onSuccess={fetchTransactions} />
        <GoalForm user={user} onSuccess={() => {}} />
      </div>
    </div>
  );
}
