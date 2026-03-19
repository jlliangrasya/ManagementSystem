// ============================================
// Cavella Pistachio Creams — Sample Data (PH)
// ============================================

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

// --- PRODUCTS ---
export const products = [
  {
    id: uuid(), name: 'Classic Pistachio Cream', sku: 'CAV-CPC-250',
    category: 'Pistachio Cream', unit_price: 699, cost_price: 299,
    stock_quantity: 340, min_stock_level: 50,
    description: 'Our signature pistachio cream. Rich, smooth, and made with premium Sicilian pistachios. 250g tub.',
    created_at: daysAgo(90), updated_at: daysAgo(2)
  },
  {
    id: uuid(), name: 'Classic Pistachio Cream (500g)', sku: 'CAV-CPC-500',
    category: 'Pistachio Cream', unit_price: 1249, cost_price: 549,
    stock_quantity: 185, min_stock_level: 30,
    description: 'Signature pistachio cream in a larger 500g tub. Perfect for families.',
    created_at: daysAgo(90), updated_at: daysAgo(5)
  },
  {
    id: uuid(), name: 'Dark Chocolate Pistachio Cream', sku: 'CAV-DCP-250',
    category: 'Pistachio Cream', unit_price: 799, cost_price: 349,
    stock_quantity: 210, min_stock_level: 40,
    description: 'Rich dark chocolate blended with our pistachio cream. 250g tub.',
    created_at: daysAgo(75), updated_at: daysAgo(3)
  },
  {
    id: uuid(), name: 'White Chocolate Pistachio Cream', sku: 'CAV-WCP-250',
    category: 'Pistachio Cream', unit_price: 799, cost_price: 349,
    stock_quantity: 178, min_stock_level: 40,
    description: 'Smooth white chocolate pistachio cream. Sweet and creamy. 250g tub.',
    created_at: daysAgo(75), updated_at: daysAgo(1)
  },
  {
    id: uuid(), name: 'Sugar-Free Pistachio Cream', sku: 'CAV-SFC-250',
    category: 'Sugar-Free', unit_price: 899, cost_price: 399,
    stock_quantity: 95, min_stock_level: 25,
    description: 'All the flavor, none of the sugar. Sweetened with stevia. 250g tub.',
    created_at: daysAgo(60), updated_at: daysAgo(4)
  },
  {
    id: uuid(), name: 'Pistachio Cream Gift Box (3-pack)', sku: 'CAV-GFT-3PK',
    category: 'Gift Sets', unit_price: 2199, cost_price: 899,
    stock_quantity: 62, min_stock_level: 15,
    description: 'Three 250g tubs: Classic, Dark Chocolate, and White Chocolate in a premium gift box.',
    created_at: daysAgo(45), updated_at: daysAgo(7)
  },
  {
    id: uuid(), name: 'Pistachio Cream Spread (150g)', sku: 'CAV-SPR-150',
    category: 'Spreads', unit_price: 499, cost_price: 210,
    stock_quantity: 420, min_stock_level: 80,
    description: 'Lighter, spreadable version perfect for pandesal and pastries. 150g jar.',
    created_at: daysAgo(40), updated_at: daysAgo(1)
  },
  {
    id: uuid(), name: 'Salted Pistachio Cream', sku: 'CAV-SPC-250',
    category: 'Pistachio Cream', unit_price: 749, cost_price: 329,
    stock_quantity: 18, min_stock_level: 35,
    description: 'A hint of sea salt elevates the nutty flavor. 250g tub.',
    created_at: daysAgo(30), updated_at: daysAgo(2)
  },
  {
    id: uuid(), name: 'Honey Pistachio Cream', sku: 'CAV-HPC-250',
    category: 'Pistachio Cream', unit_price: 849, cost_price: 369,
    stock_quantity: 12, min_stock_level: 30,
    description: 'Natural honey blended with pistachio cream. 250g tub.',
    created_at: daysAgo(20), updated_at: daysAgo(1)
  },
  {
    id: uuid(), name: 'Vegan Pistachio Cream', sku: 'CAV-VPC-250',
    category: 'Vegan', unit_price: 879, cost_price: 389,
    stock_quantity: 8, min_stock_level: 25,
    description: '100% plant-based pistachio cream. Dairy-free and delicious. 250g tub.',
    created_at: daysAgo(15), updated_at: daysAgo(1)
  },
]

