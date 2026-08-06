import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { HeartPulse, Printer, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const InvoiceViewModal = ({ isOpen, onClose, invoice }) => {
  const { addToast } = useToast();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast(`Downloading ${invoice.invoiceNo}.pdf simulation`, 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice Preview: ${invoice.invoiceNo}`}
      maxWidth="max-w-3xl"
      footer={
        <>
          <Button variant="outline" icon={Download} onClick={handleDownload}>
            Download PDF
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print Invoice
          </Button>
        </>
      }
    >
      <div className="p-6 bg-white text-slate-900 rounded-xl space-y-6 border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none">
        {/* Letterhead Header */}
        <div className="flex items-start justify-between border-b pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">MedPulse Medical Center</h2>
              <p className="text-xs text-slate-500">742 Evergreen Terrace, Medical District, NY 10001</p>
              <p className="text-xs text-slate-500">Phone: +1 (555) 999-0000 | billing@medpulse.org</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-extrabold text-blue-600 tracking-wider">INVOICE</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1">{invoice.invoiceNo}</p>
            <div className="mt-2">
              <Badge status={invoice.status}>{invoice.status}</Badge>
            </div>
          </div>
        </div>

        {/* Invoice Metadata */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div>
            <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To:</p>
            <p className="text-sm font-bold text-slate-900">{invoice.patientName}</p>
            <p className="text-slate-500">Patient ID: {invoice.patientId}</p>
          </div>
          <div className="text-right space-y-1">
            <p><span className="font-bold text-slate-500">Issue Date:</span> {invoice.issueDate}</p>
            <p><span className="font-bold text-slate-500">Payment Due:</span> {invoice.dueDate}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 font-semibold text-slate-700">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Rate ($)</th>
                <th className="p-3 text-right">Total ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-medium text-slate-800">{item.description}</td>
                  <td className="p-3 text-center text-slate-600">{item.qty}</td>
                  <td className="p-3 text-right text-slate-600">${Number(item.rate).toFixed(2)}</td>
                  <td className="p-3 text-right font-semibold text-slate-900">${(Number(item.qty) * Number(item.rate)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Calculations */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${Number(invoice.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>${Number(invoice.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-${Number(invoice.discount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t">
              <span>Total Amount:</span>
              <span className="text-blue-600">${Number(invoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
