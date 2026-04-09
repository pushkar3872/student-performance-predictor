import { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8000';

export default function UploadDataset({ onTrainSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(`${response.data.message} Accuracy: ${(response.data.accuracy * 100).toFixed(2)}%`);
      onTrainSuccess();
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred during upload/training.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card flex flex-col items-start h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none text-slate-800 dark:text-slate-100">
        <UploadCloud size={120} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 p-2.5 rounded-lg border border-brand-200 dark:border-brand-800/60">
          <UploadCloud size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Initialize Model</h2>
      </div>
      
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        Connect your historical student CSV data. We'll instantly train a customized machine learning pipeline.
      </p>

      <form onSubmit={handleUpload} className="w-full mt-auto space-y-6">
        <div 
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-brand-400 dark:hover:border-brand-500 transition-colors cursor-pointer group/upload"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".csv" 
            onChange={handleFileChange} 
          />
          
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileType className="text-brand-500" size={32} />
              <span className="font-medium text-slate-700 dark:text-slate-200">{file.name}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-2">
                <UploadCloud className="text-slate-400 dark:text-slate-500 group-hover/upload:text-brand-400 transition-colors" size={32} />
                <span className="font-medium text-slate-600 dark:text-slate-300 cursor-pointer">Click to browse CSV files</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Standard formats only</span>
             </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading || !file}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing Data...
            </>
          ) : (
            'Train Model'
          )}
        </button>
      </form>
    </div>
  );
}
