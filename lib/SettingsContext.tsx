'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppSettings {
  delayAlerts: boolean;
  upcomingAlerts: boolean;
  darkMode: boolean;
  language: 'en' | 'it';
  name: string;
}

const DEFAULTS: AppSettings = {
  delayAlerts: true,
  upcomingAlerts: true,
  darkMode: true,
  language: 'en',
  name: 'Elena',
};

interface CtxValue {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
}

const Ctx = createContext<CtxValue>({ settings: DEFAULTS, update: () => {} });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sp-settings');
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setMounted(true);
  }, []);

  // Apply theme to <html> whenever darkMode changes
  useEffect(() => {
    if (!mounted) return;
    if (settings.darkMode) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [settings.darkMode, mounted]);

  function update(patch: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('sp-settings', JSON.stringify(next));
      return next;
    });
  }

  return <Ctx.Provider value={{ settings, update }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return useContext(Ctx);
}
