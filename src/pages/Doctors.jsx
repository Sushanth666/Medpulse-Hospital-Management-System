import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { getDoctorAvatar } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
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
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck
} from 'lucide-react';

export const Doctors = () => {
  const { doctors } = useHospital();

  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [expandedDoctorId, setExpandedDoctorId] = useState(null);
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

  const toggleExpand = (id) => {
    setExpandedDoctorId(prev => (prev === id ? null : id));
  };

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
            Doctor credentials, contact info, and specialty management across 20+ departments
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-start">
          {filteredDoctors.map((doc) => {
            const isExpanded = expandedDoctorId === doc.id;
            return (
              <div
                key={doc.id}
                className={`relative group bg-white dark:bg-slate-900 border transition-all duration-200 rounded-2xl p-4 sm:p-5 shadow-sm card-hover-effect flex flex-col justify-between ${
                  isExpanded ? 'ring-2 ring-orange-500/50 border-orange-500/50 dark:border-orange-500/50 z-20' : 'border-slate-200 dark:border-slate-800 hover:z-20'
                }`}
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

                {/* Dropdown Details Card Panel */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-orange-500/20 bg-orange-50/50 dark:bg-slate-800/70 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 rounded-b-2xl space-y-3 animate-fade-in">
                    <h5 className="text-xs font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5" /> Doctor Full Profile
                    </h5>

                    <div className="space-y-2 text-xs">
                      <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1 border-b border-slate-200/60 dark:border-slate-700/60 flex-wrap gap-1">
                        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Working Hours
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{doc.workingHours}</span>
                      </p>

                      <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1 border-b border-slate-200/60 dark:border-slate-700/60 flex-wrap gap-1">
                        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Phone className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" /> Phone Number
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{doc.phone}</span>
                      </p>

                      <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1 border-b border-slate-200/60 dark:border-slate-700/60 flex-wrap gap-1">
                        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Mail className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> Email Address
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[170px]">{doc.email}</span>
                      </p>

                      <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1 flex-wrap gap-1">
                        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" /> Department
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{doc.specialization} OPD</span>
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit}
                        className="w-full text-xs min-h-[36px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(doc);
                        }}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </div>
                )}

                {/* Dropdown Toggle Button */}
                <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 relative z-10">
                  <Button
                    variant={isExpanded ? "primary" : "outline"}
                    size="sm"
                    icon={isExpanded ? ChevronUp : ChevronDown}
                    className="flex-1 whitespace-nowrap text-xs py-2 px-2.5 sm:px-3 min-h-[38px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(doc.id);
                    }}
                  >
                    {isExpanded ? 'Hide Details' : 'Doctor Details'}
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
            );
          })}
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
                {filteredDoctors.map((doc) => {
                  const isExpanded = expandedDoctorId === doc.id;
                  return (
                    <React.Fragment key={doc.id}>
                      <tr className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isExpanded ? 'bg-orange-50/40 dark:bg-slate-800/40' : ''}`}>
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
                            variant={isExpanded ? "primary" : "ghost"}
                            size="sm"
                            icon={isExpanded ? ChevronUp : ChevronDown}
                            title={isExpanded ? "Hide Details" : "View Doctor Details"}
                            aria-label="View Doctor Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(doc.id);
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
                      {/* Table View Collapsible Details Row */}
                      {isExpanded && (
                        <tr className="bg-orange-50/40 dark:bg-slate-800/30">
                          <td colSpan={6} className="p-4 border-b border-orange-500/20 dark:border-slate-800">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contact Info</span>
                                <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{doc.phone}</p>
                                <p className="text-slate-500">{doc.email}</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Working Schedule</span>
                                <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{doc.workingHours}</p>
                                <p className="text-orange-600 font-semibold">{doc.specialization} Wing</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Performance & Fee</span>
                                <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{doc.experience} • {doc.rating} ★</p>
                                <p className="text-teal-600 font-bold">{doc.consultationFee}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      <EditDoctorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        doctorToEdit={doctorToEdit}
      />
    </div>
  );
};
