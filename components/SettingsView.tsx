'use client';

import { useState } from 'react';
import {
  User,
  Bell,
  Moon,
  Globe,
  ChevronRight,
  LogOut,
  Shield,
  Smartphone,
  Info,
} from 'lucide-react';
import clsx from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
        checked ? 'bg-blue-600' : 'bg-gray-600'
      )}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={clsx(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

function SettingRow({
  icon,
  label,
  sublabel,
  right,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={clsx(
        'w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors',
        onClick && !danger && 'hover:bg-white/5 active:bg-white/10',
        onClick && danger && 'hover:bg-red-500/10',
        !onClick && 'cursor-default'
      )}
    >
      <span className={clsx('flex-shrink-0', danger ? 'text-red-400' : 'text-gray-400')}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', danger ? 'text-red-400' : 'text-white')}>
          {label}
        </p>
        {sublabel && <p className="text-gray-500 text-xs mt-0.5">{sublabel}</p>}
      </div>
      {right ?? (onClick && !danger ? <ChevronRight size={16} className="text-gray-600 flex-shrink-0" /> : null)}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-4 mb-1">
        {title}
      </p>
      <div className="bg-surface-card rounded-2xl overflow-hidden divide-y divide-gray-700/40">
        {children}
      </div>
    </div>
  );
}

export default function SettingsView() {
  const [delayAlerts, setDelayAlerts] = useState(true);
  const [upcomingAlerts, setUpcomingAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [name, setName] = useState('Elena');
  const [editingName, setEditingName] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto px-5 pb-28">
      <section className="mb-5">
        <h1 className="text-white font-extrabold text-2xl leading-tight">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your account & preferences</p>
      </section>

      {/* Profile card */}
      <div className="bg-surface-card rounded-2xl p-4 flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
              className="bg-surface-input text-white rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-white font-bold text-base truncate">{name}</p>
          )}
          <p className="text-gray-400 text-xs mt-0.5">Restaurant Manager</p>
        </div>
        <button
          onClick={() => setEditingName(true)}
          className="text-blue-400 text-xs font-medium hover:text-blue-300 transition-colors flex-shrink-0"
        >
          Edit
        </button>
      </div>

      <Section title="Notifications">
        <SettingRow
          icon={<Bell size={18} />}
          label="Delay Alerts"
          sublabel="Notify when a delivery is overdue"
          right={<Toggle checked={delayAlerts} onChange={setDelayAlerts} />}
        />
        <SettingRow
          icon={<Bell size={18} />}
          label="Upcoming Reminders"
          sublabel="30-minute heads-up before delivery"
          right={<Toggle checked={upcomingAlerts} onChange={setUpcomingAlerts} />}
        />
      </Section>

      <Section title="Appearance">
        <SettingRow
          icon={<Moon size={18} />}
          label="Dark Mode"
          sublabel="Always on for now"
          right={<Toggle checked={darkMode} onChange={setDarkMode} />}
        />
        <SettingRow
          icon={<Globe size={18} />}
          label="Language"
          sublabel="English"
          onClick={() => {}}
        />
      </Section>

      <Section title="App">
        <SettingRow
          icon={<Smartphone size={18} />}
          label="Install as App"
          sublabel="Add SupplyPilot to your home screen"
          onClick={() => alert('Open this page in your mobile browser, then tap "Share → Add to Home Screen"')}
        />
        <SettingRow
          icon={<Shield size={18} />}
          label="Privacy Policy"
          onClick={() => {}}
        />
        <SettingRow
          icon={<Info size={18} />}
          label="Version"
          sublabel="1.0.0-beta"
        />
      </Section>

      <Section title="Account">
        <SettingRow
          icon={<LogOut size={18} />}
          label="Sign Out"
          onClick={() => {}}
          danger
        />
      </Section>
    </main>
  );
}
