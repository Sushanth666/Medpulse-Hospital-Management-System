import React from 'react';
import { NavLink } from 'react-router-dom';
import { HeartPulseLogo } from '../common/HeartPulseLogo';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  BedDouble,
  Pill,
  FileText,
  Bell,
  User,
  Activity,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', path: '/patients', icon: Users },
  { name: 'Doctors', path: '/doctors', icon: UserCheck },
  { name: 'Appointments', path: '/appointments', icon: Calendar },
  { name: 'Bed Management', path: '/beds', icon: BedDouble },
  { name: 'Pharmacy', path: '/pharmacy', icon: Pill },
  { name: 'Billing & Invoices', path: '/billing', icon: FileText },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'User Profile', path: '/profile', icon: User }
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Fixed Sidebar Component */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/35 group-hover:scale-105 transition-transform duration-300 animate-light-glow">
                <HeartPulseLogo className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-wide animate-text-gradient">
                  MedPulse
                </h1>
                <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold tracking-wider uppercase block -mt-0.5">
                  Hospital Core v2.4
                </span>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Main Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 border border-orange-400/30 translate-x-1.5'
                        : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-slate-100 hover:bg-orange-50/60 dark:hover:bg-slate-800/60 hover:translate-x-1'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-120 group-hover:rotate-6" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Emergency System Badge */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80">
          <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-slate-900 border border-orange-200/60 dark:border-slate-800 hover:border-orange-400 transition-all duration-300 animate-soft-ripple">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-beacon-aqua" />
                System Active
              </span>
              <Activity className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">ER Response Unit Connected</p>
          </div>
        </div>
      </aside>
    </>
  );
};
