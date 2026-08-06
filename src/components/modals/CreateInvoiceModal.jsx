import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2 } from 'lucide-react';

export const CreateInvoiceModal = ({ isOpen, onClose }) => {
  const { patients, createInvoice } = useHospital();
  const { addToast } = useToast();

  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [status, setStatus] = useState('Pending');
  const [discount, setDiscount] = useState('0');

  const [items, setItems] = useState([
    { description: 'Specialist Consultation Fee', qty: 1, rate: 150 }
  ]);

  const [error, setError] = useState('');

  const handleAddItem = () => {
    setItems([...items, { description: '', qty: 1, rate: 100 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.rate || 0)), 0);
  const tax = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal + tax - Number(discount || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient');
      return;
    }

    const patient = patients.find(p => p.id === patientId);

    createInvoice({
      patientId,
      patientName: patient ? patient.name : 'Unknown Patient',
      dueDate,
      status,
      discount: Number(discount),
      items: items.map(i => ({
        description: i.description || 'Hospital Service',
        qty: Number(i.qty),
        rate: Number(i.rate),
        amount: Number(i.qty) * Number(i.rate)
      }))
    });

    addToast('Invoice created successfully', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Hospital Invoice"
      maxWidth="max-w-3xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Generate Invoice</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Select Patient *"
            options={patients.map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))}
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            error={error}
          />

          <Input
            label="Payment Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Select
            label="Initial Status"
            options={['Pending', 'Paid', 'Overdue']}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        {/* Dynamic Line Items */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Itemized Charges & Services
            </h4>
            <Button variant="ghost" size="sm" icon={Plus} onClick={handleAddItem}>
              Add Line Item
            </Button>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                placeholder="Description (e.g. Lab Test, Bed Charge)"
                value={item.description}
                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                className="w-20"
              />
              <Input
                type="number"
                placeholder="Rate ($)"
                value={item.rate}
                onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                className="w-28"
              />
              <div className="w-24 text-right font-semibold text-xs text-slate-700 dark:text-slate-200">
                ${(Number(item.qty || 0) * Number(item.rate || 0)).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Billing Calculation Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 text-xs border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Hospital Tax (5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Discount ($)</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-24 px-2 py-1 text-right text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
            />
          </div>
          <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>Grand Total</span>
            <span className="text-blue-600 dark:text-blue-400">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};
