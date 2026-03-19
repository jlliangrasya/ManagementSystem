import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import DistributorMap from '../components/DistributorMap'
import { Plus, Trash2, Map, List, BarChart3, ArrowLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const emptyForm = { name: '', email: '', phone: '', address: '', notes: '', latitude: '', longitude: '' }

export default function Distributors() {
  const [distributors, setDistributors] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState('map')
  const [clickPosition, setClickPosition] = useState(null)

  // Performance state
  const [perfView, setPerfView] = useState(null) // null = main view, distributor obj = perf view
  const [perfData, setPerfData] = useState({ pos: [], totalPOs: 0, totalValue: 0, avgValue: 0, receivedPOs: 0 })
  const [loadingPerf, setLoadingPerf] = useState(false)

  const fetchDistributors = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('clients').select('*').eq('type', 'distributor').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setDistributors(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchDistributors() }, [])

  async function viewPerformance(dist) {
    setPerfView(dist)
    setLoadingPerf(true)
    const { data: pos } = await supabase.from('purchase_orders').select('*, purchase_order_items(*)').eq('distributor_id', dist.id).order('po_date', { ascending: false })
    const allPOs = pos || []
    const received = allPOs.filter(p => p.status === 'received')
    const totalValue = allPOs.reduce((s, p) => s + (p.total_cost || 0), 0)

    setPerfData({
      pos: allPOs,
      totalPOs: allPOs.length,
      totalValue,
      avgValue: allPOs.length > 0 ? totalValue / allPOs.length : 0,
      receivedPOs: received.length,
    })
    setLoadingPerf(false)
  }

  const openAdd = () => { setEditing(null); setForm(emptyForm); setClickPosition(null); setError(''); setModalOpen(true) }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ name: row.name || '', email: row.email || '', phone: row.phone || '', address: row.address || '', notes: row.notes || '', latitude: row.latitude ?? '', longitude: row.longitude ?? '' })
    setClickPosition(row.latitude && row.longitude ? { lat: row.latitude, lng: row.longitude } : null)
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); setClickPosition(null); setError('') }
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleMapClick = (latlng) => { setClickPosition(latlng); setForm(prev => ({ ...prev, latitude: latlng.lat.toFixed(6), longitude: latlng.lng.toFixed(6) })) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { name: form.name, email: form.email, phone: form.phone, address: form.address, notes: form.notes, latitude: form.latitude ? parseFloat(form.latitude) : null, longitude: form.longitude ? parseFloat(form.longitude) : null }
    if (editing) {
      const { error } = await supabase.from('clients').update(payload).eq('id', editing.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('clients').insert([{ ...payload, type: 'distributor' }])
      if (error) { setError(error.message); setSaving(false); return }
    }
    setSaving(false); closeModal(); fetchDistributors()
  }

  const handleDelete = async () => {
    if (!editing || !confirm('Delete this distributor?')) return
    setSaving(true)
    const { error } = await supabase.from('clients').delete().eq('id', editing.id)
    if (error) { setError(error.message); setSaving(false); return }
    setSaving(false); closeModal(); fetchDistributors()
  }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    { header: 'Location', accessor: 'latitude', render: row => row.latitude && row.longitude ? <span className="badge badge-green">Pinned</span> : <span className="badge badge-gray">No pin</span> },
    { header: 'Date Added', accessor: 'created_at', render: row => row.created_at ? new Date(row.created_at).toLocaleDateString() : '' },
    {
      header: 'Performance',
      accessor: 'perf',
      render: row => (
        <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}
          onClick={(e) => { e.stopPropagation(); viewPerformance(row) }}>
          <BarChart3 size={14} /> View
        </button>
      )
    },
  ]

  const pinnedCount = distributors.filter(d => d.latitude && d.longitude).length

  // Performance detail view
  if (perfView) {
    const statusColors = { received: '#065f46', shipped: '#D4AF37', ordered: '#3b82f6', draft: '#78716c', cancelled: '#ef4444' }
    const poMonthly = {}
    perfData.pos.forEach(po => {
      const d = new Date(po.po_date)
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' })
      if (!poMonthly[key]) poMonthly[key] = { month: key, value: 0 }
      poMonthly[key].value += po.total_cost || 0
    })
    const chartData = Object.values(poMonthly)

    return (
      <div className="page">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn-icon" onClick={() => setPerfView(null)}><ArrowLeft size={20} /></button>
            <div>
              <h1>{perfView.name}</h1>
              <p className="page-subtitle">Distributor Performance</p>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => { openEdit(perfView); setPerfView(null) }}>Edit Distributor</button>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-title">Total POs</span>
              <span className="stat-card-value">{perfData.totalPOs}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-title">Total Value</span>
              <span className="stat-card-value" style={{ color: '#065f46' }}>${perfData.totalValue.toFixed(2)}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-title">Avg. PO Value</span>
              <span className="stat-card-value">${perfData.avgValue.toFixed(2)}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-title">Received</span>
              <span className="stat-card-value">{perfData.receivedPOs} / {perfData.totalPOs}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
          <div className="chart-card">
            <h3>Purchase Order Value Over Time</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => `₱${v.toLocaleString()}`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => [`₱${Number(v).toFixed(2)}`, 'Value']} />
                  <Bar dataKey="value" fill="#065f46" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#a8a29e', padding: 20, textAlign: 'center' }}>No PO data</p>
            )}
          </div>
          <div className="chart-card">
            <h3>Distributor Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, padding: '8px 0' }}>
              <div><strong style={{ color: '#78716c' }}>Email:</strong> {perfView.email || '—'}</div>
              <div><strong style={{ color: '#78716c' }}>Phone:</strong> {perfView.phone || '—'}</div>
              <div><strong style={{ color: '#78716c' }}>Address:</strong> {perfView.address || '—'}</div>
              <div><strong style={{ color: '#78716c' }}>Notes:</strong> {perfView.notes || '—'}</div>
              <div><strong style={{ color: '#78716c' }}>Location:</strong> {perfView.latitude && perfView.longitude ? `${perfView.latitude}, ${perfView.longitude}` : 'Not set'}</div>
            </div>
          </div>
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, marginBottom: 12 }}>Purchase Order History</h3>
        {loadingPerf ? (
          <p className="loading">Loading...</p>
        ) : (
          <DataTable
            columns={[
              { header: 'PO #', accessor: 'po_number' },
              { header: 'Date', accessor: 'po_date', render: row => new Date(row.po_date).toLocaleDateString() },
              { header: 'Items', accessor: 'items', render: row => row.purchase_order_items?.length || 0 },
              { header: 'Total', accessor: 'total_cost', render: row => `₱${(row.total_cost || 0).toFixed(2)}` },
              {
                header: 'Status', accessor: 'status',
                render: row => (
                  <span className="badge" style={{ backgroundColor: statusColors[row.status] || '#78716c', color: '#fff' }}>
                    {row.status}
                  </span>
                )
              },
              { header: 'Expected', accessor: 'expected_delivery', render: row => row.expected_delivery ? new Date(row.expected_delivery).toLocaleDateString() : '—' },
            ]}
            data={perfData.pos}
            searchable={false}
          />
        )}
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Distributors</h1>
          <p className="page-subtitle">{distributors.length} total &middot; {pinnedCount} pinned on map</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="view-toggle">
            <button className={`btn ${view === 'map' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('map')}>
              <Map size={16} /> Map
            </button>
            <button className={`btn ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('list')}>
              <List size={16} /> List
            </button>
          </div>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Distributor</button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : view === 'map' ? (
        <div style={{ height: 500, marginBottom: 24 }}>
          <DistributorMap distributors={distributors} />
        </div>
      ) : null}

      {!loading && (
        <DataTable columns={columns} data={distributors} onRowClick={openEdit} />
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Distributor' : 'Add Distributor'} onClose={closeModal} wide>
          <form onSubmit={handleSave}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Distributor name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" />
              </div>
            </div>
            <div className="form-group">
              <label>Location (click map to place pin)</label>
              <div style={{ height: 300, marginTop: 8 }}>
                <DistributorMap distributors={editing ? [editing] : []} onMapClick={handleMapClick} clickPosition={clickPosition} interactive />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input type="number" name="latitude" value={form.latitude} onChange={handleChange} placeholder="e.g. 14.5995" step="any" />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="number" name="longitude" value={form.longitude} onChange={handleChange} placeholder="e.g. 120.9842" step="any" />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes" rows={3} />
            </div>
            <div className="modal-actions">
              {editing && (
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}><Trash2 size={16} /> Delete</button>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
