import { useState } from 'react';
import axios from 'axios';
import { Activity, Loader2, Info, HelpCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ResultDisplay from './ResultDisplay';

const API_BASE_URL = 'http://localhost:8000';

export default function PredictionForm({ isModelTrained, onPredictionComplete }) {
  const [formData, setFormData] = useState({
    study_hours: '',
    attendance: '',
    previous_score: '',
    sleep_hours: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [inputsSnapshot, setInputsSnapshot] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadSampleData = () => {
    setFormData({
      study_hours: '6.5',
      attendance: '88.0',
      previous_score: '82.5',
      sleep_hours: '7.5'
    });
    toast.success('Sample demo data injected!');
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const inputs = {
      study_hours: parseFloat(formData.study_hours),
      attendance: parseFloat(formData.attendance),
      previous_score: parseFloat(formData.previous_score),
      sleep_hours: parseFloat(formData.sleep_hours)
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, inputs);
      setResult(response.data);
      setInputsSnapshot(inputs); // Save snapshot for charting
      
      // Save to localStorage history
      const prevHistory = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
      const newEntry = {
         id: Date.now(),
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         inputs: inputs,
         prediction: response.data
      };
      localStorage.setItem('predictionHistory', JSON.stringify([newEntry, ...prevHistory].slice(0, 10)));
      
      onPredictionComplete();
      toast.success('Inference complete!');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Prediction failed. Is the model trained?';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const Tooltip = ({ text }) => (
    <div className="group relative ml-1 inline-block">
      <HelpCircle size={14} className="text-slate-400 hover:text-brand-500 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-xs text-white rounded-md shadow-lg z-10 text-center">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-auth border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="flex flex-col gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card relative overflow-hidden">
        {/* Animated Progress Bar overlay */}
        <AnimatePresence>
          {loading && (
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: '100%' }} 
               exit={{ opacity: 0 }}
               transition={{ duration: 1.5, ease: 'easeOut' }}
               className="absolute top-0 left-0 h-1 bg-gradient-to-r from-brand-400 to-purple-500 z-10"
             />
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 p-2.5 rounded-lg border border-brand-200 dark:border-brand-800/60">
               <Activity size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Inference Engine</h2>
          </div>
          
          {isModelTrained && (
             <button 
               type="button"
               onClick={loadSampleData}
               className="text-xs flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 px-3 py-1.5 rounded-md transition-colors border border-slate-200 dark:border-slate-600"
             >
               <Zap size={12} /> Auto-fill Demo
             </button>
          )}
        </div>

        {!isModelTrained && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-400 p-4 rounded-lg">
            <Info className="shrink-0 mt-0.5" size={18} />
            <p className="text-sm font-medium">Model offline. Connect historical data in the left panel to initialize predictive capabilities.</p>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-5 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                Study Hours / Week
                <Tooltip text="Total estimated hours spent studying in a single week outside of lectures." />
              </label>
              <input 
                className="input-field"
                type="number" step="0.1" name="study_hours" 
                value={formData.study_hours} onChange={handleChange}
                required placeholder="e.g. 5.5" disabled={!isModelTrained || loading}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                Attendance %
                <Tooltip text="Percentage of total classes successfully attended." />
              </label>
              <input 
                className="input-field"
                type="number" step="0.1" name="attendance" 
                value={formData.attendance} onChange={handleChange}
                required placeholder="e.g. 85.0" disabled={!isModelTrained || loading}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                Previous Score %
                <Tooltip text="The student's holistic performance score entering this module." />
              </label>
              <input 
                className="input-field"
                type="number" step="0.1" name="previous_score" 
                value={formData.previous_score} onChange={handleChange}
                required placeholder="e.g. 76.0" disabled={!isModelTrained || loading}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                Sleep Hours / Night
                <Tooltip text="Average sleep tracking duration prior to assessment." />
              </label>
              <input 
                className="input-field"
                type="number" step="0.1" name="sleep_hours" 
                value={formData.sleep_hours} onChange={handleChange}
                required placeholder="e.g. 7.0" disabled={!isModelTrained || loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary mt-4"
            disabled={loading || !isModelTrained}
          >
            {loading ? (
               <>
                 <Loader2 className="animate-spin" size={20} />
                 Calculating Probabilities...
               </>
            ) : (
              'Run Prediction'
            )}
          </button>
        </form>
      </div>

      <AnimatePresence>
         {result && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <ResultDisplay result={result} inputs={inputsSnapshot} />
            </motion.div>
         )}
      </AnimatePresence>
    </motion.div>
  );
}
