import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import StatCard from '../components/StatCard'
import { Download, DollarSign, ShoppingCart, Package, TrendingUp, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'

const COLORS = ['#065f46', '#D4AF37', '#10b981', '#C49B2D', '#059669', '#BFA14A']
const TABS = ['Sales Report', 'Inventory Report', 'Financial Report']

function exportCSV(data, columns, filename) {
  const header = columns.map(c => c.header).join(',')
  const rows = data.map(row => columns.map(c => {
    const val = c.accessor ? row[c.accessor] : ''
    return typeof val === 'string' && val.includes(',') ? `"${val}"` : val
  }).join(','))
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function getDefaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }
}

export default function Reports() {
  const [tab, setTab] = useState(0)
  const [dateRange, setDateRange] = useState(getDefaultRange())
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [saleItems, setSaleItems] = useState([])
  const [transactions, setTransactions] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [dateRange])

  async function fetchData() {
    setLoading(true)
    const [prodRes, salesRes, itemsRes, txRes, clientsRes] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('sales').select('*, clients(name)').order('sale_date', { ascending: false }),
      supabase.from('sale_items').select('*'),
      supabase.from('transactions').select('*').order('transaction_date', { ascending: false }),
      supabase.from('clients').select('*').eq('type', 'client'),
    ])
    setProducts(prodRes.data || [])
    setSales(salesRes.data || [])
    setSaleItems(itemsRes.data || [])
    setTransactions(txRes.data || [])
    setClients(clientsRes.data || [])
    setLoading(false)
  }

  const inRange = (d) => d >= dateRange.start && d <= dateRange.end + 'T23:59:59'
  const filteredSales = sales.filter(s => s.status !== 'cancelled' && inRange(s.sale_date || s.created_at))
  const filteredTx = transactions.filter(t => inRange(t.transaction_date || t.created_at))

  // Sales report data
  const totalRevenue = filteredSales.reduce((s, r) => s + (r.total_net || 0), 0)
  const avgOrder = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0

  const productRevenue = {}
  saleItems.forEach(item => {
    const prod = products.find(p => p.id === item.product_id)
    const name = prod?.name || 'Unknown'
    if (!productRevenue[name]) productRevenue[name] = { name, revenue: 0 }
    productRevenue[name].revenue += item.total || (item.quantity * item.unit_price) || 0
  })
  const productChart = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
  const topProduct = productChart[0]?.name || '—'

  const clientRevenue = {}
  filteredSales.forEach(s => {
    const name = s.clients?.name || 'Walk-in'
    if (!clientRevenue[name]) clientRevenue[name] = { name, orders: 0, revenue: 0 }
    clientRevenue[name].orders++
    clientRevenue[name].revenue += s.total_net || 0
  })
  const topClients = Object.values(clientRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 10)

  // Inventory report data
  const totalStockValue = products.reduce((s, p) => s + (p.stock_quantity || 0) * (p.cost_price || 0), 0)
  const lowStockItems = products.filter(p => p.stock_quantity <= p.min_stock_level)
  const categoryStock = {}
  products.forEach(p => {
    const cat = p.category || 'Uncategorized'
    if (!categoryStock[cat]) categoryStock[cat] = { name: cat, value: 0 }
    categoryStock[cat].value += (p.stock_quantity || 0) * (p.cost_price || 0)
  })

  // Financial report data
  const income = filteredTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = filteredTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const netProfit = income - expenses
  const margin = income > 0 ? ((netProfit / income) * 100).toFixed(1) : '0.0'

  const monthlyFinancial = {}
  filteredTx.forEach(t => {
    const d = new Date(t.transaction_date)
    const key = d.toLocaleString('default', { month: 'short' })
    if (!monthlyFinancial[key]) monthlyFinancial[key] = { month: key, income: 0, expenses: 0 }
    if (t.type === 'income') monthlyFinancial[key].income += t.amount
    else monthlyFinancial[key].expenses += t.amount
  })

  const expenseByCategory = {}
  filteredTx.filter(t => t.type === 'expense').forEach(t => {
    if (!expenseByCategory[t.category]) expenseByCategory[t.category] = { name: t.category, value: 0 }
    expenseByCategory[t.category].value += t.amount
  })

  if (loading) return <div className="loading">Loading reports...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
            style={{ padding: '6px 10px', border: '1px solid #d6d3d1', borderRadius: 6, fontSize: 13 }} />
          <span style={{ color: '#78716c' }}>to</span>
          <input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
            style={{ padding: '6px 10px', border: '1px solid #d6d3d1', borderRadius: 6, fontSize: 13 }} />
        </div>
      </div>

      <div className="filter-buttons">
        {TABS.map((t, i) => (
          <button key={t} className={`btn ${tab === i ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* SALES REPORT */}
      {tab === 0 && (
        <>
          <div className="stats-grid">
            <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} color="#065f46" />
            <StatCard title="Total Orders" value={filteredSales.length} icon={ShoppingCart} color="#D4AF37" />
            <StatCard title="Avg Order Value" value={`$${avgOrder.toFixed(2)}`} icon={TrendingUp} color="#059669" />
            <StatCard title="Top Product" value={topProduct} icon={Package} color="#10b981" subtitle="by revenue" />
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Revenue by Product (Top 10)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis type="number" tickFormatter={v => `$${v}`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
                  <Bar dataKey="revenue" fill="#065f46" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Top Clients</h3>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}
                  onClick={() => exportCSV(topClients, [{ header: 'Client', accessor: 'name' }, { header: 'Orders', accessor: 'orders' }, { header: 'Revenue', accessor: 'revenue' }], 'sales-report.csv')}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <table className="data-table" style={{ width: '100%', marginTop: 12 }}>
                <thead><tr><th>#</th><th>Client</th><th>Orders</th><th>Revenue</th></tr></thead>
                <tbody>
                  {topClients.map((c, i) => (
                    <tr key={i}><td>{i + 1}</td><td>{c.name}</td><td>{c.orders}</td><td style={{ fontWeight: 600, color: '#065f46' }}>${c.revenue.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* INVENTORY REPORT */}
      {tab === 1 && (
        <>
          <div className="stats-grid">
            <StatCard title="Total Products" value={products.length} icon={Package} color="#065f46" />
            <StatCard title="Stock Value" value={`$${totalStockValue.toFixed(2)}`} icon={DollarSign} color="#D4AF37" />
            <StatCard title="Low Stock Items" value={lowStockItems.length} icon={Package} color="#ef4444" />
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Stock Value by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={Object.values(categoryStock)} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {Object.values(categoryStock).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Inventory Levels</h3>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}
                  onClick={() => exportCSV(products, [
                    { header: 'Name', accessor: 'name' }, { header: 'SKU', accessor: 'sku' },
                    { header: 'Stock', accessor: 'stock_quantity' }, { header: 'Min', accessor: 'min_stock_level' },
                    { header: 'Cost', accessor: 'cost_price' }, { header: 'Price', accessor: 'unit_price' },
                  ], 'inventory-report.csv')}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <table className="data-table" style={{ width: '100%', marginTop: 12 }}>
                <thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Value</th><th>Status</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td><td>{p.sku}</td><td>{p.stock_quantity}</td>
                      <td>${((p.stock_quantity || 0) * (p.cost_price || 0)).toFixed(2)}</td>
                      <td><span className={`badge badge-${p.stock_quantity <= p.min_stock_level ? 'red' : 'green'}`}>
                        {p.stock_quantity <= p.min_stock_level ? 'Low' : 'OK'}
                      </span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* FINANCIAL REPORT */}
      {tab === 2 && (
        <>
          <div className="stats-grid">
            <StatCard title="Total Income" value={`$${income.toFixed(2)}`} icon={TrendingUp} color="#10b981" />
            <StatCard title="Total Expenses" value={`$${expenses.toFixed(2)}`} icon={DollarSign} color="#ef4444" />
            <StatCard title="Net Profit" value={`$${netProfit.toFixed(2)}`} icon={DollarSign} color={netProfit >= 0 ? '#065f46' : '#ef4444'} />
            <StatCard title="Profit Margin" value={`${margin}%`} icon={TrendingUp} color="#D4AF37" />
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.values(monthlyFinancial)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#065f46" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Expense Breakdown</h3>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}
                  onClick={() => exportCSV(filteredTx, [
                    { header: 'Date', accessor: 'transaction_date' }, { header: 'Type', accessor: 'type' },
                    { header: 'Category', accessor: 'category' }, { header: 'Amount', accessor: 'amount' },
                    { header: 'Description', accessor: 'description' },
                  ], 'financial-report.csv')}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={Object.values(expenseByCategory)} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {Object.values(expenseByCategory).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
