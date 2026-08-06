import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';

export const AdmitPatientModal = ({ isOpen, onClose }) => {
  const { addPatient, doctors } = useHospital();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    department: 'Cardiology',
    triageStatus: 'Stable',
    doctor: doctors[0]?.name || 'Dr. Sarah Jenkins',
    contact: '',
    roomNo: 'GEN-101',
    medicalHistory: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Patient name is required';
    if (!formData.age || Number(formData.age) <= 0) errs.age = 'Valid age is required';
    if (!formData.contact.trim()) errs.contact = 'Contact number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addPatient({
      ...formData,
      age: Number(formData.age),
      medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(s => s.trim()) : ['None']
    });

    addToast(`Patient ${formData.name} admitted successfully`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admit New Patient"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Admit Patient</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Age *"
          type="number"
          placeholder="e.g. 45"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          error={errors.age}
        />

        <Select
          label="Gender"
          options={['Male', 'Female', 'Other']}
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        />

        <Select
          label="Blood Group"
          options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
          value={formData.bloodGroup}
          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
        />

        <Select
          label="Department"
          options={['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine']}
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />

        <Select
          label="Triage / Severity Status"
          options={['Critical', 'Serious', 'Stable', 'Under Observation']}
          value={formData.triageStatus}
          onChange={(e) => setFormData({ ...formData, triageStatus: e.target.value })}
        />

        <Select
          label="Attending Doctor"
          options={doctors.map(d => d.name)}
          value={formData.doctor}
          onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
        />

        <Input
          label="Contact Number *"
          placeholder="+1 (555) 000-0000"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          error={errors.contact}
        />

        <Input
          label="Room / Ward Assigned"
          placeholder="e.g. ICU-02 or GEN-105"
          value={formData.roomNo}
          onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
        />

        <div className="sm:col-span-2">
          <Input
            label="Medical History / Conditions (comma separated)"
            placeholder="e.g. Hypertension, Diabetes, Asthma"
            value={formData.medicalHistory}
            onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
