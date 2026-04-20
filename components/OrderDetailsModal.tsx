'use client';

import { X, Phone, MessageCircle, Clock, Package, Truck } from 'lucide-react';
import { Delivery, formatTime } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  delivery: Delivery;
  delayed: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ delivery, delayed, onClose }: Props) {
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
        <div className="flex items-start justify-between p-5 border-b border-gray-700/50">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{delivery.supplierName}</h2>
            <span
              className={clsx(
                'mt-1 inline-block text-xs font-semibold uppercase tracking-wide',
                delayed ? 'text-red-400' : 'text-green-400'
              )}
            >
              {delayed ? '⚠ Delayed' : '✓ On Time'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 -mr-1 -mt-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4">
          <DetailRow icon={<Truck size={16} />} label="Supplier" value={delivery.supplierName} />
          <DetailRow icon={<Clock size={16} />} label="Expected Time" value={formatTime(delivery.expectedTime)} />
          <DetailRow icon={<Package size={16} />} label="Items" value={delivery.items} />
          {delivery.note && (
            <DetailRow icon={<MessageCircle size={16} />} label="Note" value={delivery.note} />
          )}
        </div>

        {/* CTA Buttons */}
        <div className="px-5 pb-5 space-y-3">
          <a
            href={`https://wa.me/${delivery.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm active:scale-95"
          >
            <MessageCircle size={18} />
            WhatsApp Supplier
          </a>
          <a
            href={`tel:${delivery.phone}`}
            className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm active:scale-95"
          >
            <Phone size={18} />
            Call Supplier
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 flex items-center justify-between gap-4">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-white text-sm font-medium text-right">{value}</span>
      </div>
    </div>
  );
}
