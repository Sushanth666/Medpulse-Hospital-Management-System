import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Select } from '../components/common/Select';
import { AssignBedModal } from '../components/modals/AssignBedModal';
import {
  BedDouble,
  UserPlus,
  LogOut,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Activity,
  Heart,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Building2,
  Cpu,
  Thermometer,
  Zap,
  Sparkles,
  Layers,
  Grid,
  Maximize2
} from 'lucide-react';
import { getDoctorAvatar } from '../data/mockData';

export const BedManagement = () => {
  const { beds, patients, assignBed, releaseBed, updateBedStatus } = useHospital();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('blueprint'); // 'blueprint' | 'grid'

  // Wards List
  const wards = ['All', ...Array.from(new Set(beds.map(b => b.ward)))];

  // Filtered beds
  const filteredBeds = beds.filter(b => {
    const matchesWard = selectedWard === 'All' || b.ward === selectedWard;
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
    const matchesSearch =
      b.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.patientName && b.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesWard && matchesStatus && matchesSearch;
  });

  // Telemetry metrics
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const availableBeds = beds.filter(b => b.status === 'Available').length;
  const maintenanceBeds = beds.filter(b => b.status === 'Maintenance').length;
  const reservedBeds = beds.filter(b => b.status === 'Reserved').length;
  const icuBeds = beds.filter(b => b.ward === 'Intensive Care Unit');
  const icuOccupied = icuBeds.filter(b => b.status === 'Occupied').length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const handleConfirmAssign = (bedId, patientId, patientName) => {
    assignBed(bedId, patientId, patientName);
    const bedObj = beds.find(b => b.id === bedId);
    addToast(`Bed ${bedObj?.bedNumber || bedId} allocated to ${patientName}!`, 'success');
  };

  const handleRelease = (bed) => {
    if (window.confirm(`Release Bed ${bed.bedNumber} occupied by ${bed.patientName}?`)) {
      releaseBed(bed.id);
      addToast(`Bed ${bed.bedNumber} released & cleared for sterilization!`, 'success');
    }
  };

  const handleToggleMaintenance = (bed) => {
    const newStatus = bed.status === 'Maintenance' ? 'Available' : 'Maintenance';
    updateBedStatus(bed.id, newStatus);
    addToast(`Bed ${bed.bedNumber} status updated to ${newStatus}`, 'info');
  };

  // Group beds by ward for Blueprint view
  const bedsByWard = beds.reduce((acc, bed) => {
    if (!acc[bed.ward]) acc[bed.ward] = [];
    acc[bed.ward].push(bed);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header & Live Operational Telemetry Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400">
              <Building2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Inpatient Ward Telemetry Hub
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 animate-pulse">
                  Live Sync
                </span>
              </h1>
              <p className="text-xs text-slate-300">
                Real-time bed allocation, ICU capacity telemetry, and ward occupancy analytics
              </p>
            </div>
          </div>
        </div>

        {/* Live Occupancy Gauge Pill */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 relative z-10">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold gap-4">
              <span className="text-slate-300">Overall Occupancy Rate</span>
              <span className="text-teal-300 font-extrabold">{occupancyRate}% Capacity</span>
            </div>
            <div className="w-48 h-2 rounded-full bg-slate-700/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-rose-500 transition-all duration-500"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Total Capacity</span>
            <BedDouble className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalBeds}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Facility Beds</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/30 border border-emerald-500/30 shadow-xs">
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-bold">Vacant & Ready</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{availableBeds}</h3>
          <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">Ready for Admission</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/30 border border-rose-500/30 shadow-xs">
          <div className="flex justify-between items-center text-rose-600 dark:text-rose-400">
            <span className="text-xs font-bold">Occupied Beds</span>
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{occupiedBeds}</h3>
          <p className="text-[10px] text-rose-600/70 dark:text-rose-400/70 mt-0.5">Active Inpatients</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/30 border border-amber-500/30 shadow-xs">
          <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
            <span className="text-xs font-bold">ICU Telemetry</span>
            <Heart className="w-4 h-4 animate-bounce text-rose-500" />
          </div>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {icuOccupied} / {icuBeds.length}
          </h3>
          <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">ICU Beds Occupied</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Maintenance</span>
            <RefreshCw className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{maintenanceBeds}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Sanitizing / Servicing</p>
        </div>
      </div>

      {/* Control Toolbar: Filters & View Switcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Bed #, Ward, or Patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-teal-500"
          />
        </div>

        {/* Ward Filter Pills - Sleek Capsule Bar without Scrollbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {wards.map((w) => {
            const isSelected = selectedWard === w;
            const count = w === 'All' ? beds.length : beds.filter(b => b.ward === w).length;
            const shortName =
              w === 'Intensive Care Unit' ? 'ICU' :
              w === 'Emergency Ward' ? 'Emergency' :
              w === 'General Ward' ? 'General' :
              w === 'VIP Deluxe Suite' ? 'VIP Suites' :
              w === 'Pediatric Ward' ? 'Pediatrics' :
              w === 'Surgical Recovery Ward' ? 'Surgical' : w;

            return (
              <button
                key={w}
                onClick={() => setSelectedWard(w)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-md shadow-orange-500/25 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                }`}
                title={w}
              >
                <span>{shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status Filter Dropdown & View Mode */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none cursor-pointer h-7 rounded-md max-w-[115px]"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Occupied">Occupied Only</option>
            <option value="Maintenance">Maintenance Only</option>
          </select>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1">
            <button
              onClick={() => setViewMode('blueprint')}
              className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'blueprint'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Ward Blueprint View"
            >
              <Layers className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Flat Grid View"
            >
              <Grid className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Ward Blueprint Architectural View */}
      {viewMode === 'blueprint' && (
        <div className="space-y-6">
          {Object.keys(bedsByWard)
            .filter(ward => selectedWard === 'All' || ward === selectedWard)
            .map(wardName => {
              const wardBeds = bedsByWard[wardName];
              const matchesFilter = wardBeds.filter(b => {
                const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
                const matchesSearch =
                  b.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (b.patientName && b.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
                return matchesStatus && matchesSearch;
              });

              if (matchesFilter.length === 0 && (selectedStatus !== 'All' || searchQuery)) return null;

              const wardOccupied = wardBeds.filter(b => b.status === 'Occupied').length;
              const wardPct = Math.round((wardOccupied / wardBeds.length) * 100);

              return (
                <div
                  key={wardName}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
                        {wardName}
                        <span className="text-xs text-slate-400 font-normal">({wardBeds.length} Bed Pods)</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Capacity Usage: <span className="font-bold text-teal-600 dark:text-teal-400">{wardOccupied} / {wardBeds.length} Occupied</span> ({wardPct}%)
                      </p>
                    </div>
                    <div className="w-full sm:w-48 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-emerald-500"
                        style={{ width: `${wardPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {matchesFilter.map((bed) => (
                      <BedPodCard
                        key={bed.id}
                        bed={bed}
                        patients={patients}
                        onConfirmAssign={handleConfirmAssign}
                        onRelease={() => handleRelease(bed)}
                        onToggleMaintenance={() => handleToggleMaintenance(bed)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Mode 2: Flat Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {filteredBeds.map((bed) => (
            <BedPodCard
              key={bed.id}
              bed={bed}
              patients={patients}
              onConfirmAssign={handleConfirmAssign}
              onRelease={() => handleRelease(bed)}
              onToggleMaintenance={() => handleToggleMaintenance(bed)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable Visual Bed Pod Card Component with Inline Allocation
const BedPodCard = ({ bed, patients = [], onConfirmAssign, onRelease, onToggleMaintenance }) => {
  const isOccupied = bed.status === 'Occupied';
  const isAvailable = bed.status === 'Available';
  const isMaintenance = bed.status === 'Maintenance';

  const [isAllocating, setIsAllocating] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 card-hover-effect flex flex-col justify-between relative overflow-hidden ${
        isOccupied
          ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/40 shadow-rose-500/5'
          : isAvailable
          ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500 shadow-emerald-500/5'
          : 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/40 shadow-amber-500/5'
      }`}
    >
      {/* Top Pod Header */}
      <div>
        <div className="flex items-start justify-between gap-1 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <BedDouble className={`w-4 h-4 ${isOccupied ? 'text-rose-500 animate-pulse' : isAvailable ? 'text-emerald-500' : 'text-amber-500'}`} />
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                {bed.bedNumber}
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5 truncate">
              {bed.ward}
            </span>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
              isOccupied
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                : isAvailable
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-rose-500 animate-ping' : isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {bed.status}
          </span>
        </div>

        {/* Equipment & Details */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Pod Type:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]" title={bed.type}>
              {bed.type}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Rate:</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">${bed.pricePerDay}/day</span>
          </div>

          {/* Occupied State Details */}
          {isOccupied && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 space-y-1.5 mt-2">
              <div className="flex items-center gap-2">
                <img
                  src={getDoctorAvatar(bed.patientName || 'P')}
                  alt="Patient"
                  className="w-6 h-6 rounded-full border border-rose-400/40"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Assigned Patient</p>
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                    {bed.patientName}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                <span>Admitted:</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">{bed.assignedDate}</span>
              </div>
            </div>
          )}

          {/* Maintenance State */}
          {isMaintenance && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 space-y-1 mt-2">
              <div className="flex items-center justify-between font-bold text-[10px] uppercase">
                <span>Sterilization Status</span>
                <span>In Progress</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-amber-200 dark:bg-amber-900 overflow-hidden">
                <div className="h-full bg-amber-500 animate-pulse w-3/4" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline Allocation Widget Container */}
      {isAvailable && isAllocating && (
        <div className="mt-3 p-3 rounded-2xl bg-orange-50/90 dark:bg-slate-800/90 border border-orange-500/30 space-y-2.5 animate-fade-in text-xs">
          <label className="block text-[10px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Select Patient to Admit
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-slate-100 cursor-pointer"
          >
            <option value="">-- Choose Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.department})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsAllocating(false);
                setSelectedPatientId('');
              }}
              className="flex-1 py-1.5 px-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedPatientId}
              onClick={() => {
                const p = patients.find(pat => pat.id === selectedPatientId);
                if (p) {
                  onConfirmAssign(bed.id, p.id, p.name);
                  setIsAllocating(false);
                  setSelectedPatientId('');
                }
              }}
              className="flex-1 py-1.5 px-2 text-[11px] font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-xs hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Pod Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
        {isAvailable && !isAllocating && (
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs py-2 rounded-xl shadow-md shadow-orange-500/30"
            onClick={() => setIsAllocating(true)}
          >
            Allocate Patient
          </Button>
        )}

        {isOccupied && (
          <Button
            variant="outline"
            size="sm"
            icon={LogOut}
            className="w-full text-rose-600 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold py-2 rounded-xl"
            onClick={onRelease}
          >
            Release & Discharge
          </Button>
        )}

        {isMaintenance && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCircle2}
            className="w-full text-emerald-600 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold py-2 rounded-xl"
            onClick={onToggleMaintenance}
          >
            Mark Ready
          </Button>
        )}
      </div>
    </div>
  );
};
