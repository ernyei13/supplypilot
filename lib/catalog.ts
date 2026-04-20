export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  supplierId: string;
  pricePerUnit: number; // EUR
  minOrderQty: number;
  deliveryLeadDays: number;
  inStock: boolean;
  tags: string[];
}

export interface StandingOrder {
  id: string;
  name: string;
  supplierId: string;
  supplierName: string;
  items: { productName: string; quantity: number; unit: string }[];
  frequency: 'daily' | 'weekly' | 'twice-weekly';
  dayLabel: string; // "Every Monday" etc.
  active: boolean;
  nextOrderDate: string; // ISO date string
}

export interface CartItem {
  product: CatalogProduct;
  quantity: number;
}

export const CATALOG: CatalogProduct[] = [
  // Metro Food Service
  { id: 'metro-1', name: 'Chicken Thigh', category: 'Poultry', unit: 'kg', supplierId: 'metro', pricePerUnit: 4.20, minOrderQty: 5, deliveryLeadDays: 1, inStock: true, tags: ['chicken', 'poultry', 'meat', 'coscia'] },
  { id: 'metro-2', name: 'Chicken Breast', category: 'Poultry', unit: 'kg', supplierId: 'metro', pricePerUnit: 5.80, minOrderQty: 5, deliveryLeadDays: 1, inStock: true, tags: ['chicken', 'poultry', 'meat', 'petto'] },
  { id: 'metro-3', name: 'Iceberg Lettuce', category: 'Salad', unit: 'piece', supplierId: 'metro', pricePerUnit: 0.90, minOrderQty: 10, deliveryLeadDays: 1, inStock: true, tags: ['salad', 'lettuce', 'insalata', 'green'] },
  { id: 'metro-4', name: 'Mixed Tomatoes', category: 'Vegetables', unit: 'kg', supplierId: 'metro', pricePerUnit: 2.10, minOrderQty: 3, deliveryLeadDays: 1, inStock: true, tags: ['tomato', 'pomodoro', 'vegetables'] },
  { id: 'metro-5', name: 'Bell Peppers Mix', category: 'Vegetables', unit: 'kg', supplierId: 'metro', pricePerUnit: 2.80, minOrderQty: 2, deliveryLeadDays: 1, inStock: true, tags: ['pepper', 'peperone', 'vegetables'] },
  { id: 'metro-6', name: 'Zucchini', category: 'Vegetables', unit: 'kg', supplierId: 'metro', pricePerUnit: 1.60, minOrderQty: 3, deliveryLeadDays: 1, inStock: true, tags: ['zucchini', 'vegetables', 'green'] },
  { id: 'metro-7', name: 'Whole Salmon Fillet', category: 'Fish', unit: 'kg', supplierId: 'metro', pricePerUnit: 12.50, minOrderQty: 2, deliveryLeadDays: 1, inStock: false, tags: ['fish', 'salmon', 'salmone', 'pesce'] },

  // Local Greens Co.
  { id: 'greens-1', name: 'Mixed Salad Leaves', category: 'Salad', unit: 'kg', supplierId: 'greens', pricePerUnit: 6.50, minOrderQty: 1, deliveryLeadDays: 0, inStock: true, tags: ['salad', 'insalata', 'mixed', 'green', 'leaves'] },
  { id: 'greens-2', name: 'Rocket (Arugula)', category: 'Salad', unit: 'kg', supplierId: 'greens', pricePerUnit: 7.20, minOrderQty: 0.5, deliveryLeadDays: 0, inStock: true, tags: ['rocket', 'arugula', 'rucola', 'salad'] },
  { id: 'greens-3', name: 'Fresh Basil', category: 'Herbs', unit: 'bunch', supplierId: 'greens', pricePerUnit: 1.80, minOrderQty: 5, deliveryLeadDays: 0, inStock: true, tags: ['basil', 'basilico', 'herbs'] },
  { id: 'greens-4', name: 'Microgreens Mix', category: 'Specialty', unit: 'tray', supplierId: 'greens', pricePerUnit: 8.00, minOrderQty: 2, deliveryLeadDays: 1, inStock: true, tags: ['microgreens', 'specialty', 'garnish'] },
  { id: 'greens-5', name: 'Baby Spinach', category: 'Salad', unit: 'kg', supplierId: 'greens', pricePerUnit: 5.40, minOrderQty: 1, deliveryLeadDays: 0, inStock: true, tags: ['spinach', 'spinaci', 'salad', 'green'] },

  // Balla Fresh Co.
  { id: 'balla-1', name: 'Chicken Thigh', category: 'Poultry', unit: 'kg', supplierId: 'balla', pricePerUnit: 3.90, minOrderQty: 5, deliveryLeadDays: 1, inStock: true, tags: ['chicken', 'poultry', 'meat', 'coscia'] },
  { id: 'balla-2', name: 'Seasonal Vegetables Box', category: 'Vegetables', unit: 'box (5kg)', supplierId: 'balla', pricePerUnit: 14.00, minOrderQty: 1, deliveryLeadDays: 1, inStock: true, tags: ['vegetables', 'seasonal', 'box', 'mixed'] },
  { id: 'balla-3', name: 'Potatoes', category: 'Vegetables', unit: 'kg', supplierId: 'balla', pricePerUnit: 0.80, minOrderQty: 10, deliveryLeadDays: 1, inStock: true, tags: ['potato', 'patate', 'vegetables'] },
  { id: 'balla-4', name: 'Onions', category: 'Vegetables', unit: 'kg', supplierId: 'balla', pricePerUnit: 0.60, minOrderQty: 5, deliveryLeadDays: 1, inStock: true, tags: ['onion', 'cipolla', 'vegetables'] },
  { id: 'balla-5', name: 'Lemons', category: 'Fruit', unit: 'kg', supplierId: 'balla', pricePerUnit: 1.90, minOrderQty: 3, deliveryLeadDays: 1, inStock: true, tags: ['lemon', 'limone', 'fruit', 'citrus'] },

  // Velier Spirits
  { id: 'velier-1', name: 'Havana Club 7yo', category: 'Rum', unit: 'bottle (70cl)', supplierId: 'velier', pricePerUnit: 24.00, minOrderQty: 6, deliveryLeadDays: 2, inStock: true, tags: ['rum', 'havana', 'spirits', 'cocktail'] },
  { id: 'velier-2', name: 'Diplomatico Reserva', category: 'Rum', unit: 'bottle (70cl)', supplierId: 'velier', pricePerUnit: 32.00, minOrderQty: 3, deliveryLeadDays: 2, inStock: true, tags: ['rum', 'diplomatico', 'spirits', 'premium'] },
  { id: 'velier-3', name: 'Hendrick\'s Gin', category: 'Gin', unit: 'bottle (70cl)', supplierId: 'velier', pricePerUnit: 28.50, minOrderQty: 3, deliveryLeadDays: 2, inStock: true, tags: ['gin', 'spirits', 'cocktail'] },
  { id: 'velier-4', name: 'Campari', category: 'Aperitif', unit: 'bottle (100cl)', supplierId: 'velier', pricePerUnit: 18.00, minOrderQty: 6, deliveryLeadDays: 2, inStock: true, tags: ['campari', 'aperitif', 'spirits', 'cocktail'] },
  { id: 'velier-5', name: 'Aperol', category: 'Aperitif', unit: 'bottle (100cl)', supplierId: 'velier', pricePerUnit: 14.50, minOrderQty: 6, deliveryLeadDays: 2, inStock: true, tags: ['aperol', 'aperitif', 'spritz'] },

  // Sopplaya Produce
  { id: 'sopplaya-1', name: 'Whole Milk', category: 'Dairy', unit: 'L', supplierId: 'sopplaya', pricePerUnit: 1.10, minOrderQty: 10, deliveryLeadDays: 0, inStock: true, tags: ['milk', 'latte', 'dairy'] },
  { id: 'sopplaya-2', name: 'Fresh Cream', category: 'Dairy', unit: 'L', supplierId: 'sopplaya', pricePerUnit: 3.20, minOrderQty: 3, deliveryLeadDays: 0, inStock: true, tags: ['cream', 'panna', 'dairy'] },
  { id: 'sopplaya-3', name: 'Orange Juice (fresh)', category: 'Juice', unit: 'L', supplierId: 'sopplaya', pricePerUnit: 4.50, minOrderQty: 5, deliveryLeadDays: 0, inStock: true, tags: ['orange', 'juice', 'succo', 'fruit'] },
  { id: 'sopplaya-4', name: 'Strawberries', category: 'Fruit', unit: 'kg', supplierId: 'sopplaya', pricePerUnit: 5.80, minOrderQty: 2, deliveryLeadDays: 0, inStock: false, tags: ['strawberry', 'fragola', 'fruit', 'berries'] },
  { id: 'sopplaya-5', name: 'Lemons', category: 'Fruit', unit: 'kg', supplierId: 'sopplaya', pricePerUnit: 2.20, minOrderQty: 2, deliveryLeadDays: 0, inStock: true, tags: ['lemon', 'limone', 'fruit', 'citrus'] },

  // Selecta
  { id: 'selecta-1', name: 'Parmigiano Reggiano 24m', category: 'Cheese', unit: 'kg', supplierId: 'selecta', pricePerUnit: 18.50, minOrderQty: 1, deliveryLeadDays: 1, inStock: true, tags: ['parmesan', 'parmigiano', 'cheese', 'formaggio'] },
  { id: 'selecta-2', name: 'Buffalo Mozzarella', category: 'Cheese', unit: 'kg', supplierId: 'selecta', pricePerUnit: 12.00, minOrderQty: 1, deliveryLeadDays: 1, inStock: true, tags: ['mozzarella', 'buffalo', 'cheese', 'formaggio'] },
  { id: 'selecta-3', name: 'Prosciutto Crudo San Daniele', category: 'Cold Cuts', unit: 'kg', supplierId: 'selecta', pricePerUnit: 24.00, minOrderQty: 0.5, deliveryLeadDays: 1, inStock: true, tags: ['prosciutto', 'ham', 'salumi', 'cold cuts'] },
  { id: 'selecta-4', name: 'Butter (unsalted)', category: 'Dairy', unit: 'kg', supplierId: 'selecta', pricePerUnit: 6.80, minOrderQty: 1, deliveryLeadDays: 1, inStock: true, tags: ['butter', 'burro', 'dairy'] },
  { id: 'selecta-5', name: 'Chicken Breast (organic)', category: 'Poultry', unit: 'kg', supplierId: 'selecta', pricePerUnit: 7.40, minOrderQty: 3, deliveryLeadDays: 1, inStock: true, tags: ['chicken', 'breast', 'petto', 'poultry', 'organic'] },
];

