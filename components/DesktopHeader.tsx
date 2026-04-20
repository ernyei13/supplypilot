'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'home' | 'deliveries' | 'notifs' | 'settings';

const PAGE_TITLES: Record<Tab, { title: string; sub: string }> = {
  home: { title: 'Good morning, Elena 👋', sub: "Here's your supply status for today." },
  deliveries: { title: 'Deliveries', sub: 'Manage and track all incoming orders.' },
  notifs: { title: 'Notifications', sub: 'Active alerts and delivery updates.' },
  settings: { title: 'Settings', sub: 'Manage your account and preferences.' },
};

interface Props {
  activeTab: Tab;
  delayedCount: number;
  onNotifs: () => void;
}

export default function DesktopHeader({ activeTab, delayedCount, onNotifs }: Props) {
  const { title, sub } = PAGE_TITLES[activeTab];
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-gray-700/50 flex-shrink-0 bg-surface">
      {/* Left: page title */}
      <div>
        <h1 className="text-white font-extrabold text-xl leading-tight">{title}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{sub}</p>
      </div>

      {/* Right: search + date + bell + avatar */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search suppliers, items…"
            className="bg-surface-card text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          />
        </div>

        <span className="text-gray-500 text-sm hidden xl:block">{today}</span>

        <button
          onClick={onNotifs}
          className="relative p-2 text-gray-400 hover:text-white transition-colors bg-surface-card rounded-xl"
        >
          <Bell size={18} />
          {delayedCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
              {delayedCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 bg-surface-card rounded-xl px-3 py-2 cursor-pointer hover:bg-gray-700/50 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            E
          </div>
          <span className="text-white text-sm font-medium hidden xl:block">Elena</span>
          <ChevronDown size={14} className="text-gray-500 hidden xl:block" />
        </div>
      </div>
    </header>
  );
}
