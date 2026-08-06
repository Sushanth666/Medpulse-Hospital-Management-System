import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { HeartPulse, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
        <HeartPulse className="w-10 h-10 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">404</h1>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-1">Page Not Found</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-2 mb-6">
        The clinical route or system record you are searching for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={Home}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
