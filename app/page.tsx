'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Home,
  Truck,
  Bell,
  Settings,
  Zap,
  ChevronRight,
  Package,
} from 'lucide-react';
import { Delivery, SAMPLE_DELIVERIES, isDelayed, formatTime } from '@/lib/data';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import AddDeliveryModal from '@/components/AddDeliveryModal';
import FakeDoorModal from '@/components/FakeDoorModal';
import clsx from 'clsx';


type Modal = 'none' | 'order' | 'add' | 'fakedoor';

export default function Dashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(SAMPLE_DELIVERIES);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [modal, setModal] = useState<Modal>('none');
  const [activeTab, setActiveTab] = useState<'home' | 'deliveries' | 'notifs' | 'settings'>('home');
  const [, forceUpdate] = useState(0);

  // Re-evaluate statuses every 30s so the traffic light stays current
  useEffect(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const delayed = deliveries.filter((d) => isDelayed(d.expectedTime));
  const onTime = deliveries.filter((d) => !isDelayed(d.expectedTime));

  function openOrder(delivery: Delivery) {
    setSelectedDelivery(delivery);
    setModal('order');
  }

  function closeModal() {
    setModal('none');
    setSelectedDelivery(null);
  }

  function addDelivery(delivery: Delivery) {
    setDeliveries((prev) => [delivery, ...prev]);
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 rounded-lg p-1.5">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SupplyPilot</span>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors p-1">
          <Menu size={22} />
        </button>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-5 pb-28">
        {/* Greeting */}
        <section className="mb-6">
          <p className="text-gray-400 text-sm">Good morning 👋</p>
          <h1 className="text-white font-extrabold text-2xl leading-tight mt-0.5">
            Hi Elena, here is today&apos;s supply status.
          </h1>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-3 gap-3 mb-6">
          <SummaryCard
            label="Total Orders"
            value={deliveries.length}
            color="text-white"
            bg="bg-surface-card"
          />
          <SummaryCard
            label="On Time"
            value={onTime.length}
            color="text-green-400"
            bg="bg-surface-card"
          />
          <SummaryCard
            label="Delayed"
            value={delayed.length}
            color="text-red-400"
            bg="bg-surface-card"
          />
        </section>

        {/* AI Copilot Banner (Fake Door trigger) */}
        {delayed.length > 0 && (
          <button
            onClick={() => setModal('fakedoor')}
            className="w-full mb-6 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform shadow-lg shadow-blue-900/40"
          >
            <span className="text-2xl">⚡</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">
                Resolve Delays Automatically
              </p>
              <p className="text-blue-200 text-xs mt-0.5">Upgrade to AI Copilot · $29/mo</p>
            </div>
            <ChevronRight size={18} className="text-blue-200 flex-shrink-0" />
          </button>
        )}

        {/* Deliveries list */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">Today&apos;s deliveries</h2>

          {deliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package size={48} className="text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">No deliveries yet today.</p>
              <button
                onClick={() => setModal('add')}
                className="mt-4 text-blue-400 text-sm font-medium underline underline-offset-2"
              >
                Add your first delivery
              </button>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {deliveries.map((d) => {
                const late = isDelayed(d.expectedTime);
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => openOrder(d)}
                      className={clsx(
                        'w-full flex items-center gap-3 bg-surface-card rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.98]',
                        late
                          ? 'border border-red-500/30 hover:border-red-500/60'
                          : 'border border-transparent hover:border-gray-600'
                      )}
                    >
                      {/* Status indicator stripe */}
                      <span
                        className={clsx(
                          'w-1 h-10 rounded-full flex-shrink-0',
                          late ? 'bg-red-500' : 'bg-green-500'
                        )}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{d.supplierName}</p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">{d.items}</p>
                      </div>

                      {/* Time + badge */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-gray-300 text-xs font-medium">
                          {formatTime(d.expectedTime)}
                        </span>
                        <span
                          className={clsx(
                            'text-[10px] font-bold uppercase tracking-wide',
                            late ? 'text-red-400' : 'text-green-400'
                          )}
                        >
                          {late ? 'DELAYED' : 'ON TIME'}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setModal('add')}
        className="fixed bottom-24 right-5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full w-14 h-14 flex items-center justify-center shadow-xl shadow-yellow-400/30 transition-all active:scale-90 z-40"
        aria-label="Add delivery"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-surface-card border-t border-gray-700/50 flex items-center justify-around px-4 py-3 z-30">
        {(
          [
            { id: 'home', Icon: Home, label: 'Home' },
            { id: 'deliveries', Icon: Truck, label: 'Deliveries' },
            { id: 'notifs', Icon: Bell, label: 'Notifs' },
            { id: 'settings', Icon: Settings, label: 'Settings' },
          ] as const
        ).map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={clsx(
              'flex flex-col items-center gap-1 transition-colors',
              activeTab === id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* Modals */}
      {modal === 'order' && selectedDelivery && (
        <OrderDetailsModal
          delivery={selectedDelivery}
          delayed={isDelayed(selectedDelivery.expectedTime)}
          onClose={closeModal}
        />
      )}
      {modal === 'add' && <AddDeliveryModal onClose={closeModal} onAdd={addDelivery} />}
      {modal === 'fakedoor' && <FakeDoorModal onClose={closeModal} />}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={clsx(bg, 'rounded-2xl p-3.5 flex flex-col gap-1')}>
      <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide leading-tight">
        {label}
      </span>
      <span className={clsx('font-extrabold text-2xl', color)}>{value}</span>
    </div>
  );
}
