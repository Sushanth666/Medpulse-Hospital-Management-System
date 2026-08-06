import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { HeartPulseLogo } from '../../components/common/HeartPulseLogo';
import {
  Mail,
  Lock,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  Sun,
  Moon,
  CheckCircle2,
  Sparkles,
  User,
  Building,
  FileCheck,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('Admin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Role-specific fields
  const [department, setDepartment] = useState('Cardiology');
  const [licenseNo, setLicenseNo] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [adminCode, setAdminCode] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'Admin', label: 'System Admin', icon: ShieldCheck, desc: 'Full System & Security Manager' },
    { id: 'Doctor', label: 'Medical Doctor', icon: Stethoscope, desc: 'Clinical Practitioner & Care Provider' },
    { id: 'Receptionist', label: 'Reception / Staff', icon: UserCheck, desc: 'Patient Check-in & Queue Frontdesk' }
  ];

  const departmentOptions = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'General Medicine',
    'Pulmonology',
    'Oncology',
    'Dermatology',
    'Nephrology',
    'Emergency & ICU'
  ];

  const handleRoleChange = (rId) => {
    setRole(rId);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full Name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';

    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (role === 'Doctor' && !licenseNo.trim()) {
      errs.licenseNo = 'Medical License Number is required';
    }

    if (role === 'Receptionist' && !employeeId.trim()) {
      errs.employeeId = 'Staff Employee ID is required';
    }

    if (role === 'Admin' && !adminCode.trim()) {
      errs.adminCode = 'Security Clearance Code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const res = register(name, email, password, role, {
        department,
        licenseNo: role === 'Doctor' ? licenseNo : undefined,
        employeeId: role === 'Receptionist' ? employeeId : undefined,
        adminCode: role === 'Admin' ? adminCode : undefined
      });
      setLoading(false);
      if (res.success) {
        addToast(res.message, 'success');
        navigate('/dashboard');
      } else {
        setErrors({ general: res.message });
        addToast(res.message, 'error');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black text-slate-900 dark:text-white relative overflow-hidden font-sans transition-colors duration-300 py-10">
      
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

          {/* Left Hero Feature Showcase Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative min-h-[600px] border-r border-slate-200 dark:border-slate-800">
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
                    MedPulse <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-300 font-bold border border-orange-500/30">v2.4</span>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Healthcare Staff Onboarding Portal</p>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Join the Medical Staff Team
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Register credentialed accounts for Doctors, Frontdesk Staff, and System Administrators to access real-time clinical telemetry.
                </p>
              </div>

              {/* Registration Benefits List */}
              <div className="mt-8 space-y-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Verified Medical Practitioner Onboarding</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Real-time Electronic Patient Record Access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>HIPAA Compliant Encrypted Telemetry</span>
                </div>
              </div>
            </div>

            {/* Live System Connectivity Footer */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between relative z-10 mt-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Staff Onboarding Queue Active
              </div>
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>
          </div>

          {/* Right Registration Form Container */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 lg:p-12 text-slate-900 dark:text-slate-100 flex flex-col justify-center">

            {/* Mobile Brand Header */}
            <div className="flex lg:hidden flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3 animate-float">
                <HeartPulseLogo className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">MedPulse Registration</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Staff & Clinical Portal Account Setup</p>
            </div>

            {/* Form Title & Link */}
            <div className="mb-6 hidden lg:flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Staff Account Registration</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fill out your professional credentials below</p>
              </div>
              <Link to="/login" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline">
                Already registered? Sign In &rarr;
              </Link>
            </div>

            {/* Role Selection Tabs */}
            <div className="mb-6 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Select Your Staff Role *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id)}
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
                          {r.id} Access
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-ping" />
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  type="text"
                  icon={User}
                  placeholder={role === 'Doctor' ? 'Dr. Sarah Jenkins' : 'Jane Doe'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />

                <Input
                  label="Email Address *"
                  type="email"
                  icon={Mail}
                  placeholder="name@medpulse.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
              </div>

              {/* Dynamic Role Fields */}
              {role === 'Doctor' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Specialization / Department *"
                    options={departmentOptions}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />

                  <Input
                    label="Medical License No. *"
                    type="text"
                    icon={BadgeCheck}
                    placeholder="LIC-2026-8842"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    error={errors.licenseNo}
                  />
                </div>
              )}

              {role === 'Receptionist' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Staff Employee ID *"
                    type="text"
                    icon={BadgeCheck}
                    placeholder="EMP-STAFF-902"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    error={errors.employeeId}
                  />

                  <Select
                    label="Assigned Department *"
                    options={['Frontdesk & Check-in', 'Patient Admissions', 'Outpatient Queue', 'Billing Desk']}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              )}

              {role === 'Admin' && (
                <Input
                  label="Security Clearance Code *"
                  type="password"
                  icon={Lock}
                  placeholder="Enter admin authorization key"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  error={errors.adminCode}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password *"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />

                <Input
                  label="Confirm Password *"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  className="rounded bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  I agree to the <span className="text-orange-600 dark:text-orange-400 font-semibold underline">Clinical Staff Terms</span> & <span className="text-orange-600 dark:text-orange-400 font-semibold underline">HIPAA Privacy Policy</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                icon={ArrowRight}
                className="w-full mt-3 py-3.5 text-sm font-bold shadow-lg shadow-orange-500/30"
              >
                Register Account as {role}
              </Button>
            </form>

            {/* Mobile Sign In Link */}
            <div className="mt-6 text-center lg:hidden">
              <Link to="/login" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline">
                Already registered? Sign In &rarr;
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
