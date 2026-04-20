'use client';

import { Bell, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Delivery, isDelayed, formatTime } from '@/lib/data';
import clsx from 'clsx';

interface Props {
  deliveries: Delivery[];
  onOpenOrder: (d: Delivery) => void;
}

interface Notif {
  id: string;
  type: 'delayed' | 'delivered' | 'upcoming';
  title: string;
  body: string;
  time: string;
  delivery?: Delivery;
}

function buildNotifications(deliveries: Delivery[]): Notif[] {
  const now = new Date();
  const notifs: Notif[] = [];

  for (const d of deliveries) {
    const late = isDelayed(d.expectedTime);
    const [h, m] = d.expectedTime.split(':').map(Number);
    const expected = new Date();
    expected.setHours(h, m, 0, 0);
    const diffMin = Math.round((expected.getTime() - now.getTime()) / 60000);

    if (late) {
      const minsLate = Math.abs(diffMin);
      notifs.push({
        id: `late-${d.id}`,
        type: 'delayed',
        title: `${d.supplierName} is delayed`,
        body: `Expected at ${formatTime(d.expectedTime)} · ${minsLate}m overdue`,
        time: formatTime(d.expectedTime),
        delivery: d,
      });
    } else if (diffMin > 0 && diffMin <= 30) {
      notifs.push({
        id: `soon-${d.id}`,
        type: 'upcoming',
        title: `${d.supplierName} arriving soon`,
        body: `${d.items} · expected in ${diffMin} min`,
        time: formatTime(d.expectedTime),
        delivery: d,
      });
    }
  }

  // Simulated past-delivered items for realism
  const delivered: Notif[] = [
    {
      id: 'del-1',
      type: 'delivered',
      title: 'Selecta delivered successfully',
      body: 'Dairy & Eggs · confirmed at 07:45 AM',
      time: '7:45 AM',
    },
    {
      id: 'del-2',
      type: 'delivered',
      title: 'Bread & Pastry Co. delivered',
      body: 'Baked goods · confirmed at 06:30 AM',
      time: '6:30 AM',
    },
  ];

  return [...notifs, ...delivered];
}

const iconMap = {
  delayed: <AlertTriangle size={18} className="text-red-400" />,
  delivered: <CheckCircle size={18} className="text-green-400" />,
  upcoming: <Clock size={18} className="text-yellow-400" />,
};

const bgMap = {
  delayed: 'border-red-500/20 bg-red-500/5',
  delivered: 'border-green-500/20',
  upcoming: 'border-yellow-500/20 bg-yellow-500/5',
};

export default function NotificationsView({ deliveries, onOpenOrder }: Props) {
  const notifs = buildNotifications(deliveries);

  return (
    <main className="flex-1 overflow-y-auto px-5 pb-28">
      <section className="mb-5">
        <h1 className="text-white font-extrabold text-2xl leading-tight">Notifications</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {notifs.filter((n) => n.type !== 'delivered').length > 0
            ? `${notifs.filter((n) => n.type !== 'delivered').length} active alerts`
            : 'All deliveries on track'}
        </p>
      </section>

      {notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell size={48} className="text-gray-600 mb-3" />
          <p className="text-white font-semibold">All clear!</p>
          <p className="text-gray-400 text-sm mt-1">No alerts right now.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {notifs.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => n.delivery && onOpenOrder(n.delivery)}
                disabled={!n.delivery}
                className={clsx(
                  'w-full flex items-start gap-3 bg-surface-card rounded-2xl px-4 py-3.5 text-left border transition-all',
                  bgMap[n.type],
                  n.delivery ? 'active:scale-[0.98] cursor-pointer' : 'cursor-default'
                )}
              >
                <span className="mt-0.5 flex-shrink-0">{iconMap[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">{n.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{n.body}</p>
                </div>
                <span className="text-gray-500 text-[10px] font-medium flex-shrink-0 mt-0.5">
                  {n.time}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
