'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Truck } from 'lucide-react';
import { Delivery, isDelayed, formatTime } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  deliveries: Delivery[];
  onOpenOrder: (d: Delivery) => void;
  onAdd: () => void;
}

type Filter = 'all' | 'delayed' | 'ontime';

export default function DeliveriesView({ deliveries, onOpenOrder, onAdd }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      d.items.toLowerCase().includes(search.toLowerCase());
    const late = isDelayed(d.expectedTime);
    const matchesFilter =
      filter === 'all' || (filter === 'delayed' && late) || (filter === 'ontime' && !late);
    return matchesSearch && matchesFilter;
  });

  const delayedCount = deliveries.filter((d) => isDelayed(d.expectedTime)).length;
  const onTimeCount = deliveries.length - delayedCount;

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
      <div className="flex gap-2 mb-5">
        {(
          [
            { id: 'all', label: `All (${deliveries.length})` },
            { id: 'delayed', label: `Delayed (${delayedCount})` },
            { id: 'ontime', label: `On Time (${onTimeCount})` },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors',
              filter === id
                ? id === 'delayed'
                  ? 'bg-red-500 text-white'
                  : id === 'ontime'
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-surface-card text-gray-400 hover:text-white'
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
            const late = isDelayed(d.expectedTime);
            return (
              <li key={d.id}>
                <button
                  onClick={() => onOpenOrder(d)}
                  className={clsx(
                    'w-full flex items-center gap-3 bg-surface-card rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.98]',
                    late ? 'border border-red-500/30' : 'border border-transparent hover:border-gray-600'
                  )}
                >
                  <span className={clsx('w-1 h-10 rounded-full flex-shrink-0', late ? 'bg-red-500' : 'bg-green-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{d.supplierName}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{d.items}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-gray-300 text-xs font-medium">{formatTime(d.expectedTime)}</span>
                    <span className={clsx('text-[10px] font-bold uppercase tracking-wide', late ? 'text-red-400' : 'text-green-400')}>
                      {late ? 'DELAYED' : 'ON TIME'}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
