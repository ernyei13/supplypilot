'use client';

import { useState, useEffect } from 'react';
import { Plus, Home, Truck, Bell, Settings, Package } from 'lucide-react';
import { Delivery, SAMPLE_DELIVERIES, isDelayed, formatTime } from '@/lib/data';

import AppHeader from '@/components/AppHeader';
import DesktopHeader from '@/components/DesktopHeader';
import Sidebar from '@/components/Sidebar';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import AddDeliveryModal from '@/components/AddDeliveryModal';
import FakeDoorModal from '@/components/FakeDoorModal';
import DeliveriesView from '@/components/DeliveriesView';
import NotificationsView from '@/components/NotificationsView';
import SettingsView from '@/components/SettingsView';
import HamburgerMenu from '@/components/HamburgerMenu';
import FABMenu from '@/components/FABMenu';
import PlaceOrderModal from '@/components/PlaceOrderModal';
import StandingOrdersModal from '@/components/StandingOrdersModal';

// Desktop panels
import MetricCards from '@/components/desktop/MetricCards';
import SupplierPerformance from '@/components/desktop/SupplierPerformance';
import OrdersTable from '@/components/desktop/OrdersTable';
import AlertsPanel from '@/components/desktop/AlertsPanel';

import clsx from 'clsx';
import { useSettings } from '@/lib/SettingsContext';

type Tab = 'home' | 'deliveries' | 'notifs' | 'settings';
type Modal = 'none' | 'order' | 'add' | 'fakedoor' | 'placeorder' | 'standing';

export default function App() {
  const { settings } = useSettings();
  const [deliveries, setDeliveries] = useState<Delivery[]>(SAMPLE_DELIVERIES);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [modal, setModal] = useState<Modal>('none');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const delayed = deliveries.filter((d) => isDelayed(d.expectedTime));
  // Respect notification settings for badge counts
  const badgeCount = settings.delayAlerts ? delayed.length : 0;
  const onTime = deliveries.filter((d) => !isDelayed(d.expectedTime));

  function openOrder(delivery: Delivery) {
    setSelectedDelivery(delivery);
    setModal('order');
  }
  function closeModal() { setModal('none'); setSelectedDelivery(null); }
  function addDelivery(d: Delivery) { setDeliveries((prev) => [d, ...prev]); }

  const showFAB = activeTab === 'home' || activeTab === 'deliveries';

  return (
    <div className="min-h-screen bg-surface flex">
      {/* ── Desktop sidebar ── */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onFakeDoor={() => setModal('fakedoor')}
        delayedCount={badgeCount}
      />

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:max-h-screen lg:overflow-hidden">
        {/* Mobile header */}
        <AppHeader
          activeTab={activeTab}
          delayedCount={badgeCount}
          onMenuOpen={() => setMenuOpen(true)}
          onNotifs={() => setActiveTab('notifs')}
        />

        {/* Desktop header */}
        <DesktopHeader
          activeTab={activeTab}
          delayedCount={badgeCount}
          onNotifs={() => setActiveTab('notifs')}
        />

        {/* ── Content area ── */}
        <div className="flex-1 lg:overflow-y-auto">

          {/* HOME */}
          {activeTab === 'home' && (
            <>
              {/* Desktop dashboard */}
              <div className="hidden lg:block px-8 py-6">
                <MetricCards deliveries={deliveries} />

                <div className="grid grid-cols-3 gap-5">
                  {/* Left: orders table (2/3) */}
                  <div className="col-span-2 flex flex-col gap-5">
                    <OrdersTable deliveries={deliveries} onOpenOrder={openOrder} />
                    <SupplierPerformance />
                  </div>

                  {/* Right: alerts (1/3) */}
                  <div className="col-span-1">
                    <AlertsPanel
                      deliveries={deliveries}
                      onOpenOrder={openOrder}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile home */}
              <MobileHome
                deliveries={deliveries}
                delayed={delayed}
                onTime={onTime}
                onOpenOrder={openOrder}
                onAddDelivery={() => setModal('add')}
              />
            </>
          )}

          {/* DELIVERIES */}
          {activeTab === 'deliveries' && (
            <>
              {/* Desktop deliveries = same table in full width */}
              <div className="hidden lg:block px-8 py-6">
                <MetricCards deliveries={deliveries} />
                <OrdersTable deliveries={deliveries} onOpenOrder={openOrder} />
              </div>
              <div className="lg:hidden flex flex-col flex-1">
                <DeliveriesView
                  deliveries={deliveries}
                  onOpenOrder={openOrder}
                  onAdd={() => setModal('add')}
                />
              </div>
            </>
          )}

          {/* NOTIFS */}
          {activeTab === 'notifs' && (
            <>
              <div className="hidden lg:block px-8 py-6">
                <AlertsPanel
                  deliveries={deliveries}
                  onOpenOrder={openOrder}
                />
              </div>
              <div className="lg:hidden flex flex-col flex-1">
                <NotificationsView deliveries={deliveries} onOpenOrder={openOrder} />
              </div>
            </>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <>
              <div className="hidden lg:block px-8 py-6 max-w-2xl">
                <SettingsView />
              </div>
              <div className="lg:hidden flex flex-col flex-1">
                <SettingsView />
              </div>
            </>
          )}
        </div>

        {/* ── Mobile bottom nav ── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-card border-t border-gray-700/50 flex items-center justify-around px-4 py-3 z-30">
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
                'flex flex-col items-center gap-1 transition-colors relative',
                activeTab === id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <span className="relative">
                <Icon size={22} />
                {id === 'notifs' && badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Mobile FAB speed dial ── */}
      {showFAB && (
        <div className="lg:hidden">
          <FABMenu
            onTrackDelivery={() => setModal('add')}
            onPlaceOrder={() => setModal('placeorder')}
            onStandingOrders={() => setModal('standing')}
          />
        </div>
      )}

      {/* ── Desktop FAB speed dial ── */}
      {showFAB && (
        <div className="hidden lg:block fixed bottom-8 right-8 z-40">
          <FABMenu
            isDesktop
            onTrackDelivery={() => setModal('add')}
            onPlaceOrder={() => setModal('placeorder')}
            onStandingOrders={() => setModal('standing')}
          />
        </div>
      )}

      {/* ── Modals ── */}
      {modal === 'order' && selectedDelivery && (
        <OrderDetailsModal
          delivery={selectedDelivery}
          delayed={isDelayed(selectedDelivery.expectedTime)}
          onClose={closeModal}
        />
      )}
      {modal === 'add' && <AddDeliveryModal onClose={closeModal} onAdd={addDelivery} />}
      {modal === 'fakedoor' && <FakeDoorModal onClose={closeModal} />}
      {modal === 'placeorder' && <PlaceOrderModal onClose={closeModal} />}
      {modal === 'standing' && <StandingOrdersModal onClose={closeModal} />}

      {/* Mobile hamburger drawer */}
      {menuOpen && (
        <HamburgerMenu
          activeTab={activeTab}
          onNavigate={setActiveTab}
          onClose={() => setMenuOpen(false)}
          onFakeDoor={() => setModal('fakedoor')}
          delayedCount={badgeCount}
        />
      )}
    </div>
  );
}

