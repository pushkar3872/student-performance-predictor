import { CheckCircle2, XCircle, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ResultDisplay({ result, inputs }) {
  if (!result || !inputs) return null;

  const passed = result.prediction === 1;
  const isHighConfidence = result.probability > 0.8;

  const chartData = [
    { name: 'Study (hrs)', value: inputs.study_hours, base: 5 },
    { name: 'Att. (%)', value: inputs.attendance / 10, base: 7.5 }, 
    { name: 'Score (%)', value: inputs.previous_score / 10, base: 6 },
    { name: 'Sleep (hrs)', value: inputs.sleep_hours, base: 8 },
  ];

  const handleDownloadCSV = () => {
    const headers = ['Study Hours', 'Attendance (%)', 'Previous Score (%)', 'Sleep Hours', 'Predicted Outcome', 'Confidence (%)'];
    const rowData = [
      inputs.study_hours,
      inputs.attendance,
      inputs.previous_score,
      inputs.sleep_hours,
      result.result_text,
      (result.probability * 100).toFixed(2)
    ];

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rowData.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Prediction_Report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="glass-card mt-8 overflow-hidden relative">
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20 dark:opacity-10 blur-3xl ${passed ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Synthesis Complete
        </h3>
        <button 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600"
          title="Download Report as CSV"
        >
          <Download size={14} /> Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Result Value */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50/80 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
          <div className={`flex items-center justify-center w-20 h-20 rounded-full mb-4 ${passed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
            {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
          </div>
          
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Status Forecast</h4>
          <span className={`text-4xl font-extrabold tracking-tight ${passed ? 'text-emerald-500' : 'text-rose-500'}`}>
            {result.result_text.toUpperCase()}
          </span>
          
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300">
            <span>Confidence:</span>
            <span className={isHighConfidence ? 'text-brand-600 dark:text-brand-400' : 'text-amber-500'}>
              {(result.probability * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Right Column: Chart Explanation */}
        <div className="flex flex-col h-full min-h-[220px]">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-4">Input Metric Balance</h4>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis hide={true} />
                <RechartsTooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                   {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value >= entry.base ? '#8b5cf6' : '#cbd5e1'} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
            Purple columns represent metrics exceeding typical base requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
