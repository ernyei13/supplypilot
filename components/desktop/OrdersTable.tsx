'use client';

import { Phone, MessageCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Delivery, isDelayed, formatTime } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  deliveries: Delivery[];
  onOpenOrder: (d: Delivery) => void;
  onMarkReceived: (id: string) => void;
}

export default function OrdersTable({ deliveries, onOpenOrder, onMarkReceived }: Props) {
  const sorted = [...deliveries].sort((a, b) => {
    // received go last
    if (a.status === 'received' && b.status !== 'received') return 1;
    if (a.status !== 'received' && b.status === 'received') return -1;
    // delayed first among pending
    const aLate = isDelayed(a.expectedTime) && a.status !== 'received';
    const bLate = isDelayed(b.expectedTime) && b.status !== 'received';
    if (aLate && !bLate) return -1;
    if (!aLate && bLate) return 1;
    return a.expectedTime.localeCompare(b.expectedTime);
  });

  const receivedCount = deliveries.filter((d) => d.status === 'received').length;

  return (
    <div className="bg-surface-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-base">Today&apos;s Orders</h2>
          <p className="text-gray-400 text-xs mt-0.5">{deliveries.length} deliveries · {receivedCount} received</p>
        </div>
        {receivedCount > 0 && (
          <span className="bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
            {receivedCount} ✓
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/40">
              <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-5 py-3">
                Supplier
              </th>
              <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-4 py-3 hidden sm:table-cell">
                Items
              </th>
              <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                Expected
              </th>
              <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                Status
              </th>
              <th className="text-right text-gray-500 text-xs font-semibold uppercase tracking-wide px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {sorted.map((d) => {
              const late = isDelayed(d.expectedTime) && d.status !== 'received';
              const received = d.status === 'received';
              return (
                <tr
                  key={d.id}
                  className={clsx(
                    'transition-colors cursor-pointer group',
                    received ? 'opacity-60 hover:opacity-80' : 'hover:bg-white/[0.02]'
                  )}
                  onClick={() => onOpenOrder(d)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={clsx(
                        'w-1.5 h-8 rounded-full flex-shrink-0',
                        received ? 'bg-emerald-500' : late ? 'bg-red-500' : 'bg-green-500'
                      )} />
                      <span className={clsx('font-semibold text-sm truncate max-w-[160px]', received ? 'text-gray-400 line-through' : 'text-white')}>
                        {d.supplierName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-gray-400 text-sm">{d.items}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={clsx('text-sm font-medium', late ? 'text-red-300' : 'text-gray-300')}>{formatTime(d.expectedTime)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide',
                        received
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : late
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      )}
                    >
                      <span className={clsx('w-1.5 h-1.5 rounded-full', received ? 'bg-emerald-400' : late ? 'bg-red-400 animate-pulse' : 'bg-green-400')} />
                      {received ? 'Received' : late ? 'Delayed' : 'On Time'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {!received && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onMarkReceived(d.id); }}
                          className="p-1.5 text-gray-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-400/10"
                          title="Mark received"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${d.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-gray-500 hover:text-[#25D366] transition-colors rounded-lg hover:bg-[#25D366]/10"
                        title="WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </a>
                      <a
                        href={`tel:${d.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-400/10"
                        title="Call"
                      >
                        <Phone size={14} />
                      </a>
                      <ChevronRight size={14} className="text-gray-600 ml-1 group-hover:text-gray-400 transition-colors" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
