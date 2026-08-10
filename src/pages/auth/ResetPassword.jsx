import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { HeartPulseLogo } from '../../components/common/HeartPulseLogo';
import { Lock, Sun, Moon } from 'lucide-react';

export const ResetPassword = () => {
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addToast('Password updated successfully! Please login with your new password.', 'success');
    navigate('/login');
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose a strong password with letters, numbers, and symbols.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Input
            label="Confirm New Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
            Reset Password
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Cancel & Return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
