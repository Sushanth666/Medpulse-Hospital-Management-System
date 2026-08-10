import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';
import { getDoctorAvatar } from '../../data/mockData';
import {
  User,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Briefcase,
  Shield,
  Users,
  CheckCircle,
  Sparkles
} from 'lucide-react';

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
    totalPatients: 100,
    status: 'On Duty',
    avatar: ''
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
        totalPatients: doctorToEdit.totalPatients || 100,
        status: doctorToEdit.status || 'On Duty',
        rating: doctorToEdit.rating || 4.8,
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
        totalPatients: 100,
        status: 'On Duty',
        avatar: ''
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

  // Avatar generator helper
  const avatarSrc = formData.avatar || getDoctorAvatar(formData.name || 'Doctor', 'f97316');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={doctorToEdit ? `Edit Doctor Profile` : `Add New Doctor`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={CheckCircle} onClick={handleSubmit}>
            {doctorToEdit ? 'Save Doctor Changes' : 'Create Doctor Profile'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Modern Live Avatar & Overview Banner */}
        <div className="p-4 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-100 dark:from-slate-800 dark:via-slate-800/60 dark:to-slate-900 rounded-2xl border border-orange-500/20 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={avatarSrc}
              alt={formData.name || 'Doctor'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDoctorAvatar(formData.name || 'Doctor', 'f97316');
              }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
              formData.status === 'On Duty' ? 'bg-teal-500' : formData.status === 'On Call' ? 'bg-amber-500' : 'bg-slate-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {formData.name || 'Doctor Profile'}
            </h4>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mt-0.5">
              {formData.specialization} Specialist
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Profile Sync Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Personal Credentials */}
        <div className="space-y-3">
          <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <User className="w-4 h-4 text-orange-500" /> Personal Credentials
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Doctor Full Name *"
              placeholder="e.g. Dr. Jane Foster"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />
            <Select
              label="Specialization"
              options={['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Dermatology', 'Oncology', 'Gynecology', 'Urology', 'Radiology']}
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
            <Select
              label="Gender"
              options={['Male', 'Female']}
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            />
            <Select
              label="Duty Status"
              options={['On Duty', 'On Call', 'Off Duty']}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>
        </div>

        {/* Section 2: Contact & Working Schedule */}
        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wider pt-2">
            <Clock className="w-4 h-4 text-blue-500" /> Contact & Working Schedule
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
              label="Experience"
              placeholder="e.g. 10 Years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>
        </div>

        {/* Section 3: Practice & Fee Metrics */}
        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wider pt-2">
            <DollarSign className="w-4 h-4 text-teal-500" /> Practice & Fee Metrics
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Consultation Fee"
              placeholder="$150"
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
            />
            <Input
              label="Total Patients"
              type="number"
              placeholder="100"
              value={formData.totalPatients}
              onChange={(e) => setFormData({ ...formData, totalPatients: e.target.value })}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
