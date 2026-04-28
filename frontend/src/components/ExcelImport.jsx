import React, { useState, useRef } from 'react';

export default function ExcelImport({ user, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage('');
    
    try {
      let token = "";
      if (user && user.getIdToken) {
        token = await user.getIdToken();
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch("http://localhost:8000/api/transactions/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Import successful!');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess();
      } else {
        setMessage(data.detail || 'Upload failed');
      }
    } catch (error) {
      console.error("Failed to upload excel", error);
      setMessage("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-500/30">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
        </span>
        Bulk Import
      </h3>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Upload Excel/CSV</label>
          <div className="relative border-2 border-dashed border-gray-600 hover:border-purple-500 rounded-lg p-4 transition-all text-center">
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileChange}
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-gray-300">
              {file ? (
                <span className="text-purple-400 font-medium">{file.name}</span>
              ) : (
                <span className="text-sm">Drag & drop or click to select file</span>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className={`text-sm font-medium ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!file || loading}
          className="w-full mt-2 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Upload Data'}
        </button>
      </form>
    </div>
  );
}