// --- CLIENTS ---
export const clients = [
  {
    id: uuid(), name: 'Café de Lipa', email: 'cafe.delipa@gmail.com', phone: '+63 917 123 4501',
    address: 'J.P. Laurel Highway, Lipa City, Batangas 4217', type: 'client',
    notes: 'Weekly orders, prefers Monday delivery. Famous for their Kapeng Barako pairing.',
    created_at: daysAgo(80), updated_at: daysAgo(5)
  },
  {
    id: uuid(), name: 'Pan de Manila Bakeshop', email: 'orders@pandemanila.ph', phone: '+63 917 123 4502',
    address: '152 Tomas Morato Ave, Quezon City 1103', type: 'client',
    notes: 'Uses our cream as pandesal filling. High-volume orders.',
    created_at: daysAgo(70), updated_at: daysAgo(3)
  },
  {
    id: uuid(), name: 'Patisserie de Manila', email: 'info@patisseriedemanila.ph', phone: '+63 917 123 4503',
    address: 'G/F Greenbelt 5, Ayala Center, Makati City 1224', type: 'client',
    notes: 'High-end patisserie. Orders gift boxes for corporate events and holidays.',
    created_at: daysAgo(65), updated_at: daysAgo(10)
  },
  {
    id: uuid(), name: 'Green Earth Organics', email: 'buyer@greenearth.ph', phone: '+63 917 123 4504',
    address: '2/F Bonifacio High Street, BGC, Taguig City 1634', type: 'client',
    notes: 'Stocks our vegan and sugar-free lines. Health-conscious clientele.',
    created_at: daysAgo(50), updated_at: daysAgo(8)
  },
  {
    id: uuid(), name: 'Kusina ni Maria', email: 'chef@kusinamaria.ph', phone: '+63 917 123 4505',
    address: '88 Ortigas Ave, Pasig City 1605', type: 'client',
    notes: 'Uses cream in their dessert menu. Bulk orders every 2 weeks.',
    created_at: daysAgo(40), updated_at: daysAgo(2)
  },
  {
    id: uuid(), name: "Lola's Ice Cream Parlor", email: 'hello@lolasicecream.ph', phone: '+63 917 123 4506',
    address: 'Festival Mall, Alabang, Muntinlupa City 1781', type: 'client',
    notes: 'Seasonal. Heavy orders during summer months (March–May).',
    created_at: daysAgo(30), updated_at: daysAgo(15)
  },
  {
    id: uuid(), name: 'Luxe Gifts Manila', email: 'sourcing@luxegifts.ph', phone: '+63 917 123 4507',
    address: 'Power Plant Mall, Rockwell Center, Makati City 1210', type: 'client',
    notes: 'Only orders gift boxes. Premium client for corporate gifting.',
    created_at: daysAgo(20), updated_at: daysAgo(4)
  },
]

// --- DISTRIBUTORS ---
export const distributors = [
  {
    id: uuid(), name: 'Metro Manila Food Distributors', email: 'dispatch@metrofood.ph', phone: '+63 917 200 0101',
    address: 'Ortigas Center Warehouse, Pasig City 1605', type: 'distributor',
    latitude: 14.5764, longitude: 121.0851,
    notes: 'Main distributor for NCR area. Same-day and next-day delivery.', created_at: daysAgo(85), updated_at: daysAgo(3)
  },
  {
    id: uuid(), name: 'Visayas Gourmet Supply', email: 'orders@visayasgourmet.ph', phone: '+63 917 200 0102',
    address: 'Mandaue City Industrial Park, Cebu 6014', type: 'distributor',
    latitude: 10.3157, longitude: 123.8854,
    notes: 'Covers Cebu, Bohol, and Western Visayas.', created_at: daysAgo(75), updated_at: daysAgo(7)
  },
  {
    id: uuid(), name: 'Luzon Premier Foods', email: 'info@luzonfoods.ph', phone: '+63 917 200 0103',
    address: 'Clark Freeport Zone, Pampanga 2023', type: 'distributor',
    latitude: 15.1858, longitude: 120.5464,
    notes: 'Covers Central and North Luzon. 2-day delivery.', created_at: daysAgo(60), updated_at: daysAgo(12)
  },
  {
    id: uuid(), name: 'Mindanao Fresh Trading', email: 'supply@mindanaofresh.ph', phone: '+63 917 200 0104',
    address: 'Davao City Trade Center, Davao City 8000', type: 'distributor',
    latitude: 7.0731, longitude: 125.6128,
    notes: 'Davao, GenSan, and CDO coverage.', created_at: daysAgo(45), updated_at: daysAgo(5)
  },
  {
    id: uuid(), name: 'Calabarzon Wholesale', email: 'sales@calabarzon.ph', phone: '+63 917 200 0105',
    address: 'Greenfield Industrial Park, Santa Rosa, Laguna 4026', type: 'distributor',
    latitude: 14.3136, longitude: 121.1159,
    notes: 'Laguna, Batangas, Cavite triangle. Close to Metro Manila — consider territory overlap.',
    created_at: daysAgo(30), updated_at: daysAgo(2)
  },
  {
    id: uuid(), name: 'BGC Express Delivery', email: 'partner@bgcexpress.ph', phone: '+63 917 200 0106',
    address: '28th Street, BGC, Taguig City 1634', type: 'distributor',
    latitude: 14.5502, longitude: 121.0498,
    notes: 'Local BGC/Makati distributor. Same-day delivery within Metro Manila.', created_at: daysAgo(15), updated_at: daysAgo(1)
  },
]

// --- SALES ---
const saleIds = Array.from({ length: 12 }, () => uuid())

