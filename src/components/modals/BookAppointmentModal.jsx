import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';

export const BookAppointmentModal = ({ isOpen, onClose }) => {
  const { patients, doctors, bookAppointment } = useHospital();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'Routine Checkup',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.patientId) errs.patientId = 'Patient selection is required';
    if (!formData.doctorId) errs.doctorId = 'Doctor selection is required';
    if (!formData.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const patient = patients.find(p => p.id === formData.patientId);
    const doctor = doctors.find(d => d.id === formData.doctorId);

    bookAppointment({
      ...formData,
      patientName: patient ? patient.name : 'Selected Patient',
      doctorName: doctor ? doctor.name : 'Selected Doctor',
      department: doctor ? doctor.specialization : 'General Medicine'
    });

    addToast('Appointment booked successfully', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Doctor Appointment"
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Confirm Booking</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Patient *"
          options={patients.map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))}
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          error={errors.patientId}
        />

        <Select
          label="Select Doctor *"
          options={doctors.map(d => ({ value: d.id, label: `${d.name} (${d.specialization})` }))}
          value={formData.doctorId}
          onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
          error={errors.doctorId}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Appointment Date *"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
          />

          <Select
            label="Time Slot"
            options={['09:00 AM', '10:00 AM', '11:15 AM', '02:00 PM', '03:30 PM', '04:45 PM']}
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>

        <Select
          label="Appointment Type"
          options={['Routine Checkup', 'Consultation', 'Follow-up', 'Emergency Checkup', 'Post-Surgery Assessment']}
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />

        <Input
          label="Clinical Notes / Symptoms"
          placeholder="e.g. Complaining of joint soreness"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </form>
    </Modal>
  );
};