export const STANDING_ORDERS: StandingOrder[] = [
  {
    id: 'so-1',
    name: 'Weekly Vegetables',
    supplierId: 'metro',
    supplierName: 'Metro Food Service',
    items: [
      { productName: 'Mixed Tomatoes', quantity: 10, unit: 'kg' },
      { productName: 'Bell Peppers Mix', quantity: 5, unit: 'kg' },
      { productName: 'Zucchini', quantity: 5, unit: 'kg' },
    ],
    frequency: 'weekly',
    dayLabel: 'Every Monday',
    active: true,
    nextOrderDate: '2026-04-21',
  },
  {
    id: 'so-2',
    name: 'Daily Salad Greens',
    supplierId: 'greens',
    supplierName: 'Local Greens Co.',
    items: [
      { productName: 'Mixed Salad Leaves', quantity: 3, unit: 'kg' },
      { productName: 'Rocket (Arugula)', quantity: 1, unit: 'kg' },
    ],
    frequency: 'daily',
    dayLabel: 'Every day',
    active: true,
    nextOrderDate: '2026-04-21',
  },
  {
    id: 'so-3',
    name: 'Weekly Spirits Restock',
    supplierId: 'velier',
    supplierName: 'Velier Spirits',
    items: [
      { productName: 'Aperol', quantity: 6, unit: 'bottle (100cl)' },
      { productName: 'Campari', quantity: 6, unit: 'bottle (100cl)' },
    ],
    frequency: 'weekly',
    dayLabel: 'Every Friday',
    active: false,
    nextOrderDate: '2026-04-25',
  },
];

