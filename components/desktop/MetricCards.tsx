'use client';

import { Truck, CheckCircle, AlertTriangle, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Delivery, SUPPLIERS, isDelayed } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  deliveries: Delivery[];
}

export default function MetricCards({ deliveries }: Props) {
  const delayed = deliveries.filter((d) => isDelayed(d.expectedTime));
  const onTime = deliveries.filter((d) => !isDelayed(d.expectedTime));
  const onTimeRate = deliveries.length > 0 ? Math.round((onTime.length / deliveries.length) * 100) : 0;

  const cards = [
    {
      label: 'Total Orders Today',
      value: deliveries.length,
      sub: 'scheduled deliveries',
      icon: <Truck size={20} />,
      iconBg: 'bg-blue-600/20',
      iconColor: 'text-blue-400',
      trend: null,
    },
    {
      label: 'On Time',
      value: onTime.length,
      sub: `${onTimeRate}% on-time rate`,
      icon: <CheckCircle size={20} />,
      iconBg: 'bg-green-600/20',
      iconColor: 'text-green-400',
      trend: onTimeRate >= 70 ? 'up' : 'down',
    },
    {
      label: 'Delayed',
      value: delayed.length,
      sub: delayed.length > 0 ? 'require attention' : 'All on schedule',
      icon: <AlertTriangle size={20} />,
      iconBg: delayed.length > 0 ? 'bg-red-600/20' : 'bg-gray-600/20',
      iconColor: delayed.length > 0 ? 'text-red-400' : 'text-gray-400',
      trend: delayed.length > 0 ? 'down' : null,
    },
    {
      label: 'Active Suppliers',
      value: SUPPLIERS.length,
      sub: 'registered suppliers',
      icon: <Users size={20} />,
      iconBg: 'bg-purple-600/20',
      iconColor: 'text-purple-400',
      trend: null,
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
            <p className={clsx('font-extrabold text-3xl mt-0.5', c.iconColor === 'text-red-400' && c.value > 0 ? 'text-red-400' : c.iconColor === 'text-green-400' ? 'text-green-400' : 'text-white')}>
              {c.value}
            </p>
            <p className="text-gray-500 text-xs mt-1">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
