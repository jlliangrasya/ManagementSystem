import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatCard from '../components/StatCard'
import { Plus, Trash2, Layers, AlertTriangle, Calendar, CheckCircle } from 'lucide-react'

const FILTERS = ['All', 'Active', 'Expiring Soon', 'Expired']

function getBatchStatus(batch) {
  if (batch.quality_status === 'failed') return { label: 'Quality Failed', color: 'red' }
  const now = new Date()
  const expiry = new Date(batch.expiry_date)
  const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  if (daysLeft < 0) return { label: 'Expired', color: 'red' }
  if (daysLeft <= 30) return { label: 'Expiring Soon', color: 'yellow' }
  return { label: 'Active', color: 'green' }
}

function getDaysUntilExpiry(expiryDate) {
  const now = new Date()
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
}

export default function BatchTracking() {
  const [batches, setBatches] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('All')

  const [form, setForm] = useState({
    batch_number: '', product_id: '', quantity: '', production_date: new Date().toISOString().slice(0, 10),
    expiry_date: '', storage_location: '', quality_status: 'pending', notes: '',
  })

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [batchRes, prodRes] = await Promise.all([
      supabase.from('batches').select('*, products(name)').order('created_at', { ascending: false }),
      supabase.from('products').select('id, name').order('name'),
    ])
    setBatches(batchRes.data || [])
    setProducts(prodRes.data || [])
    setLoading(false)
  }

  const enriched = batches.map(b => ({ ...b, _status: getBatchStatus(b), _daysLeft: getDaysUntilExpiry(b.expiry_date) }))
  const active = enriched.filter(b => b._status.label === 'Active').length
  const expiringSoon = enriched.filter(b => b._status.label === 'Expiring Soon').length
  const expired = enriched.filter(b => b._status.label === 'Expired' || b._status.label === 'Quality Failed').length

  const filtered = filter === 'All' ? enriched
    : filter === 'Active' ? enriched.filter(b => b._status.label === 'Active')
    : filter === 'Expiring Soon' ? enriched.filter(b => b._status.label === 'Expiring Soon')
    : enriched.filter(b => b._status.label === 'Expired' || b._status.label === 'Quality Failed')

  const nextBatch = `BATCH-${String(batches.length + 1).padStart(3, '0')}`

  function openNew() {
    setEditing(null)
    setForm({ batch_number: nextBatch, product_id: '', quantity: '', production_date: new Date().toISOString().slice(0, 10), expiry_date: '', storage_location: '', quality_status: 'pending', notes: '' })
    setModalOpen(true)
  }

  function openEdit(b) {
    setEditing(b)
    setForm({
      batch_number: b.batch_number || '', product_id: b.product_id || '', quantity: b.quantity || '',
      production_date: b.production_date?.slice(0, 10) || '', expiry_date: b.expiry_date?.slice(0, 10) || '',
      storage_location: b.storage_location || '', quality_status: b.quality_status || 'pending', notes: b.notes || '',
    })
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditing(null) }

  async function handleSave() {
    setSaving(true)
    try {
      const record = {
        batch_number: form.batch_number, product_id: form.product_id || null,
        quantity: Number(form.quantity) || 0, production_date: form.production_date,
        expiry_date: form.expiry_date, storage_location: form.storage_location,
        quality_status: form.quality_status, notes: form.notes || null,
      }

      if (editing) {
        await supabase.from('batches').update(record).eq('id', editing.id)
      } else {
        await supabase.from('batches').insert(record)
        // Create stock movement
        if (record.product_id && record.quantity > 0) {
          await supabase.from('stock_movements').insert({
            product_id: record.product_id, type: 'in', quantity: record.quantity,
            reference: record.batch_number, notes: `Batch ${record.batch_number} production`,
          })
        }
      }
      closeModal()
      fetchAll()
    } catch (err) { alert('Error: ' + err.message) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!editing || !confirm('Delete this batch?')) return
    await supabase.from('batches').delete().eq('id', editing.id)
    closeModal()
    fetchAll()
  }

  const columns = [
    { header: 'Batch #', accessor: 'batch_number', render: r => <span style={{ fontWeight: 600 }}>{r.batch_number}</span> },
    { header: 'Product', accessor: 'product', render: r => r.products?.name || '—' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Production', accessor: 'production_date', render: r => r.production_date ? new Date(r.production_date).toLocaleDateString() : '—' },
    { header: 'Expiry', accessor: 'expiry_date', render: r => r.expiry_date ? new Date(r.expiry_date).toLocaleDateString() : '—' },
    {
      header: 'Days Left', accessor: '_daysLeft',
      render: r => {
        const d = r._daysLeft
        const color = d < 0 ? '#ef4444' : d <= 30 ? '#d97706' : '#059669'
        return <span style={{ fontWeight: 700, color }}>{d < 0 ? `Expired ${Math.abs(d)}d ago` : `${d} days`}</span>
      }
    },
    { header: 'QC', accessor: 'quality_status', render: r => <span className={`badge badge-${r.quality_status === 'passed' ? 'green' : r.quality_status === 'failed' ? 'red' : 'yellow'}`}>{r.quality_status}</span> },
    { header: 'Status', accessor: '_status', render: r => <span className={`badge badge-${r._status.color}`}>{r._status.label}</span> },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Batch Tracking</h1>
          <p className="page-subtitle">Food safety and production tracking</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> New Batch</button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Batches" value={batches.length} icon={Layers} color="#065f46" />
        <StatCard title="Active" value={active} icon={CheckCircle} color="#10b981" />
        <StatCard title="Expiring Soon" value={expiringSoon} icon={Calendar} color="#D4AF37" subtitle="within 30 days" />
        <StatCard title="Expired" value={expired} icon={AlertTriangle} color="#ef4444" />
      </div>

      <div className="filter-buttons">
        {FILTERS.map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {loading ? <p className="loading">Loading...</p> : <DataTable columns={columns} data={filtered} onRowClick={openEdit} />}

      {modalOpen && (
        <Modal title={editing ? `Edit ${editing.batch_number}` : 'New Batch'} onClose={closeModal}>
          <div className="form-row">
            <div className="form-group">
              <label>Batch Number</label>
              <input type="text" value={form.batch_number} onChange={e => setForm({ ...form, batch_number: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Product</label>
              <select value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} required>
                <option value="">Select product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantity Produced</label>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Quality Check</label>
              <select value={form.quality_status} onChange={e => setForm({ ...form, quality_status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Production Date</label>
              <input type="date" value={form.production_date} onChange={e => setForm({ ...form, production_date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Storage Location</label>
            <input type="text" value={form.storage_location} onChange={e => setForm({ ...form, storage_location: e.target.value })} placeholder="e.g. Warehouse A — Shelf 1" />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
          </div>
          <div className="modal-actions">
            {editing && <button className="btn btn-danger" onClick={handleDelete} type="button"><Trash2 size={16} /> Delete</button>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={closeModal} type="button">Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create Batch'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
