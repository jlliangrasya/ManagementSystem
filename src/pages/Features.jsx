import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck,
  ArrowLeftRight, TrendingUp, DollarSign, FileText, Bell,
  Layers, RotateCcw, BarChart3, Activity, Shield, ClipboardList,
  Calendar, Map, Printer, Download, Search, CheckCircle
} from 'lucide-react'

const FEATURES = [
  {
    category: 'Dashboard & Overview',
    icon: LayoutDashboard,
    color: '#065f46',
    description: 'Get a complete view of your business performance at a glance.',
    items: [
      { title: 'Live Dashboard', desc: 'See your total products, active clients, revenue, and profit the moment you open the app.' },
      { title: 'Date Range Picker', desc: 'Filter your dashboard by any date range — last 7 days, 30 days, 90 days, or pick custom dates.' },
      { title: 'Revenue Charts', desc: 'Visual bar charts and pie charts show your monthly revenue and sales by product category.' },
      { title: 'Top Clients', desc: 'A ranked list of your highest-spending clients so you know who your best customers are.' },
      { title: 'Low Stock Alerts', desc: 'Immediately see which products are running low and need restocking.' },
    ]
  },
  {
    category: 'Inventory & Products',
    icon: Package,
    color: '#059669',
    description: 'Keep track of every product, its stock level, pricing, and category.',
    items: [
      { title: 'Product Catalog', desc: 'Add, edit, or remove products with full details — name, SKU, category, pricing, and stock levels.' },
      { title: 'Stock Levels', desc: 'See current stock quantities at a glance. Products below minimum levels are highlighted in red.' },
      { title: 'Cost & Pricing', desc: 'Track both your cost price and selling price to understand your margins on each product.' },
      { title: 'Categories', desc: 'Organize products into categories like Pistachio Cream, Spreads, Gift Sets, and more.' },
      { title: 'Stock Flow Tracking', desc: 'A dedicated page showing every stock movement — incoming, outgoing, returns, and adjustments.' },
    ]
  },
  {
    category: 'Sales & Orders',
    icon: ShoppingCart,
    color: '#D4AF37',
    description: 'Create sales, track order status, and see your complete sales history.',
    items: [
      { title: 'Create Sales Orders', desc: 'Build a sale with line items — pick products, set quantities, apply discounts and tax.' },
      { title: 'Client Linking', desc: 'Attach each sale to a client so you can track who bought what and when.' },
      { title: 'Order Status', desc: 'Mark sales as pending, completed, cancelled, or refunded. Filter by status anytime.' },
      { title: 'Gross & Net Tracking', desc: 'Automatically calculates subtotal, gross (with tax), and net (after discount) for every sale.' },
      { title: 'Sales Flow Analytics', desc: 'A dedicated page with daily revenue trends, top products, and client purchase rankings.' },
    ]
  },
  {
    category: 'Clients & Distributors',
    icon: Users,
    color: '#10b981',
    description: 'Manage your customer relationships and distribution network.',
    items: [
      { title: 'Client Directory', desc: 'Store contact details, addresses, and notes for every client. Search and filter easily.' },
      { title: 'Purchase History', desc: 'Click any client to see all their past orders, total spending, average order value, and top products.' },
      { title: 'Distributor Directory', desc: 'Track your distributors with full contact info, addresses, and performance notes.' },
      { title: 'Interactive Map', desc: 'See all your distributors pinned on a map. Identify coverage gaps or overlapping territories.' },
      { title: 'Distributor Performance', desc: 'View each distributor\'s purchase order history, total value, and delivery track record.' },
    ]
  },
  {
    category: 'Purchase Orders',
    icon: ClipboardList,
    color: '#065f46',
    description: 'Manage orders to your suppliers and track deliveries.',
    items: [
      { title: 'Create Purchase Orders', desc: 'Build POs with line items for your distributors. Auto-fills cost prices from your product catalog.' },
      { title: 'Order Status Tracking', desc: 'Track POs through their lifecycle — Draft, Ordered, Shipped, Received, or Cancelled.' },
      { title: 'Automatic Stock-In', desc: 'When you mark a PO as "Received", stock levels are automatically updated for each product.' },
      { title: 'Open Value Summary', desc: 'See total value of all pending orders at a glance on the stats cards.' },
    ]
  },
  {
    category: 'Invoicing',
    icon: FileText,
    color: '#C49B2D',
    description: 'Generate professional invoices and track payments.',
    items: [
      { title: 'Generate from Sales', desc: 'Create an invoice from any completed sale with one click. All details are pre-filled.' },
      { title: 'Professional Invoice Layout', desc: 'Branded invoice with Cavella header, gold accents, itemized table, and totals breakdown.' },
      { title: 'Print or Save as PDF', desc: 'Print invoices directly from the browser or save as PDF for emailing to clients.' },
      { title: 'Payment Tracking', desc: 'Track invoice status — Draft, Sent, Paid, or Overdue. Mark invoices as paid with one click.' },
      { title: 'Payment Terms', desc: 'Set payment terms per invoice — Due on Receipt, Net 15, Net 30, or Net 60.' },
    ]
  },
  {
    category: 'Financial Management',
    icon: DollarSign,
    color: '#059669',
    description: 'Track all income and expenses to understand your cash position.',
    items: [
      { title: 'Cash Flow Dashboard', desc: 'See total income, total expenses, and net balance with color-coded stat cards.' },
      { title: 'Income vs Expenses Chart', desc: 'Monthly bar chart comparing your income and expenses side by side over the last 6 months.' },
      { title: 'Expense Breakdown', desc: 'Pie chart showing where your money goes — inventory, salaries, rent, marketing, and more.' },
      { title: 'Transaction Logging', desc: 'Record any income or expense transaction with category, amount, date, and description.' },
      { title: 'Category Filtering', desc: 'Filter transactions by type (income/expense) to quickly find what you\'re looking for.' },
    ]
  },
  {
    category: 'Returns Management',
    icon: RotateCcw,
    color: '#ef4444',
    description: 'Handle product returns with full traceability back to the original sale.',
    items: [
      { title: 'Create Returns', desc: 'Link a return to the original sale. Select which items are being returned and the quantity.' },
      { title: 'Refund Calculation', desc: 'The system automatically calculates the refund amount based on items selected and original prices.' },
      { title: 'Status Workflow', desc: 'Track returns through Pending, Approved, Completed, or Rejected stages.' },
      { title: 'Stock Restoration', desc: 'When a return is completed, returned items are automatically added back to your inventory.' },
      { title: 'Refund Transactions', desc: 'A refund expense record is automatically created in your cash flow when a return is completed.' },
    ]
  },
  {
    category: 'Batch & Lot Tracking',
    icon: Layers,
    color: '#d97706',
    description: 'Track production batches for food safety and quality control.',
    items: [
      { title: 'Batch Records', desc: 'Log every production batch with product, quantity, production date, and expiry date.' },
      { title: 'Expiry Monitoring', desc: 'See how many days until each batch expires. Color-coded: green (safe), yellow (soon), red (expired).' },
      { title: 'Quality Control', desc: 'Mark each batch as Pending, Passed, or Failed QC inspection.' },
      { title: 'Storage Tracking', desc: 'Record where each batch is stored (e.g., Warehouse A — Shelf 1).' },
      { title: 'Automatic Alerts', desc: 'Get notified when batches are about to expire or have already expired.' },
    ]
  },
  {
    category: 'Reports & Export',
    icon: BarChart3,
    color: '#3b82f6',
    description: 'Generate detailed reports and export data for your records.',
    items: [
      { title: 'Sales Report', desc: 'Revenue by product, top clients table, and total order count for any date range.' },
      { title: 'Inventory Report', desc: 'Current stock levels, stock value by category, and which products are running low.' },
      { title: 'Financial Report', desc: 'Income vs expenses, net profit, profit margin percentage, and expense breakdown by category.' },
      { title: 'CSV Export', desc: 'Download any report as a CSV file that you can open in Excel or Google Sheets.' },
      { title: 'Date Range Filter', desc: 'All reports can be filtered by custom date ranges to focus on the period you need.' },
    ]
  },
  {
    category: 'Notifications & Alerts',
    icon: Bell,
    color: '#D4AF37',
    description: 'Stay informed about important events and actions needed.',
    items: [
      { title: 'Low Stock Alerts', desc: 'Automatic notifications when any product drops below its minimum stock level.' },
      { title: 'Expiry Alerts', desc: 'Get warned when product batches are about to expire or have already expired.' },
      { title: 'Order Notifications', desc: 'Know when purchase orders are shipped, invoices are overdue, or returns are submitted.' },
      { title: 'Mark as Read', desc: 'Click a notification to mark it as read. Or use "Mark All Read" to clear them all at once.' },
      { title: 'Filter by Type', desc: 'Filter notifications by Low Stock, Expiry, Orders, or System messages.' },
    ]
  },
  {
    category: 'Security & Administration',
    icon: Shield,
    color: '#78716c',
    description: 'Control access and maintain a full record of all system activity.',
    items: [
      { title: 'User Roles', desc: 'Four access levels — Admin (full access), Manager, Staff (limited), and Viewer (read-only).' },
      { title: 'Activity Log', desc: 'Every action (create, update, delete) is recorded with the user, timestamp, and details.' },
      { title: 'Audit Trail Filters', desc: 'Search and filter the activity log by action type, entity, date range, or keyword.' },
      { title: 'Secure Authentication', desc: 'Powered by Supabase Auth with email/password sign-in and session management.' },
    ]
  },
]

