import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';

export const AssignBedModal = ({ isOpen, onClose, selectedBed }) => {
  const { patients, assignBed } = useHospital();
  const { addToast } = useToast();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setError('Please select a patient to assign');
      return;
    }
    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient || !selectedBed) return;

    assignBed(selectedBed.id, patient.id, patient.name);
    addToast(`Bed ${selectedBed.bedNumber} assigned to ${patient.name}`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Bed ${selectedBed?.bedNumber || ''}`}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Confirm Assignment</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
          <p><span className="font-semibold">Ward:</span> {selectedBed?.ward}</p>
          <p><span className="font-semibold">Type:</span> {selectedBed?.type}</p>
          <p><span className="font-semibold">Rate:</span> ${selectedBed?.pricePerDay} / day</p>
        </div>

        <Select
          label="Select Patient *"
          placeholder="-- Select Patient --"
          options={patients.map(p => ({ value: p.id, label: `${p.name} (${p.id} - ${p.department})` }))}
          value={selectedPatientId}
          onChange={(e) => {
            setSelectedPatientId(e.target.value);
            setError('');
          }}
          error={error}
        />
      </form>
    </Modal>
  );
};
