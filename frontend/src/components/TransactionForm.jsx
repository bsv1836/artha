import React, { useState } from 'react';

const CATEGORIES = ["Housing", "Food", "Transport", "Utilities", "Entertainment", "Other"];

export default function TransactionForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    category: 'Food',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.transaction_date) return;
    
    setLoading(true);
    try {
      let token = "";
      if (user && user.getIdToken) {
        token = await user.getIdToken();
      }
      
      const payload = {
        amount: parseFloat(formData.amount),
        transaction_date: formData.transaction_date,
        category: formData.category,
        description: formData.description || null
      };

      await fetch("http://localhost:8000/api/transactions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      setFormData({...formData, amount: '', description: ''});
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add transaction", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:shadow-teal-900/20 hover:border-teal-500/30">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="bg-teal-500/20 p-2 rounded-lg text-teal-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </span>
        Log Expense
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Amount ($)</label>
            <input 
              type="number" step="0.01" min="0" required
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Date</label>
            <input 
              type="date" required
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              value={formData.transaction_date}
              onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Category</label>
          <select 
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Description (Optional)</label>
          <input 
            type="text" 
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="e.g. Morning Coffee"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Logging...' : 'Save Transaction'}
        </button>
      </form>
    </div>
  );
}
