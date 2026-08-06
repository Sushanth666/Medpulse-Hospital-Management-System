import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useToast } from '../context/ToastContext';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
import { InvoiceViewModal } from '../components/modals/InvoiceViewModal';
import {
  FileText,
  Search,
  Plus,
  DollarSign,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';

export const Billing = () => {
  const { invoices, updateInvoiceStatus } = useHospital();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoiceView, setSelectedInvoiceView] = useState(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? inv.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Billing KPI metrics
  const totalBilled = invoices.reduce((sum, i) => sum + Number(i.total), 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.total), 0);
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + Number(i.total), 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + Number(i.total), 0);

  const handleMarkPaid = (inv) => {
    updateInvoiceStatus(inv.id, 'Paid');
    addToast(`Invoice ${inv.invoiceNo} marked as PAID`, 'success');
  };

  const columns = [
    {
      header: 'Invoice Details',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.invoiceNo}</span>
          <span className="text-[11px] text-slate-400 font-mono">Issued: {row.issueDate}</span>
        </div>
      )
    },
    {
      header: 'Patient Name',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">{row.patientName}</span>
          <span className="text-[11px] text-slate-400">{row.patientId}</span>
        </div>
      )
    },
    {
      header: 'Total Amount',
      render: (row) => <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">${Number(row.total).toFixed(2)}</span>
    },
    {
      header: 'Payment Due',
      accessor: 'dueDate',
      cellClassName: 'text-xs text-slate-500 font-mono font-medium'
    },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => setSelectedInvoiceView(row)}
            title="View Invoice Letterhead"
          />
          {row.status !== 'Paid' && (
            <Button
              variant="outline"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleMarkPaid(row)}
            >
              Mark Paid
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Billing & Invoicing ({invoices.length} Invoices)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Patient statement ledgers, insurance claims, and financial accounting
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Create Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400">Total Billed</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">${totalBilled.toLocaleString()}</h3>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-xs font-semibold text-emerald-500">Collected Revenue</p>
          <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">${totalPaid.toLocaleString()}</h3>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-xs font-semibold text-amber-500">Pending Receivables</p>
          <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">${totalPending.toLocaleString()}</h3>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-xs font-semibold text-rose-500">Overdue Payments</p>
          <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">${totalOverdue.toLocaleString()}</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1">
          <Input
            icon={Search}
            placeholder="Search patient name, invoice # (e.g. INV-2026-1045), or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            placeholder="All Invoice Statuses"
            options={['Paid', 'Pending', 'Overdue']}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table & Pagination */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <Table columns={columns} data={paginatedInvoices} emptyMessage="No billing records matched your filter" />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={filteredInvoices.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Create Modal */}
      <CreateInvoiceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Printable View Modal */}
      <InvoiceViewModal
        isOpen={!!selectedInvoiceView}
        onClose={() => setSelectedInvoiceView(null)}
        invoice={selectedInvoiceView}
      />
    </div>
  );
};
