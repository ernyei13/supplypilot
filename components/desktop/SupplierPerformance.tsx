'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { SUPPLIERS, getSupplierStats } from '@/lib/data';
import clsx from 'clsx';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const reliabilityLabel = {
  excellent: { text: 'Excellent', cls: 'bg-green-500/20 text-green-400' },
  good: { text: 'Good', cls: 'bg-yellow-500/20 text-yellow-400' },
  poor: { text: 'Poor', cls: 'bg-red-500/20 text-red-400' },
};

export default function SupplierPerformance() {
  return (
    <div className="bg-surface-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-base">Supplier Performance</h2>
          <p className="text-gray-400 text-xs mt-0.5">7-day on-time delivery history</p>
        </div>
      </div>

      <div className="divide-y divide-gray-700/40">
        {SUPPLIERS.map((s) => {
          const { onTimeRate, reliability } = getSupplierStats(s);
          const rl = reliabilityLabel[reliability];

          return (
            <div key={s.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              {/* Avatar */}
              <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0', s.color)}>
                {s.name.charAt(0)}
              </div>

              {/* Name + category */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{s.name}</p>
                <p className="text-gray-500 text-xs truncate">{s.category}</p>
              </div>

              {/* 7-day sparkline dots */}
              <div className="hidden xl:flex items-center gap-1">
                {s.weeklyHistory.map((onTime, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div
                      className={clsx(
                        'w-2.5 h-2.5 rounded-full',
                        onTime ? 'bg-green-500' : 'bg-red-500'
                      )}
                    />
                    <span className="text-[9px] text-gray-600">{DAYS[i]}</span>
                  </div>
                ))}
              </div>

              {/* On-time rate bar */}
              <div className="hidden lg:flex flex-col gap-1 w-24">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-semibold">{onTimeRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full', onTimeRate >= 80 ? 'bg-green-500' : onTimeRate >= 57 ? 'bg-yellow-500' : 'bg-red-500')}
                    style={{ width: `${onTimeRate}%` }}
                  />
                </div>
              </div>

              {/* Badge */}
              <span className={clsx('hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0', rl.cls)}>
                {rl.text}
              </span>

              {/* Contact */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-500 hover:text-[#25D366] transition-colors rounded-lg hover:bg-[#25D366]/10"
                  title="WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
                <a
                  href={`tel:${s.phone}`}
                  className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-400/10"
                  title="Call"
                >
                  <Phone size={15} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
