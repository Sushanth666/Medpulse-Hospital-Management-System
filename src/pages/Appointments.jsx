import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useToast } from '../context/ToastContext';
import { Table } from '../components/common/Table';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { BookAppointmentModal } from '../components/modals/BookAppointmentModal';
import {
  Calendar,
  Search,
  Plus,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Play,
  FileText
} from 'lucide-react';

export const Appointments = () => {
  const { appointments, doctors, updateAppointmentStatus } = useHospital();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      apt.id.toLowerCase().includes(search.toLowerCase()) ||
      apt.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? apt.status === statusFilter : true;
    const matchesDoctor = doctorFilter ? apt.doctorId === doctorFilter : true;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    addToast(`Appointment status updated to ${newStatus}`, 'info');
  };

  const columns = [
    {
      header: 'Patient',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.patientName}</span>
          <span className="text-[11px] text-slate-400">{row.patientId}</span>
        </div>
      )
    },
    {
      header: 'Doctor & Dept',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">{row.doctorName}</span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{row.department}</span>
        </div>
      )
    },
    {
      header: 'Date & Time',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.date} at {row.time}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      cellClassName: 'text-xs text-slate-600 dark:text-slate-400 font-medium'
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: 'Status Update Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status === 'Upcoming' && (
            <Button
              variant="outline"
              size="sm"
              icon={Play}
              onClick={() => handleStatusChange(row.id, 'In-Progress')}
            >
              Start
            </Button>
          )}
          {row.status === 'In-Progress' && (
            <Button
              variant="secondary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleStatusChange(row.id, 'Completed')}
            >
              Complete
            </Button>
          )}
          {row.status !== 'Cancelled' && row.status !== 'Completed' && (
            <Button
              variant="ghost"
              size="sm"
              icon={XCircle}
              className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              onClick={() => handleStatusChange(row.id, 'Cancelled')}
            >
              Cancel
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Appointment Management ({appointments.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Outpatient scheduling, consultations, and triage bookings across all departments
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsBookModalOpen(true)}>
          Book Appointment
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1">
          <Input
            icon={Search}
            placeholder="Search patient, doctor, department, or appointment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56">
          <Select
            placeholder="All Doctors"
            options={doctors.map(d => ({ value: d.id, label: d.name }))}
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            placeholder="All Statuses"
            options={['Upcoming', 'In-Progress', 'Completed', 'Cancelled']}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <Table columns={columns} data={filteredAppointments} emptyMessage="No appointments matched your query" />
      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
    </div>
  );
};
