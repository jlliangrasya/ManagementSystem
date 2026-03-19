import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatCard from '../components/StatCard'
import { Plus, Trash2, X, ClipboardList, Clock, DollarSign, CheckCircle } from 'lucide-react'

const statusColors = { draft: 'gray', ordered: 'blue', shipped: 'yellow', received: 'green', cancelled: 'red' }
const emptyItem = { product_id: '', quantity: 1, unit_cost: 0 }

export default function PurchaseOrders() {
  const [pos, setPOs] = useState([])
  const [distributors, setDistributors] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    distributor_id: '', po_date: new Date().toISOString().slice(0, 10),
    expected_delivery: '', status: 'draft', notes: '',
  })
  const [items, setItems] = useState([{ ...emptyItem }])

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [posRes, distRes, prodRes] = await Promise.all([
      supabase.from('purchase_orders').select('*, clients(name), purchase_order_items(*, products(name))').order('po_date', { ascending: false }),
      supabase.from('clients').select('id, name').eq('type', 'distributor').order('name'),
      supabase.from('products').select('id, name, cost_price').order('name'),
    ])
    setPOs(posRes.data || [])
    setDistributors(distRes.data || [])
    setProducts(prodRes.data || [])
    setLoading(false)
  }

  const pendingPOs = pos.filter(p => ['draft', 'ordered', 'shipped'].includes(p.status))
  const openValue = pendingPOs.reduce((s, p) => s + (p.total_cost || 0), 0)
  const thisMonth = pos.filter(p => {
    const d = new Date(p.po_date)
    const now = new Date()
    return p.status === 'received' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  function openNew() {
    setEditing(null)
    setForm({ distributor_id: '', po_date: new Date().toISOString().slice(0, 10), expected_delivery: '', status: 'draft', notes: '' })
    setItems([{ ...emptyItem }])
    setModalOpen(true)
  }

  function openEdit(po) {
    setEditing(po)
    setForm({
      distributor_id: po.distributor_id || '', po_date: po.po_date?.slice(0, 10) || '',
      expected_delivery: po.expected_delivery?.slice(0, 10) || '', status: po.status || 'draft', notes: po.notes || '',
    })
    setItems(
      po.purchase_order_items?.length > 0
        ? po.purchase_order_items.map(i => ({ product_id: i.product_id || '', quantity: i.quantity || 1, unit_cost: i.unit_cost || 0 }))
        : [{ ...emptyItem }]
    )
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditing(null) }

  function updateItem(idx, field, value) {
    setItems(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], [field]: value }
      if (field === 'product_id') {
        const prod = products.find(p => p.id === value)
        if (prod) updated[idx].unit_cost = prod.cost_price || 0
      }
      return updated
    })
  }

  const totalCost = items.reduce((s, i) => s + i.quantity * i.unit_cost, 0)
  const nextPONumber = `PO-${String(pos.length + 1).padStart(3, '0')}`

  async function handleSave() {
    setSaving(true)
    try {
      const record = {
        po_number: editing?.po_number || nextPONumber,
        distributor_id: form.distributor_id || null,
        po_date: form.po_date, expected_delivery: form.expected_delivery || null,
        status: form.status, total_cost: totalCost, notes: form.notes || null,
      }

      let poId = editing?.id
      if (editing) {
        await supabase.from('purchase_orders').update(record).eq('id', editing.id)
      } else {
        const { data } = await supabase.from('purchase_orders').insert(record)
        poId = data?.[0]?.id
      }

      await supabase.from('purchase_order_items').delete().eq('purchase_order_id', poId)
      const poItems = items.filter(i => i.product_id).map(i => ({
        purchase_order_id: poId, product_id: i.product_id, quantity: Number(i.quantity),
        unit_cost: Number(i.unit_cost), line_total: Number(i.quantity) * Number(i.unit_cost),
      }))
      if (poItems.length > 0) await supabase.from('purchase_order_items').insert(poItems)

      // When marking as received, create stock movements
      if (form.status === 'received' && editing?.status !== 'received') {
        for (const item of poItems) {
          await supabase.from('stock_movements').insert({
            product_id: item.product_id, type: 'in', quantity: item.quantity,
            reference: record.po_number, notes: `Received from PO ${record.po_number}`,
          })
          const prod = products.find(p => p.id === item.product_id)
          if (prod) {
            await supabase.from('products').update({ stock_quantity: (prod.stock_quantity || 0) + item.quantity }).eq('id', item.product_id)
          }
        }
      }

      closeModal()
      fetchAll()
    } catch (err) { alert('Error: ' + err.message) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!editing || !confirm('Delete this purchase order?')) return
    await supabase.from('purchase_order_items').delete().eq('purchase_order_id', editing.id)
    await supabase.from('purchase_orders').delete().eq('id', editing.id)
    closeModal()
    fetchAll()
  }

  const columns = [
    { header: 'PO #', accessor: 'po_number' },
    { header: 'Date', accessor: 'po_date', render: r => r.po_date ? new Date(r.po_date).toLocaleDateString() : '' },
    { header: 'Distributor', accessor: 'dist', render: r => r.clients?.name || '—' },
    { header: 'Items', accessor: 'items', render: r => r.purchase_order_items?.length || 0 },
    { header: 'Total Cost', accessor: 'total_cost', render: r => `$${(r.total_cost || 0).toFixed(2)}` },
    { header: 'Status', accessor: 'status', render: r => <span className={`badge badge-${statusColors[r.status] || 'gray'}`}>{r.status}</span> },
    { header: 'Expected', accessor: 'expected_delivery', render: r => r.expected_delivery ? new Date(r.expected_delivery).toLocaleDateString() : '—' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Purchase Orders</h1>
          <p className="page-subtitle">{pos.length} total orders</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> New PO</button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total POs" value={pos.length} icon={ClipboardList} color="#065f46" />
        <StatCard title="Pending Orders" value={pendingPOs.length} icon={Clock} color="#D4AF37" />
        <StatCard title="Open Value" value={`$${openValue.toFixed(2)}`} icon={DollarSign} color="#059669" />
        <StatCard title="Received This Month" value={thisMonth} icon={CheckCircle} color="#10b981" />
      </div>

      {loading ? <p className="loading">Loading...</p> : <DataTable columns={columns} data={pos} onRowClick={openEdit} />}

      {modalOpen && (
        <Modal title={editing ? `Edit ${editing.po_number}` : 'New Purchase Order'} onClose={closeModal} wide>
          <div className="form-row">
            <div className="form-group">
              <label>Distributor</label>
              <select value={form.distributor_id} onChange={e => setForm({ ...form, distributor_id: e.target.value })}>
                <option value="">Select distributor...</option>
                {distributors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>PO Date</label>
              <input type="date" value={form.po_date} onChange={e => setForm({ ...form, po_date: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expected Delivery</label>
              <input type="date" value={form.expected_delivery} onChange={e => setForm({ ...form, expected_delivery: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="ordered">Ordered</option>
                <option value="shipped">Shipped</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ margin: '16px 0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 }}>Line Items</label>
              <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setItems(p => [...p, { ...emptyItem }])} type="button">
                <Plus size={14} /> Add Item
              </button>
            </div>
            <table className="line-items-table">
              <thead><tr><th>Product</th><th style={{ width: 90 }}>Qty</th><th style={{ width: 120 }}>Unit Cost</th><th style={{ width: 120 }}>Total</th><th style={{ width: 40 }}></th></tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}>
                        <option value="">Select...</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </td>
                    <td><input type="number" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} /></td>
                    <td><input type="number" min="0" step="0.01" value={item.unit_cost} onChange={e => updateItem(i, 'unit_cost', Number(e.target.value))} /></td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>${(item.quantity * item.unit_cost).toFixed(2)}</td>
                    <td><button className="btn-icon" onClick={() => setItems(p => p.length > 1 ? p.filter((_, j) => j !== i) : p)} type="button"><X size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="summary-row total"><span>Total Cost</span><span>${totalCost.toFixed(2)}</span></div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
          </div>

          <div className="modal-actions">
            {editing && <button className="btn btn-danger" onClick={handleDelete} type="button"><Trash2 size={16} /> Delete</button>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={closeModal} type="button">Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create PO'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
