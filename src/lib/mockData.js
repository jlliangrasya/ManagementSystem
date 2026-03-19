// ============================================
// Cavella Pistachio Creams — Sample Data
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
    category: 'Pistachio Cream', unit_price: 12.99, cost_price: 5.50,
    stock_quantity: 340, min_stock_level: 50,
    description: 'Our signature pistachio cream. Rich, smooth, and made with premium Sicilian pistachios. 250g tub.',
    created_at: daysAgo(90), updated_at: daysAgo(2)
  },
  {
    id: uuid(), name: 'Classic Pistachio Cream (500g)', sku: 'CAV-CPC-500',
    category: 'Pistachio Cream', unit_price: 22.99, cost_price: 9.80,
    stock_quantity: 185, min_stock_level: 30,
    description: 'Signature pistachio cream in a larger 500g tub. Perfect for families.',
    created_at: daysAgo(90), updated_at: daysAgo(5)
  },
  {
    id: uuid(), name: 'Dark Chocolate Pistachio Cream', sku: 'CAV-DCP-250',
    category: 'Pistachio Cream', unit_price: 14.49, cost_price: 6.20,
    stock_quantity: 210, min_stock_level: 40,
    description: 'Rich dark chocolate blended with our pistachio cream. 250g tub.',
    created_at: daysAgo(75), updated_at: daysAgo(3)
  },
  {
    id: uuid(), name: 'White Chocolate Pistachio Cream', sku: 'CAV-WCP-250',
    category: 'Pistachio Cream', unit_price: 14.49, cost_price: 6.20,
    stock_quantity: 178, min_stock_level: 40,
    description: 'Smooth white chocolate pistachio cream. Sweet and creamy. 250g tub.',
    created_at: daysAgo(75), updated_at: daysAgo(1)
  },
  {
    id: uuid(), name: 'Sugar-Free Pistachio Cream', sku: 'CAV-SFC-250',
    category: 'Sugar-Free', unit_price: 15.99, cost_price: 7.10,
    stock_quantity: 95, min_stock_level: 25,
    description: 'All the flavor, none of the sugar. Sweetened with stevia. 250g tub.',
    created_at: daysAgo(60), updated_at: daysAgo(4)
  },
  {
    id: uuid(), name: 'Pistachio Cream Gift Box (3-pack)', sku: 'CAV-GFT-3PK',
    category: 'Gift Sets', unit_price: 39.99, cost_price: 16.00,
    stock_quantity: 62, min_stock_level: 15,
    description: 'Three 250g tubs: Classic, Dark Chocolate, and White Chocolate in a premium gift box.',
    created_at: daysAgo(45), updated_at: daysAgo(7)
  },
  {
    id: uuid(), name: 'Pistachio Cream Spread (150g)', sku: 'CAV-SPR-150',
    category: 'Spreads', unit_price: 8.99, cost_price: 3.80,
    stock_quantity: 420, min_stock_level: 80,
    description: 'Lighter, spreadable version perfect for toast and pastries. 150g jar.',
    created_at: daysAgo(40), updated_at: daysAgo(1)
  },
  {
    id: uuid(), name: 'Salted Pistachio Cream', sku: 'CAV-SPC-250',
    category: 'Pistachio Cream', unit_price: 13.99, cost_price: 5.90,
    stock_quantity: 18, min_stock_level: 35,
    description: 'A hint of sea salt elevates the nutty flavor. 250g tub.',
    created_at: daysAgo(30), updated_at: daysAgo(2)
  },
  {
    id: uuid(), name: 'Honey Pistachio Cream', sku: 'CAV-HPC-250',
    category: 'Pistachio Cream', unit_price: 14.99, cost_price: 6.50,
    stock_quantity: 12, min_stock_level: 30,
    description: 'Natural honey blended with pistachio cream. 250g tub.',
    created_at: daysAgo(20), updated_at: daysAgo(1)
  },
  {
    id: uuid(), name: 'Vegan Pistachio Cream', sku: 'CAV-VPC-250',
    category: 'Vegan', unit_price: 15.49, cost_price: 7.00,
    stock_quantity: 8, min_stock_level: 25,
    description: '100% plant-based pistachio cream. Dairy-free and delicious. 250g tub.',
    created_at: daysAgo(15), updated_at: daysAgo(1)
  },
]

