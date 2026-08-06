import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Select } from '../components/common/Select';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trash2,
  Filter
} from 'lucide-react';

export const Notifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications } = useHospital();
  const { addToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState('');
  const [readFilter, setReadFilter] = useState('');

  const filtered = notifications.filter(n => {
    const matchesCategory = categoryFilter ? n.category === categoryFilter : true;
    const matchesRead = readFilter === 'unread' ? !n.read : readFilter === 'read' ? n.read : true;
    return matchesCategory && matchesRead;
  });

  const handleClearAll = () => {
    if (window.confirm('Clear all notification history?')) {
      clearAllNotifications();
      addToast('Notification history cleared', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notifications & Alerts</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time audit log of critical clinical events, stock warnings, and patient updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={CheckCircle2} onClick={markAllNotificationsAsRead}>
            Mark All Read
          </Button>
          <Button variant="ghost" size="sm" icon={Trash2} className="text-rose-500 hover:bg-rose-50" onClick={handleClearAll}>
            Clear History
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:w-64">
          <Select
            placeholder="All Categories"
            options={['Emergency', 'Pharmacy', 'Appointments', 'Bed Management', 'Billing']}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            placeholder="All Read Statuses"
            options={[
              { value: 'unread', label: 'Unread Only' },
              { value: 'read', label: 'Read Only' }
            ]}
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Notification List */}
      <Card>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No notifications found matching your criteria.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {n.type === 'critical' ? (
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                    ) : n.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    ) : n.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                        {n.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.description}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">{n.timestamp}</span>
                  </div>
                </div>

                {!n.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 text-xs"
                    onClick={() => markNotificationAsRead(n.id)}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
