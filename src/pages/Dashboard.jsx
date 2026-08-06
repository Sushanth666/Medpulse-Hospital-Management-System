import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { AdmitPatientModal } from '../components/modals/AdmitPatientModal';
import { BookAppointmentModal } from '../components/modals/BookAppointmentModal';
import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
import {
  Users,
  UserCheck,
  Calendar,
  BedDouble,
  DollarSign,
  AlertTriangle,
  Plus,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  CHART_DATA_PATIENT_TRENDS,
  CHART_DATA_REVENUE,
  CHART_DATA_BED_OCCUPANCY
} from '../data/mockData';

export const Dashboard = () => {
  const { patients, doctors, appointments, beds, invoices, notifications } = useHospital();

  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Calculated KPI numbers
  const totalPatients = patients.length;
  const activeDoctors = doctors.filter(d => d.status === 'On Duty').length;
  const todayAppointments = appointments.filter(a => a.status === 'Upcoming' || a.status === 'In-Progress').length;
  const availableBeds = beds.filter(b => b.status === 'Available').length;
  const totalBeds = beds.length;
  const occupancyRate = Math.round(((totalBeds - availableBeds) / totalBeds) * 100);
  const criticalCount = patients.filter(p => p.triageStatus === 'Critical').length;
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + Number(inv.total), 0);

  return (
    <div className="space-y-6">
      {/* Live Telemetry Marquee Ticker */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-2.5 overflow-hidden border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 px-2.5 py-1 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            LIVE FEED
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee gap-8 text-xs font-medium text-slate-300">
              <span>🚨 ICU Unit-04 Patient Eleanor Vance Vitals Normalizing</span>
              <span>•</span>
              <span>💊 Pharmacy Restock Required for Lisinopril 10mg</span>
              <span>•</span>
              <span>👨‍⚕️ Dr. Sarah Jenkins On Duty - Cardiology OPD</span>
              <span>•</span>
              <span>🛏️ 4 Beds Available in Emergency Ward</span>
              <span>•</span>
              <span>💳 New Invoice #INV-2026-0728 Paid in Full ($13,045.00)</span>
              <span>•</span>
              <span>🚨 ICU Unit-04 Patient Eleanor Vance Vitals Normalizing</span>
              <span>•</span>
              <span>💊 Pharmacy Restock Required for Lisinopril 10mg</span>
              <span>•</span>
              <span>👨‍⚕️ Dr. Sarah Jenkins On Duty - Cardiology OPD</span>
              <span>•</span>
              <span>🛏️ 4 Beds Available in Emergency Ward</span>
              <span>•</span>
              <span>💳 New Invoice #INV-2026-0728 Paid in Full ($13,045.00)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Executive Overview</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time medical operational metrics & facility analytics
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary" icon={Plus} onClick={() => setIsAdmitModalOpen(true)}>
            Admit Patient
          </Button>
          <Button variant="secondary" icon={Calendar} onClick={() => setIsBookModalOpen(true)}>
            Book Appointment
          </Button>
          <Button variant="outline" icon={FileSpreadsheet} onClick={() => setIsInvoiceModalOpen(true)}>
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Emergency Alert Banner if Critical Patients exist */}
      {criticalCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
              <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Critical Alert Notice</h4>
              <p className="text-xs text-white/90">
                {criticalCount} critical patient(s) currently require intensive care supervision in ICU/Emergency.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md hidden sm:inline-block">
            Priority Tier 1
          </span>
        </div>
      )}

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          change="+12%"
          isPositive={true}
          icon={Users}
          color="orange"
        />
        <StatCard
          title="On-Duty Doctors"
          value={`${activeDoctors} / ${doctors.length}`}
          change="Optimal"
          isPositive={true}
          icon={UserCheck}
          color="emerald"
        />
        <StatCard
          title="Active Appointments"
          value={todayAppointments}
          change="+8%"
          isPositive={true}
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Available Beds"
          value={`${availableBeds} (${occupancyRate}% Occ)`}
          change={occupancyRate > 75 ? 'High Occ' : 'Normal'}
          isPositive={occupancyRate < 80}
          icon={BedDouble}
          color="amber"
        />
        <StatCard
          title="Paid Revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}k`}
          change="+15%"
          isPositive={true}
          icon={DollarSign}
          color="orange"
        />
        <StatCard
          title="Critical Cases"
          value={criticalCount}
          change={criticalCount > 0 ? 'Urgent' : 'Clear'}
          isPositive={criticalCount === 0}
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Admission Trends Area Chart */}
        <Card
          title="Patient Admission Trends"
          subtitle="Monthly admissions broken down by department type"
          className="lg:col-span-2"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA_PATIENT_TRENDS}>
                <defs>
                  <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInpatient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutpatient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Outpatient" stroke="#10b981" fillOpacity={1} fill="url(#colorOutpatient)" />
                <Area type="monotone" dataKey="Inpatient" stroke="#f97316" fillOpacity={1} fill="url(#colorInpatient)" />
                <Area type="monotone" dataKey="Emergency" stroke="#ef4444" fillOpacity={1} fill="url(#colorEmergency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bed Occupancy Donut Chart */}
        <Card title="Bed Status Distribution" subtitle="Real-time capacity across hospital wards">
          <div className="h-72 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={CHART_DATA_BED_OCCUPANCY}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CHART_DATA_BED_OCCUPANCY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Second Row Grid: Revenue Bar Chart & Recent Check-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expense Bar Chart */}
        <Card title="Financial Performance" subtitle="Monthly Revenue vs Operating Expenses ($)" className="lg:col-span-2">
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA_REVENUE}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expenses" fill="#64748b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Today's Appointments Feed */}
        <Card title="Today's Appointments" subtitle="Scheduled clinical consultations">
          <div className="space-y-3">
            {appointments.slice(0, 4).map((apt) => (
              <div
                key={apt.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    {apt.time.split(':')[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{apt.patientName}</h5>
                    <p className="text-[11px] text-slate-500">{apt.doctorName} • {apt.department}</p>
                  </div>
                </div>
                <Badge status={apt.status}>{apt.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Modals */}
      <AdmitPatientModal isOpen={isAdmitModalOpen} onClose={() => setIsAdmitModalOpen(false)} />
      <BookAppointmentModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
      <CreateInvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} />
    </div>
  );
};