// --- CLIENTS ---
export const clients = [
  {
    id: uuid(), name: 'Sweet Bites Bakery', email: 'orders@sweetbites.com', phone: '+1 555-0101',
    address: '42 Baker Street, New York, NY 10001', type: 'client', notes: 'Weekly orders, prefers Monday delivery.',
    created_at: daysAgo(80), updated_at: daysAgo(5)
  },
  {
    id: uuid(), name: 'Café Aroma', email: 'purchasing@cafearoma.com', phone: '+1 555-0102',
    address: '15 Coffee Lane, Brooklyn, NY 11201', type: 'client', notes: 'Uses our cream in their pistachio lattes.',
    created_at: daysAgo(70), updated_at: daysAgo(3)
  },
  {
    id: uuid(), name: 'The Pastry Corner', email: 'info@pastrycorner.com', phone: '+1 555-0103',
    address: '88 Dessert Ave, Manhattan, NY 10013', type: 'client', notes: 'High-end patisserie. Orders gift boxes for holidays.',
    created_at: daysAgo(65), updated_at: daysAgo(10)
  },
  {
    id: uuid(), name: 'Green Grocer Market', email: 'buyer@greengrocer.com', phone: '+1 555-0104',
    address: '200 Organic Way, Queens, NY 11375', type: 'client', notes: 'Stocks our vegan and sugar-free lines.',
    created_at: daysAgo(50), updated_at: daysAgo(8)
  },
  {
    id: uuid(), name: 'Bella Cucina Restaurant', email: 'chef@bellacucina.com', phone: '+1 555-0105',
    address: '77 Italian Blvd, Bronx, NY 10451', type: 'client', notes: 'Uses cream in dessert menu. Bulk orders.',
    created_at: daysAgo(40), updated_at: daysAgo(2)
  },
  {
    id: uuid(), name: 'Nana\'s Ice Cream Shop', email: 'hello@nanasicecream.com', phone: '+1 555-0106',
    address: '33 Scoop Street, Staten Island, NY 10301', type: 'client', notes: 'Seasonal. Heavy orders in summer.',
    created_at: daysAgo(30), updated_at: daysAgo(15)
  },
  {
    id: uuid(), name: 'Luxe Gift Emporium', email: 'sourcing@luxegifts.com', phone: '+1 555-0107',
    address: '5th Avenue, Manhattan, NY 10019', type: 'client', notes: 'Only orders gift boxes. Premium client.',
    created_at: daysAgo(20), updated_at: daysAgo(4)
  },
]

// --- DISTRIBUTORS ---
export const distributors = [
  {
    id: uuid(), name: 'Metro Food Distributors', email: 'dispatch@metrofood.com', phone: '+1 555-0201',
    address: '500 Warehouse Blvd, Newark, NJ 07102', type: 'distributor',
    latitude: 40.7357, longitude: -74.1724,
    notes: 'Main distributor for NJ/NY area. 2-day delivery.', created_at: daysAgo(85), updated_at: daysAgo(3)
  },
  {
    id: uuid(), name: 'East Coast Gourmet Supply', email: 'orders@ecgourmet.com', phone: '+1 555-0202',
    address: '120 Harbor Drive, Philadelphia, PA 19103', type: 'distributor',
    latitude: 39.9526, longitude: -75.1652,
    notes: 'Covers PA and DE region.', created_at: daysAgo(75), updated_at: daysAgo(7)
  },
  {
    id: uuid(), name: 'Northeast Specialty Foods', email: 'info@nespecialty.com', phone: '+1 555-0203',
    address: '85 Commerce St, Boston, MA 02110', type: 'distributor',
    latitude: 42.3601, longitude: -71.0589,
    notes: 'New England distribution. Premium accounts only.', created_at: daysAgo(60), updated_at: daysAgo(12)
  },
  {
    id: uuid(), name: 'Capital Region Foods', email: 'supply@capitalfoods.com', phone: '+1 555-0204',
    address: '300 Distribution Way, Washington, DC 20001', type: 'distributor',
    latitude: 38.9072, longitude: -77.0369,
    notes: 'DC, Maryland, Virginia triangle.', created_at: daysAgo(45), updated_at: daysAgo(5)
  },
  {
    id: uuid(), name: 'Garden State Wholesale', email: 'sales@gswholesale.com', phone: '+1 555-0205',
    address: '75 Turnpike Road, Edison, NJ 08817', type: 'distributor',
    latitude: 40.5187, longitude: -74.4121,
    notes: 'Central NJ. Close to Metro Food — consider territory overlap.',
    created_at: daysAgo(30), updated_at: daysAgo(2)
  },
  {
    id: uuid(), name: 'Brooklyn Fresh Co.', email: 'partner@brooklynfresh.com', phone: '+1 555-0206',
    address: '22 Atlantic Ave, Brooklyn, NY 11217', type: 'distributor',
    latitude: 40.6865, longitude: -73.9780,
    notes: 'Local Brooklyn distributor. Same-day delivery.', created_at: daysAgo(15), updated_at: daysAgo(1)
  },
]

