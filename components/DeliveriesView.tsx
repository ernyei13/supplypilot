'use client';

import { useState } from 'react';
import { Search, Truck, MessageCircle, CheckCircle2 } from 'lucide-react';
import { Delivery, isDelayed, formatTime } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  deliveries: Delivery[];
  onOpenOrder: (d: Delivery) => void;
  onAdd: () => void;
  onMarkReceived?: (id: string) => void;
}

type Filter = 'all' | 'delayed' | 'ontime' | 'received';

export default function DeliveriesView({ deliveries, onOpenOrder, onAdd, onMarkReceived }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const delayedCount = deliveries.filter((d) => isDelayed(d.expectedTime) && d.status !== 'received').length;
  const onTimeCount = deliveries.filter((d) => !isDelayed(d.expectedTime) && d.status !== 'received').length;
  const receivedCount = deliveries.filter((d) => d.status === 'received').length;

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      d.items.toLowerCase().includes(search.toLowerCase());
    const late = isDelayed(d.expectedTime) && d.status !== 'received';
    const received = d.status === 'received';
    const matchesFilter =
      filter === 'all' ||
      (filter === 'delayed' && late) ||
      (filter === 'ontime' && !late && !received) ||
      (filter === 'received' && received);
    return matchesSearch && matchesFilter;
  });

  const chips: { id: Filter; label: string; activeColor: string }[] = [
    { id: 'all', label: `All (${deliveries.length})`, activeColor: 'bg-blue-600 text-white' },
    { id: 'delayed', label: `Delayed (${delayedCount})`, activeColor: 'bg-red-500 text-white' },
    { id: 'ontime', label: `On Time (${onTimeCount})`, activeColor: 'bg-green-600 text-white' },
    { id: 'received', label: `Received (${receivedCount})`, activeColor: 'bg-emerald-600 text-white' },
  ];

  return (
    <main className="flex-1 overflow-y-auto px-5 pb-28">
      <section className="mb-5">
        <h1 className="text-white font-extrabold text-2xl leading-tight">Deliveries</h1>
        <p className="text-gray-400 text-sm mt-0.5">All orders for today</p>
      </section>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search supplier or item…"
          className="w-full bg-surface-card text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {chips.map(({ id, label, activeColor }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0',
              filter === id ? activeColor : 'bg-surface-card text-gray-400 hover:text-white'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Truck size={44} className="text-gray-600 mb-3" />
          <p className="text-gray-400 text-sm">No deliveries match your filter.</p>
          {deliveries.length === 0 && (
            <button
              onClick={onAdd}
              className="mt-3 text-blue-400 text-sm font-medium underline underline-offset-2"
            >
              Add your first delivery
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((d) => {
            const late = isDelayed(d.expectedTime) && d.status !== 'received';
            const isReceived = d.status === 'received';
            return (
              <li key={d.id}>
                <div
                  className={clsx(
                    'flex items-center gap-3 bg-surface-card rounded-2xl px-4 py-3.5 border transition-all',
                    isReceived ? 'border-emerald-500/20 opacity-75' : late ? 'border-red-500/30' : 'border-transparent'
                  )}
                >
                  <button onClick={() => onOpenOrder(d)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                    <span className={clsx('w-1 h-10 rounded-full flex-shrink-0', isReceived ? 'bg-emerald-500' : late ? 'bg-red-500' : 'bg-green-500')} />
                    <div className="flex-1 min-w-0">
                      <p className={clsx('font-semibold text-sm truncate', isReceived ? 'text-gray-400 line-through' : 'text-white')}>
                        {d.supplierName}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{d.items}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 mr-1">
                      <span className="text-gray-300 text-xs font-medium">{formatTime(d.expectedTime)}</span>
                      <span className={clsx('text-[10px] font-bold uppercase tracking-wide',
                        isReceived ? 'text-emerald-400' : late ? 'text-red-400' : 'text-green-400')}>
                        {isReceived ? 'RECEIVED' : late ? 'DELAYED' : 'ON TIME'}
                      </span>
                    </div>
                  </button>

                  {/* Quick actions */}
                  <div className="flex items-center gap-1 flex-shrink-0 border-l border-gray-700/50 pl-3">
                    {!isReceived && onMarkReceived && (
                      <button
                        onClick={() => onMarkReceived(d.id)}
                        className="p-1.5 text-gray-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-400/10"
                        title="Mark received"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    <a
                      href={`https://wa.me/${d.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-500 hover:text-[#25D366] transition-colors rounded-lg hover:bg-[#25D366]/10"
                      title="WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