const COMING_SOON = [
  'Multi-branch support — manage multiple store locations from one dashboard',
  'Barcode scanning — scan products for faster inventory counts and sales entry',
  'SMS & email notifications — get alerts sent directly to your phone or inbox',
  'Supplier price comparison — track pricing across different distributors',
  'Customer loyalty program — reward repeat buyers with points and discounts',
  'Mobile app — access your dashboard on the go from your phone',
  'Automated reorder — set rules to auto-generate purchase orders when stock is low',
]

export default function Features() {
  return (
    <div className="page">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
        borderRadius: 16, padding: '40px 36px', marginBottom: 28, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: 80, width: 150, height: 150,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        }} />
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32,
          margin: '0 0 8px', letterSpacing: 1,
        }}>
          System Features
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: '0 0 16px', maxWidth: 600, lineHeight: 1.6 }}>
          Everything you need to manage Cavella's operations — from tracking inventory and sales
          to generating invoices and monitoring your cash flow. Built for simplicity, designed for growth.
        </p>
        <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
          <span><strong style={{ color: '#D4AF37', fontSize: 22 }}>{FEATURES.reduce((s, f) => s + f.items.length, 0)}</strong> features available</span>
          <span><strong style={{ color: '#D4AF37', fontSize: 22 }}>{FEATURES.length}</strong> categories</span>
          {/* <span><strong style={{ color: '#D4AF37', fontSize: 22 }}>{COMING_SOON.length}</strong> coming soon</span> */}
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {FEATURES.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.category} style={{
              background: 'white', borderRadius: 12, border: '1px solid #e7e5e4',
              overflow: 'hidden',
            }}>
              {/* Category Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px',
                borderBottom: '1px solid #f5f5f4',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${section.color}12`, color: section.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 18, margin: 0, color: '#1c1917',
                  }}>
                    {section.category}
                  </h2>
                  <p style={{ fontSize: 13, color: '#78716c', margin: '2px 0 0' }}>{section.description}</p>
                </div>
                <span style={{
                  marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: section.color,
                  background: `${section.color}12`, padding: '4px 12px', borderRadius: 20,
                  whiteSpace: 'nowrap',
                }}>
                  {section.items.length} features
                </span>
              </div>

              {/* Feature Items */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 1, background: '#f5f5f4',
              }}>
                {section.items.map((item) => (
                  <div key={item.title} style={{
                    padding: '16px 20px', background: 'white',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <CheckCircle size={15} color="#10b981" />
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1c1917' }}>{item.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#57534e', margin: 0, lineHeight: 1.55, paddingLeft: 23 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Coming Soon */}
      {/* <div style={{
        marginTop: 32, background: '#FBF5E5', borderRadius: 12, border: '1px solid #D4AF3730',
        padding: '28px 28px 20px',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 20, margin: '0 0 6px', color: '#1c1917',
        }}>
          Coming Soon
        </h2>
        <p style={{ fontSize: 13, color: '#78716c', margin: '0 0 16px' }}>
          We're always improving. Here's what's on the roadmap — and we're open to your suggestions!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COMING_SOON.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#44403c',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: '#D4AF3720', color: '#C49B2D', fontWeight: 700, fontSize: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i + 1}
              </span>
              <span style={{ lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Footer Note */}
      <div style={{
        textAlign: 'center', padding: '32px 0 8px', fontSize: 13, color: '#a8a29e',
      }}>
        Have a feature request? Let us know — Cavella is built to grow with your business.
      </div>
    </div>
  )
}
