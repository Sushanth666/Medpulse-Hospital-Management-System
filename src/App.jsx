import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { HospitalProvider } from './context/HospitalContext';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Doctors } from './pages/Doctors';
import { Appointments } from './pages/Appointments';
import { BedManagement } from './pages/BedManagement';
import { Pharmacy } from './pages/Pharmacy';
import { Billing } from './pages/Billing';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export default function App() {
  // Continuous Scrolling Browser Tab Title Marquee
  useEffect(() => {
    const titleText = "MedPulse | Next-Gen Hospital Management System  •  Real-Time Clinical Telemetry  •  ";
    let index = 0;
    const interval = setInterval(() => {
      document.title = titleText.substring(index) + titleText.substring(0, index);
      index = (index + 1) % titleText.length;
    }, 220);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <HospitalProvider>
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Dashboard Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/beds" element={<BedManagement />} />
                    <Route path="/pharmacy" element={<Pharmacy />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </HospitalProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
