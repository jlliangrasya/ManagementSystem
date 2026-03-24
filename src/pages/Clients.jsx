import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'

const emptyForm = { name: '', email: '', phone: '', address: '', notes: '' }

export default function Clients() {
  const { canDo } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Purchase history state
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientSales, setClientSales] = useState([])
  const [clientStats, setClientStats] = useState({ totalOrders: 0, totalSpent: 0, avgOrder: 0, lastOrder: null })
  const [loadingHistory, setLoadingHistory] = useState(false)

  const fetchClients = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('type', 'client')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setClients(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  async function viewPurchaseHistory(client) {
    setSelectedClient(client)
    setLoadingHistory(true)

    const { data: sales } = await supabase
      .from('sales')
      .select('*, sale_items(*, products(name))')
      .eq('client_id', client.id)
      .order('sale_date', { ascending: false })

    const clientSalesData = sales || []
    setClientSales(clientSalesData)

    const completed = clientSalesData.filter(s => s.status === 'completed')
    const totalSpent = completed.reduce((sum, s) => sum + (s.total_net || 0), 0)

    setClientStats({
      totalOrders: completed.length,
      totalSpent,
      avgOrder: completed.length > 0 ? totalSpent / completed.length : 0,
      lastOrder: clientSalesData[0]?.sale_date || null,
    })

    setLoadingHistory(false)
  }

  const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setModalOpen(true) }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ name: row.name || '', email: row.email || '', phone: row.phone || '', address: row.address || '', notes: row.notes || '' })
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); setError('') }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (editing) {
      const { error } = await supabase.from('clients').update({ name: form.name, email: form.email, phone: form.phone, address: form.address, notes: form.notes }).eq('id', editing.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('clients').insert([{ ...form, type: 'client' }])
      if (error) { setError(error.message); setSaving(false); return }
    }

    setSaving(false)
    closeModal()
    fetchClients()
  }

  const handleDelete = async () => {
    if (!editing || !confirm('Are you sure you want to delete this client?')) return
    setSaving(true)
    const { error } = await supabase.from('clients').delete().eq('id', editing.id)
    if (error) { setError(error.message); setSaving(false); return }
    setSaving(false)
    closeModal()
    fetchClients()
  }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    { header: 'Date Added', accessor: 'created_at', render: row => row.created_at ? new Date(row.created_at).toLocaleDateString() : '' },
    {
      header: 'History',
      accessor: 'history',
      render: row => (
        <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}
          onClick={(e) => { e.stopPropagation(); viewPurchaseHistory(row) }}>
          <ShoppingCart size={14} /> View
        </button>
      )
    },
  ]

  const historyColumns = [
    { header: 'Date', accessor: 'sale_date', render: row => row.sale_date ? new Date(row.sale_date).toLocaleDateString() : '' },
    { header: 'Items', accessor: 'items', render: row => row.sale_items?.length || 0 },
    { header: 'Subtotal', accessor: 'subtotal', render: row => `₱${(row.subtotal || 0).toFixed(2)}` },
    { header: 'Discount', accessor: 'discount', render: row => `₱${(row.discount || 0).toFixed(2)}` },
    { header: 'Net', accessor: 'total_net', render: row => `₱${(row.total_net || 0).toFixed(2)}` },
    {
      header: 'Status', accessor: 'status',
      render: row => (
        <span className={`badge badge-${row.status === 'completed' ? 'green' : row.status === 'pending' ? 'yellow' : row.status === 'cancelled' ? 'red' : 'gray'}`}>
          {row.status}
        </span>
      )
    },
  ]

  // Purchase history detail view
  if (selectedClient) {
    return (
      <div className="page">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn-icon" onClick={() => setSelectedClient(null)}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1>{selectedClient.name}</h1>
              <p className="page-subtitle">{selectedClient.email} {selectedClient.phone ? `| ${selectedClient.phone}` : ''}</p>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => { openEdit(selectedClient); setSelectedClient(null) }}>
            Edit Client
          </button>
        </div>

        {/* Client stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-title">Total Orders</span>
              <span className="stat-card-value">{clientStats.totalOrders}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-title">Total Spent</span>
              <span className="stat-card-value" style={{ color: '#065f46' }}>${clientStats.totalSpent.toFixed(2)}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-title">Avg. Order Value</span>
              <span className="stat-card-value">${clientStats.avgOrder.toFixed(2)}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-title">Last Order</span>
              <span className="stat-card-value" style={{ fontSize: 18 }}>
                {clientStats.lastOrder ? new Date(clientStats.lastOrder).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Client details card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 18, marginBottom: 24 }}>
          <div className="chart-card">
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, marginBottom: 12 }}>Client Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div><strong style={{ color: '#78716c' }}>Address:</strong> <span>{selectedClient.address || '—'}</span></div>
              <div><strong style={{ color: '#78716c' }}>Notes:</strong> <span>{selectedClient.notes || '—'}</span></div>
              <div><strong style={{ color: '#78716c' }}>Client since:</strong> <span>{new Date(selectedClient.created_at).toLocaleDateString()}</span></div>
            </div>
          </div>

          <div className="chart-card">
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, marginBottom: 12 }}>Frequently Ordered Products</h3>
            {(() => {
              const productMap = {}
              clientSales.forEach(sale => {
                (sale.sale_items || []).forEach(item => {
                  const name = item.products?.name || item.product_name || 'Unknown'
                  if (!productMap[name]) productMap[name] = { name, qty: 0, revenue: 0 }
                  productMap[name].qty += item.quantity || 0
                  productMap[name].revenue += item.total || (item.quantity * item.unit_price) || 0
                })
              })
              const sorted = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

              if (sorted.length === 0) return <p style={{ color: '#a8a29e', fontSize: 13 }}>No orders yet</p>

              return (
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty Ordered</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((p, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td>{p.qty}</td>
                        <td style={{ color: '#065f46', fontWeight: 600 }}>${p.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            })()}
          </div>
        </div>

        {/* Order history table */}
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, marginBottom: 12 }}>Order History</h3>
        {loadingHistory ? (
          <p className="loading">Loading history...</p>
        ) : (
          <DataTable columns={historyColumns} data={clientSales} searchable={false} />
        )}
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Clients</h1>
          <p className="page-subtitle">{clients.length} total client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        {canDo('clients', 'add') && (
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={18} /> Add Client
          </button>
        )}
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <DataTable columns={columns} data={clients} onRowClick={(canDo('clients', 'edit') || canDo('clients', 'delete')) ? openEdit : undefined} />
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Client' : 'Add Client'} onClose={closeModal}>
          <form onSubmit={handleSave}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Client name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes" rows={3} />
            </div>
            <div className="modal-actions">
              {editing && canDo('clients', 'delete') && (
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                  <Trash2 size={16} /> Delete
                </button>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || (editing && !canDo('clients', 'edit'))}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
