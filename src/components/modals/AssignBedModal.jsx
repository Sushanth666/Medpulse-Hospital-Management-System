import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';
import { BedDouble, UserPlus, CheckCircle, ShieldCheck, DollarSign, Clock } from 'lucide-react';
import { getDoctorAvatar } from '../../data/mockData';

export const AssignBedModal = ({ isOpen, onClose, selectedBed }) => {
  const { patients, assignBed } = useHospital();
  const { addToast } = useToast();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedPatientId('');
      setError('');
    }
  }, [isOpen]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setError('Please select a patient to allocate to this bed');
      return;
    }
    if (!selectedPatient || !selectedBed) return;

    assignBed(selectedBed.id, selectedPatient.id, selectedPatient.name);
    addToast(`Bed ${selectedBed.bedNumber} allocated to ${selectedPatient.name}`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Allocate Patient: Bed ${selectedBed?.bedNumber || ''}`}
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={UserPlus} onClick={handleSubmit}>
            Confirm Allocation
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bed Target Header Banner */}
        <div className="p-4 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-emerald-500/10 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-orange-500/20 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{selectedBed?.bedNumber}</h4>
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400">{selectedBed?.ward}</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Daily Rate</span>
            <span className="font-extrabold text-teal-600 dark:text-teal-400">${selectedBed?.pricePerDay} / day</span>
          </div>
        </div>

        {/* Patient Selection Input */}
        <Select
          label="Select Patient for Allocation *"
          placeholder="-- Choose Admitted Patient --"
          options={patients.map(p => ({ value: p.id, label: `${p.name} (${p.id} - ${p.department})` }))}
          value={selectedPatientId}
          onChange={(e) => {
            setSelectedPatientId(e.target.value);
            setError('');
          }}
          error={error}
        />

        {/* Selected Patient Live Preview */}
        {selectedPatient && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 animate-fade-in text-xs">
            <div className="flex items-center gap-3">
              <img
                src={getDoctorAvatar(selectedPatient.name, 'f97316')}
                alt={selectedPatient.name}
                className="w-10 h-10 rounded-xl object-cover border border-orange-500/30 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 truncate">{selectedPatient.name}</h5>
                <p className="text-[11px] text-slate-500 font-semibold">{selectedPatient.department} Department</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
              <div>
                <span className="text-slate-400 block">Condition</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPatient.condition || 'Admitted'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Assigned Doctor</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPatient.doctor || 'On Duty Staff'}</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
