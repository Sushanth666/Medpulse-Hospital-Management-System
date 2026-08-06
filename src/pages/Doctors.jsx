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
  Calendar
} from 'lucide-react';

export const Doctors = () => {
  const { doctors } = useHospital();

  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToEdit, setDoctorToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatar || getDoctorAvatar(doc.name, 'f97316')}
                      alt={doc.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getDoctorAvatar(doc.name, 'f97316');
                      }}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-500/30 shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{doc.name}</h4>
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">{doc.specialization}</p>
                    </div>
                  </div>
                  <Badge status={doc.status}>{doc.status}</Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
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

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedDoctor(doc)}
                >
                  View Roster
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(doc)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
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
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="sm" icon={Calendar} onClick={() => setSelectedDoctor(doc)} />
                      <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEdit(doc)} />
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
        onClose={() => setSelectedDoctor(null)}
        title={`Doctor Roster: ${selectedDoctor?.name}`}
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
              <img
                src={selectedDoctor.avatar || getDoctorAvatar(selectedDoctor.name, '2563eb')}
                alt={selectedDoctor.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getDoctorAvatar(selectedDoctor.name, '2563eb');
                }}
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedDoctor.name}</h4>
                <p className="text-xs text-blue-600 font-semibold">{selectedDoctor.specialization}</p>
                <Badge status={selectedDoctor.status} className="mt-1">{selectedDoctor.status}</Badge>
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
              <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-blue-500" />
                Working Hours: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDoctor.workingHours}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-teal-500" />
                Phone: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDoctor.phone}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-amber-500" />
                Email: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDoctor.email}</span>
              </p>
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
