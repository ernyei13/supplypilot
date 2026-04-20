'use client';

import { Home, Truck, Bell, Settings, Sparkles } from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';

type Tab = 'home' | 'deliveries' | 'notifs' | 'settings';

const navItems = [
  { id: 'home' as Tab, Icon: Home, label: 'Dashboard' },
  { id: 'deliveries' as Tab, Icon: Truck, label: 'Deliveries' },
  { id: 'notifs' as Tab, Icon: Bell, label: 'Notifications' },
  { id: 'settings' as Tab, Icon: Settings, label: 'Settings' },
];

interface Props {
  activeTab: Tab;
  onNavigate: (tab: Tab) => void;
  onFakeDoor: () => void;
  delayedCount: number;
}

export default function Sidebar({ activeTab, onNavigate, onFakeDoor, delayedCount }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-60 bg-surface-card border-r border-gray-700/50 flex-shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-gray-700/50">
        <Image src="/icons/icon-64.png" alt="SupplyPilot" width={36} height={36} className="rounded-xl flex-shrink-0" />
        <div>
          <p className="text-white font-bold text-base leading-tight">SupplyPilot</p>
          <p className="text-gray-500 text-xs">Restaurant Manager</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">
          Main Menu
        </p>
        {navItems.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-medium',
              activeTab === id
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {id === 'notifs' && delayedCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {delayedCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* AI Copilot CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={onFakeDoor}
          className="w-full bg-gradient-to-br from-blue-600/80 to-indigo-700/80 border border-blue-500/30 rounded-2xl p-4 text-left hover:from-blue-600 hover:to-indigo-700 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={13} className="text-yellow-300" />
            <span className="text-yellow-300 text-[10px] font-bold uppercase tracking-wider">Beta</span>
          </div>
          <p className="text-white font-bold text-sm">AI Copilot</p>
          <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">
            Auto-contact suppliers &amp; compare prices
          </p>
        </button>
      </div>

      {/* User */}
      <div className="border-t border-gray-700/50 px-4 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          E
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">Elena</p>
          <p className="text-gray-500 text-xs truncate">Manager</p>
        </div>
      </div>
    </aside>
  );
}