// --- SALES ---
const saleIds = Array.from({ length: 12 }, () => uuid())

export const sales = [
  {
    id: saleIds[0], client_id: clients[0].id, sale_date: daysAgo(2),
    subtotal: 129.90, discount: 5.00, tax: 10.00, total_gross: 139.90, total_net: 124.90,
    status: 'completed', notes: 'Regular weekly order', created_at: daysAgo(2),
    clients: { name: clients[0].name }
  },
  {
    id: saleIds[1], client_id: clients[1].id, sale_date: daysAgo(3),
    subtotal: 64.95, discount: 0, tax: 5.20, total_gross: 70.15, total_net: 64.95,
    status: 'completed', notes: '', created_at: daysAgo(3),
    clients: { name: clients[1].name }
  },
  {
    id: saleIds[2], client_id: clients[4].id, sale_date: daysAgo(5),
    subtotal: 259.80, discount: 15.00, tax: 19.58, total_gross: 279.38, total_net: 244.80,
    status: 'completed', notes: 'Bulk order for restaurant menu launch', created_at: daysAgo(5),
    clients: { name: clients[4].name }
  },
  {
    id: saleIds[3], client_id: clients[2].id, sale_date: daysAgo(7),
    subtotal: 199.95, discount: 10.00, tax: 15.20, total_gross: 215.15, total_net: 189.95,
    status: 'completed', notes: 'Gift boxes for corporate event', created_at: daysAgo(7),
    clients: { name: clients[2].name }
  },
  {
    id: saleIds[4], client_id: clients[3].id, sale_date: daysAgo(10),
    subtotal: 93.93, discount: 0, tax: 7.51, total_gross: 101.44, total_net: 93.93,
    status: 'completed', notes: '', created_at: daysAgo(10),
    clients: { name: clients[3].name }
  },
  {
    id: saleIds[5], client_id: clients[0].id, sale_date: daysAgo(9),
    subtotal: 155.88, discount: 5.00, tax: 12.07, total_gross: 167.95, total_net: 150.88,
    status: 'completed', notes: 'Extra order — weekend rush', created_at: daysAgo(9),
    clients: { name: clients[0].name }
  },
  {
    id: saleIds[6], client_id: clients[5].id, sale_date: daysAgo(12),
    subtotal: 89.91, discount: 0, tax: 7.19, total_gross: 97.10, total_net: 89.91,
    status: 'completed', notes: 'Summer season starter', created_at: daysAgo(12),
    clients: { name: clients[5].name }
  },
  {
    id: saleIds[7], client_id: clients[6].id, sale_date: daysAgo(14),
    subtotal: 319.92, discount: 20.00, tax: 23.99, total_gross: 343.91, total_net: 299.92,
    status: 'completed', notes: 'Gift boxes bulk order', created_at: daysAgo(14),
    clients: { name: clients[6].name }
  },
  {
    id: saleIds[8], client_id: clients[1].id, sale_date: daysAgo(1),
    subtotal: 44.97, discount: 0, tax: 3.60, total_gross: 48.57, total_net: 44.97,
    status: 'pending', notes: 'Awaiting delivery confirmation', created_at: daysAgo(1),
    clients: { name: clients[1].name }
  },
  {
    id: saleIds[9], client_id: clients[3].id, sale_date: daysAgo(20),
    subtotal: 77.45, discount: 0, tax: 6.20, total_gross: 83.65, total_net: 77.45,
    status: 'cancelled', notes: 'Client cancelled — store renovation', created_at: daysAgo(20),
    clients: { name: clients[3].name }
  },
  {
    id: saleIds[10], client_id: clients[4].id, sale_date: daysAgo(25),
    subtotal: 187.35, discount: 10.00, tax: 14.19, total_gross: 201.54, total_net: 177.35,
    status: 'completed', notes: '', created_at: daysAgo(25),
    clients: { name: clients[4].name }
  },
  {
    id: saleIds[11], client_id: clients[2].id, sale_date: daysAgo(30),
    subtotal: 119.97, discount: 0, tax: 9.60, total_gross: 129.57, total_net: 119.97,
    status: 'completed', notes: 'First gift box order', created_at: daysAgo(30),
    clients: { name: clients[2].name }
  },
]

