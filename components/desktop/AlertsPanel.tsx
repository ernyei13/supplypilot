'use client';

import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Delivery, isDelayed, formatTime } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  deliveries: Delivery[];
  onOpenOrder: (d: Delivery) => void;
}

export default function AlertsPanel({ deliveries, onOpenOrder }: Props) {
  const now = new Date();

  const delayed = deliveries.filter((d) => isDelayed(d.expectedTime));
  const upcoming = deliveries.filter((d) => {
    const [h, m] = d.expectedTime.split(':').map(Number);
    const exp = new Date();
    exp.setHours(h, m, 0, 0);
    const diff = (exp.getTime() - now.getTime()) / 60000;
    return diff > 0 && diff <= 45;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Active alerts */}
      <div className="bg-surface-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700/50">
          <h2 className="text-white font-bold text-base">Active Alerts</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {delayed.length + upcoming.length === 0 ? 'All clear' : `${delayed.length + upcoming.length} alerts`}
          </p>
        </div>

        <div className="divide-y divide-gray-700/40">
          {delayed.length === 0 && upcoming.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center px-5">
              <CheckCircle size={36} className="text-green-500 mb-2" />
              <p className="text-white font-semibold text-sm">All deliveries on track</p>
              <p className="text-gray-500 text-xs mt-1">No active alerts right now.</p>
            </div>
          )}

          {delayed.map((d) => {
            const [h, m] = d.expectedTime.split(':').map(Number);
            const exp = new Date();
            exp.setHours(h, m, 0, 0);
            const minsLate = Math.round((now.getTime() - exp.getTime()) / 60000);
            return (
              <button
                key={`late-${d.id}`}
                onClick={() => onOpenOrder(d)}
                className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-red-500/5 transition-colors"
              >
                <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{d.supplierName}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{d.items} · {minsLate}m overdue</p>
                </div>
                <span className="text-red-400 text-xs font-bold flex-shrink-0">{formatTime(d.expectedTime)}</span>
              </button>
            );
          })}

          {upcoming.map((d) => {
            const [h, m] = d.expectedTime.split(':').map(Number);
            const exp = new Date();
            exp.setHours(h, m, 0, 0);
            const minsLeft = Math.round((exp.getTime() - now.getTime()) / 60000);
            return (
              <button
                key={`soon-${d.id}`}
                onClick={() => onOpenOrder(d)}
                className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-yellow-500/5 transition-colors"
              >
                <Clock size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{d.supplierName}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{d.items} · in {minsLeft} min</p>
                </div>
                <span className="text-yellow-400 text-xs font-bold flex-shrink-0">{formatTime(d.expectedTime)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
