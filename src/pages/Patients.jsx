import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useToast } from '../context/ToastContext';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Drawer } from '../components/common/Drawer';
import { AdmitPatientModal } from '../components/modals/AdmitPatientModal';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Trash2,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Phone,
  FileText,
  UserX
} from 'lucide-react';

export const Patients = () => {
  const { patients, deletePatient, updatePatient } = useHospital();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [triageFilter, setTriageFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  // Dynamic departments list
  const departmentsList = Array.from(new Set(patients.map(p => p.department))).sort();

  // Filtering Logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.roomNo.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter ? p.department === departmentFilter : true;
    const matchesTriage = triageFilter ? p.triageStatus === triageFilter : true;
    return matchesSearch && matchesDept && matchesTriage;
  });

  // Pagination Slice
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (patient) => {
    if (window.confirm(`Are you sure you want to remove patient record for ${patient.name}?`)) {
      deletePatient(patient.id);
      if (selectedPatient?.id === patient.id) setSelectedPatient(null);
      addToast(`Deleted record for ${patient.name}`, 'warning');
    }
  };

  const handleDischarge = (patient) => {
    updatePatient(patient.id, { status: 'Discharged', roomNo: 'Outpatient' });
    setSelectedPatient(prev => prev ? { ...prev, status: 'Discharged', roomNo: 'Outpatient' } : null);
    addToast(`Patient ${patient.name} discharged successfully`, 'success');
  };

  const columns = [
    {
      header: 'Patient Info',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shadow-sm">
            {row.name.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">{row.name}</span>
            <span className="text-[11px] text-slate-400">{row.id} • {row.age} yrs • {row.gender}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Department / Room',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">{row.department}</span>
          <span className="text-[11px] text-slate-400 font-mono">{row.roomNo}</span>
        </div>
      )
    },
    {
      header: 'Triage Severity',
      render: (row) => <Badge status={row.triageStatus}>{row.triageStatus}</Badge>
    },
    {
      header: 'Attending Doctor',
      render: (row) => <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{row.doctor}</span>
    },
    {
      header: 'Admission Date',
      accessor: 'admissionDate',
      cellClassName: 'text-xs text-slate-500 font-mono'
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => setSelectedPatient(row)}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            onClick={() => handleDelete(row)}
            title="Delete Record"
          />
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
            Patient Directory ({patients.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage admitted patients, triage assessments, and clinical vitals across 10 departments
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsAdmitModalOpen(true)}>
          Admit Patient
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1">
          <Input
            icon={Search}
            placeholder="Search by patient name, ID (e.g. PAT-1045), or room..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full md:w-56">
          <Select
            placeholder="All Departments"
            options={departmentsList}
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            placeholder="All Triage Levels"
            options={['Critical', 'Serious', 'Stable', 'Under Observation']}
            value={triageFilter}
            onChange={(e) => {
              setTriageFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table & Pagination */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <Table columns={columns} data={paginatedPatients} emptyMessage="No matching patient records found" />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={filteredPatients.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Patient Detail Drawer */}
      <Drawer
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={`Clinical File: ${selectedPatient?.name}`}
        footer={
          selectedPatient?.status === 'Admitted' && (
            <Button variant="danger" icon={UserX} className="w-full" onClick={() => handleDischarge(selectedPatient)}>
              Discharge Patient
            </Button>
          )
        }
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedPatient.name}</h4>
                <p className="text-xs text-slate-500">{selectedPatient.id} • {selectedPatient.gender}, {selectedPatient.age} yrs</p>
                <span className="inline-block mt-1 font-semibold text-xs text-blue-600 dark:text-blue-400">
                  Blood Group: {selectedPatient.bloodGroup}
                </span>
              </div>
              <div className="text-right">
                <Badge status={selectedPatient.triageStatus}>{selectedPatient.triageStatus}</Badge>
                <p className="text-xs text-slate-400 mt-1">Room: {selectedPatient.roomNo}</p>
              </div>
            </div>

            {/* Vitals Summary Grid */}
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Vitals Telemetry</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedPatient.vitals.hr}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedPatient.vitals.bp}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Temperature</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedPatient.vitals.temp}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                  <Wind className="w-5 h-5 text-emerald-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">SpO2 Oxygen</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedPatient.vitals.spo2}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diagnoses & Pre-conditions</h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedPatient.medicalHistory.map((history, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium">
                    {history}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Prescriptions */}
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Prescriptions</h5>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedPatient.activeMeds.map((med, idx) => (
                  <li key={idx} className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    {med}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1">
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400" />
                Emergency Contact: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedPatient.contact}</span>
              </p>
              <p className="text-slate-400 text-[11px] pl-6">Admitted under care of {selectedPatient.doctor}</p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Admit Modal */}
      <AdmitPatientModal isOpen={isAdmitModalOpen} onClose={() => setIsAdmitModalOpen(false)} />
    </div>
  );
};
