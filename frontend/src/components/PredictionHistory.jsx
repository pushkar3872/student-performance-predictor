import { useEffect, useState } from 'react';
import { History, Clock, FileInput, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PredictionHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const rawData = localStorage.getItem('predictionHistory');
    if (rawData) {
      setHistory(JSON.parse(rawData));
    }
  }, []);

  if (history.length === 0) {
    return (
      <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-70 border-dashed">
        <History className="text-slate-300 dark:text-slate-600 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Prediction Log Empty</h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 max-w-[200px] mt-2">
          Run your first machine learning inference to populate this history column.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card h-full overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
           <History size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Prediction Log</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  <Clock size={12} />
                  <span>{item.date} • {item.time}</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                  item.prediction.result_text === 'Pass' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                }`}>
                  {item.prediction.result_text.toUpperCase()} ({(item.prediction.probability * 100).toFixed(0)}%)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                  <span>Study</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.inputs.study_hours}h</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                  <span>Attd.</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.inputs.attendance}%</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                  <span>Prior</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.inputs.previous_score}%</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                  <span>Sleep</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.inputs.sleep_hours}h</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
