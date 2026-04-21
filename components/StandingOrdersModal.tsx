'use client';

import { useState } from 'react';
import { X, RefreshCw, Play, Pause, Zap, CheckCircle, Plus, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
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

const SUPPLIER_OPTIONS = [
  { id: 'metro', name: 'Metro Food Service' },
  { id: 'greens', name: 'Local Greens Co.' },
  { id: 'balla', name: 'Balla Fresh Co.' },
  { id: 'velier', name: 'Velier Spirits' },
  { id: 'sopplaya', name: 'Sopplaya Produce' },
  { id: 'selecta', name: 'Selecta' },
];

const FREQ_OPTIONS: { value: StandingOrder['frequency']; label: string; desc: string }[] = [
  { value: 'daily', label: 'Daily', desc: 'Every day' },
  { value: 'twice-weekly', label: 'Twice a Week', desc: 'Mon & Thu' },
  { value: 'weekly', label: 'Weekly', desc: 'Once a week' },
];

const DAY_OPTIONS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StandingOrdersModal({ onClose }: Props) {
  const [orders, setOrders] = useState<StandingOrder[]>(STANDING_ORDERS);
  const [ordered, setOrdered] = useState(false);
  const [justOrderedId, setJustOrderedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSupplier, setFormSupplier] = useState('metro');
  const [formFreq, setFormFreq] = useState<StandingOrder['frequency']>('weekly');
  const [formDay, setFormDay] = useState('Monday');
  const [formItems, setFormItems] = useState([{ productName: '', quantity: 1, unit: 'kg' }]);

  function toggleActive(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o)));
  }

  function deleteOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  function reorderOne(id: string) {
    setJustOrderedId(id);
    setTimeout(() => setJustOrderedId(null), 2000);
  }

  function orderAll() {
    setOrdered(true);
    setTimeout(() => setOrdered(false), 3000);
  }

  function addItem() {
    setFormItems((prev) => [...prev, { productName: '', quantity: 1, unit: 'kg' }]);
  }

  function updateItem(i: number, field: string, value: string | number) {
    setFormItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  function removeItem(i: number) {
    setFormItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function submitForm() {
    if (!formName.trim()) return;
    const validItems = formItems.filter((it) => it.productName.trim());
    if (validItems.length === 0) return;

    const supplierName = SUPPLIER_OPTIONS.find((s) => s.id === formSupplier)?.name ?? formSupplier;
    const dayLabel = formFreq === 'daily' ? 'Every day' : `Every ${formDay}`;
    const newOrder: StandingOrder = {
      id: `so-${Date.now()}`,
      name: formName.trim(),
      supplierId: formSupplier,
      supplierName,
      items: validItems,
      frequency: formFreq,
      dayLabel,
      active: true,
      nextOrderDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setOrders((prev) => [...prev, newOrder]);
    // reset
    setFormName('');
    setFormSupplier('metro');
    setFormFreq('weekly');
    setFormDay('Monday');
    setFormItems([{ productName: '', quantity: 1, unit: 'kg' }]);
    setShowAddForm(false);
  }

  const activeOrders = orders.filter((o) => o.active);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-surface-card rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {showAddForm ? (
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white transition-colors p-1 -ml-1">
                <ArrowLeft size={20} />
              </button>
            ) : (
              <span className="bg-purple-600 p-1.5 rounded-lg"><RefreshCw size={16} className="text-white" /></span>
            )}
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {showAddForm ? 'New Standing Order' : 'Standing Orders'}
              </h2>
              {!showAddForm && (
                <p className="text-gray-400 text-xs">{activeOrders.length} active recurring orders</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"><X size={20} /></button>
        </div>

        {showAddForm ? (
          /* ── Add Standing Order Form ── */
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Order name */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Order Name</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Weekly Vegetables"
                className="w-full bg-surface text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700/50"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Supplier</label>
              <div className="grid grid-cols-2 gap-2">
                {SUPPLIER_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFormSupplier(s.id)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all text-sm',
                      formSupplier === s.id
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                    )}
                  >
                    <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', SUPPLIER_COLORS[s.id])} />
                    <span className="truncate text-xs font-medium">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {FREQ_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormFreq(f.value)}
                    className={clsx(
                      'px-3 py-2.5 rounded-xl border text-center transition-all',
                      formFreq === f.value
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-gray-700/50 text-gray-400 hover:border-gray-600'
                    )}
                  >
                    <p className="text-xs font-semibold">{f.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Day (shown only when not daily) */}
            {formFreq !== 'daily' && (
              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Day</label>
                <div className="flex flex-wrap gap-2">
                  {DAY_OPTIONS.map((day) => (
                    <button
                      key={day}
                      onClick={() => setFormDay(day)}
                      className={clsx(
                        'px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all',
                        formDay === day
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-gray-700/50 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                      )}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Items</label>
                <button onClick={addItem} className="text-purple-400 text-xs font-semibold hover:text-purple-300 transition-colors flex items-center gap-1">
                  <Plus size={12} /> Add Item
                </button>
              </div>
              <div className="space-y-2">
                {formItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={item.productName}
                      onChange={(e) => updateItem(i, 'productName', e.target.value)}
                      placeholder="Product name"
                      className="flex-1 bg-surface text-white placeholder-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700/50"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => updateItem(i, 'quantity', parseFloat(e.target.value) || 1)}
                      className="w-16 bg-surface text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700/50 text-center"
                    />
                    <input
                      value={item.unit}
                      onChange={(e) => updateItem(i, 'unit', e.target.value)}
                      placeholder="kg"
                      className="w-16 bg-surface text-white placeholder-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700/50 text-center"
                    />
                    {formItems.length > 1 && (
                      <button onClick={() => removeItem(i)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={submitForm}
              disabled={!formName.trim() || formItems.every((it) => !it.productName.trim())}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm active:scale-95"
            >
              Create Standing Order
            </button>
          </div>
        ) : (
          <>
            {/* Order All Now button */}
            <div className="px-5 py-4 border-b border-gray-700/50 flex-shrink-0">
              <button
                onClick={orderAll}
                disabled={activeOrders.length === 0}
                className={clsx(
                  'w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
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
                  Sends to {Array.from(new Set(activeOrders.map((o) => o.supplierName))).join(', ')}
                </p>
              )}
            </div>

            {/* Orders list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <RefreshCw size={36} className="text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm font-medium">No standing orders yet</p>
                  <p className="text-gray-600 text-xs mt-1">Create one below to automate your recurring supply orders</p>
                </div>
              )}

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
                    <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0', SUPPLIER_COLORS[order.supplierId] ?? 'bg-gray-600')}>
                      {order.supplierName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{order.name}</p>
                      <p className="text-gray-400 text-xs">
                        {order.supplierName} · {FREQ_LABEL[order.frequency]} · {order.dayLabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleActive(order.id)}
                        className={clsx(
                          'p-1.5 rounded-xl transition-colors',
                          order.active ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-500 hover:bg-gray-700'
                        )}
                        title={order.active ? 'Pause' : 'Resume'}
                      >
                        {order.active ? <Pause size={15} /> : <Play size={15} />}
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-1.5 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

              {/* Add standing order button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-gray-600 rounded-2xl text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-sm font-medium"
              >
                <Plus size={16} />
                Add Standing Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
