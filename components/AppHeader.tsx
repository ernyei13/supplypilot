'use client';

import { Menu, Bell, Search, Zap } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'home' | 'deliveries' | 'notifs' | 'settings';

const TAB_TITLES: Record<Tab, string> = {
  home: 'Dashboard',
  deliveries: 'Deliveries',
  notifs: 'Notifications',
  settings: 'Settings',
};

interface Props {
  activeTab: Tab;
  delayedCount: number;
  onMenuOpen: () => void;
  onNotifs: () => void;
}

export default function AppHeader({ activeTab, delayedCount, onMenuOpen, onNotifs }: Props) {
  return (
    <header className="flex items-center justify-between px-5 pt-10 pb-4 flex-shrink-0 lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="bg-blue-600 rounded-lg p-1.5">
          <Zap size={18} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">
          {TAB_TITLES[activeTab]}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {delayedCount > 0 && (
          <button
            onClick={onNotifs}
            className="relative text-gray-400 hover:text-white transition-colors p-2"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
              {delayedCount}
            </span>
          </button>
        )}
        <button
          onClick={onMenuOpen}
          className="text-gray-400 hover:text-white transition-colors p-2"
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
