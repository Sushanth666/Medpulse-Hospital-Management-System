import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useHospital } from '../../context/HospitalContext';
import { getDoctorAvatar } from '../../data/mockData';
import {
  Bell,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAllNotificationsAsRead } = useHospital();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden md:flex items-center w-64 lg:w-80">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients, doctors, records..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-transparent focus:border-orange-500 text-xs text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      className={`p-2.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors ${
                        !n.read ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                        ) : n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-2">{n.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  View Notification Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <img
              src={user?.avatar || getDoctorAvatar(user?.name || 'Admin', 'f97316')}
              alt="User Avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDoctorAvatar(user?.name || 'Admin', 'f97316');
              }}
              className="w-8 h-8 rounded-xl object-cover border border-orange-500/40 shadow-sm"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user?.name}</span>
              <span className="text-[10px] text-slate-400">{user?.role || 'Admin'}</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2.5 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2.5 z-50 animate-fade-in overflow-hidden">
              {/* Profile Card Header Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-red-500/10 dark:from-orange-950/40 dark:to-slate-900 border border-orange-500/20 mb-2 relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <img
                      src={user?.avatar || getDoctorAvatar(user?.name || 'Admin', 'f97316')}
                      alt="User Avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getDoctorAvatar(user?.name || 'Admin', 'f97316');
                      }}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-orange-500 shadow-md"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-orange-500/15 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25 tracking-wide">
                    {user?.role || 'Doctor'} Access
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Online
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="group flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span>Account Profile</span>
                    <p className="text-[10px] text-slate-400 font-normal">Manage avatar & details</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 rounded-xl transition-all duration-200 mt-1 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <span>Sign Out</span>
                    <p className="text-[10px] opacity-75 font-normal">Disconnect session</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
