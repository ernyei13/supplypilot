'use client';

import { Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { Delivery, isDelayed, formatTime } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  deliveries: Delivery[];
  onOpenOrder: (d: Delivery) => void;
}

export default function OrdersTable({ deliveries, onOpenOrder }: Props) {
  const sorted = [...deliveries].sort((a, b) => {
    const aLate = isDelayed(a.expectedTime);
    const bLate = isDelayed(b.expectedTime);
    if (aLate && !bLate) return -1;
    if (!aLate && bLate) return 1;
    return a.expectedTime.localeCompare(b.expectedTime);
  });

  return (
    <div className="bg-surface-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50">
        <h2 className="text-white font-bold text-base">Today&apos;s Orders</h2>
        <p className="text-gray-400 text-xs mt-0.5">{deliveries.length} deliveries scheduled</p>
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
              const late = isDelayed(d.expectedTime);
              return (
                <tr
                  key={d.id}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  onClick={() => onOpenOrder(d)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={clsx('w-1.5 h-8 rounded-full flex-shrink-0', late ? 'bg-red-500' : 'bg-green-500')} />
                      <span className="text-white font-semibold text-sm truncate max-w-[160px]">
                        {d.supplierName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-gray-400 text-sm">{d.items}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-300 text-sm font-medium">{formatTime(d.expectedTime)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={clsx(
                        'inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide',
                        late ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      )}
                    >
                      {late ? 'Delayed' : 'On Time'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`https://wa.me/${d.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-gray-500 hover:text-[#25D366] transition-colors rounded-lg hover:bg-[#25D366]/10"
                      >
                        <MessageCircle size={14} />
                      </a>
                      <a
                        href={`tel:${d.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-400/10"
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