// --- SALE ITEMS ---
export const sale_items = [
  // Sale 0 — Sweet Bites Bakery
  { id: uuid(), sale_id: saleIds[0], product_id: products[0].id, product_name: products[0].name, quantity: 10, unit_price: 12.99, cost_price: 5.50, total: 129.90, created_at: daysAgo(2) },
  // Sale 1 — Café Aroma
  { id: uuid(), sale_id: saleIds[1], product_id: products[0].id, product_name: products[0].name, quantity: 5, unit_price: 12.99, cost_price: 5.50, total: 64.95, created_at: daysAgo(3) },
  // Sale 2 — Bella Cucina
  { id: uuid(), sale_id: saleIds[2], product_id: products[1].id, product_name: products[1].name, quantity: 8, unit_price: 22.99, cost_price: 9.80, total: 183.92, created_at: daysAgo(5) },
  { id: uuid(), sale_id: saleIds[2], product_id: products[2].id, product_name: products[2].name, quantity: 4, unit_price: 14.49, cost_price: 6.20, total: 57.96, created_at: daysAgo(5) },
  // Sale 3 — The Pastry Corner
  { id: uuid(), sale_id: saleIds[3], product_id: products[5].id, product_name: products[5].name, quantity: 5, unit_price: 39.99, cost_price: 16.00, total: 199.95, created_at: daysAgo(7) },
  // Sale 4 — Green Grocer
  { id: uuid(), sale_id: saleIds[4], product_id: products[4].id, product_name: products[4].name, quantity: 3, unit_price: 15.99, cost_price: 7.10, total: 47.97, created_at: daysAgo(10) },
  { id: uuid(), sale_id: saleIds[4], product_id: products[9].id, product_name: products[9].name, quantity: 3, unit_price: 15.49, cost_price: 7.00, total: 46.47, created_at: daysAgo(10) },
  // Sale 5 — Sweet Bites extra
  { id: uuid(), sale_id: saleIds[5], product_id: products[0].id, product_name: products[0].name, quantity: 6, unit_price: 12.99, cost_price: 5.50, total: 77.94, created_at: daysAgo(9) },
  { id: uuid(), sale_id: saleIds[5], product_id: products[2].id, product_name: products[2].name, quantity: 4, unit_price: 14.49, cost_price: 6.20, total: 57.96, created_at: daysAgo(9) },
  { id: uuid(), sale_id: saleIds[5], product_id: products[6].id, product_name: products[6].name, quantity: 2, unit_price: 8.99, cost_price: 3.80, total: 17.98, created_at: daysAgo(9) },
  // Sale 6 — Nana's Ice Cream
  { id: uuid(), sale_id: saleIds[6], product_id: products[0].id, product_name: products[0].name, quantity: 3, unit_price: 12.99, cost_price: 5.50, total: 38.97, created_at: daysAgo(12) },
  { id: uuid(), sale_id: saleIds[6], product_id: products[1].id, product_name: products[1].name, quantity: 2, unit_price: 22.99, cost_price: 9.80, total: 45.98, created_at: daysAgo(12) },
  // Sale 7 — Luxe Gift
  { id: uuid(), sale_id: saleIds[7], product_id: products[5].id, product_name: products[5].name, quantity: 8, unit_price: 39.99, cost_price: 16.00, total: 319.92, created_at: daysAgo(14) },
  // Sale 8 — Café Aroma pending
  { id: uuid(), sale_id: saleIds[8], product_id: products[6].id, product_name: products[6].name, quantity: 5, unit_price: 8.99, cost_price: 3.80, total: 44.95, created_at: daysAgo(1) },
  // Sale 10 — Bella Cucina
  { id: uuid(), sale_id: saleIds[10], product_id: products[0].id, product_name: products[0].name, quantity: 6, unit_price: 12.99, cost_price: 5.50, total: 77.94, created_at: daysAgo(25) },
  { id: uuid(), sale_id: saleIds[10], product_id: products[7].id, product_name: products[7].name, quantity: 5, unit_price: 13.99, cost_price: 5.90, total: 69.95, created_at: daysAgo(25) },
  { id: uuid(), sale_id: saleIds[10], product_id: products[5].id, product_name: products[5].name, quantity: 1, unit_price: 39.99, cost_price: 16.00, total: 39.99, created_at: daysAgo(25) },
  // Sale 11 — Pastry Corner
  { id: uuid(), sale_id: saleIds[11], product_id: products[5].id, product_name: products[5].name, quantity: 3, unit_price: 39.99, cost_price: 16.00, total: 119.97, created_at: daysAgo(30) },
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
  { id: uuid(), product_id: products[7].id, type: 'out', quantity: 5, reference: 'Sales', notes: 'Bella Cucina order', created_at: daysAgo(25), products: { name: products[7].name } },
  { id: uuid(), product_id: products[9].id, type: 'adjustment', quantity: -2, reference: 'QC', notes: 'Damaged tubs removed', created_at: daysAgo(10), products: { name: products[9].name } },
  { id: uuid(), product_id: products[8].id, type: 'in', quantity: 80, reference: 'PO-006', notes: 'Honey cream batch', created_at: daysAgo(20), products: { name: products[8].name } },
  { id: uuid(), product_id: products[1].id, type: 'out', quantity: 10, reference: 'Sales', notes: 'Restaurant orders', created_at: daysAgo(12), products: { name: products[1].name } },
  { id: uuid(), product_id: products[4].id, type: 'return', quantity: 2, reference: 'RET-001', notes: 'Customer return — mislabeled', created_at: daysAgo(8), products: { name: products[4].name } },
]

