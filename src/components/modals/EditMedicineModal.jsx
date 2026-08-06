import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';

export const EditMedicineModal = ({ isOpen, onClose, medicineToEdit = null }) => {
  const { addMedicine, updateMedicine } = useHospital();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Antibiotics',
    stock: '',
    unit: 'Tablets',
    minThreshold: '30',
    price: '',
    expiryDate: '',
    manufacturer: 'Pfizer Bio'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (medicineToEdit) {
      setFormData({
        ...medicineToEdit,
        stock: String(medicineToEdit.stock),
        minThreshold: String(medicineToEdit.minThreshold),
        price: String(medicineToEdit.price)
      });
    } else {
      setFormData({
        name: '',
        category: 'Antibiotics',
        stock: '',
        unit: 'Tablets',
        minThreshold: '30',
        price: '',
        expiryDate: '',
        manufacturer: 'Pfizer Bio'
      });
    }
  }, [medicineToEdit, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Medicine name is required';
    if (!formData.stock || Number(formData.stock) < 0) errs.stock = 'Valid stock quantity required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Valid unit price required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      stock: Number(formData.stock),
      minThreshold: Number(formData.minThreshold),
      price: Number(formData.price)
    };

    if (medicineToEdit) {
      updateMedicine(medicineToEdit.id, payload);
      addToast(`Updated stock for ${formData.name}`, 'success');
    } else {
      addMedicine(payload);
      addToast(`Added new medicine ${formData.name}`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={medicineToEdit ? 'Edit Inventory Item' : 'Add New Medicine'}
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Inventory</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Medicine Name *"
          placeholder="e.g. Amoxicillin 500mg"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Select
          label="Category"
          options={['Antibiotics', 'Cardiac', 'Analgesics', 'Respiratory', 'Diabetic', 'Vaccines', 'Supplements']}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />

        <Input
          label="Stock Quantity *"
          type="number"
          placeholder="100"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          error={errors.stock}
        />

        <Select
          label="Unit Type"
          options={['Tablets', 'Capsules', 'Vials', 'Inhalers', 'Bottles (ml)', 'Ampoules']}
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />

        <Input
          label="Min Reorder Threshold"
          type="number"
          placeholder="30"
          value={formData.minThreshold}
          onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
        />

        <Input
          label="Unit Price ($) *"
          type="number"
          step="0.01"
          placeholder="15.00"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          error={errors.price}
        />

        <Input
          label="Expiry Date"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />

        <Input
          label="Manufacturer"
          placeholder="e.g. Pfizer Bio"
          value={formData.manufacturer}
          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
        />
      </form>
    </Modal>
  );
};
