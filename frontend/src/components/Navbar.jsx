import { useState, useEffect } from 'react';
import { GraduationCap, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial system/localStorage preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <nav className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex flex-shrink-0 items-center overflow-hidden gap-2">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/50 rounded-lg text-brand-600 dark:text-brand-400">
               <GraduationCap size={24} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100">
              Grade<span className="text-brand-600 dark:text-brand-500">Sync</span>
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Documentation</a>
              <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Support</a>
              <button className="bg-slate-900 dark:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-brand-700 transition-colors">
                GitHub Repo
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
