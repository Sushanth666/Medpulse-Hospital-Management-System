import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useToast } from '../context/ToastContext';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { EditMedicineModal } from '../components/modals/EditMedicineModal';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  ShoppingCart,
  Edit,
  MinusCircle,
  Package,
  Calendar,
  Filter
} from 'lucide-react';

export const Pharmacy = () => {
  const { pharmacy, dispenseMedicine } = useHospital();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState(null);

  // Dynamic Categories List
  const categoriesList = Array.from(new Set(pharmacy.map(m => m.category))).sort();

  // Dispense modal state
  const [dispenseItem, setDispenseItem] = useState(null);
  const [dispenseQty, setDispenseQty] = useState(1);

  const lowStockItems = pharmacy.filter(m => m.stock < m.minThreshold);

  const filteredPharmacy = pharmacy.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? m.category === categoryFilter : true;
    const matchesLowStock = showLowStockOnly ? m.stock < m.minThreshold : true;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const totalPages = Math.ceil(filteredPharmacy.length / itemsPerPage);
  const paginatedPharmacy = filteredPharmacy.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDispenseSubmit = (e) => {
    e.preventDefault();
    if (!dispenseItem || dispenseQty <= 0) return;

    if (dispenseQty > dispenseItem.stock) {
      addToast(`Cannot dispense ${dispenseQty} units. Only ${dispenseItem.stock} available.`, 'error');
      return;
    }

    dispenseMedicine(dispenseItem.id, Number(dispenseQty));
    addToast(`Dispensed ${dispenseQty} ${dispenseItem.unit} of ${dispenseItem.name}`, 'success');
    setDispenseItem(null);
  };

  const columns = [
    {
      header: 'Medicine / Drug',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shadow-sm">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.name}</span>
            <span className="text-[11px] text-slate-400">{row.sku} • {row.manufacturer}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      cellClassName: 'text-xs font-semibold text-slate-700 dark:text-slate-300'
    },
    {
      header: 'Stock Level',
      render: (row) => {
        const isLow = row.stock < row.minThreshold;
        return (
          <div>
            <span className={`font-bold text-xs ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {row.stock} {row.unit}
            </span>
            {isLow && (
              <span className="block text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Reorder Alert (&lt;{row.minThreshold})
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Unit Price',
      render: (row) => <span className="font-bold text-xs text-teal-600 dark:text-teal-400">${Number(row.price).toFixed(2)}</span>
    },
    {
      header: 'Expiry Date',
      render: (row) => (
        <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {row.expiryDate}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={ShoppingCart}
            onClick={() => {
              setDispenseItem(row);
              setDispenseQty(1);
            }}
          >
            Dispense
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => {
              setMedicineToEdit(row);
              setIsEditModalOpen(true);
            }}
          />
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
            Pharmacy & Inventory ({pharmacy.length} Medications)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pharmaceutical stock tracking across {categoriesList.length} therapeutic categories, reorder thresholds, and prescription dispensing
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setMedicineToEdit(null);
            setIsEditModalOpen(true);
          }}
        >
          Add Medicine
        </Button>
      </div>

      {/* Low Stock Warning Alert Banner - Redesigned */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                Inventory Low-Stock Warning
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 font-medium">
                <span className="font-bold text-amber-900 dark:text-amber-100">{lowStockItems.length} medication(s)</span> are currently below their minimum safety stock threshold.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                setShowLowStockOnly(prev => !prev);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                showLowStockOnly
                  ? 'bg-amber-700 text-white ring-2 ring-amber-500/50'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {showLowStockOnly ? 'Show All Items' : `Filter Low Stock (${lowStockItems.length})`}
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1">
          <Input
            icon={Search}
            placeholder="Search medicine name, SKU, or manufacturer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            placeholder="All Categories"
            options={categoriesList}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table & Pagination */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <Table columns={columns} data={paginatedPharmacy} emptyMessage="No matching pharmaceutical items found" />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={filteredPharmacy.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Dispense Modal */}
      <Modal
        isOpen={!!dispenseItem}
        onClose={() => setDispenseItem(null)}
        title={`Dispense Medication: ${dispenseItem?.name}`}
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDispenseItem(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleDispenseSubmit}>Fulfill Prescription</Button>
          </>
        }
      >
        <form onSubmit={handleDispenseSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
            <p><span className="font-semibold">Current Stock:</span> {dispenseItem?.stock} {dispenseItem?.unit}</p>
            <p><span className="font-semibold">Unit Rate:</span> ${dispenseItem?.price}</p>
          </div>

          <Input
            label="Quantity to Dispense *"
            type="number"
            min="1"
            max={dispenseItem?.stock}
            value={dispenseQty}
            onChange={(e) => setDispenseQty(e.target.value)}
          />

          <div className="pt-2 border-t flex justify-between font-bold text-sm text-slate-900 dark:text-slate-100">
            <span>Total Prescription Charge:</span>
            <span className="text-teal-600">${(Number(dispenseQty) * Number(dispenseItem?.price || 0)).toFixed(2)}</span>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Medicine Modal */}
      <EditMedicineModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        medicineToEdit={medicineToEdit}
      />
    </div>
  );
};
