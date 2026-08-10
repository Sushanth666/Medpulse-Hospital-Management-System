import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { getDoctorAvatar } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Drawer } from '../components/common/Drawer';
import { EditDoctorModal } from '../components/modals/EditDoctorModal';
import {
  UserCheck,
  Search,
  Plus,
  Star,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Edit,
  LayoutGrid,
  List,
  Calendar,
  ChevronDown
} from 'lucide-react';

export const Doctors = () => {
  const { doctors } = useHospital();

  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [doctorToEdit, setDoctorToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || null;

  // Dynamic unique specializations list
  const specializations = Array.from(new Set(doctors.map(d => d.specialization))).sort();

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = specFilter ? d.specialization === specFilter : true;
    const matchesStatus = statusFilter ? d.status === statusFilter : true;
    return matchesSearch && matchesSpec && matchesStatus;
  });

  const handleEdit = (doc) => {
    setDoctorToEdit(doc);
    setIsEditModalOpen(true);
  };

  const handleAddNew = () => {
    setDoctorToEdit(null);
    setIsEditModalOpen(true);
  };

  // Helper to generate weekly roster schedule
  const getWeeklyRoster = (doc) => {
    if (!doc) return [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const isOffDuty = doc.status === 'Off Duty';
    const isOnCall = doc.status === 'On Call';

    return days.map((day, idx) => {
      if (isOffDuty && (idx === 5 || idx === 6 || idx === 0)) {
        return { day, shift: 'Off Duty', time: 'Rest Day', location: 'N/A', status: 'off' };
      }
      if (isOnCall && (idx === 2 || idx === 5)) {
        return { day, shift: 'On Call / Emergency', time: '24-Hour Cover', location: 'Emergency Trauma Care', status: 'call' };
      }
      if (idx === 6) {
        return { day, shift: 'Off Duty', time: 'Rest Day', location: 'N/A', status: 'off' };
      }
      const shifts = [
        { shift: 'Morning Shift', time: doc.workingHours || '08:00 AM - 04:00 PM', location: `${doc.specialization} OPD Wing` },
        { shift: 'Evening Shift', time: '02:00 PM - 10:00 PM', location: 'Inpatient Ward 3B' },
        { shift: 'Full Day Duty', time: '08:00 AM - 06:00 PM', location: 'Main Surgery Block' }
      ];
      const shiftInfo = shifts[idx % shifts.length];
      return { day, ...shiftInfo, status: 'active' };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Medical Staff Directory ({doctors.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Doctor rosters, duty schedules, and specialty management across 20+ departments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              aria-label="Table View"
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleAddNew}>
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1">
          <Input
            icon={Search}
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56">
          <Select
            placeholder="All Specializations"
            options={specializations}
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            placeholder="All Duty Statuses"
            options={['On Duty', 'On Call', 'Off Duty']}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm card-hover-effect hover:z-20 focus-within:z-20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <img
                      src={doc.avatar || getDoctorAvatar(doc.name, 'f97316')}
                      alt={doc.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getDoctorAvatar(doc.name, 'f97316');
                      }}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border-2 border-orange-500/30 shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{doc.name}</h4>
                      <p className="text-[11px] sm:text-xs text-orange-600 dark:text-orange-400 font-semibold truncate">{doc.specialization}</p>
                    </div>
                  </div>
                  <Badge status={doc.status} className="flex-shrink-0">{doc.status}</Badge>
                </div>

                <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Experience:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{doc.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rating:</span>
                    <span className="font-semibold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Patients:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{doc.totalPatients}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Consultation Fee:</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{doc.consultationFee}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 relative z-10">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Calendar}
                  className="flex-1 whitespace-nowrap text-xs py-2 px-2.5 sm:px-3 min-h-[38px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDoctorId(doc.id);
                  }}
                >
                  View Roster
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  title="Edit Doctor Details"
                  aria-label="Edit Doctor"
                  className="min-h-[38px] min-w-[38px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(doc);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Specialty</th>
                  <th className="p-3">Duty Status</th>
                  <th className="p-3">Working Hours</th>
                  <th className="p-3">Fee</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={doc.avatar || getDoctorAvatar(doc.name, '2563eb')}
                        alt={doc.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getDoctorAvatar(doc.name, '2563eb');
                        }}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{doc.name}</span>
                        <span className="block text-[10px] text-slate-400">{doc.email}</span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{doc.specialization}</td>
                    <td className="p-3"><Badge status={doc.status}>{doc.status}</Badge></td>
                    <td className="p-3 text-slate-500">{doc.workingHours}</td>
                    <td className="p-3 font-bold text-teal-600">{doc.consultationFee}</td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Calendar}
                        title="View Roster"
                        aria-label="View Roster"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctorId(doc.id);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        title="Edit Doctor"
                        aria-label="Edit Doctor"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(doc);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctor Schedule Drawer */}
      <Drawer
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctorId(null)}
        title={`Doctor Roster: ${selectedDoctor?.name || ''}`}
        footer={
          selectedDoctor ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={Edit}
                className="flex-1 min-h-[42px]"
                onClick={() => {
                  handleEdit(selectedDoctor);
                  setSelectedDoctorId(null);
                }}
              >
                Edit Profile
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="px-6 min-h-[42px]"
                onClick={() => setSelectedDoctorId(null)}
              >
                Done
              </Button>
            </div>
          ) : null
        }
      >
        {selectedDoctor && (
          <div className="space-y-6">
            {/* 1. DOCTOR DETAILS CARD (SHOWN FIRST AT THE VERY TOP) */}
            <div className="p-4 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-100 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 rounded-3xl border border-orange-500/20 dark:border-slate-800 shadow-sm space-y-4">
              {/* Doctor Avatar & Key Info */}
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor.avatar || getDoctorAvatar(selectedDoctor.name, '2563eb')}
                  alt={selectedDoctor.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getDoctorAvatar(selectedDoctor.name, '2563eb');
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-orange-500 shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 truncate">{selectedDoctor.name}</h4>
                  <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-bold">{selectedDoctor.specialization}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge status={selectedDoctor.status}>{selectedDoctor.status}</Badge>
                    <span className="text-xs text-amber-500 font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-current" /> {selectedDoctor.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Experience</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">{selectedDoctor.experience}</span>
                </div>
                <div className="border-x border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Patients</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">{selectedDoctor.totalPatients}+</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Fee</span>
                  <span className="font-extrabold text-teal-600 dark:text-teal-400">{selectedDoctor.consultationFee}</span>
                </div>
              </div>

              {/* Full Contact & Duty Details */}
              <div className="space-y-2 p-3 bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
                <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/60 flex-wrap gap-1">
                  <span className="flex items-center gap-2 text-slate-500 font-medium">
                    <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" /> Working Hours
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedDoctor.workingHours}</span>
                </p>
                <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/60 flex-wrap gap-1">
                  <span className="flex items-center gap-2 text-slate-500 font-medium">
                    <Phone className="w-4 h-4 text-teal-500 flex-shrink-0" /> Contact Phone
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedDoctor.phone}</span>
                </p>
                <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1 flex-wrap gap-1">
                  <span className="flex items-center gap-2 text-slate-500 font-medium">
                    <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" /> Email Address
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[180px] sm:max-w-none">{selectedDoctor.email}</span>
                </p>
              </div>
            </div>

            {/* 2. WEEKLY DUTY ROSTER SCHEDULE (MIDDLE SECTION) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <h5 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" /> Weekly Duty Schedule
                </h5>
                <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-500/30 flex items-center gap-1 shadow-2xs">
                  Scroll Roster <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                </span>
              </div>

              {/* Weekly Duty Cards */}
              <div className="space-y-2.5 pb-6">
                {getWeeklyRoster(selectedDoctor).map((item, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs ${
                      item.status === 'off'
                        ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 opacity-75'
                        : item.status === 'call'
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-900/50'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-orange-400 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{item.day}</span>
                        {item.status === 'call' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white uppercase tracking-wider">On Call</span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-0.5">{item.shift}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.location}</p>
                    </div>
                    <div className="self-start sm:self-auto">
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-xl inline-block shadow-2xs ${
                        item.status === 'off'
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          : item.status === 'call'
                          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-300/40'
                          : 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-200 border border-teal-300/40'
                      }`}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit Doctor Modal */}
      <EditDoctorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        doctorToEdit={doctorToEdit}
      />
    </div>
  );
};