export const sales = [
  {
    id: saleIds[0], client_id: clients[0].id, sale_date: daysAgo(2),
    subtotal: 6990, discount: 280, tax: 537, total_gross: 7527, total_net: 6710,
    status: 'completed', notes: 'Regular weekly order', created_at: daysAgo(2),
    clients: { name: clients[0].name }
  },
  {
    id: saleIds[1], client_id: clients[1].id, sale_date: daysAgo(3),
    subtotal: 3495, discount: 0, tax: 280, total_gross: 3775, total_net: 3495,
    status: 'completed', notes: '', created_at: daysAgo(3),
    clients: { name: clients[1].name }
  },
  {
    id: saleIds[2], client_id: clients[4].id, sale_date: daysAgo(5),
    subtotal: 13188, discount: 800, tax: 989, total_gross: 14177, total_net: 12388,
    status: 'completed', notes: 'Bulk order for restaurant menu launch', created_at: daysAgo(5),
    clients: { name: clients[4].name }
  },
  {
    id: saleIds[3], client_id: clients[2].id, sale_date: daysAgo(7),
    subtotal: 10995, discount: 550, tax: 835, total_gross: 11830, total_net: 10445,
    status: 'completed', notes: 'Gift boxes for corporate event', created_at: daysAgo(7),
    clients: { name: clients[2].name }
  },
  {
    id: saleIds[4], client_id: clients[3].id, sale_date: daysAgo(10),
    subtotal: 5334, discount: 0, tax: 427, total_gross: 5761, total_net: 5334,
    status: 'completed', notes: '', created_at: daysAgo(10),
    clients: { name: clients[3].name }
  },
  {
    id: saleIds[5], client_id: clients[0].id, sale_date: daysAgo(9),
    subtotal: 8388, discount: 280, tax: 649, total_gross: 9037, total_net: 8108,
    status: 'completed', notes: 'Extra order — weekend rush', created_at: daysAgo(9),
    clients: { name: clients[0].name }
  },
  {
    id: saleIds[6], client_id: clients[5].id, sale_date: daysAgo(12),
    subtotal: 4595, discount: 0, tax: 368, total_gross: 4963, total_net: 4595,
    status: 'completed', notes: 'Summer season starter', created_at: daysAgo(12),
    clients: { name: clients[5].name }
  },
  {
    id: saleIds[7], client_id: clients[6].id, sale_date: daysAgo(14),
    subtotal: 17592, discount: 1100, tax: 1319, total_gross: 18911, total_net: 16492,
    status: 'completed', notes: 'Gift boxes bulk order', created_at: daysAgo(14),
    clients: { name: clients[6].name }
  },
  {
    id: saleIds[8], client_id: clients[1].id, sale_date: daysAgo(1),
    subtotal: 2495, discount: 0, tax: 200, total_gross: 2695, total_net: 2495,
    status: 'pending', notes: 'Awaiting delivery confirmation', created_at: daysAgo(1),
    clients: { name: clients[1].name }
  },
  {
    id: saleIds[9], client_id: clients[3].id, sale_date: daysAgo(20),
    subtotal: 4273, discount: 0, tax: 342, total_gross: 4615, total_net: 4273,
    status: 'cancelled', notes: 'Client cancelled — store renovation', created_at: daysAgo(20),
    clients: { name: clients[3].name }
  },
  {
    id: saleIds[10], client_id: clients[4].id, sale_date: daysAgo(25),
    subtotal: 10138, discount: 550, tax: 767, total_gross: 10905, total_net: 9588,
    status: 'completed', notes: '', created_at: daysAgo(25),
    clients: { name: clients[4].name }
  },
  {
    id: saleIds[11], client_id: clients[2].id, sale_date: daysAgo(30),
    subtotal: 6597, discount: 0, tax: 528, total_gross: 7125, total_net: 6597,
    status: 'completed', notes: 'First gift box order', created_at: daysAgo(30),
    clients: { name: clients[2].name }
  },
]