// --- TRANSACTIONS ---
export const transactions = [
  { id: uuid(), type: 'income', category: 'Sale', amount: 124.90, description: 'Sweet Bites Bakery — weekly order', transaction_date: daysAgo(2), created_at: daysAgo(2) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 64.95, description: 'Café Aroma order', transaction_date: daysAgo(3), created_at: daysAgo(3) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 244.80, description: 'Bella Cucina bulk order', transaction_date: daysAgo(5), created_at: daysAgo(5) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 189.95, description: 'The Pastry Corner gift boxes', transaction_date: daysAgo(7), created_at: daysAgo(7) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 150.88, description: 'Sweet Bites extra weekend order', transaction_date: daysAgo(9), created_at: daysAgo(9) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 93.93, description: 'Green Grocer Market', transaction_date: daysAgo(10), created_at: daysAgo(10) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 89.91, description: 'Nana\'s Ice Cream summer order', transaction_date: daysAgo(12), created_at: daysAgo(12) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 299.92, description: 'Luxe Gift Emporium bulk', transaction_date: daysAgo(14), created_at: daysAgo(14) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 177.35, description: 'Bella Cucina reorder', transaction_date: daysAgo(25), created_at: daysAgo(25) },
  { id: uuid(), type: 'income', category: 'Sale', amount: 119.97, description: 'The Pastry Corner first order', transaction_date: daysAgo(30), created_at: daysAgo(30) },
  { id: uuid(), type: 'expense', category: 'Inventory Purchase', amount: 2750.00, description: 'Sicilian pistachio bulk — 50kg', transaction_date: daysAgo(28), created_at: daysAgo(28) },
  { id: uuid(), type: 'expense', category: 'Inventory Purchase', amount: 1200.00, description: 'Tubs and packaging — 2000 units', transaction_date: daysAgo(28), created_at: daysAgo(28) },
  { id: uuid(), type: 'expense', category: 'Shipping', amount: 320.00, description: 'Metro Food delivery fees — March', transaction_date: daysAgo(5), created_at: daysAgo(5) },
  { id: uuid(), type: 'expense', category: 'Rent', amount: 1800.00, description: 'Kitchen space rental — March', transaction_date: daysAgo(1), created_at: daysAgo(1) },
  { id: uuid(), type: 'expense', category: 'Utilities', amount: 245.00, description: 'Electricity and water — March', transaction_date: daysAgo(1), created_at: daysAgo(1) },
  { id: uuid(), type: 'expense', category: 'Marketing', amount: 450.00, description: 'Instagram campaign — pistachio cream launch', transaction_date: daysAgo(15), created_at: daysAgo(15) },
  { id: uuid(), type: 'expense', category: 'Salary', amount: 3200.00, description: 'Production staff — March', transaction_date: daysAgo(1), created_at: daysAgo(1) },
  { id: uuid(), type: 'expense', category: 'Inventory Purchase', amount: 850.00, description: 'Chocolate and cocoa supply', transaction_date: daysAgo(20), created_at: daysAgo(20) },
]

// --- PURCHASE ORDERS ---
const poIds = Array.from({ length: 6 }, () => uuid())

