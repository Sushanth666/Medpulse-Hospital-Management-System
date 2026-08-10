import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';
import { getDoctorAvatar, getRandomAvatar, detectGender } from '../../data/mockData';
import { Star, User } from 'lucide-react';

export const EditDoctorModal = ({ isOpen, onClose, doctorToEdit = null }) => {
  const { addDoctor, updateDoctor } = useHospital();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    specialization: 'Cardiology',
    experience: '5 Years',
    phone: '',
    email: '',
    workingHours: '08:00 AM - 04:00 PM',
    consultationFee: '$150',
    status: 'On Duty'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (doctorToEdit) {
      const docGen = doctorToEdit.gender || (doctorToEdit.avatar?.includes('/women/') ? 'Female' : 'Male');
      setFormData({
        name: doctorToEdit.name || '',
        gender: docGen,
        specialization: doctorToEdit.specialization || 'Cardiology',
        experience: doctorToEdit.experience || '5 Years',
        phone: doctorToEdit.phone || '',
        email: doctorToEdit.email || '',
        workingHours: doctorToEdit.workingHours || '08:00 AM - 04:00 PM',
        consultationFee: doctorToEdit.consultationFee || '$150',
        status: doctorToEdit.status || 'On Duty',
        rating: doctorToEdit.rating || 4.8,
        totalPatients: doctorToEdit.totalPatients || 100,
        avatar: doctorToEdit.avatar || ''
      });
    } else {
      setFormData({
        name: '',
        gender: 'Male',
        specialization: 'Cardiology',
        experience: '5 Years',
        phone: '',
        email: '',
        workingHours: '08:00 AM - 04:00 PM',
        consultationFee: '$150',
        status: 'On Duty'
      });
    }
    setErrors({});
  }, [doctorToEdit, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name || !formData.name.trim()) errs.name = 'Doctor name is required';
    if (!formData.phone || !formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.email || !formData.email.trim()) errs.email = 'Email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (doctorToEdit) {
      updateDoctor(doctorToEdit.id, formData);
      addToast(`Updated profile for ${formData.name}`, 'success');
    } else {
      addDoctor(formData);
      addToast(`Added new doctor ${formData.name}`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={doctorToEdit ? `Edit Doctor: ${doctorToEdit.name}` : `Add New Doctor`}
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Doctor Header Profile Summary Card (Matches Doctor Details Modal showing style) */}
        {doctorToEdit && (
          <div className="flex items-center gap-4 p-3.5 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-100 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 rounded-2xl border border-orange-500/20 dark:border-slate-800">
            <img
              src={formData.avatar || getDoctorAvatar(formData.name || 'Doctor', 'f97316')}
              alt={formData.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDoctorAvatar(formData.name || 'Doctor', 'f97316');
              }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
                {formData.name || 'Doctor Profile'}
              </h4>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-bold">
                {formData.specialization}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge status={formData.status}>{formData.status}</Badge>
                {formData.rating && (
                  <span className="text-xs text-amber-500 font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-current" /> {formData.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Editable Input Fields Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Doctor Name *"
            placeholder="e.g. Dr. Jane Foster"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <Select
            label="Specialization"
            options={['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Dermatology', 'Oncology']}
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />

          <Select
            label="Gender"
            options={['Male', 'Female']}
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          />

          <Input
            label="Experience"
            placeholder="e.g. 10 Years"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />

          <Select
            label="Duty Status"
            options={['On Duty', 'On Call', 'Off Duty']}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />

          <Input
            label="Phone Number *"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="doctor@medpulse.org"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Working Hours"
            placeholder="08:00 AM - 04:00 PM"
            value={formData.workingHours}
            onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
          />

          <Input
            label="Consultation Fee"
            placeholder="$150"
            value={formData.consultationFee}
            onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
          />
        </form>
      </div>
    </Modal>
  );
};
