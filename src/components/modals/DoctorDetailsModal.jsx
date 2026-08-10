import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { getDoctorAvatar } from '../../data/mockData';
import {
  Clock,
  Phone,
  Mail,
  Star,
  ShieldCheck,
  Edit,
  UserCheck,
  Award,
  Users,
  DollarSign
} from 'lucide-react';

export const DoctorDetailsModal = ({ isOpen, onClose, doctor, onEdit }) => {
  if (!doctor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Doctor Profile: ${doctor.name}`}
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            icon={Edit}
            className="flex-1 sm:flex-initial"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(doctor);
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="px-6"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Doctor Header Card */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-100 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 rounded-2xl border border-orange-500/20 dark:border-slate-800">
          <img
            src={doctor.avatar || getDoctorAvatar(doctor.name, 'f97316')}
            alt={doctor.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getDoctorAvatar(doctor.name, 'f97316');
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {doctor.name}
            </h4>
            <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-bold">
              {doctor.specialization}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge status={doctor.status}>{doctor.status}</Badge>
              <span className="text-xs text-amber-500 font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-current" /> {doctor.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center text-xs">
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Experience</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{doctor.experience}</span>
          </div>
          <div className="border-x border-slate-200 dark:border-slate-700">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Patients</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{doctor.totalPatients}+</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Fee</span>
            <span className="font-extrabold text-teal-600 dark:text-teal-400">{doctor.consultationFee}</span>
          </div>
        </div>

        {/* Full Contact & Official Information */}
        <div className="space-y-2 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs shadow-xs">
          <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1.5 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-1">
            <span className="flex items-center gap-2 text-slate-500 font-medium">
              <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" /> Working Hours
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{doctor.workingHours}</span>
          </p>

          <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1.5 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-1">
            <span className="flex items-center gap-2 text-slate-500 font-medium">
              <Phone className="w-4 h-4 text-teal-500 flex-shrink-0" /> Phone Number
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{doctor.phone}</span>
          </p>

          <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1.5 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-1">
            <span className="flex items-center gap-2 text-slate-500 font-medium">
              <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" /> Email Address
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-none">{doctor.email}</span>
          </p>

          <p className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-1.5 flex-wrap gap-1">
            <span className="flex items-center gap-2 text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-purple-500 flex-shrink-0" /> Assigned Wing
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{doctor.specialization} OPD Block</span>
          </p>
        </div>
      </div>
    </Modal>
  );
};
