'use client';

import { useState } from 'react';
import { X, RefreshCw, Play, Pause, Zap, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { STANDING_ORDERS, StandingOrder } from '@/lib/catalog';
import clsx from 'clsx';

interface Props { onClose: () => void; }

const SUPPLIER_COLORS: Record<string, string> = {
  metro: 'bg-blue-600', greens: 'bg-green-600', balla: 'bg-emerald-600',
  velier: 'bg-purple-600', sopplaya: 'bg-orange-600', selecta: 'bg-cyan-600',
};

const FREQ_LABEL: Record<StandingOrder['frequency'], string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  'twice-weekly': 'Twice a week',
};

export default function StandingOrdersModal({ onClose }: Props) {
  const [orders, setOrders] = useState<StandingOrder[]>(STANDING_ORDERS);
  const [ordered, setOrdered] = useState(false);
  const [justOrderedId, setJustOrderedId] = useState<string | null>(null);

  function toggleActive(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o)));
  }

  function reorderOne(id: string) {
    setJustOrderedId(id);
    setTimeout(() => setJustOrderedId(null), 2000);
  }

  function orderAll() {
    setOrdered(true);
    setTimeout(() => setOrdered(false), 3000);
  }

  const activeOrders = orders.filter((o) => o.active);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-surface-card rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="bg-purple-600 p-1.5 rounded-lg"><RefreshCw size={16} className="text-white" /></span>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Standing Orders</h2>
              <p className="text-gray-400 text-xs">{activeOrders.length} active recurring orders</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {/* Order All Now button */}
        <div className="px-5 py-4 border-b border-gray-700/50 flex-shrink-0">
          <button
            onClick={orderAll}
            className={clsx(
              'w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95',
              ordered
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 shadow-lg shadow-yellow-900/20'
            )}
          >
            {ordered ? (
              <><CheckCircle size={18} /> All Orders Sent!</>
            ) : (
              <><Zap size={18} /> Order All Active Now</>
            )}
          </button>
          {activeOrders.length > 0 && !ordered && (
            <p className="text-gray-500 text-xs text-center mt-2">
              Will send requests to {[...new Set(activeOrders.map((o) => o.supplierName))].join(', ')}
            </p>
          )}
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className={clsx(
                'bg-surface rounded-2xl overflow-hidden border transition-all',
                order.active ? 'border-gray-700/50' : 'border-gray-700/20 opacity-70'
              )}
            >
              {/* Order header */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0', SUPPLIER_COLORS[order.supplierId])}>
                  {order.supplierName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{order.name}</p>
                  <p className="text-gray-400 text-xs">
                    {order.supplierName} · {FREQ_LABEL[order.frequency]} · {order.dayLabel}
                  </p>
                </div>
                <button
                  onClick={() => toggleActive(order.id)}
                  className={clsx(
                    'p-2 rounded-xl transition-colors flex-shrink-0',
                    order.active ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-500 hover:bg-gray-700'
                  )}
                  title={order.active ? 'Pause' : 'Resume'}
                >
                  {order.active ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>

              {/* Items */}
              <div className="px-4 pb-3 space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-1 h-1 rounded-full bg-gray-600 flex-shrink-0" />
                    <span>{item.productName}</span>
                    <span className="text-gray-600">·</span>
                    <span className="font-medium text-gray-300">{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/30">
                <div className="flex items-center gap-1.5">
                  <span className={clsx('w-1.5 h-1.5 rounded-full', order.active ? 'bg-green-500' : 'bg-gray-600')} />
                  <span className="text-gray-500 text-xs">
                    {order.active
                      ? `Next: ${new Date(order.nextOrderDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`
                      : 'Paused'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {justOrderedId === order.id ? (
                    <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle size={12} /> Sent!
                    </span>
                  ) : (
                    <button
                      onClick={() => reorderOne(order.id)}
                      disabled={!order.active}
                      className={clsx(
                        'text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
                        order.active
                          ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                          : 'text-gray-600 cursor-not-allowed'
                      )}
                    >
                      Order Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add standing order placeholder */}
          <button className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-gray-600 rounded-2xl text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors text-sm">
            <Plus size={16} />
            Add Standing Order
          </button>
        </div>
      </div>
    </div>
  );
}
