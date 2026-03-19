import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const TYPE_BADGES = {
  in: { label: 'In', color: '#16a34a', bg: '#16a34a15' },
  out: { label: 'Out', color: '#dc2626', bg: '#dc262615' },
  adjustment: { label: 'Adjustment', color: '#ca8a04', bg: '#ca8a0415' },
  return: { label: 'Return', color: '#2563eb', bg: '#2563eb15' },
}

const FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'in', label: 'In' },
  { key: 'out', label: 'Out' },
  { key: 'adjustment', label: 'Adjustments' },
  { key: 'return', label: 'Returns' },
]

function buildChartData(movements) {
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const dayMap = {}
  for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0]
    dayMap[key] = { date: key, in: 0, out: 0 }
  }

  movements.forEach(m => {
    const key = new Date(m.created_at).toISOString().split('T')[0]
    if (dayMap[key]) {
      if (m.type === 'in' || m.type === 'return') {
        dayMap[key].in += m.quantity
      } else if (m.type === 'out') {
        dayMap[key].out += m.quantity
      }
    }
  })

  return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date))
}

export default function StockFlow() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    product_id: '',
    type: 'in',
    quantity: '',
    reference: '',
    notes: '',
  })

  useEffect(() => {
    fetchMovements()
    fetchProducts()
  }, [])

  async function fetchMovements() {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*, products(name)')
      .order('created_at', { ascending: false })
    if (!error) setMovements(data || [])
    setLoading(false)
  }

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
    if (!error) setProducts(data || [])
  }

  const filteredMovements = filter === 'all'
    ? movements
    : movements.filter(m => m.type === filter)

  const totalIn = movements
    .filter(m => m.type === 'in')
    .reduce((sum, m) => sum + m.quantity, 0)

  const totalOut = movements
    .filter(m => m.type === 'out')
    .reduce((sum, m) => sum + m.quantity, 0)

  const totalAdjustments = movements
    .filter(m => m.type === 'adjustment')
    .reduce((sum, m) => sum + m.quantity, 0)

  const chartData = buildChartData(movements)

  const columns = [
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      header: 'Product',
      accessor: 'product_name',
      render: (row) => row.products?.name || 'Unknown',
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => {
        const badge = TYPE_BADGES[row.type] || TYPE_BADGES.in
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: badge.color,
              backgroundColor: badge.bg,
            }}
          >
            {badge.label}
          </span>
        )
      },
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
    },
    {
      header: 'Reference',
      accessor: 'reference',
    },
    {
      header: 'Notes',
      accessor: 'notes',
    },
  ]

  function openModal() {
    setForm({ product_id: '', type: 'in', quantity: '', reference: '', notes: '' })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    const product = products.find(p => p.id === form.product_id)
    if (!product) {
      setSaving(false)
      return
    }

    const quantity = Number(form.quantity)

    const { error: insertError } = await supabase
      .from('stock_movements')
      .insert([{
        product_id: form.product_id,
        type: form.type,
        quantity,
        reference: form.reference,
        notes: form.notes,
      }])

    if (insertError) {
      setSaving(false)
      return
    }

    let newQty = product.stock_quantity
    if (form.type === 'in' || form.type === 'return') {
      newQty += quantity
    } else if (form.type === 'out') {
      newQty -= quantity
    } else if (form.type === 'adjustment') {
      newQty = quantity
    }

    await supabase
      .from('products')
      .update({ stock_quantity: newQty })
      .eq('id', form.product_id)

    setSaving(false)
    setShowModal(false)
    fetchMovements()
    fetchProducts()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Stock Flow</h1>
        <button className="btn btn-primary" onClick={openModal}>
          <Plus size={18} />
          Record Movement
        </button>
      </div>

      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#16a34a15', color: '#16a34a' }}>
            <ArrowDownCircle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Total In</span>
            <span className="stat-card-value">{totalIn}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#dc262615', color: '#dc2626' }}>
            <ArrowUpCircle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Total Out</span>
            <span className="stat-card-value">{totalOut}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#ca8a0415', color: '#ca8a04' }}>
            <RefreshCw size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Total Adjustments</span>
            <span className="stat-card-value">{totalAdjustments}</span>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--card-bg, #fff)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-color, #e5e7eb)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Movements Over Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(val) => {
                const d = new Date(val + 'T00:00:00')
                return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              }}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip
              labelFormatter={(val) => new Date(val + 'T00:00:00').toLocaleDateString()}
            />
            <Legend />
            <Line type="monotone" dataKey="in" stroke="#16a34a" strokeWidth={2} name="In" dot={false} />
            <Line type="monotone" dataKey="out" stroke="#dc2626" strokeWidth={2} name="Out" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.key}
            className={`btn ${filter === opt.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading stock movements...</p>
      ) : (
        <DataTable columns={columns} data={filteredMovements} />
      )}

      {showModal && (
        <Modal title="Record Movement" onClose={closeModal}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Product</label>
              <select
                value={form.product_id}
                onChange={e => setForm({ ...form, product_id: e.target.value })}
                required
              >
                <option value="">Select a product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                required
              >
                <option value="in">In</option>
                <option value="out">Out</option>
                <option value="adjustment">Adjustment</option>
                <option value="return">Return</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                min="0"
                required
                placeholder="Enter quantity"
              />
            </div>

            <div className="form-group">
              <label>Reference</label>
              <input
                type="text"
                value={form.reference}
                onChange={e => setForm({ ...form, reference: e.target.value })}
                placeholder="e.g. PO-12345"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional notes"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Movement'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
