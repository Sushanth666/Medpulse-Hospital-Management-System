import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { HeartPulseLogo } from '../../components/common/HeartPulseLogo';
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'Admin', label: 'System Admin', icon: ShieldCheck, desc: 'Full System Access' },
    { id: 'Doctor', label: 'Medical Doctor', icon: Stethoscope, desc: 'Clinical Diagnostics' },
    { id: 'Receptionist', label: 'Reception / Staff', icon: UserCheck, desc: 'Patient Check-in Queue' }
  ];

  const handleSelectRole = (r) => {
    setRole(r.id);
    setEmail('');
    setPassword('');
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email address is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const result = login(email, password, role);
      setLoading(false);
      if (result.success) {
        addToast(result.message || `Welcome back to MedPulse! Logged in as ${role}`, 'success');
        navigate('/dashboard');
      } else {
        setErrors({ general: result.message });
        addToast(result.message, 'error');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black text-slate-900 dark:text-white relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Floating Header Theme Toggle */}
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        className="absolute top-6 right-6 p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 hover:scale-110 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all shadow-md cursor-pointer z-30"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-orange-400 animate-spin-slow" />
        ) : (
          <Moon className="w-5 h-5 text-orange-500" />
        )}
      </button>

      {/* Main Split Grid Layout */}
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl lg:rounded-[2.5rem] shadow-2xl overflow-hidden">

          {/* Left Hero Feature Showcase Panel (Desktop) - White in light mode, Dark in dark mode */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative min-h-[520px] border-r border-slate-200 dark:border-slate-800">
            {/* Background Glow Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.12),transparent_70%)] pointer-events-none" />

            {/* Brand Header */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <HeartPulseLogo className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    MedPulse <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-300 font-bold border border-orange-500/30">HMS v2.4</span>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enterprise Healthcare Intelligence Platform</p>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Precision Clinical Operations & Real-Time Patient Telemetry
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Streamlining hospital admissions, doctor scheduling, pharmacy inventory, and medical billing across unified workflows.
                </p>
              </div>
            </div>

            {/* Live System Connectivity Footer */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between relative z-10 mt-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Emergency Command & ER Response Unit Active
              </div>
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>
          </div>

          {/* Right Login Form Container */}
          <div className="col-span-1 lg:col-span-6 p-6 sm:p-10 lg:p-12 text-slate-900 dark:text-slate-100 flex flex-col justify-center">

            {/* Mobile Brand Logo Header */}
            <div className="flex lg:hidden flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
                <HeartPulseLogo className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">MedPulse HMS</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Next-Gen Hospital Management System</p>
            </div>

            {/* Form Title */}
            <div className="mb-6 hidden lg:block">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Sign In to Dashboard</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select your assigned clinical role below to sign in
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="mb-6 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Select Portal Access Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRole(r)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-lg shadow-orange-500/30 scale-[1.02]'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-orange-600 dark:text-orange-400'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{r.label}</span>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                          {r.id}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-ping" />
                  <span>{errors.general}</span>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="name@medpulse.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-orange-600 focus:ring-orange-500" />
                  Remember credentials
                </label>
                <Link to="/forgot-password" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                icon={ArrowRight}
                className="w-full mt-3 py-3.5 text-sm font-bold shadow-lg shadow-orange-500/30"
              >
                Sign In as {role}
              </Button>

              <div className="pt-3 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Don't have a staff account?{' '}
                  <Link to="/register" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                    Register Here &rarr;
                  </Link>
                </p>
              </div>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
};
