'use client';

import { X, Home, Truck, Bell, Settings, Zap, Sparkles, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'home' | 'deliveries' | 'notifs' | 'settings';

interface Props {
  activeTab: Tab;
  onNavigate: (tab: Tab) => void;
  onClose: () => void;
  onFakeDoor: () => void;
  delayedCount: number;
}

const navItems: { id: Tab; Icon: React.ElementType; label: string; desc: string }[] = [
  { id: 'home', Icon: Home, label: 'Dashboard', desc: 'Today\'s supply overview' },
  { id: 'deliveries', Icon: Truck, label: 'Deliveries', desc: 'All orders & search' },
  { id: 'notifs', Icon: Bell, label: 'Notifications', desc: 'Alerts & updates' },
  { id: 'settings', Icon: Settings, label: 'Settings', desc: 'Account & preferences' },
];

export default function HamburgerMenu({ activeTab, onNavigate, onClose, onFakeDoor, delayedCount }: Props) {
  function go(tab: Tab) {
    onNavigate(tab);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface-card flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-14 pb-5 border-b border-gray-700/50">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">SupplyPilot</p>
              <p className="text-gray-500 text-xs">Restaurant Manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ id, Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={clsx(
                'w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all',
                activeTab === id
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={clsx('text-sm font-semibold', activeTab === id ? 'text-blue-400' : 'text-white')}>
                  {label}
                </p>
                <p className="text-gray-500 text-xs truncate">{desc}</p>
              </div>
              {id === 'notifs' && delayedCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  {delayedCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* AI Copilot promo */}
        <div className="px-4 pb-4">
          <button
            onClick={() => { onFakeDoor(); onClose(); }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-yellow-300 text-xs font-bold uppercase tracking-wide">Beta</span>
            </div>
            <p className="text-white font-bold text-sm">AI Copilot</p>
            <p className="text-blue-200 text-xs mt-0.5">Auto-contact suppliers · Compare prices</p>
          </button>
        </div>

        {/* Version */}
        <div className="px-5 pb-8 text-center">
          <p className="text-gray-600 text-xs">v1.0.0-beta · Made with ♥ for restaurants</p>
        </div>
      </div>
    </>
  );
}
