import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadDataset from './components/UploadDataset';
import PredictionForm from './components/PredictionForm';
import PredictionHistory from './components/PredictionHistory';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [modelTrained, setModelTrained] = useState(false);
  const [historyUpdated, setHistoryUpdated] = useState(0); // Forcing history remounts

  const triggerHistoryUpdate = () => {
    setHistoryUpdated(prev => prev + 1);
  };

  const scrollToApp = () => {
    document.getElementById('app-interface').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white border dark:border-slate-700',
      }} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center relative overflow-hidden"
        >
           
           {/* Background gradient decorative elements */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen max-w-screen-xl h-full pointer-events-none opacity-40 dark:opacity-20">
             <div className="absolute top-10 left-20 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply flex blur-3xl opacity-70 animate-pulse"></div>
             <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply flex blur-3xl opacity-70 animate-pulse delay-1000"></div>
           </div>

           <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                 Predict Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">Success</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                 Leverage our intelligent machine learning pipeline to forecast academic performance. Upload historical data, train the engine, and generate instant probability assessments for incoming students.
              </p>
              
              <button 
                onClick={scrollToApp}
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-brand-600 text-white rounded-full px-8 py-3.5 font-semibold text-sm tracking-wide shadow-lg shadow-slate-500/20 dark:shadow-brand-500/20 hover:bg-slate-800 dark:hover:bg-brand-500 transition-all hover:scale-105 active:scale-95"
              >
                Launch Application
                <ArrowDown size={18} className="animate-bounce mt-1" />
              </button>
           </div>
        </motion.div>
      </section>

      {/* Main Application Interface */}
      <main id="app-interface" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* Left Column: Tools */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="lg:col-span-8 flex flex-col gap-8"
           >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UploadDataset onTrainSuccess={() => setModelTrained(true)} />
                <PredictionForm 
                   isModelTrained={modelTrained} 
                   onPredictionComplete={triggerHistoryUpdate}
                />
             </div>
           </motion.div>

           {/* Right Column: History */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="lg:col-span-4"
           >
             <PredictionHistory key={historyUpdated} />
           </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
