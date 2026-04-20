export interface Delivery {
  id: string;
  supplierName: string;
  items: string;
  expectedTime: string; // "HH:MM" 24h
  phone: string;
  whatsapp: string;
  note?: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  phone: string;
  whatsapp: string;
  color: string; // tailwind bg class for avatar
  weeklyHistory: boolean[]; // last 7 days: true=on-time, false=delayed
  avgDeliveryMinutes: number; // typical early/late offset
}

export const SUPPLIERS: Supplier[] = [
  {
    id: 'metro',
    name: 'Metro Food Service',
    category: 'Vegetables & Salads',
    phone: '+391234567890',
    whatsapp: '391234567890',
    color: 'bg-blue-600',
    weeklyHistory: [true, true, false, true, true, true, false],
    avgDeliveryMinutes: -5,
  },
  {
    id: 'greens',
    name: 'Local Greens Co.',
    category: 'Fresh Salads',
    phone: '+391234567891',
    whatsapp: '391234567891',
    color: 'bg-green-600',
    weeklyHistory: [false, true, false, false, true, true, false],
    avgDeliveryMinutes: 18,
  },
  {
    id: 'balla',
    name: 'Balla Fresh Co.',
    category: 'Vegetables',
    phone: '+391234567892',
    whatsapp: '391234567892',
    color: 'bg-emerald-600',
    weeklyHistory: [true, true, true, true, false, true, true],
    avgDeliveryMinutes: -2,
  },
  {
    id: 'velier',
    name: 'Velier Spirits',
    category: 'Spirits & Liquors',
    phone: '+391234567893',
    whatsapp: '391234567893',
    color: 'bg-purple-600',
    weeklyHistory: [true, true, true, false, true, true, true],
    avgDeliveryMinutes: 3,
  },
  {
    id: 'sopplaya',
    name: 'Sopplaya Produce',
    category: 'Fruits & Dairy',
    phone: '+391234567894',
    whatsapp: '391234567894',
    color: 'bg-orange-600',
    weeklyHistory: [false, false, true, true, false, true, false],
    avgDeliveryMinutes: 25,
  },
  {
    id: 'selecta',
    name: 'Selecta',
    category: 'Dairy & Cold Chain',
    phone: '+391234567895',
    whatsapp: '391234567895',
    color: 'bg-cyan-600',
    weeklyHistory: [true, true, true, true, true, false, true],
    avgDeliveryMinutes: -8,
  },
];

export const SAMPLE_DELIVERIES: Delivery[] = [
  {
    id: '1',
    supplierName: 'Metro Food Service',
    items: 'Vegetables',
    expectedTime: '10:30',
    phone: '+391234567890',
    whatsapp: '391234567890',
  },
  {
    id: '2',
    supplierName: 'Local Greens Co.',
    items: 'Salads',
    expectedTime: '09:00',
    phone: '+391234567891',
    whatsapp: '391234567891',
    note: 'Call if late',
  },
  {
    id: '3',
    supplierName: 'Balla Fresh Co.',
    items: 'Vegetables',
    expectedTime: '10:30',
    phone: '+391234567892',
    whatsapp: '391234567892',
  },
  {
    id: '4',
    supplierName: 'Metro Food Service',
    items: 'Salads',
    expectedTime: '10:30',
    phone: '+391234567890',
    whatsapp: '391234567890',
  },
  {
    id: '5',
    supplierName: 'Velier Spirits',
    items: 'Rum, Speciality Liquors',
    expectedTime: '11:45',
    phone: '+391234567893',
    whatsapp: '391234567893',
  },
  {
    id: '6',
    supplierName: 'Sopplaya Produce',
    items: 'Fruits & Dairy',
    expectedTime: '08:30',
    phone: '+391234567894',
    whatsapp: '391234567894',
  },
];

export function isDelayed(expectedTime: string): boolean {
  const now = new Date();
  const [h, m] = expectedTime.split(':').map(Number);
  const expected = new Date();
  expected.setHours(h, m, 0, 0);
  return now > expected;
}

export function formatTime(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

export function getSupplierStats(supplier: Supplier) {
  const onTimeCount = supplier.weeklyHistory.filter(Boolean).length;
  const total = supplier.weeklyHistory.length;
  const onTimeRate = Math.round((onTimeCount / total) * 100);
  const reliability: 'excellent' | 'good' | 'poor' =
    onTimeRate >= 80 ? 'excellent' : onTimeRate >= 57 ? 'good' : 'poor';
  return { onTimeRate, onTimeCount, total, reliability };
}
