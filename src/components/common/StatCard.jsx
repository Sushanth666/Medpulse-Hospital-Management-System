import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive, icon: Icon, color = 'orange' }) => {
  const colorMap = {
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50',
    blue: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
    teal: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-orange-500/40 group animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.orange} transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
          {isPositive ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              {change}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
              <TrendingDown className="w-3.5 h-3.5" />
              {change}
            </span>
          )}
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
