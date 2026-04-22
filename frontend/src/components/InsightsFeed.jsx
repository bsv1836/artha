import React, { useEffect, useState } from 'react';

export default function InsightsFeed({ user }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Reach out to our real Python FastAPI backend
    const fetchAIInsights = async () => {
      try {
        setLoading(true);
        let token = "";
        // Extract the secure JWT from the active Google User session
        if (user && user.getIdToken) {
          token = await user.getIdToken();
        }
        
        const res = await fetch("http://localhost:8000/api/insights", { 
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        
        if (isMounted) {
           // We expect the backend to return an 'insights' object 
           setInsight(data.insights || null);
           setLoading(false);
        }

      } catch (e) {
        console.error("Backend error: Failed to fetch insights.", e);
        if (isMounted) setLoading(false);
      }
    };

    fetchAIInsights();
    return () => { isMounted = false; };
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col space-y-4 w-full">
        <div className="h-32 bg-gray-700/50 border border-gray-600/50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow space-y-4">
      {insight ? (
        <div className="p-6 bg-gradient-to-br from-teal-900/40 to-gray-800 rounded-xl border border-teal-500/30 relative flex flex-col h-full justify-between shadow-lg">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500 rounded-l-xl"></div>
          <div>
             <div className="flex items-center gap-2 mb-3">
                 <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                   Vertex AI Insight
                 </span>
             </div>
             <p className="text-gray-100 mb-6 font-medium text-lg leading-snug">
               "{insight.message}"
             </p>
          </div>
          <button className="w-full py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/25">
            {insight.action}
          </button>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center p-6 bg-gray-800 rounded-xl border border-dashed border-gray-600">
           <p className="text-gray-400 font-medium">No alerts right now.</p>
        </div>
      )}
    </div>
  );
}
