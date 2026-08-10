import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { HeartPulseLogo } from '../../components/common/HeartPulseLogo';
import { Mail, ArrowLeft, CheckCircle2, Sun, Moon } from 'lucide-react';

export const ForgotPassword = () => {
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address');
      return;
    }
    setError('');
    setSubmitted(true);
    addToast('Password reset link sent to your email address', 'success');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-black text-slate-900 dark:text-white relative overflow-hidden font-sans transition-colors duration-300 p-4 sm:p-6">
      {/* Background Radial Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

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

      <div className="w-full max-w-md bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 flex items-center justify-center mb-3 shadow-lg shadow-orange-500/30">
            <HeartPulseLogo className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reset Your Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your MedPulse account email address to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
              <p className="font-bold">Verification Email Sent!</p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                We sent instructions to <span className="font-bold text-slate-900 dark:text-white">{email}</span>. Please check your inbox.
              </p>
            </div>
            <Link to="/reset-password">
              <Button variant="primary" className="w-full">
                Simulate Entering Reset Code →
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              icon={Mail}
              placeholder="doctor@medpulse.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
              Send Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