// --- SALE ITEMS ---
export const sale_items = [
  // Sale 0 — Café de Lipa
  { id: uuid(), sale_id: saleIds[0], product_id: products[0].id, product_name: products[0].name, quantity: 10, unit_price: 699, cost_price: 299, total: 6990, created_at: daysAgo(2) },
  // Sale 1 — Pan de Manila
  { id: uuid(), sale_id: saleIds[1], product_id: products[0].id, product_name: products[0].name, quantity: 5, unit_price: 699, cost_price: 299, total: 3495, created_at: daysAgo(3) },
  // Sale 2 — Kusina ni Maria
  { id: uuid(), sale_id: saleIds[2], product_id: products[1].id, product_name: products[1].name, quantity: 8, unit_price: 1249, cost_price: 549, total: 9992, created_at: daysAgo(5) },
  { id: uuid(), sale_id: saleIds[2], product_id: products[2].id, product_name: products[2].name, quantity: 4, unit_price: 799, cost_price: 349, total: 3196, created_at: daysAgo(5) },
  // Sale 3 — Patisserie de Manila
  { id: uuid(), sale_id: saleIds[3], product_id: products[5].id, product_name: products[5].name, quantity: 5, unit_price: 2199, cost_price: 899, total: 10995, created_at: daysAgo(7) },
  // Sale 4 — Green Earth
  { id: uuid(), sale_id: saleIds[4], product_id: products[4].id, product_name: products[4].name, quantity: 3, unit_price: 899, cost_price: 399, total: 2697, created_at: daysAgo(10) },
  { id: uuid(), sale_id: saleIds[4], product_id: products[9].id, product_name: products[9].name, quantity: 3, unit_price: 879, cost_price: 389, total: 2637, created_at: daysAgo(10) },
  // Sale 5 — Café de Lipa extra
  { id: uuid(), sale_id: saleIds[5], product_id: products[0].id, product_name: products[0].name, quantity: 6, unit_price: 699, cost_price: 299, total: 4194, created_at: daysAgo(9) },
  { id: uuid(), sale_id: saleIds[5], product_id: products[2].id, product_name: products[2].name, quantity: 4, unit_price: 799, cost_price: 349, total: 3196, created_at: daysAgo(9) },
  { id: uuid(), sale_id: saleIds[5], product_id: products[6].id, product_name: products[6].name, quantity: 2, unit_price: 499, cost_price: 210, total: 998, created_at: daysAgo(9) },
  // Sale 6 — Lola's Ice Cream
  { id: uuid(), sale_id: saleIds[6], product_id: products[0].id, product_name: products[0].name, quantity: 3, unit_price: 699, cost_price: 299, total: 2097, created_at: daysAgo(12) },
  { id: uuid(), sale_id: saleIds[6], product_id: products[1].id, product_name: products[1].name, quantity: 2, unit_price: 1249, cost_price: 549, total: 2498, created_at: daysAgo(12) },
  // Sale 7 — Luxe Gifts
  { id: uuid(), sale_id: saleIds[7], product_id: products[5].id, product_name: products[5].name, quantity: 8, unit_price: 2199, cost_price: 899, total: 17592, created_at: daysAgo(14) },
  // Sale 8 — Pan de Manila pending
  { id: uuid(), sale_id: saleIds[8], product_id: products[6].id, product_name: products[6].name, quantity: 5, unit_price: 499, cost_price: 210, total: 2495, created_at: daysAgo(1) },
  // Sale 10 — Kusina ni Maria
  { id: uuid(), sale_id: saleIds[10], product_id: products[0].id, product_name: products[0].name, quantity: 6, unit_price: 699, cost_price: 299, total: 4194, created_at: daysAgo(25) },
  { id: uuid(), sale_id: saleIds[10], product_id: products[7].id, product_name: products[7].name, quantity: 5, unit_price: 749, cost_price: 329, total: 3745, created_at: daysAgo(25) },
  { id: uuid(), sale_id: saleIds[10], product_id: products[5].id, product_name: products[5].name, quantity: 1, unit_price: 2199, cost_price: 899, total: 2199, created_at: daysAgo(25) },
  // Sale 11 — Patisserie de Manila
  { id: uuid(), sale_id: saleIds[11], product_id: products[5].id, product_name: products[5].name, quantity: 3, unit_price: 2199, cost_price: 899, total: 6597, created_at: daysAgo(30) },
]

// --- STOCK MOVEMENTS ---
export const stock_movements = [
  { id: uuid(), product_id: products[0].id, type: 'in', quantity: 500, reference: 'PO-001', notes: 'Initial stock from supplier', created_at: daysAgo(90), products: { name: products[0].name } },
  { id: uuid(), product_id: products[1].id, type: 'in', quantity: 250, reference: 'PO-001', notes: 'Initial stock', created_at: daysAgo(90), products: { name: products[1].name } },
  { id: uuid(), product_id: products[2].id, type: 'in', quantity: 300, reference: 'PO-002', notes: 'Initial stock', created_at: daysAgo(75), products: { name: products[2].name } },
  { id: uuid(), product_id: products[3].id, type: 'in', quantity: 250, reference: 'PO-002', notes: 'Initial stock', created_at: daysAgo(75), products: { name: products[3].name } },
  { id: uuid(), product_id: products[0].id, type: 'out', quantity: 21, reference: 'Sales', notes: 'Weekly sales fulfillment', created_at: daysAgo(9), products: { name: products[0].name } },
  { id: uuid(), product_id: products[2].id, type: 'out', quantity: 8, reference: 'Sales', notes: 'Sales fulfillment', created_at: daysAgo(9), products: { name: products[2].name } },
  { id: uuid(), product_id: products[5].id, type: 'out', quantity: 13, reference: 'Sales', notes: 'Gift box orders', created_at: daysAgo(14), products: { name: products[5].name } },
  { id: uuid(), product_id: products[0].id, type: 'in', quantity: 200, reference: 'PO-005', notes: 'Restock — classic cream', created_at: daysAgo(7), products: { name: products[0].name } },
  { id: uuid(), product_id: products[6].id, type: 'in', quantity: 500, reference: 'PO-003', notes: 'Initial spread stock', created_at: daysAgo(40), products: { name: products[6].name } },
  { id: uuid(), product_id: products[6].id, type: 'out', quantity: 7, reference: 'Sales', notes: 'Spread orders', created_at: daysAgo(3), products: { name: products[6].name } },
  { id: uuid(), product_id: products[7].id, type: 'in', quantity: 100, reference: 'PO-004', notes: 'Salted cream initial', created_at: daysAgo(30), products: { name: products[7].name } },
  { id: uuid(), product_id: products[7].id, type: 'out', quantity: 5, reference: 'Sales', notes: 'Kusina ni Maria order', created_at: daysAgo(25), products: { name: products[7].name } },
  { id: uuid(), product_id: products[9].id, type: 'adjustment', quantity: -2, reference: 'QC', notes: 'Damaged tubs removed', created_at: daysAgo(10), products: { name: products[9].name } },
  { id: uuid(), product_id: products[8].id, type: 'in', quantity: 80, reference: 'PO-006', notes: 'Honey cream batch', created_at: daysAgo(20), products: { name: products[8].name } },
  { id: uuid(), product_id: products[1].id, type: 'out', quantity: 10, reference: 'Sales', notes: 'Restaurant orders', created_at: daysAgo(12), products: { name: products[1].name } },
  { id: uuid(), product_id: products[4].id, type: 'return', quantity: 2, reference: 'RET-001', notes: 'Customer return — mislabeled', created_at: daysAgo(8), products: { name: products[4].name } },
]