// ── Mobile-only Home view ────────────────────────────────────────────────────

function MobileHome({
  deliveries,
  delayed,
  onTime,
  onOpenOrder,
  onAddDelivery,
}: {
  deliveries: Delivery[];
  delayed: Delivery[];
  onTime: Delivery[];
  onOpenOrder: (d: Delivery) => void;
  onAddDelivery: () => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <main className="lg:hidden flex-1 overflow-y-auto px-5 pb-28">
      <section className="mb-6">
        <p className="text-gray-400 text-sm">{greeting} 👋</p>
        <h1 className="text-white font-extrabold text-2xl leading-tight mt-0.5">
          Hi Elena, here is today&apos;s supply status.
        </h1>
      </section>

      <section className="grid grid-cols-3 gap-3 mb-6">
        <SummaryCard label="Total Orders" value={deliveries.length} color="text-white" />
        <SummaryCard label="On Time" value={onTime.length} color="text-green-400" />
        <SummaryCard label="Delayed" value={delayed.length} color="text-red-400" />
      </section>

      <section>
        <h2 className="text-white font-bold text-base mb-3">Today&apos;s deliveries</h2>
        {deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package size={48} className="text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No deliveries yet today.</p>
            <button onClick={onAddDelivery} className="mt-4 text-blue-400 text-sm font-medium underline underline-offset-2">
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
                    onClick={() => onOpenOrder(d)}
                    className={clsx(
                      'w-full flex items-center gap-3 bg-surface-card rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.98]',
                      late ? 'border border-red-500/30' : 'border border-transparent hover:border-gray-600'
                    )}
                  >
                    <span className={clsx('w-1 h-10 rounded-full flex-shrink-0', late ? 'bg-red-500' : 'bg-green-500')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{d.supplierName}</p>
                      <p className="text-gray-400 text-xs mt-0.5 truncate">{d.items}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-gray-300 text-xs font-medium">{formatTime(d.expectedTime)}</span>
                      <span className={clsx('text-[10px] font-bold uppercase tracking-wide', late ? 'text-red-400' : 'text-green-400')}>
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
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-surface-card rounded-2xl p-3.5 flex flex-col gap-1">
      <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide leading-tight">{label}</span>
      <span className={clsx('font-extrabold text-2xl', color)}>{value}</span>
    </div>
  );
}
