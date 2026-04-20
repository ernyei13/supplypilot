export interface Delivery {
  id: string;
  supplierName: string;
  items: string;
  expectedTime: string; // "HH:MM" 24h
  phone: string;
  whatsapp: string;
  note?: string;
}

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

/** Returns true if the delivery is considered delayed (expected time has passed). */
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
