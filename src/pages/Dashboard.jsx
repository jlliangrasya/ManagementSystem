import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Package, Users, ShoppingCart, AlertTriangle, Calendar, DollarSign, TrendingUp } from 'lucide-react'

const COLORS = ['#065f46', '#D4AF37', '#10b981', '#C49B2D', '#059669', '#BFA14A']

function getDefaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState(getDefaultRange())
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalClients: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    netProfit: 0,
  })
  const [monthlySales, setMonthlySales] = useState([])
  const [categorySales, setCategorySales] = useState([])
  const [recentSales, setRecentSales] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [topClients, setTopClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      await Promise.all([
        fetchStats(),
        fetchMonthlySales(),
        fetchCategorySales(),
        fetchRecentSales(),
        fetchLowStockItems(),
        fetchTopClients(),
      ])
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats() {
    const [productsRes, clientsRes, salesRes, transactionsRes] = await Promise.all([
      supabase.from('products').select('id, stock_quantity, min_stock_level'),
      supabase.from('clients').select('id').eq('type', 'client'),
      supabase.from('sales').select('id, total_net, sale_date, status'),
      supabase.from('transactions').select('type, amount, transaction_date'),
    ])

    const allProducts = productsRes.data || []
    const lowStockCount = allProducts.filter(p => p.stock_quantity <= p.min_stock_level).length

    const filteredSales = (salesRes.data || []).filter(s => {
      const d = s.sale_date || s.created_at
      return d >= dateRange.start && d <= dateRange.end + 'T23:59:59' && s.status !== 'cancelled'
    })

    const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.total_net || 0), 0)

    const filteredTx = (transactionsRes.data || []).filter(t => {
      const d = t.transaction_date || t.created_at
      return d >= dateRange.start && d <= dateRange.end + 'T23:59:59'
    })
    const income = filteredTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = filteredTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    setStats({
      totalProducts: allProducts.length,
      totalClients: (clientsRes.data || []).length,
      totalSales: filteredSales.length,
      totalRevenue,
      lowStockCount,
      netProfit: income - expenses,
    })
  }

  async function fetchMonthlySales() {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data } = await supabase
      .from('sales')
      .select('sale_date, total_net, status')
      .order('sale_date', { ascending: true })

    if (!data) return

    const monthlyMap = {}
    data.filter(s => s.status !== 'cancelled').forEach(sale => {
      const date = new Date(sale.sale_date)
      if (date < sixMonthsAgo) return
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = date.toLocaleString('default', { month: 'short', year: 'numeric' })
      if (!monthlyMap[key]) monthlyMap[key] = { month: label, revenue: 0 }
      monthlyMap[key].revenue += sale.total_net || 0
    })

    setMonthlySales(Object.values(monthlyMap))
  }

  async function fetchCategorySales() {
    const { data: items } = await supabase.from('sale_items').select('*')
    const { data: prods } = await supabase.from('products').select('id, category')
    if (!items || !prods) return

    const prodMap = {}
    prods.forEach(p => { prodMap[p.id] = p.category || 'Uncategorized' })

    const categoryMap = {}
    items.forEach(item => {
      const cat = prodMap[item.product_id] || 'Uncategorized'
      if (!categoryMap[cat]) categoryMap[cat] = { name: cat, value: 0 }
      categoryMap[cat].value += (item.quantity || 0) * (item.unit_price || 0)
    })

    setCategorySales(Object.values(categoryMap))
  }

  async function fetchRecentSales() {
    const { data } = await supabase
      .from('sales')
      .select('*, clients(name)')
      .order('sale_date', { ascending: false })
      .limit(5)

    if (data) setRecentSales(data)
  }

  async function fetchLowStockItems() {
    const { data } = await supabase.from('products').select('id, name, stock_quantity, min_stock_level, category')
    if (!data) return
    setLowStockItems(data.filter(p => p.stock_quantity <= p.min_stock_level))
  }

  async function fetchTopClients() {
    const { data: salesData } = await supabase.from('sales').select('client_id, total_net, status')
    const { data: clientsData } = await supabase.from('clients').select('id, name').eq('type', 'client')
    if (!salesData || !clientsData) return

    const clientMap = {}
    clientsData.forEach(c => { clientMap[c.id] = c.name })

    const totals = {}
    salesData
      .filter(s => s.status === 'completed' && s.client_id)
      .forEach(s => {
        if (!totals[s.client_id]) totals[s.client_id] = { name: clientMap[s.client_id] || 'Unknown', total: 0, orders: 0 }
        totals[s.client_id].total += s.total_net || 0
        totals[s.client_id].orders += 1
      })

    const sorted = Object.values(totals).sort((a, b) => b.total - a.total).slice(0, 5)
    setTopClients(sorted)
  }

  function handleDateChange(field, value) {
    setDateRange(prev => ({ ...prev, [field]: value }))
  }

  function setPreset(days) {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    setDateRange({
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    })
  }

  const recentSalesColumns = [
    { header: 'Date', accessor: 'sale_date', render: row => row.sale_date ? new Date(row.sale_date).toLocaleDateString() : '' },
    { header: 'Client', accessor: 'client_name', render: row => row.clients?.name || 'Walk-in' },
    { header: 'Net', accessor: 'total_net', render: row => `₱${(row.total_net || 0).toFixed(2)}` },
    { header: 'Status', accessor: 'status', render: row => (
      <span className={`badge badge-${row.status === 'completed' ? 'green' : row.status === 'pending' ? 'yellow' : 'gray'}`}>
        {row.status}
      </span>
    )},
  ]

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, margin: 0 }}>Dashboard</h1>
          <p className="page-subtitle">Welcome back to Cavella</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color="#78716c" />
          <input type="date" value={dateRange.start} onChange={e => handleDateChange('start', e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #d6d3d1', borderRadius: 6, fontSize: 13 }} />
          <span style={{ color: '#78716c' }}>to</span>
          <input type="date" value={dateRange.end} onChange={e => handleDateChange('end', e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #d6d3d1', borderRadius: 6, fontSize: 13 }} />
          <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            {[7, 30, 90].map(d => (
              <button key={d} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: 12 }}
                onClick={() => setPreset(d)}>{d}d</button>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Products" value={stats.totalProducts.toLocaleString()} icon={Package} color="#065f46" />
        <StatCard title="Total Clients" value={stats.totalClients.toLocaleString()} icon={Users} color="#D4AF37" />
        <StatCard title="Sales Revenue" value={`₱${stats.totalRevenue.toFixed(2)}`} icon={ShoppingCart} color="#059669"
          subtitle={`${stats.totalSales} orders in range`} />
        <StatCard title="Net Profit" value={`₱${stats.netProfit.toFixed(2)}`} icon={TrendingUp}
          color={stats.netProfit >= 0 ? '#10b981' : '#ef4444'} />
        <StatCard title="Low Stock Alerts" value={stats.lowStockCount.toLocaleString()} icon={AlertTriangle} color="#ef4444" />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Sales Revenue (Last 6 Months)</h3>
          {monthlySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={v => `₱${v.toLocaleString()}`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={v => [`₱${Number(v).toFixed(2)}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#065f46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="loading">No sales data available</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Sales by Category</h3>
          {categorySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categorySales} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100} dataKey="value">
                  {categorySales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => [`₱${Number(v).toFixed(2)}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="loading">No category data</p>
          )}
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Recent Sales</h3>
          <DataTable columns={recentSalesColumns} data={recentSales} searchable={false} pageSize={5} />
        </div>

        <div className="dashboard-section">
          <h3>Top Clients</h3>
          {topClients.length > 0 ? (
            <div className="top-clients-list">
              {topClients.map((client, i) => (
                <div key={i} className="top-client-item">
                  <div className="top-client-rank">{i + 1}</div>
                  <div className="top-client-info">
                    <div className="top-client-name">{client.name}</div>
                    <div className="top-client-detail">{client.orders} orders</div>
                  </div>
                  <div className="top-client-amount">${client.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="loading">No client data</p>
          )}
        </div>
      </div>

      <div className="dashboard-sections" style={{ marginTop: 18 }}>
        <div className="dashboard-section">
          <h3>Low Stock Alerts</h3>
          {lowStockItems.length > 0 ? (
            <div className="low-stock-list">
              {lowStockItems.map(item => (
                <div key={item.id} className="low-stock-item">
                  <AlertTriangle size={16} color="#ef4444" />
                  <span className="item-name">{item.name}</span>
                  <span className="item-detail">{item.stock_quantity} left (min: {item.min_stock_level})</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#10b981', fontSize: 13 }}>All products well-stocked</p>
          )}
        </div>
      </div>
    </div>
  )
}
