import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-slate-500">
          <GraduationCap size={20} />
          <span className="font-semibold text-slate-700">GradeSync OS</span>
        </div>
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} GradeSync. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