export const purchase_orders = [
  {
    id: poIds[0], po_number: 'PO-001', distributor_id: distributors[0].id,
    po_date: daysAgo(90), expected_delivery: daysAgo(85), status: 'received',
    total_cost: 4150.00, notes: 'Initial stock order — classic and 500g tubs',
    created_at: daysAgo(90), clients: { name: distributors[0].name }
  },
  {
    id: poIds[1], po_number: 'PO-002', distributor_id: distributors[1].id,
    po_date: daysAgo(75), expected_delivery: daysAgo(72), status: 'received',
    total_cost: 3410.00, notes: 'Dark and white chocolate cream stock',
    created_at: daysAgo(75), clients: { name: distributors[1].name }
  },
  {
    id: poIds[2], po_number: 'PO-003', distributor_id: distributors[0].id,
    po_date: daysAgo(40), expected_delivery: daysAgo(37), status: 'received',
    total_cost: 1900.00, notes: 'Spread restock',
    created_at: daysAgo(40), clients: { name: distributors[0].name }
  },
  {
    id: poIds[3], po_number: 'PO-004', distributor_id: distributors[2].id,
    po_date: daysAgo(30), expected_delivery: daysAgo(27), status: 'received',
    total_cost: 590.00, notes: 'Salted cream initial order',
    created_at: daysAgo(30), clients: { name: distributors[2].name }
  },
  {
    id: poIds[4], po_number: 'PO-005', distributor_id: distributors[0].id,
    po_date: daysAgo(10), expected_delivery: daysAgo(7), status: 'received',
    total_cost: 1100.00, notes: 'Classic cream restock',
    created_at: daysAgo(10), clients: { name: distributors[0].name }
  },
  {
    id: poIds[5], po_number: 'PO-006', distributor_id: distributors[3].id,
    po_date: daysAgo(3), expected_delivery: daysAgo(-4), status: 'shipped',
    total_cost: 2480.00, notes: 'Monthly restock — multiple SKUs',
    created_at: daysAgo(3), clients: { name: distributors[3].name }
  },
]

export const purchase_order_items = [
  { id: uuid(), purchase_order_id: poIds[0], product_id: products[0].id, quantity: 500, unit_cost: 5.50, line_total: 2750.00, created_at: daysAgo(90), products: { name: products[0].name } },
  { id: uuid(), purchase_order_id: poIds[0], product_id: products[1].id, quantity: 250, unit_cost: 9.80, line_total: 2450.00, created_at: daysAgo(90), products: { name: products[1].name } },
  { id: uuid(), purchase_order_id: poIds[1], product_id: products[2].id, quantity: 300, unit_cost: 6.20, line_total: 1860.00, created_at: daysAgo(75), products: { name: products[2].name } },
  { id: uuid(), purchase_order_id: poIds[1], product_id: products[3].id, quantity: 250, unit_cost: 6.20, line_total: 1550.00, created_at: daysAgo(75), products: { name: products[3].name } },
  { id: uuid(), purchase_order_id: poIds[2], product_id: products[6].id, quantity: 500, unit_cost: 3.80, line_total: 1900.00, created_at: daysAgo(40), products: { name: products[6].name } },
  { id: uuid(), purchase_order_id: poIds[3], product_id: products[7].id, quantity: 100, unit_cost: 5.90, line_total: 590.00, created_at: daysAgo(30), products: { name: products[7].name } },
  { id: uuid(), purchase_order_id: poIds[4], product_id: products[0].id, quantity: 200, unit_cost: 5.50, line_total: 1100.00, created_at: daysAgo(10), products: { name: products[0].name } },
  { id: uuid(), purchase_order_id: poIds[5], product_id: products[0].id, quantity: 200, unit_cost: 5.50, line_total: 1100.00, created_at: daysAgo(3), products: { name: products[0].name } },
  { id: uuid(), purchase_order_id: poIds[5], product_id: products[2].id, quantity: 100, unit_cost: 6.20, line_total: 620.00, created_at: daysAgo(3), products: { name: products[2].name } },
  { id: uuid(), purchase_order_id: poIds[5], product_id: products[8].id, quantity: 80, unit_cost: 6.50, line_total: 520.00, created_at: daysAgo(3), products: { name: products[8].name } },
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
    invoice_date: daysAgo(2), due_date: daysAgo(-28), amount: 124.90,
    status: 'paid', payment_terms: 'Net 30', notes: '',
    created_at: daysAgo(2), clients: { name: clients[0].name }
  },
  {
    id: uuid(), invoice_number: 'INV-002', sale_id: saleIds[1], client_id: clients[1].id,
    invoice_date: daysAgo(3), due_date: daysAgo(-27), amount: 64.95,
    status: 'paid', payment_terms: 'Net 30', notes: '',
    created_at: daysAgo(3), clients: { name: clients[1].name }
  },
  {
    id: uuid(), invoice_number: 'INV-003', sale_id: saleIds[2], client_id: clients[4].id,
    invoice_date: daysAgo(5), due_date: daysAgo(-25), amount: 244.80,
    status: 'paid', payment_terms: 'Net 30', notes: 'Bulk order discount applied',
    created_at: daysAgo(5), clients: { name: clients[4].name }
  },
  {
    id: uuid(), invoice_number: 'INV-004', sale_id: saleIds[3], client_id: clients[2].id,
    invoice_date: daysAgo(7), due_date: daysAgo(-23), amount: 189.95,
    status: 'sent', payment_terms: 'Net 30', notes: 'Corporate event order',
    created_at: daysAgo(7), clients: { name: clients[2].name }
  },
  {
    id: uuid(), invoice_number: 'INV-005', sale_id: saleIds[7], client_id: clients[6].id,
    invoice_date: daysAgo(14), due_date: daysAgo(-1), amount: 299.92,
    status: 'overdue', payment_terms: 'Net 15', notes: 'Premium client — follow up',
    created_at: daysAgo(14), clients: { name: clients[6].name }
  },
  {
    id: uuid(), invoice_number: 'INV-006', sale_id: saleIds[8], client_id: clients[1].id,
    invoice_date: daysAgo(1), due_date: daysFromNow(29), amount: 44.97,
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
    return_date: daysAgo(8), reason: 'Damaged', refund_amount: 31.98,
    status: 'completed', notes: 'Two tubs arrived with broken seals',
    created_at: daysAgo(8), clients: { name: clients[3].name },
    sales: { id: saleIds[4] }
  },
  {
    id: returnIds[1], return_number: 'RET-002', sale_id: saleIds[6], client_id: clients[5].id,
    return_date: daysAgo(4), reason: 'Quality Issue', refund_amount: 45.98,
    status: 'approved', notes: 'Customer reported off-taste in 500g tubs',
    created_at: daysAgo(4), clients: { name: clients[5].name },
    sales: { id: saleIds[6] }
  },
  {
    id: returnIds[2], return_number: 'RET-003', sale_id: saleIds[5], client_id: clients[0].id,
    return_date: daysAgo(1), reason: 'Wrong Product', refund_amount: 17.98,
    status: 'pending', notes: 'Received spread instead of classic cream',
    created_at: daysAgo(1), clients: { name: clients[0].name },
    sales: { id: saleIds[5] }
  },
]

