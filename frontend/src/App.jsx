import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import Dashboard from './components/Dashboard';

// Real Firebase Config loaded from Vite env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      // Execute OAuth Popup
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Firebase Login Failed", error);
      // Removed mock bypass to enforce real authentication
      alert("Login failed. Please check your Firebase configuration and console logs.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="p-6 bg-gray-800 shadow-md flex justify-between items-center border-b border-gray-700">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500">
          Artha CFO
        </h1>
        {user ? (
          <div className="flex items-center gap-4">
             <span className="text-gray-300 font-medium">Hello, {user.displayName}</span>
             <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
              >
               Sign Out
             </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg font-semibold shadow-lg hover:shadow-teal-500/30 transition-all text-white"
          >
            Sign in with Google
          </button>
        )}
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {!user ? (
          <div className="text-center mt-32 space-y-4">
            <h2 className="text-5xl font-extrabold text-white">Your AI Personal CFO</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Proactive, intelligent, and deeply personalized financial insights powered by Google Vertex AI.
            </p>
          </div>
        ) : (
          <Dashboard user={user} />
        )}
      </main>
    </div>
  );
}
