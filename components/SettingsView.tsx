'use client';

import { useState } from 'react';
import {
  Bell, Moon, Sun, Globe, ChevronRight, LogOut,
  Shield, Smartphone, Info, Check,
} from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '@/lib/SettingsContext';

// ── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
        checked ? 'bg-blue-600' : 'bg-gray-600'
      )}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={clsx(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

function SettingRow({
  icon, label, sublabel, right, onClick, danger,
}: {
  icon: React.ReactNode; label: string; sublabel?: string;
  right?: React.ReactNode; onClick?: () => void; danger?: boolean;
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
      <span className={clsx('flex-shrink-0', danger ? 'text-red-400' : 'text-gray-400')}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', danger ? 'text-red-400' : 'text-white')}>{label}</p>
        {sublabel && <p className="text-gray-500 text-xs mt-0.5">{sublabel}</p>}
      </div>
      {right ?? (onClick && !danger ? <ChevronRight size={16} className="text-gray-600 flex-shrink-0" /> : null)}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-4 mb-1">{title}</p>
      <div className="bg-surface-card rounded-2xl overflow-hidden divide-y divide-gray-700/40">{children}</div>
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 whitespace-nowrap">
      <Check size={14} className="text-green-400 flex-shrink-0" />
      {message}
    </div>
  );
}

// ── Language picker ──────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  { code: 'it' as const, label: 'Italiano', flag: '🇮🇹' },
];

function LanguagePicker({
  current, onSelect, onClose,
}: {
  current: 'en' | 'it'; onSelect: (l: 'en' | 'it') => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-surface-card rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-700/50">
          <p className="text-white font-bold text-base">Select Language</p>
        </div>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => { onSelect(l.code); onClose(); }}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors border-b border-gray-700/30 last:border-0"
          >
            <span className="text-2xl">{l.flag}</span>
            <span className="text-white font-medium flex-1 text-left">{l.label}</span>
            {current === l.code && <Check size={18} className="text-blue-400" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function SettingsView() {
  const { settings, update } = useSettings();
  const [editingName, setEditingName] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleToggle(key: 'delayAlerts' | 'upcomingAlerts' | 'darkMode', value: boolean) {
    update({ [key]: value });
    const labels: Record<string, string> = {
      delayAlerts: value ? 'Delay alerts enabled' : 'Delay alerts disabled',
      upcomingAlerts: value ? 'Upcoming reminders enabled' : 'Upcoming reminders disabled',
      darkMode: value ? 'Dark mode on' : 'Light mode on',
    };
    showToast(labels[key]);
  }

  const langLabel = LANGUAGES.find((l) => l.code === settings.language)?.label ?? 'English';
  const langFlag  = LANGUAGES.find((l) => l.code === settings.language)?.flag ?? '🇬🇧';

  return (
    <>
      <main className="flex-1 overflow-y-auto px-5 pb-28 pt-5 lg:pt-0">
        <section className="mb-5 lg:hidden">
          <h1 className="text-white font-extrabold text-2xl leading-tight">Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your account &amp; preferences</p>
        </section>

        {/* Profile card */}
        <div className="bg-surface-card rounded-2xl p-4 flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {settings.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <input
                autoFocus
                value={settings.name}
                onChange={(e) => update({ name: e.target.value })}
                onBlur={() => { setEditingName(false); showToast('Name saved'); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { setEditingName(false); showToast('Name saved'); } }}
                className="bg-surface-input text-white rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-white font-bold text-base truncate">{settings.name}</p>
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
            sublabel={settings.delayAlerts ? 'Showing delay badges & alerts' : 'Delay badges hidden'}
            right={<Toggle checked={settings.delayAlerts} onChange={(v) => handleToggle('delayAlerts', v)} />}
          />
          <SettingRow
            icon={<Bell size={18} />}
            label="Upcoming Reminders"
            sublabel={settings.upcomingAlerts ? 'Alerting 45 min before delivery' : 'Upcoming reminders off'}
            right={<Toggle checked={settings.upcomingAlerts} onChange={(v) => handleToggle('upcomingAlerts', v)} />}
          />
        </Section>

        <Section title="Appearance">
          <SettingRow
            icon={settings.darkMode ? <Moon size={18} /> : <Sun size={18} />}
            label="Dark Mode"
            sublabel={settings.darkMode ? 'Currently using dark theme' : 'Currently using light theme'}
            right={<Toggle checked={settings.darkMode} onChange={(v) => handleToggle('darkMode', v)} />}
          />
          <SettingRow
            icon={<Globe size={18} />}
            label="Language"
            sublabel={`${langFlag} ${langLabel}`}
            onClick={() => setLangPickerOpen(true)}
          />
        </Section>

        <Section title="App">
          <SettingRow
            icon={<Smartphone size={18} />}
            label="Install as App"
            sublabel="Add SupplyPilot to your home screen"
            onClick={() => showToast('Open in mobile browser → Share → Add to Home Screen')}
          />
          <SettingRow icon={<Shield size={18} />} label="Privacy Policy" onClick={() => {}} />
          <SettingRow icon={<Info size={18} />} label="Version" sublabel="1.0.0-beta" />
        </Section>

        <Section title="Account">
          <SettingRow icon={<LogOut size={18} />} label="Sign Out" onClick={() => showToast('Sign out coming soon')} danger />
        </Section>
      </main>

      {/* Language picker modal */}
      {langPickerOpen && (
        <LanguagePicker
          current={settings.language}
          onSelect={(l) => { update({ language: l }); showToast(`Language set to ${LANGUAGES.find((x) => x.code === l)?.label}`); }}
          onClose={() => setLangPickerOpen(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} />}
    </>
  );
}