export const return_items = [
  { id: uuid(), return_id: returnIds[0], product_id: products[4].id, quantity: 2, unit_price: 15.99, total: 31.98, created_at: daysAgo(8), products: { name: products[4].name } },
  { id: uuid(), return_id: returnIds[1], product_id: products[1].id, quantity: 2, unit_price: 22.99, total: 45.98, created_at: daysAgo(4), products: { name: products[1].name } },
  { id: uuid(), return_id: returnIds[2], product_id: products[6].id, quantity: 2, unit_price: 8.99, total: 17.98, created_at: daysAgo(1), products: { name: products[6].name } },
]

// --- ACTIVITY LOG ---
export const activity_log = [
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Product', entity_name: 'Classic Pistachio Cream', details: 'Added new product SKU CAV-CPC-250', created_at: daysAgo(90) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Product', entity_name: 'Classic Pistachio Cream (500g)', details: 'Added new product SKU CAV-CPC-500', created_at: daysAgo(90) },
  { id: uuid(), user_email: 'admin@cavella.com', user_name: 'Admin', action: 'created', entity_type: 'Client', entity_name: 'Sweet Bites Bakery', details: 'New client registered', created_at: daysAgo(80) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Purchase Order', entity_name: 'PO-001', details: 'Created PO for Metro Food Distributors — $4,150', created_at: daysAgo(90) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'updated', entity_type: 'Purchase Order', entity_name: 'PO-001', details: 'Status changed to Received', created_at: daysAgo(85) },
  { id: uuid(), user_email: 'admin@cavella.com', user_name: 'Admin', action: 'created', entity_type: 'Distributor', entity_name: 'Metro Food Distributors', details: 'New distributor added — NJ/NY area', created_at: daysAgo(85) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Batch', entity_name: 'BATCH-001', details: 'Production batch: 500 units of Classic Pistachio Cream', created_at: daysAgo(90) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Sale', entity_name: 'Sale #1', details: 'Sale to Sweet Bites Bakery — $124.90', created_at: daysAgo(2) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Sale', entity_name: 'Sale #2', details: 'Sale to Café Aroma — $64.95', created_at: daysAgo(3) },
  { id: uuid(), user_email: 'admin@cavella.com', user_name: 'Admin', action: 'created', entity_type: 'Sale', entity_name: 'Sale #3', details: 'Bulk order: Bella Cucina Restaurant — $244.80', created_at: daysAgo(5) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Invoice', entity_name: 'INV-001', details: 'Invoice generated for Sweet Bites Bakery', created_at: daysAgo(2) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'updated', entity_type: 'Invoice', entity_name: 'INV-001', details: 'Marked as Paid', created_at: daysAgo(1) },
  { id: uuid(), user_email: 'admin@cavella.com', user_name: 'Admin', action: 'created', entity_type: 'Return', entity_name: 'RET-001', details: 'Return from Green Grocer Market — 2 damaged tubs', created_at: daysAgo(8) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'updated', entity_type: 'Return', entity_name: 'RET-001', details: 'Status changed to Completed, refund issued $31.98', created_at: daysAgo(7) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'updated', entity_type: 'Product', entity_name: 'Vegan Pistachio Cream', details: 'Stock adjusted: removed 2 damaged tubs', created_at: daysAgo(10) },
  { id: uuid(), user_email: 'admin@cavella.com', user_name: 'Admin', action: 'created', entity_type: 'Client', entity_name: 'Luxe Gift Emporium', details: 'Premium gift box client added', created_at: daysAgo(20) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Purchase Order', entity_name: 'PO-006', details: 'Monthly restock order — $2,480', created_at: daysAgo(3) },
  { id: uuid(), user_email: 'admin@cavella.com', user_name: 'Admin', action: 'deleted', entity_type: 'Product', entity_name: 'Test Product', details: 'Removed test product from catalog', created_at: daysAgo(50) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'updated', entity_type: 'Batch', entity_name: 'BATCH-008', details: 'Batch marked as expired — needs disposal', created_at: daysAgo(5) },
  { id: uuid(), user_email: 'demo@cavella.com', user_name: 'Demo User', action: 'created', entity_type: 'Batch', entity_name: 'BATCH-010', details: 'New production: 200 units Classic Pistachio Cream', created_at: daysAgo(7) },
]

// --- NOTIFICATIONS ---
export const notifications = [
  { id: uuid(), type: 'low_stock', title: 'Low Stock: Vegan Pistachio Cream', message: 'Only 8 units remaining (minimum: 25). Reorder needed.', read: false, created_at: daysAgo(0) },
  { id: uuid(), type: 'low_stock', title: 'Low Stock: Honey Pistachio Cream', message: 'Only 12 units remaining (minimum: 30). Consider restocking.', read: false, created_at: daysAgo(0) },
  { id: uuid(), type: 'low_stock', title: 'Low Stock: Salted Pistachio Cream', message: 'Only 18 units remaining (minimum: 35). Running low.', read: false, created_at: daysAgo(1) },
  { id: uuid(), type: 'expiry', title: 'Batch Expiring: BATCH-008', message: 'Vegan Pistachio Cream batch has expired. Dispose of remaining units.', read: false, created_at: daysAgo(5) },
  { id: uuid(), type: 'expiry', title: 'Batch Expiring Soon: BATCH-006', message: 'Salted Pistachio Cream expires in 15 days. Prioritize for sales.', read: true, created_at: daysAgo(3) },
  { id: uuid(), type: 'order', title: 'PO-006 Shipped', message: 'Purchase order from Capital Region Foods has been shipped. Expected delivery in 4 days.', read: true, created_at: daysAgo(2) },
  { id: uuid(), type: 'order', title: 'Invoice INV-005 Overdue', message: 'Invoice for Luxe Gift Emporium ($299.92) is past due. Follow up required.', read: false, created_at: daysAgo(1) },
  { id: uuid(), type: 'order', title: 'New Return Request: RET-003', message: 'Sweet Bites Bakery submitted a return request. Review and approve.', read: false, created_at: daysAgo(1) },
  { id: uuid(), type: 'system', title: 'Welcome to Cavella', message: 'Your management system is ready. Start by reviewing your inventory and pending orders.', read: true, created_at: daysAgo(90) },
  { id: uuid(), type: 'system', title: 'Monthly Report Available', message: 'Your February sales report is ready for review in Reports.', read: true, created_at: daysAgo(19) },
]
