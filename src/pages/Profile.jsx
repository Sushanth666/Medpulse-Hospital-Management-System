import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useHospital } from '../context/HospitalContext';
import { useToast } from '../context/ToastContext';
import { getDoctorAvatar } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import {
  User,
  Shield,
  Sun,
  Moon,
  RotateCcw,
  Save,
  Lock,
  Mail,
  Building,
  CheckCircle2,
  Camera,
  Upload,
  UserCircle,
  Sparkles,
  Award,
  KeyRound,
  Sliders,
  Check
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetAllDataToDefaults } = useHospital();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'preferences'

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Dr. Sarah Jenkins',
    email: user?.email || 'sarah.jenkins@medpulse.org',
    department: user?.department || 'Cardiology',
    role: user?.role || 'Admin'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile(profileData);
    addToast('Profile details updated successfully', 'success');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Avatar = event.target.result;
      updateUserProfile({ avatar: base64Avatar });
      addToast('Account profile picture updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSetLetterAvatar = () => {
    const letterAvatar = getDoctorAvatar(profileData.name);
    updateUserProfile({ avatar: letterAvatar });
    addToast(`Set account picture to First-Letter (${profileData.name.replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase()}) Avatar`, 'info');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    addToast('Security password changed successfully', 'success');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all mock data to system defaults? This will restore original initial patients, doctors, beds, and invoices.')) {
      resetAllDataToDefaults();
      addToast('All hospital data reset to factory defaults', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8 animate-fade-in">
      {/* Premium Hero Profile Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 border border-slate-700/60 shadow-xl">
        {/* Background Decorative Ambient Glow Circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Main Avatar Frame */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img
              src={user?.avatar || getDoctorAvatar(user?.name || 'Admin')}
              alt="User Avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDoctorAvatar(user?.name || 'Admin');
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-orange-500/50 shadow-2xl shadow-orange-500/20 group-hover:opacity-90 transition-all duration-300 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="w-8 h-8 text-white animate-bounce" />
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center" title="Online Status">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>

          {/* Hero User Credentials Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {profileData.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {profileData.role || 'Admin'} Access
              </span>
            </div>

            <p className="text-xs font-medium text-slate-300 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-orange-400" />
              <span>{profileData.email}</span>
            </p>

            {/* Quick Badges Row */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-semibold text-slate-300">
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                {profileData.department} Dept
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Credentials
              </span>
              <span className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                HIPAA Certified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Segmented Pill Navigation Tabs */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between sm:justify-start gap-1 shadow-inner">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Information</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'security'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'preferences'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Theme & Reset Data</span>
        </button>
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <Card title="Personal Roster Details" subtitle="Update your official staff credentials and avatar representation" className="shadow-lg">
          <form onSubmit={handleProfileSave} className="space-y-5">
            {/* Profile Picture Settings Sub-Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-orange-500" />
                    Account Profile Picture
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Upload a custom image or use your initial letter avatar
                  </p>
                </div>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Check className="w-3 h-3" />
                  Active Picture
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Avatar Display with Camera Overlay */}
                <div className="relative group cursor-pointer flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
                  <img
                    src={user?.avatar || getDoctorAvatar(user?.name || 'Admin')}
                    alt="Avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getDoctorAvatar(user?.name || 'Admin');
                    }}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500/40 shadow-md group-hover:opacity-85 transition-all"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <button
                    type="button"
                    title="Upload Image"
                    className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:scale-110 transition-transform"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex-1 space-y-2.5 text-center sm:text-left">
                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={UserCircle}
                      onClick={handleSetLetterAvatar}
                      className="text-xs font-bold"
                    >
                      Use First Letter Avatar ({profileData.name.replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase() || 'U'})
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={Upload}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold"
                    >
                      Upload Profile Image
                    </Button>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium">
                    Supports PNG, JPG, WEBP formats (Max 5MB). Changes update automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                icon={User}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>

            <Select
              label="Department"
              options={['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine']}
              value={profileData.department}
              onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" icon={Save} size="lg" className="px-6 py-2.5 text-sm font-bold shadow-lg shadow-orange-500/30">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <Card title="Update Password" subtitle="Ensure your staff portal password meets hospital security standards" className="shadow-lg">
          <form onSubmit={handlePasswordSave} className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="font-medium">
                Password must contain at least 8 characters including letters, numbers, and special symbols.
              </p>
            </div>

            <Input
              label="Current Password"
              type="password"
              icon={Lock}
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />

              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" icon={Shield} size="lg" className="px-6 py-2.5 text-sm font-bold shadow-lg shadow-orange-500/30">
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: Preferences & Reset */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <Card title="Appearance Theme" subtitle="Toggle light or dark portal color theme">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
                  Dark / Light Mode Toggle
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Currently active: <span className="font-extrabold text-orange-600 dark:text-orange-400 uppercase">{theme} Mode</span>
                </p>
              </div>
              <Button
                variant="outline"
                icon={theme === 'dark' ? Sun : Moon}
                onClick={toggleTheme}
                className="font-bold"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </Button>
            </div>
          </Card>

          <Card title="Demo Factory Reset" subtitle="Restore initial seed data across all clinical modules" className="border-l-4 border-l-rose-500 shadow-lg">
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Clicking the button below will wipe all custom modifications stored in your browser's LocalStorage and restore original initial patients, doctors, beds, pharmacy inventory, and invoice records.
              </p>
              <div className="pt-1 flex justify-start">
                <Button
                  variant="danger"
                  icon={RotateCcw}
                  onClick={handleResetData}
                  className="font-bold py-2.5 px-5 text-xs shadow-md shadow-rose-500/20"
                >
                  Reset All Data to System Defaults
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