// --- TRANSACTIONS ---
export const transactions = [
  { id: uuid(), type: 'income', category: 'Sale', amount: 6710, description: 'Café de Lipa — weekly order', transaction_date: daysAgo(2), created_at: daysAgo(2) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 3495, description: 'Pan de Manila Bakeshop order', transaction_date: daysAgo(3), created_at: daysAgo(3) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 12388, description: 'Kusina ni Maria bulk order', transaction_date: daysAgo(5), created_at: daysAgo(5) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 10445, description: 'Patisserie de Manila gift boxes', transaction_date: daysAgo(7), created_at: daysAgo(7) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 8108, description: 'Café de Lipa extra weekend order', transaction_date: daysAgo(9), created_at: daysAgo(9) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 5334, description: 'Green Earth Organics', transaction_date: daysAgo(10), created_at: daysAgo(10) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 4595, description: "Lola's Ice Cream summer order", transaction_date: daysAgo(12), created_at: daysAgo(12) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 16492, description: 'Luxe Gifts Manila bulk', transaction_date: daysAgo(14), created_at: daysAgo(14) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 9588, description: 'Kusina ni Maria reorder', transaction_date: daysAgo(25), created_at: daysAgo(25) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 6597, description: 'Patisserie de Manila first order', transaction_date: daysAgo(30), created_at: daysAgo(30) },
  { id: uuid(), type: 'expense', category: 'Inventory Purchase', amount: 78000, description: 'Sicilian pistachio bulk — 50kg', transaction_date: daysAgo(28), created_at: daysAgo(28) },
  { id: uuid(), type: 'expense', category: 'Inventory Purchase', amount: 35000, description: 'Tubs and packaging — 2,000 units', transaction_date: daysAgo(28), created_at: daysAgo(28) },
  { id: uuid(), type: 'expense', category: 'Shipping', amount: 9500, description: 'Metro Manila Food delivery fees — March', transaction_date: daysAgo(5), created_at: daysAgo(5) },
  { id: uuid(), type: 'expense', category: 'Rent', amount: 45000, description: 'Kitchen space rental — Pasig — March', transaction_date: daysAgo(1), created_at: daysAgo(1) },
  { id: uuid(), type: 'expense', category: 'Utilities', amount: 8500, description: 'Meralco and Maynilad — March', transaction_date: daysAgo(1), created_at: daysAgo(1) },
  { id: uuid(), type: 'expense', category: 'Marketing', amount: 15000, description: 'Instagram & TikTok campaign — pistachio cream launch', transaction_date: daysAgo(15), created_at: daysAgo(15) },
  { id: uuid(), type: 'expense', category: 'Salary', amount: 85000, description: 'Production staff — March', transaction_date: daysAgo(1), created_at: daysAgo(1) },
  { id: uuid(), type: 'expense', category: 'Inventory Purchase', amount: 25000, description: 'Chocolate and cocoa supply', transaction_date: daysAgo(20), created_at: daysAgo(20) },
]

// --- PURCHASE ORDERS ---
const poIds = Array.from({ length: 6 }, () => uuid())

export const purchase_orders = [
  {
    id: poIds[0], po_number: 'PO-001', distributor_id: distributors[0].id,
    po_date: daysAgo(90), expected_delivery: daysAgo(85), status: 'received',
    total_cost: 286750, notes: 'Initial stock order — classic and 500g tubs',
    created_at: daysAgo(90), clients: { name: distributors[0].name }
  },
  {
    id: poIds[1], po_number: 'PO-002', distributor_id: distributors[1].id,
    po_date: daysAgo(75), expected_delivery: daysAgo(72), status: 'received',
    total_cost: 191950, notes: 'Dark and white chocolate cream stock',
    created_at: daysAgo(75), clients: { name: distributors[1].name }
  },
  {
    id: poIds[2], po_number: 'PO-003', distributor_id: distributors[0].id,
    po_date: daysAgo(40), expected_delivery: daysAgo(37), status: 'received',
    total_cost: 105000, notes: 'Spread restock',
    created_at: daysAgo(40), clients: { name: distributors[0].name }
  },
  {
    id: poIds[3], po_number: 'PO-004', distributor_id: distributors[2].id,
    po_date: daysAgo(30), expected_delivery: daysAgo(27), status: 'received',
    total_cost: 32900, notes: 'Salted cream initial order',
    created_at: daysAgo(30), clients: { name: distributors[2].name }
  },
  {
    id: poIds[4], po_number: 'PO-005', distributor_id: distributors[0].id,
    po_date: daysAgo(10), expected_delivery: daysAgo(7), status: 'received',
    total_cost: 59800, notes: 'Classic cream restock',
    created_at: daysAgo(10), clients: { name: distributors[0].name }
  },
  {
    id: poIds[5], po_number: 'PO-006', distributor_id: distributors[3].id,
    po_date: daysAgo(3), expected_delivery: daysAgo(-4), status: 'shipped',
    total_cost: 124220, notes: 'Monthly restock — multiple SKUs',
    created_at: daysAgo(3), clients: { name: distributors[3].name }
  },
]

