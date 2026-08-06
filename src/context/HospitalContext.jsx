import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_BEDS,
  INITIAL_PHARMACY,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  getRandomAvatar,
  detectGender
} from '../data/mockData';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('medpulse_patients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length < 200) return INITIAL_PATIENTS;
        return parsed;
      } catch (e) { return INITIAL_PATIENTS; }
    }
    return INITIAL_PATIENTS;
  });

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('medpulse_doctors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length < 20 || parsed.some(d => d.avatar && (d.avatar.includes('unsplash.com') || d.avatar.includes('data:image/svg+xml')))) {
          localStorage.setItem('medpulse_doctors', JSON.stringify(INITIAL_DOCTORS));
          return INITIAL_DOCTORS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_DOCTORS;
      }
    }
    return INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('medpulse_appointments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length < 50) return INITIAL_APPOINTMENTS;
        return parsed;
      } catch (e) { return INITIAL_APPOINTMENTS; }
    }
    return INITIAL_APPOINTMENTS;
  });

  const [beds, setBeds] = useState(() => {
    const saved = localStorage.getItem('medpulse_beds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length < 30) return INITIAL_BEDS;
        return parsed;
      } catch (e) { return INITIAL_BEDS; }
    }
    return INITIAL_BEDS;
  });

  const [pharmacy, setPharmacy] = useState(() => {
    const saved = localStorage.getItem('medpulse_pharmacy');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length < 500) return INITIAL_PHARMACY;
        return parsed;
      } catch (e) { return INITIAL_PHARMACY; }
    }
    return INITIAL_PHARMACY;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('medpulse_invoices');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length < 1000) return INITIAL_INVOICES;
        return parsed;
      } catch (e) { return INITIAL_INVOICES; }
    }
    return INITIAL_INVOICES;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('medpulse_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length < 10) return INITIAL_NOTIFICATIONS;
        return parsed;
      } catch (e) { return INITIAL_NOTIFICATIONS; }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // LocalStorage Persist Sync
  useEffect(() => { localStorage.setItem('medpulse_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('medpulse_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('medpulse_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('medpulse_beds', JSON.stringify(beds)); }, [beds]);
  useEffect(() => { localStorage.setItem('medpulse_pharmacy', JSON.stringify(pharmacy)); }, [pharmacy]);
  useEffect(() => { localStorage.setItem('medpulse_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('medpulse_notifications', JSON.stringify(notifications)); }, [notifications]);

  // PATIENT HANDLERS
  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      admissionDate: patientData.admissionDate || new Date().toISOString().split('T')[0],
      status: patientData.status || 'Admitted',
      vitals: patientData.vitals || { hr: '75 bpm', bp: '120/80', temp: '98.6 °F', spo2: '98%' },
      medicalHistory: patientData.medicalHistory || [],
      activeMeds: patientData.activeMeds || []
    };
    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id, updatedData) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  // DOCTOR HANDLERS
  const addDoctor = (doctorData) => {
    const docGender = doctorData.gender || detectGender(doctorData.name, doctorData.email);
    const newDoctor = {
      ...doctorData,
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      totalPatients: 0,
      avatar: doctorData.avatar || getRandomAvatar(docGender, Math.floor(Math.random() * 80) + 1)
    };
    setDoctors(prev => [newDoctor, ...prev]);
    return newDoctor;
  };

  const updateDoctor = (id, updatedData) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updatedData } : d));
  };

  // APPOINTMENT HANDLERS
  const bookAppointment = (appointmentData) => {
    const newApt = {
      ...appointmentData,
      id: `APT-${Math.floor(800 + Math.random() * 100)}`,
      status: 'Upcoming'
    };
    setAppointments(prev => [newApt, ...prev]);

    // Push notification
    addNotification({
      title: 'New Appointment Booked',
      description: `Appointment scheduled for ${newApt.patientName} with ${newApt.doctorName}.`,
      category: 'Appointments',
      type: 'info'
    });

    return newApt;
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  // BED HANDLERS
  const assignBed = (bedId, patientId, patientName) => {
    setBeds(prev => prev.map(b => b.id === bedId ? {
      ...b,
      status: 'Occupied',
      patientId,
      patientName,
      assignedDate: new Date().toISOString().split('T')[0]
    } : b));

    addNotification({
      title: 'Bed Assigned',
      description: `Bed ${bedId} assigned to patient ${patientName}.`,
      category: 'Bed Management',
      type: 'info'
    });
  };

  const releaseBed = (bedId) => {
    setBeds(prev => prev.map(b => b.id === bedId ? {
      ...b,
      status: 'Available',
      patientId: null,
      patientName: null,
      assignedDate: null
    } : b));
  };

  // PHARMACY HANDLERS
  const addMedicine = (medicineData) => {
    const newMed = {
      ...medicineData,
      id: `MED-${Math.floor(500 + Math.random() * 400)}`,
      sku: medicineData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setPharmacy(prev => [newMed, ...prev]);
    return newMed;
  };

  const updateMedicine = (id, updatedData) => {
    setPharmacy(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const dispenseMedicine = (id, qtyToDispense) => {
    setPharmacy(prev => prev.map(m => {
      if (m.id === id) {
        const newStock = Math.max(0, m.stock - qtyToDispense);
        if (newStock < m.minThreshold) {
          addNotification({
            title: 'Low Stock Alert',
            description: `${m.name} stock level (${newStock} units) is below minimum threshold.`,
            category: 'Pharmacy',
            type: 'warning'
          });
        }
        return { ...m, stock: newStock };
      }
      return m;
    }));
  };

  // INVOICE HANDLERS
  const createInvoice = (invoiceData) => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (Number(item.rate) * Number(item.qty)), 0);
    const tax = subtotal * 0.05;
    const discount = Number(invoiceData.discount) || 0;
    const total = Math.max(0, subtotal + tax - discount);

    const newInvoice = {
      id: `INV-${Math.floor(9000 + Math.random() * 900)}`,
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      patientId: invoiceData.patientId,
      patientName: invoiceData.patientName,
      items: invoiceData.items,
      subtotal,
      tax,
      discount,
      total,
      status: invoiceData.status || 'Pending'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    addNotification({
      title: 'Invoice Generated',
      description: `Invoice ${newInvoice.invoiceNo} issued for ${newInvoice.patientName}. Total: $${total.toFixed(2)}`,
      category: 'Billing',
      type: 'success'
    });

    return newInvoice;
  };

  const updateInvoiceStatus = (id, status) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  // NOTIFICATION HANDLERS
  const addNotification = (notifData) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...notifData
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // RESET ALL DATA TO DEFAULTS
  const resetAllDataToDefaults = () => {
    setPatients(INITIAL_PATIENTS);
    setDoctors(INITIAL_DOCTORS);
    setAppointments(INITIAL_APPOINTMENTS);
    setBeds(INITIAL_BEDS);
    setPharmacy(INITIAL_PHARMACY);
    setInvoices(INITIAL_INVOICES);
    setNotifications(INITIAL_NOTIFICATIONS);

    localStorage.removeItem('medpulse_patients');
    localStorage.removeItem('medpulse_doctors');
    localStorage.removeItem('medpulse_appointments');
    localStorage.removeItem('medpulse_beds');
    localStorage.removeItem('medpulse_pharmacy');
    localStorage.removeItem('medpulse_invoices');
    localStorage.removeItem('medpulse_notifications');
  };

  return (
    <HospitalContext.Provider value={{
      patients,
      doctors,
      appointments,
      beds,
      pharmacy,
      invoices,
      notifications,
      addPatient,
      updatePatient,
      deletePatient,
      addDoctor,
      updateDoctor,
      bookAppointment,
      updateAppointmentStatus,
      assignBed,
      releaseBed,
      addMedicine,
      updateMedicine,
      dispenseMedicine,
      createInvoice,
      updateInvoiceStatus,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearAllNotifications,
      resetAllDataToDefaults
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
