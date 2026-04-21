'use client';

import { X, Phone, MessageCircle, Clock, Package, CheckCircle2, AlertTriangle, Truck } from 'lucide-react';
import { Delivery, formatTime } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  delivery: Delivery;
  delayed: boolean;
  onClose: () => void;
  onMarkReceived: (id: string) => void;
}

export default function OrderDetailsModal({ delivery, delayed, onClose, onMarkReceived }: Props) {
  const isReceived = delivery.status === 'received';

  const statusConfig = isReceived
    ? { label: 'Received', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500', icon: <CheckCircle2 size={14} /> }
    : delayed
    ? { label: 'Delayed', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500 animate-pulse', icon: <AlertTriangle size={14} /> }
    : { label: 'On Time', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', dot: 'bg-green-500', icon: <CheckCircle2 size={14} /> };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-card rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 border-b border-gray-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-3 pr-8">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {delivery.supplierName.charAt(0)}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{delivery.supplierName}</h2>
              <div className={clsx('mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold', statusConfig.bg, statusConfig.color)}>
                <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', statusConfig.dot)} />
                {statusConfig.icon}
                {statusConfig.label}
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={<Clock size={15} />}
              label="Expected"
              value={formatTime(delivery.expectedTime)}
              highlight={delayed && !isReceived}
            />
            <InfoCard
              icon={<Truck size={15} />}
              label="Supplier"
              value={delivery.supplierName.split(' ')[0]}
            />
          </div>

          <div className="bg-surface rounded-xl px-4 py-3 flex items-start gap-3">
            <Package size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs mb-0.5">Items</p>
              <p className="text-white text-sm font-medium">{delivery.items}</p>
            </div>
          </div>

          {delivery.note && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <MessageCircle size={15} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-yellow-500 text-xs mb-0.5">Note</p>
                <p className="text-yellow-100 text-sm">{delivery.note}</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="px-5 pb-5 space-y-2.5">
          {!isReceived && (
            <button
              onClick={() => { onMarkReceived(delivery.id); onClose(); }}
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm active:scale-95 shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle2 size={18} />
              Mark as Received
            </button>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`https://wa.me/${delivery.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-semibold py-3 rounded-xl transition-colors text-sm active:scale-95 border border-[#25D366]/20"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <a
              href={`tel:${delivery.phone}`}
              className="flex items-center justify-center gap-2 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 font-semibold py-3 rounded-xl transition-colors text-sm active:scale-95 border border-blue-600/20"
            >
              <Phone size={16} />
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={clsx('rounded-xl px-4 py-3 flex items-start gap-2.5', highlight ? 'bg-red-500/10 border border-red-500/20' : 'bg-surface')}>
      <span className={clsx('mt-0.5 flex-shrink-0', highlight ? 'text-red-400' : 'text-gray-400')}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs mb-0.5">{label}</p>
        <p className={clsx('text-sm font-semibold truncate', highlight ? 'text-red-300' : 'text-white')}>{value}</p>
      </div>
    </div>
  );
}
