'use client';

import { Truck, CheckCircle2, AlertTriangle, PackageCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { Delivery, SUPPLIERS, isDelayed } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  deliveries: Delivery[];
}

export default function MetricCards({ deliveries }: Props) {
  const received = deliveries.filter((d) => d.status === 'received');
  const delayed = deliveries.filter((d) => isDelayed(d.expectedTime) && d.status !== 'received');
  const pending = deliveries.filter((d) => d.status !== 'received');
  const onTime = pending.filter((d) => !isDelayed(d.expectedTime));
  const onTimeRate = deliveries.length > 0 ? Math.round(((onTime.length + received.length) / deliveries.length) * 100) : 0;

  const cards = [
    {
      label: 'Total Today',
      value: deliveries.length,
      sub: 'scheduled deliveries',
      icon: <Truck size={20} />,
      iconBg: 'bg-blue-600/20',
      iconColor: 'text-blue-400',
      valueColor: 'text-white',
      trend: null,
    },
    {
      label: 'Received',
      value: received.length,
      sub: received.length === deliveries.length && deliveries.length > 0 ? 'All done! 🎉' : `${deliveries.length - received.length} still pending`,
      icon: <PackageCheck size={20} />,
      iconBg: 'bg-emerald-600/20',
      iconColor: 'text-emerald-400',
      valueColor: received.length > 0 ? 'text-emerald-400' : 'text-white',
      trend: received.length > 0 ? 'up' : null,
    },
    {
      label: 'Delayed',
      value: delayed.length,
      sub: delayed.length > 0 ? 'require attention' : 'All on schedule',
      icon: <AlertTriangle size={20} />,
      iconBg: delayed.length > 0 ? 'bg-red-600/20' : 'bg-gray-600/20',
      iconColor: delayed.length > 0 ? 'text-red-400' : 'text-gray-400',
      valueColor: delayed.length > 0 ? 'text-red-400' : 'text-white',
      trend: delayed.length > 0 ? 'down' : null,
    },
    {
      label: 'On-Time Rate',
      value: `${onTimeRate}%`,
      sub: `${SUPPLIERS.length} active suppliers`,
      icon: <CheckCircle2 size={20} />,
      iconBg: onTimeRate >= 70 ? 'bg-green-600/20' : 'bg-yellow-600/20',
      iconColor: onTimeRate >= 70 ? 'text-green-400' : 'text-yellow-400',
      valueColor: onTimeRate >= 70 ? 'text-green-400' : 'text-yellow-400',
      trend: onTimeRate >= 70 ? 'up' : 'down',
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <div key={c.label} className="bg-surface-card rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={clsx('p-2.5 rounded-xl', c.iconBg, c.iconColor)}>{c.icon}</span>
            {c.trend === 'up' && <TrendingUp size={16} className="text-green-400" />}
            {c.trend === 'down' && <TrendingDown size={16} className="text-red-400" />}
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">{c.label}</p>
            <p className={clsx('font-extrabold text-3xl mt-0.5', c.valueColor)}>{c.value}</p>
            <p className="text-gray-500 text-xs mt-1">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
