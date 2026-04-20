'use client';

import { useState, useMemo } from 'react';
import {
  X, Search, ShoppingCart, ChevronRight, CheckCircle,
  Minus, Plus, AlertCircle, Zap,
} from 'lucide-react';
import {
  CATALOG, getProductsBySupplier, searchProducts,
  CatalogProduct, CartItem,
} from '@/lib/catalog';
import clsx from 'clsx';

interface Props { onClose: () => void; }

type Mode = 'by-supplier' | 'by-product';
type Step = 'browse' | 'cart' | 'success';

const SUPPLIER_COLORS: Record<string, string> = {
  metro: 'bg-blue-600', greens: 'bg-green-600', balla: 'bg-emerald-600',
  velier: 'bg-purple-600', sopplaya: 'bg-orange-600', selecta: 'bg-cyan-600',
};

const SUPPLIER_NAMES: Record<string, string> = {
  metro: 'Metro Food Service', greens: 'Local Greens Co.', balla: 'Balla Fresh Co.',
  velier: 'Velier Spirits', sopplaya: 'Sopplaya Produce', selecta: 'Selecta',
};

export default function PlaceOrderModal({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>('by-supplier');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<Step>('browse');

  const supplierProducts = useMemo(
    () => (selectedSupplierId ? getProductsBySupplier(selectedSupplierId) : []),
    [selectedSupplierId]
  );

  const searchResults = useMemo(() => searchProducts(searchQuery), [searchQuery]);

  const cartTotal = cart.reduce((s, i) => s + i.product.pricePerUnit * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  function setQty(product: CatalogProduct, delta: number) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (!existing) {
        if (delta <= 0) return prev;
        return [...prev, { product, quantity: delta }];
      }
      const next = existing.quantity + delta;
      if (next <= 0) return prev.filter((i) => i.product.id !== product.id);
      return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: next } : i));
    });
  }

  function getQty(productId: string) {
    return cart.find((i) => i.product.id === productId)?.quantity ?? 0;
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-surface-card rounded-2xl p-8 text-center shadow-2xl">
          <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-white font-extrabold text-xl mb-2">Order Sent!</h2>
          <p className="text-gray-400 text-sm mb-2">
            Your order request has been sent to{' '}
            <span className="text-white font-semibold">
              {selectedSupplierId ? SUPPLIER_NAMES[selectedSupplierId] : 'the supplier'}
            </span>.
          </p>
          <p className="text-gray-500 text-xs mb-6">
            They will confirm within their standard response window. You'll see the delivery in your dashboard once confirmed.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-surface-card rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="bg-blue-600 p-1.5 rounded-lg"><ShoppingCart size={16} className="text-white" /></span>
            <h2 className="text-white font-bold text-lg">Place New Order</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {/* Mode toggle */}
        <div className="px-5 pt-4 pb-3 flex-shrink-0">
          <div className="flex bg-surface rounded-xl p-1 gap-1">
            <button
              onClick={() => { setMode('by-supplier'); setSelectedSupplierId(null); setSearchQuery(''); }}
              className={clsx('flex-1 py-2 rounded-lg text-sm font-semibold transition-colors', mode === 'by-supplier' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white')}
            >
              By Supplier
            </button>
            <button
              onClick={() => { setMode('by-product'); setSelectedSupplierId(null); }}
              className={clsx('flex-1 py-2 rounded-lg text-sm font-semibold transition-colors', mode === 'by-product' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white')}
            >
              By Product
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">

          {/* ── BY SUPPLIER ── */}
          {mode === 'by-supplier' && !selectedSupplierId && (
            <div>
              <p className="text-gray-400 text-xs mb-3">Select a supplier to browse their catalog</p>
              <div className="space-y-2">
                {Object.entries(SUPPLIER_NAMES).map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedSupplierId(id)}
                    className="w-full flex items-center gap-3 bg-surface rounded-xl px-4 py-3 text-left hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0', SUPPLIER_COLORS[id])}>
                      {name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{name}</p>
                      <p className="text-gray-500 text-xs">{getProductsBySupplier(id).length} products available</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'by-supplier' && selectedSupplierId && (
            <div>
              <button
                onClick={() => setSelectedSupplierId(null)}
                className="flex items-center gap-1.5 text-blue-400 text-sm mb-4 hover:text-blue-300"
              >
                ← Back to suppliers
              </button>
              <div className="space-y-2">
                {supplierProducts.map((p) => (
                  <ProductRow key={p.id} product={p} qty={getQty(p.id)} onSetQty={(d) => setQty(p, d)} />
                ))}
              </div>
            </div>
          )}

          {/* ── BY PRODUCT ── */}
          {mode === 'by-product' && (
            <div>
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search: chicken, mozzarella, lemon…"
                  className="w-full bg-surface text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {!searchQuery && (
                <p className="text-gray-500 text-sm text-center py-8">
                  Type a product name to compare prices across all suppliers.
                </p>
              )}

              {searchQuery && searchResults.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No products found for &ldquo;{searchQuery}&rdquo;</p>
              )}

              {searchResults.length > 0 && (
                <>
                  {/* Group by product name for comparison */}
                  {groupByName(searchResults).map(({ name, products }) => (
                    <div key={name} className="mb-4">
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">{name}</p>
                      <div className="space-y-1.5">
                        {products
                          .sort((a, b) => a.pricePerUnit - b.pricePerUnit)
                          .map((p, i) => (
                            <div key={p.id} className={clsx('relative flex items-center gap-3 bg-surface rounded-xl px-4 py-3', !p.inStock && 'opacity-60')}>
                              {/* Cheapest badge */}
                              {i === 0 && products.length > 1 && p.inStock && (
                                <span className="absolute -top-2 -left-1 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Zap size={9} /> BEST PRICE
                                </span>
                              )}
                              <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0', SUPPLIER_COLORS[p.supplierId])}>
                                {SUPPLIER_NAMES[p.supplierId].charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{SUPPLIER_NAMES[p.supplierId]}</p>
                                <p className="text-gray-500 text-xs">
                                  {p.deliveryLeadDays === 0 ? 'Same day' : `${p.deliveryLeadDays}d delivery`} · min {p.minOrderQty} {p.unit}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-white font-bold text-sm">€{p.pricePerUnit.toFixed(2)}</p>
                                <p className="text-gray-500 text-xs">/{p.unit}</p>
                              </div>
                              {!p.inStock ? (
                                <span className="text-red-400 text-xs font-semibold flex-shrink-0">Out of stock</span>
                              ) : (
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {getQty(p.id) > 0 && (
                                    <>
                                      <button onClick={() => setQty(p, -1)} className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500"><Minus size={12} /></button>
                                      <span className="text-white text-sm font-bold w-5 text-center">{getQty(p.id)}</span>
                                    </>
                                  )}
                                  <button onClick={() => setQty(p, 1)} className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500"><Plus size={12} /></button>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart footer */}
        {cart.length > 0 && (
          <div className="px-5 pb-5 pt-3 border-t border-gray-700/50 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{cartCount} item{cartCount !== 1 ? 's' : ''} in cart</span>
              <span className="text-white font-bold">€{cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setStep('success')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm active:scale-95"
            >
              Send Order Request →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductRow({ product, qty, onSetQty }: { product: CatalogProduct; qty: number; onSetQty: (d: number) => void }) {
  return (
    <div className={clsx('flex items-center gap-3 bg-surface rounded-xl px-4 py-3', !product.inStock && 'opacity-60')}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white font-semibold text-sm truncate">{product.name}</p>
          {!product.inStock && <AlertCircle size={13} className="text-red-400 flex-shrink-0" />}
        </div>
        <p className="text-gray-500 text-xs mt-0.5">{product.category} · {product.unit} · min {product.minOrderQty}</p>
      </div>
      <div className="text-right flex-shrink-0 mr-2">
        <p className="text-white font-bold text-sm">€{product.pricePerUnit.toFixed(2)}</p>
        <p className="text-gray-500 text-[10px]">/{product.unit}</p>
      </div>
      {product.inStock ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {qty > 0 && (
            <>
              <button onClick={() => onSetQty(-1)} className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500"><Minus size={12} /></button>
              <span className="text-white text-sm font-bold w-5 text-center">{qty}</span>
            </>
          )}
          <button onClick={() => onSetQty(1)} className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500"><Plus size={12} /></button>
        </div>
      ) : (
        <span className="text-red-400 text-xs font-semibold">Out</span>
      )}
    </div>
  );
}

function groupByName(products: CatalogProduct[]): { name: string; products: CatalogProduct[] }[] {
  const map = new Map<string, CatalogProduct[]>();
  for (const p of products) {
    const key = p.name;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries()).map(([name, products]) => ({ name, products }));
}
