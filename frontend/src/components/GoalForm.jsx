import React, { useState } from 'react';

export default function GoalForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    goal_name: '',
    target_amount: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goal_name || !formData.target_amount) return;
    
    setLoading(true);
    try {
      let token = "";
      if (user && user.getIdToken) {
        token = await user.getIdToken();
      }
      
      const payload = {
        goal_name: formData.goal_name,
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline || null
      };

      await fetch("http://localhost:8000/api/goals", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      setFormData({ goal_name: '', target_amount: '', deadline: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add goal", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </span>
        New Goal
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Goal Name</label>
          <input 
            type="text" required
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g. Emergency Fund"
            value={formData.goal_name}
            onChange={(e) => setFormData({...formData, goal_name: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Target (₹)</label>
            <input 
              type="number" step="0.01" min="0" required
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="1000.00"
              value={formData.target_amount}
              onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Deadline</label>
            <input 
              type="date"
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Set Goal'}
        </button>
      </form>
    </div>
  );
}
