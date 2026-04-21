'use client';

import { useState, FormEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Delivery } from '@/lib/data';

interface Props {
  onClose: () => void;
  onAdd: (delivery: Delivery) => void;
}

export default function AddDeliveryModal({ onClose, onAdd }: Props) {
  const [supplierName, setSupplierName] = useState('');
  const [items, setItems] = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [phone, setPhone] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supplierName || !items || !expectedTime) return;

    onAdd({
      id: Date.now().toString(),
      supplierName,
      items,
      expectedTime,
      phone: phone || '+390000000000',
      whatsapp: (phone || '+390000000000').replace(/\D/g, ''),
      status: 'pending',
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-card rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500 p-1.5 rounded-lg">
              <Plus size={16} className="text-white" />
            </span>
            <h2 className="text-white font-bold text-lg">Add New Delivery</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 font-medium">
              Supplier Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="e.g. Metro Food Service"
              required
              className="w-full bg-surface-input text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5 font-medium">
              Items <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g. Vegetables, Fruits"
              required
              className="w-full bg-surface-input text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5 font-medium">
              Expected Time <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              value={expectedTime}
              onChange={(e) => setExpectedTime(e.target.value)}
              required
              className="w-full bg-surface-input text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5 font-medium">
              Supplier Phone <span className="text-gray-600 text-xs">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+39 123 456 7890"
              className="w-full bg-surface-input text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm active:scale-95 mt-2"
          >
            Save to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