/** Product IDs that are "usually ordered" per supplier — shown at the top of the catalog */
export const FREQUENT_ITEMS: Record<string, string[]> = {
  metro:    ['metro-4', 'metro-5', 'metro-3', 'metro-1'],   // Tomatoes, Peppers, Lettuce, Chicken Thigh
  greens:   ['greens-1', 'greens-2', 'greens-5'],           // Mixed Leaves, Rocket, Baby Spinach
  balla:    ['balla-2', 'balla-3', 'balla-4', 'balla-1'],   // Veg Box, Potatoes, Onions, Chicken
  velier:   ['velier-5', 'velier-4', 'velier-1'],           // Aperol, Campari, Havana Club
  sopplaya: ['sopplaya-1', 'sopplaya-2', 'sopplaya-3'],     // Milk, Cream, OJ
  selecta:  ['selecta-1', 'selecta-2', 'selecta-3'],        // Parmigiano, Mozzarella, Prosciutto
};

export function getProductsBySupplier(supplierId: string): CatalogProduct[] {
  return CATALOG.filter((p) => p.supplierId === supplierId);
}

export function getFrequentProducts(supplierId: string): CatalogProduct[] {
  const ids = FREQUENT_ITEMS[supplierId] ?? [];
  return ids.map((id) => CATALOG.find((p) => p.id === id)).filter(Boolean) as CatalogProduct[];
}

export function getOtherProducts(supplierId: string): CatalogProduct[] {
  const frequentIds = new Set(FREQUENT_ITEMS[supplierId] ?? []);
  return CATALOG.filter((p) => p.supplierId === supplierId && !frequentIds.has(p.id));
}

export function searchProducts(query: string): CatalogProduct[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
}

export function getPriceComparison(query: string): { product: CatalogProduct; supplierName: string }[] {
  const results = searchProducts(query);
  return results.map((p) => ({
    product: p,
    supplierName: supplierNameById(p.supplierId),
  }));
}

function supplierNameById(id: string): string {
  const map: Record<string, string> = {
    metro: 'Metro Food Service',
    greens: 'Local Greens Co.',
    balla: 'Balla Fresh Co.',
    velier: 'Velier Spirits',
    sopplaya: 'Sopplaya Produce',
    selecta: 'Selecta',
  };
  return map[id] ?? id;
}