export const purchase_order_items = [
  { id: uuid(), purchase_order_id: poIds[0], product_id: products[0].id, quantity: 500, unit_cost: 299, line_total: 149500, created_at: daysAgo(90), products: { name: products[0].name } },
  { id: uuid(), purchase_order_id: poIds[0], product_id: products[1].id, quantity: 250, unit_cost: 549, line_total: 137250, created_at: daysAgo(90), products: { name: products[1].name } },
  { id: uuid(), purchase_order_id: poIds[1], product_id: products[2].id, quantity: 300, unit_cost: 349, line_total: 104700, created_at: daysAgo(75), products: { name: products[2].name } },
  { id: uuid(), purchase_order_id: poIds[1], product_id: products[3].id, quantity: 250, unit_cost: 349, line_total: 87250, created_at: daysAgo(75), products: { name: products[3].name } },
  { id: uuid(), purchase_order_id: poIds[2], product_id: products[6].id, quantity: 500, unit_cost: 210, line_total: 105000, created_at: daysAgo(40), products: { name: products[6].name } },
  { id: uuid(), purchase_order_id: poIds[3], product_id: products[7].id, quantity: 100, unit_cost: 329, line_total: 32900, created_at: daysAgo(30), products: { name: products[7].name } },
  { id: uuid(), purchase_order_id: poIds[4], product_id: products[0].id, quantity: 200, unit_cost: 299, line_total: 59800, created_at: daysAgo(10), products: { name: products[0].name } },
  { id: uuid(), purchase_order_id: poIds[5], product_id: products[0].id, quantity: 200, unit_cost: 299, line_total: 59800, created_at: daysAgo(3), products: { name: products[0].name } },
  { id: uuid(), purchase_order_id: poIds[5], product_id: products[2].id, quantity: 100, unit_cost: 349, line_total: 34900, created_at: daysAgo(3), products: { name: products[2].name } },
  { id: uuid(), purchase_order_id: poIds[5], product_id: products[8].id, quantity: 80, unit_cost: 369, line_total: 29520, created_at: daysAgo(3), products: { name: products[8].name } },
]

// --- INVOICES ---
function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export const invoices = [
  {
    id: uuid(), invoice_number: 'INV-001', sale_id: saleIds[0], client_id: clients[0].id,
    invoice_date: daysAgo(2), due_date: daysAgo(-28), amount: 6710,
    status: 'paid', payment_terms: 'Net 30', notes: '',
    created_at: daysAgo(2), clients: { name: clients[0].name }
  },
  {
    id: uuid(), invoice_number: 'INV-002', sale_id: saleIds[1], client_id: clients[1].id,
    invoice_date: daysAgo(3), due_date: daysAgo(-27), amount: 3495,
    status: 'paid', payment_terms: 'Net 30', notes: '',
    created_at: daysAgo(3), clients: { name: clients[1].name }
  },
  {
    id: uuid(), invoice_number: 'INV-003', sale_id: saleIds[2], client_id: clients[4].id,
    invoice_date: daysAgo(5), due_date: daysAgo(-25), amount: 12388,
    status: 'paid', payment_terms: 'Net 30', notes: 'Bulk order discount applied',
    created_at: daysAgo(5), clients: { name: clients[4].name }
  },
  {
    id: uuid(), invoice_number: 'INV-004', sale_id: saleIds[3], client_id: clients[2].id,
    invoice_date: daysAgo(7), due_date: daysAgo(-23), amount: 10445,
    status: 'sent', payment_terms: 'Net 30', notes: 'Corporate event order',
    created_at: daysAgo(7), clients: { name: clients[2].name }
  },
  {
    id: uuid(), invoice_number: 'INV-005', sale_id: saleIds[7], client_id: clients[6].id,
    invoice_date: daysAgo(14), due_date: daysAgo(-1), amount: 16492,
    status: 'overdue', payment_terms: 'Net 15', notes: 'Premium client — follow up',
    created_at: daysAgo(14), clients: { name: clients[6].name }
  },
  {
    id: uuid(), invoice_number: 'INV-006', sale_id: saleIds[8], client_id: clients[1].id,
    invoice_date: daysAgo(1), due_date: daysFromNow(29), amount: 2495,
    status: 'draft', payment_terms: 'Net 30', notes: '',
    created_at: daysAgo(1), clients: { name: clients[1].name }
  },
]

