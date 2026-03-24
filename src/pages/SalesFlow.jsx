import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, DollarSign, ShoppingCart, Award } from 'lucide-react'
import StatCard from '../components/StatCard'

export default function SalesFlow() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [dailyRevenue, setDailyRevenue] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [statusData, setStatusData] = useState([])
  const [topClients, setTopClients] = useState([])
  const [stats, setStats] = useState({
    totalCount: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    topProduct: 'N/A',
  })

  useEffect(() => {
    fetchSalesData()
  }, [])

  async function fetchSalesData() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*, clients(name), sale_items(*, products(name))')
        .order('sale_date', { ascending: false })

      if (error) {
        console.error('Error fetching sales:', error)
        return
      }

      if (!data) return

      setSales(data)
      processData(data)
    } catch (err) {
      console.error('Error fetching sales data:', err)
    } finally {
      setLoading(false)
    }
  }

  function processData(data) {
    // Summary stats
    const totalCount = data.length
    const totalRevenue = data.reduce((sum, sale) => sum + (sale.total_net || 0), 0)
    const avgOrderValue = totalCount > 0 ? totalRevenue / totalCount : 0

    // Top product by revenue across all sale items
    const productRevenueMap = {}
    data.forEach(sale => {
      (sale.sale_items || []).forEach(item => {
        const name = item.products?.name || 'Unknown'
        if (!productRevenueMap[name]) {
          productRevenueMap[name] = 0
        }
        productRevenueMap[name] += (item.quantity || 0) * (item.unit_price || 0)
      })
    })

    const sortedProducts = Object.entries(productRevenueMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)

    const topProduct = sortedProducts.length > 0 ? sortedProducts[0].name : 'N/A'

    setStats({ totalCount, totalRevenue, avgOrderValue, topProduct })

    // Daily revenue for last 30 days
    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const dailyMap = {}
    // Initialize all 30 days with 0
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0]
      dailyMap[key] = { date: key, revenue: 0 }
    }

    data.forEach(sale => {
      const saleDate = sale.sale_date ? sale.sale_date.split('T')[0] : null
      if (saleDate && dailyMap[saleDate]) {
        dailyMap[saleDate].revenue += sale.total_net || 0
      }
    })

    const dailyRevenueData = Object.values(dailyMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({
        date: new Date(d.date + 'T00:00:00').toLocaleDateString(),
        revenue: d.revenue,
      }))

    setDailyRevenue(dailyRevenueData)

    // Top 10 products by revenue
    setTopProducts(sortedProducts.slice(0, 10))

    // Sales grouped by status
    const statusMap = {}
    data.forEach(sale => {
      const status = sale.status || 'Unknown'
      if (!statusMap[status]) {
        statusMap[status] = { status, count: 0, totalRevenue: 0 }
      }
      statusMap[status].count += 1
      statusMap[status].totalRevenue += sale.total_net || 0
    })

    setStatusData(Object.values(statusMap))

    // Top 5 clients by purchase amount
    const clientMap = {}
    data.forEach(sale => {
      const clientName = sale.clients?.name || 'Walk-in'
      if (!clientMap[clientName]) {
        clientMap[clientName] = { name: clientName, totalSpent: 0, orderCount: 0 }
      }
      clientMap[clientName].totalSpent += sale.total_net || 0
      clientMap[clientName].orderCount += 1
    })

    const sortedClients = Object.values(clientMap)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)

    setTopClients(sortedClients)
  }

  function formatMoney(value) {
    return `₱${(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const statusColumns = [
    {
      header: 'Status',
      accessor: 'status',
    },
    {
      header: 'Count',
      accessor: 'count',
    },
    {
      header: 'Total Revenue',
      accessor: 'totalRevenue',
      render: (row) => formatMoney(row.totalRevenue),
    },
  ]

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading sales flow data...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Sales Flow</h1>

      <div className="stats-grid">
        <StatCard
          title="Total Sales Count"
          value={stats.totalCount.toLocaleString()}
          icon={ShoppingCart}
          color="#059669"
        />
        <StatCard
          title="Total Revenue"
          value={formatMoney(stats.totalRevenue)}
          icon={DollarSign}
          color="#10b981"
        />
        <StatCard
          title="Average Order Value"
          value={formatMoney(stats.avgOrderValue)}
          icon={TrendingUp}
          color="#059669"
        />
        <StatCard
          title="Top Product"
          value={stats.topProduct}
          icon={Award}
          color="#10b981"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2 className="chart-title">Daily Sales Revenue (Last 30 Days)</h2>
          {dailyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tickFormatter={(val) => `₱${val.toLocaleString()}`} />
                <Tooltip
                  formatter={(value) => [formatMoney(value), 'Revenue']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={false}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No daily revenue data available</p>
          )}
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Top 10 Products by Revenue</h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tickFormatter={(val) => `₱${val.toLocaleString()}`} />
                <Tooltip
                  formatter={(value) => [formatMoney(value), 'Revenue']}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No product data available</p>
          )}
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2 className="section-title">Sales by Status</h2>
          <DataTable
            columns={statusColumns}
            data={statusData}
            searchable={false}
            pageSize={10}
          />
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Top 5 Clients by Purchase Amount</h2>
          {topClients.length > 0 ? (
            <ul className="low-stock-list">
              {topClients.map((client, index) => (
                <li key={client.name} className="low-stock-item">
                  <div className="low-stock-info">
                    <Award size={16} color="#059669" />
                    <span className="low-stock-name">
                      #{index + 1} {client.name}
                    </span>
                    <span className="low-stock-category">
                      {client.orderCount} order{client.orderCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="low-stock-quantities">
                    <span className="low-stock-current" style={{ color: '#10b981', fontWeight: 600 }}>
                      {formatMoney(client.totalSpent)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="chart-empty">No client data available</p>
          )}
        </div>
      </div>
    </div>
  )
}
