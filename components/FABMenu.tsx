'use client';

import { Plus, X, PackagePlus, ShoppingCart, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface Props {
  onTrackDelivery: () => void;
  onPlaceOrder: () => void;
  onStandingOrders: () => void;
  isDesktop?: boolean;
}

const actions = [
  {
    key: 'standing',
    Icon: RefreshCw,
    label: 'Standing Orders',
    sublabel: 'Manage recurring orders',
    color: 'bg-purple-600 hover:bg-purple-500',
    shadow: 'shadow-purple-900/40',
  },
  {
    key: 'order',
    Icon: ShoppingCart,
    label: 'Place New Order',
    sublabel: 'Order from suppliers now',
    color: 'bg-blue-600 hover:bg-blue-500',
    shadow: 'shadow-blue-900/40',
  },
  {
    key: 'track',
    Icon: PackagePlus,
    label: 'Track Delivery',
    sublabel: 'Add an incoming delivery',
    color: 'bg-green-600 hover:bg-green-500',
    shadow: 'shadow-green-900/40',
  },
] as const;

export default function FABMenu({ onTrackDelivery, onPlaceOrder, onStandingOrders, isDesktop }: Props) {
  const [open, setOpen] = useState(false);

  function handleAction(key: string) {
    setOpen(false);
    if (key === 'track') onTrackDelivery();
    if (key === 'order') onPlaceOrder();
    if (key === 'standing') onStandingOrders();
  }

  if (isDesktop) {
    return (
      <div className="relative">
        {/* Speed dial items */}
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute bottom-14 right-0 flex flex-col gap-2 z-50 items-end">
              {actions.map(({ key, Icon, label, sublabel, color, shadow }) => (
                <button
                  key={key}
                  onClick={() => handleAction(key)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all active:scale-95',
                    color, shadow
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            'flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm shadow-xl transition-all active:scale-95',
            open
              ? 'bg-gray-600 text-white shadow-gray-900/30'
              : 'bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow-yellow-400/20'
          )}
        >
          {open ? <X size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
          {open ? 'Close' : 'Add Delivery'}
        </button>
      </div>
    );
  }

  // Mobile FAB
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Speed dial items */}
      <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">
        {open &&
          actions.map(({ key, Icon, label, sublabel, color, shadow }, i) => (
            <div
              key={key}
              className="flex items-center gap-3"
              style={{
                animation: `fadeSlideUp 0.15s ease-out ${i * 0.05}s both`,
              }}
            >
              {/* Label */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-right shadow-lg">
                <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                <p className="text-gray-400 text-[10px]">{sublabel}</p>
              </div>
              {/* Icon button */}
              <button
                onClick={() => handleAction(key)}
                className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90',
                  color, shadow
                )}
              >
                <Icon size={20} />
              </button>
            </div>
          ))}

        {/* Main FAB */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            'w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90',
            open
              ? 'bg-gray-600 text-white rotate-45'
              : 'bg-yellow-400 hover:bg-yellow-300 text-gray-900'
          )}
          style={{ transition: 'transform 0.2s, background-color 0.2s' }}
          aria-label="Add"
        >
          <Plus size={24} strokeWidth={3} className={clsx('transition-transform', open && 'rotate-45')} />
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