// --- BATCHES ---
export const batches = [
  {
    id: uuid(), batch_number: 'BATCH-001', product_id: products[0].id,
    quantity: 500, production_date: daysAgo(90), expiry_date: daysFromNow(90),
    storage_location: 'Warehouse A — Shelf 1', quality_status: 'passed',
    notes: 'First production run', created_at: daysAgo(90), products: { name: products[0].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-002', product_id: products[1].id,
    quantity: 250, production_date: daysAgo(90), expiry_date: daysFromNow(90),
    storage_location: 'Warehouse A — Shelf 2', quality_status: 'passed',
    notes: '', created_at: daysAgo(90), products: { name: products[1].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-003', product_id: products[2].id,
    quantity: 300, production_date: daysAgo(75), expiry_date: daysFromNow(105),
    storage_location: 'Warehouse A — Shelf 3', quality_status: 'passed',
    notes: 'Dark chocolate blend', created_at: daysAgo(75), products: { name: products[2].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-004', product_id: products[3].id,
    quantity: 250, production_date: daysAgo(75), expiry_date: daysFromNow(105),
    storage_location: 'Warehouse A — Shelf 3', quality_status: 'passed',
    notes: 'White chocolate blend', created_at: daysAgo(75), products: { name: products[3].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-005', product_id: products[6].id,
    quantity: 500, production_date: daysAgo(40), expiry_date: daysFromNow(140),
    storage_location: 'Warehouse B — Cold Storage', quality_status: 'passed',
    notes: 'Spread formula v2', created_at: daysAgo(40), products: { name: products[6].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-006', product_id: products[7].id,
    quantity: 100, production_date: daysAgo(30), expiry_date: daysFromNow(15),
    storage_location: 'Warehouse A — Shelf 4', quality_status: 'passed',
    notes: 'Salted cream — expiring soon', created_at: daysAgo(30), products: { name: products[7].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-007', product_id: products[8].id,
    quantity: 80, production_date: daysAgo(20), expiry_date: daysFromNow(25),
    storage_location: 'Warehouse A — Shelf 5', quality_status: 'passed',
    notes: 'Honey cream batch', created_at: daysAgo(20), products: { name: products[8].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-008', product_id: products[9].id,
    quantity: 50, production_date: daysAgo(60), expiry_date: daysAgo(5),
    storage_location: 'Warehouse B — Cold Storage', quality_status: 'passed',
    notes: 'EXPIRED — needs disposal', created_at: daysAgo(60), products: { name: products[9].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-009', product_id: products[4].id,
    quantity: 120, production_date: daysAgo(15), expiry_date: daysFromNow(165),
    storage_location: 'Warehouse A — Shelf 2', quality_status: 'pending',
    notes: 'Sugar-free — awaiting QC clearance', created_at: daysAgo(15), products: { name: products[4].name }
  },
  {
    id: uuid(), batch_number: 'BATCH-010', product_id: products[0].id,
    quantity: 200, production_date: daysAgo(7), expiry_date: daysFromNow(173),
    storage_location: 'Warehouse A — Shelf 1', quality_status: 'passed',
    notes: 'Latest classic cream production', created_at: daysAgo(7), products: { name: products[0].name }
  },
]

// --- RETURNS ---
const returnIds = Array.from({ length: 3 }, () => uuid())

export const returns = [
  {
    id: returnIds[0], return_number: 'RET-001', sale_id: saleIds[4], client_id: clients[3].id,
    return_date: daysAgo(8), reason: 'Damaged', refund_amount: 1798,
    status: 'completed', notes: 'Two tubs arrived with broken seals',
    created_at: daysAgo(8), clients: { name: clients[3].name },
    sales: { id: saleIds[4] }
  },
  {
    id: returnIds[1], return_number: 'RET-002', sale_id: saleIds[6], client_id: clients[5].id,
    return_date: daysAgo(4), reason: 'Quality Issue', refund_amount: 2498,
    status: 'approved', notes: 'Customer reported off-taste in 500g tubs',
    created_at: daysAgo(4), clients: { name: clients[5].name },
    sales: { id: saleIds[6] }
  },
  {
    id: returnIds[2], return_number: 'RET-003', sale_id: saleIds[5], client_id: clients[0].id,
    return_date: daysAgo(1), reason: 'Wrong Product', refund_amount: 998,
    status: 'pending', notes: 'Received spread instead of classic cream',
    created_at: daysAgo(1), clients: { name: clients[0].name },
    sales: { id: saleIds[5] }
  },
]

export const return_items = [
  { id: uuid(), return_id: returnIds[0], product_id: products[4].id, quantity: 2, unit_price: 899, total: 1798, created_at: daysAgo(8), products: { name: products[4].name } },
  { id: uuid(), return_id: returnIds[1], product_id: products[1].id, quantity: 2, unit_price: 1249, total: 2498, created_at: daysAgo(4), products: { name: products[1].name } },
  { id: uuid(), return_id: returnIds[2], product_id: products[6].id, quantity: 2, unit_price: 499, total: 998, created_at: daysAgo(1), products: { name: products[6].name } },
]

// --- ACTIVITY LOG ---
export const activity_log = [
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Product', entity_name: 'Classic Pistachio Cream', details: 'Added new product SKU CAV-CPC-250', created_at: daysAgo(90) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Product', entity_name: 'Classic Pistachio Cream (500g)', details: 'Added new product SKU CAV-CPC-500', created_at: daysAgo(90) },
  { id: uuid(), user_email: 'miguel@cavella.ph', user_name: 'Miguel Santos', action: 'created', entity_type: 'Client', entity_name: 'Café de Lipa', details: 'New client registered', created_at: daysAgo(80) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Purchase Order', entity_name: 'PO-001', details: 'Created PO for Metro Manila Food Distributors — ₱286,750', created_at: daysAgo(90) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'updated', entity_type: 'Purchase Order', entity_name: 'PO-001', details: 'Status changed to Received', created_at: daysAgo(85) },
  { id: uuid(), user_email: 'miguel@cavella.ph', user_name: 'Miguel Santos', action: 'created', entity_type: 'Distributor', entity_name: 'Metro Manila Food Distributors', details: 'New distributor added — NCR area', created_at: daysAgo(85) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Batch', entity_name: 'BATCH-001', details: 'Production batch: 500 units of Classic Pistachio Cream', created_at: daysAgo(90) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Sale', entity_name: 'Sale #1', details: 'Sale to Café de Lipa — ₱6,710', created_at: daysAgo(2) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Sale', entity_name: 'Sale #2', details: 'Sale to Pan de Manila — ₱3,495', created_at: daysAgo(3) },
  { id: uuid(), user_email: 'miguel@cavella.ph', user_name: 'Miguel Santos', action: 'created', entity_type: 'Sale', entity_name: 'Sale #3', details: 'Bulk order: Kusina ni Maria — ₱12,388', created_at: daysAgo(5) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Invoice', entity_name: 'INV-001', details: 'Invoice generated for Café de Lipa', created_at: daysAgo(2) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'updated', entity_type: 'Invoice', entity_name: 'INV-001', details: 'Marked as Paid', created_at: daysAgo(1) },
  { id: uuid(), user_email: 'miguel@cavella.ph', user_name: 'Miguel Santos', action: 'created', entity_type: 'Return', entity_name: 'RET-001', details: 'Return from Green Earth Organics — 2 damaged tubs', created_at: daysAgo(8) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'updated', entity_type: 'Return', entity_name: 'RET-001', details: 'Status changed to Completed, refund issued ₱1,798', created_at: daysAgo(7) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'updated', entity_type: 'Product', entity_name: 'Vegan Pistachio Cream', details: 'Stock adjusted: removed 2 damaged tubs', created_at: daysAgo(10) },
  { id: uuid(), user_email: 'miguel@cavella.ph', user_name: 'Miguel Santos', action: 'created', entity_type: 'Client', entity_name: 'Luxe Gifts Manila', details: 'Premium gift box client added', created_at: daysAgo(20) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Purchase Order', entity_name: 'PO-006', details: 'Monthly restock order — ₱124,220', created_at: daysAgo(3) },
  { id: uuid(), user_email: 'miguel@cavella.ph', user_name: 'Miguel Santos', action: 'deleted', entity_type: 'Product', entity_name: 'Test Product', details: 'Removed test product from catalog', created_at: daysAgo(50) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'updated', entity_type: 'Batch', entity_name: 'BATCH-008', details: 'Batch marked as expired — needs disposal', created_at: daysAgo(5) },
  { id: uuid(), user_email: 'jillian@cavella.ph', user_name: 'Jillian Reyes', action: 'created', entity_type: 'Batch', entity_name: 'BATCH-010', details: 'New production: 200 units Classic Pistachio Cream', created_at: daysAgo(7) },
]

// --- NOTIFICATIONS ---
export const notifications = [
  { id: uuid(), type: 'low_stock', title: 'Low Stock: Vegan Pistachio Cream', message: 'Only 8 units remaining (minimum: 25). Reorder needed.', read: false, created_at: daysAgo(0) },
  { id: uuid(), type: 'low_stock', title: 'Low Stock: Honey Pistachio Cream', message: 'Only 12 units remaining (minimum: 30). Consider restocking.', read: false, created_at: daysAgo(0) },
  { id: uuid(), type: 'low_stock', title: 'Low Stock: Salted Pistachio Cream', message: 'Only 18 units remaining (minimum: 35). Running low.', read: false, created_at: daysAgo(1) },
  { id: uuid(), type: 'expiry', title: 'Batch Expiring: BATCH-008', message: 'Vegan Pistachio Cream batch has expired. Dispose of remaining units.', read: false, created_at: daysAgo(5) },
  { id: uuid(), type: 'expiry', title: 'Batch Expiring Soon: BATCH-006', message: 'Salted Pistachio Cream expires in 15 days. Prioritize for sales.', read: true, created_at: daysAgo(3) },
  { id: uuid(), type: 'order', title: 'PO-006 Shipped', message: 'Purchase order from Mindanao Fresh Trading has been shipped. Expected delivery in 4 days.', read: true, created_at: daysAgo(2) },
  { id: uuid(), type: 'order', title: 'Invoice INV-005 Overdue', message: 'Invoice for Luxe Gifts Manila (₱16,492) is past due. Follow up required.', read: false, created_at: daysAgo(1) },
  { id: uuid(), type: 'order', title: 'New Return Request: RET-003', message: 'Café de Lipa submitted a return request. Review and approve.', read: false, created_at: daysAgo(1) },
  { id: uuid(), type: 'system', title: 'Welcome to Cavella', message: 'Your management system is ready. Start by reviewing your inventory and pending orders.', read: true, created_at: daysAgo(90) },
  { id: uuid(), type: 'system', title: 'Monthly Report Available', message: 'Your February sales report is ready for review in Reports.', read: true, created_at: daysAgo(19) },
]
