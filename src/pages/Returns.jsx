import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatCard from '../components/StatCard'
import { Plus, Trash2, RotateCcw, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

const statusColors = { pending: 'yellow', approved: 'blue', completed: 'green', rejected: 'red' }
const REASONS = ['Damaged', 'Expired', 'Wrong Product', 'Customer Changed Mind', 'Quality Issue', 'Other']
const FILTERS = ['All', 'Pending', 'Approved', 'Completed', 'Rejected']

export default function Returns() {
  const [returns, setReturns] = useState([])
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('All')

  const [selectedSaleId, setSelectedSaleId] = useState('')
  const [saleItems, setSaleItems] = useState([])
  const [returnItems, setReturnItems] = useState([])
  const [reason, setReason] = useState('Damaged')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('pending')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [retRes, salesRes, prodRes] = await Promise.all([
      supabase.from('returns').select('*, clients(name), return_items(*, products(name))').order('return_date', { ascending: false }),
      supabase.from('sales').select('*, clients(name), sale_items(*, products(name))').eq('status', 'completed').order('sale_date', { ascending: false }),
      supabase.from('products').select('id, name, stock_quantity').order('name'),
    ])
    setReturns(retRes.data || [])
    setSales(salesRes.data || [])
    setProducts(prodRes.data || [])
    setLoading(false)
  }

  const pending = returns.filter(r => r.status === 'pending').length
  const completed = returns.filter(r => r.status === 'completed').length
  const totalRefund = returns.filter(r => r.status === 'completed').reduce((s, r) => s + (r.refund_amount || 0), 0)
  const filtered = filter === 'All' ? returns : returns.filter(r => r.status === filter.toLowerCase())
  const nextNum = `RET-${String(returns.length + 1).padStart(3, '0')}`

  function openNew() {
    setEditing(null); setSelectedSaleId(''); setSaleItems([]); setReturnItems([])
    setReason('Damaged'); setNotes(''); setStatus('pending'); setModalOpen(true)
  }

  function openEdit(ret) {
    setEditing(ret)
    setSelectedSaleId(ret.sale_id || '')
    setReturnItems((ret.return_items || []).map(ri => ({ product_id: ri.product_id, product_name: ri.products?.name || '', quantity: ri.quantity, unit_price: ri.unit_price, selected: true })))
    setReason(ret.reason || 'Damaged')
    setNotes(ret.notes || '')
    setStatus(ret.status || 'pending')
    setModalOpen(true)
  }

  function closeModal() { setModalOpen(false); setEditing(null) }

  function onSaleSelect(saleId) {
    setSelectedSaleId(saleId)
    const sale = sales.find(s => s.id === saleId)
    if (sale?.sale_items) {
      const items = sale.sale_items.map(si => ({
        product_id: si.product_id, product_name: si.products?.name || si.product_name || '—',
        quantity: 0, max_qty: si.quantity, unit_price: si.unit_price || 0, selected: false,
      }))
      setSaleItems(items)
      setReturnItems(items)
    }
  }

  function toggleItem(idx) {
    setReturnItems(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], selected: !updated[idx].selected, quantity: !updated[idx].selected ? 1 : 0 }
      return updated
    })
  }

  function updateQty(idx, qty) {
    setReturnItems(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], quantity: Math.min(Number(qty), updated[idx].max_qty || 999) }
      return updated
    })
  }

  const selectedItems = returnItems.filter(i => i.selected && i.quantity > 0)
  const refundAmount = selectedItems.reduce((s, i) => s + i.quantity * i.unit_price, 0)

  async function handleSave() {
    setSaving(true)
    try {
      const record = {
        return_number: editing?.return_number || nextNum,
        sale_id: selectedSaleId || null,
        client_id: sales.find(s => s.id === selectedSaleId)?.client_id || null,
        return_date: new Date().toISOString().slice(0, 10),
        reason, refund_amount: refundAmount, status, notes: notes || null,
      }

      let retId = editing?.id
      if (editing) {
        const oldStatus = editing.status
        await supabase.from('returns').update(record).eq('id', editing.id)

        // When completing, process stock and refund
        if (status === 'completed' && oldStatus !== 'completed') {
          for (const item of selectedItems) {
            await supabase.from('stock_movements').insert({
              product_id: item.product_id, type: 'return', quantity: item.quantity,
              reference: record.return_number, notes: `Return ${record.return_number}`,
            })
            const prod = products.find(p => p.id === item.product_id)
            if (prod) {
              await supabase.from('products').update({ stock_quantity: (prod.stock_quantity || 0) + item.quantity }).eq('id', item.product_id)
            }
          }
          await supabase.from('transactions').insert({
            type: 'expense', category: 'Refund', amount: refundAmount,
            description: `Refund for return ${record.return_number}`,
            transaction_date: new Date().toISOString().slice(0, 10),
          })
        }
      } else {
        const { data } = await supabase.from('returns').insert(record)
        retId = data?.[0]?.id

        // Save return items
        const items = selectedItems.map(i => ({
          return_id: retId, product_id: i.product_id,
          quantity: i.quantity, unit_price: i.unit_price, total: i.quantity * i.unit_price,
        }))
        if (items.length > 0) await supabase.from('return_items').insert(items)
      }

      closeModal()
      fetchAll()
    } catch (err) { alert('Error: ' + err.message) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!editing || !confirm('Delete this return?')) return
    await supabase.from('return_items').delete().eq('return_id', editing.id)
    await supabase.from('returns').delete().eq('id', editing.id)
    closeModal()
    fetchAll()
  }

  const columns = [
    { header: 'Return #', accessor: 'return_number', render: r => <span style={{ fontWeight: 600 }}>{r.return_number}</span> },
    { header: 'Date', accessor: 'return_date', render: r => r.return_date ? new Date(r.return_date).toLocaleDateString() : '' },
    { header: 'Client', accessor: 'client', render: r => r.clients?.name || '—' },
    { header: 'Items', accessor: 'items', render: r => r.return_items?.length || 0 },
    { header: 'Refund', accessor: 'refund_amount', render: r => `$${(r.refund_amount || 0).toFixed(2)}` },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Status', accessor: 'status', render: r => <span className={`badge badge-${statusColors[r.status] || 'gray'}`}>{r.status}</span> },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Returns</h1>
          <p className="page-subtitle">{returns.length} total returns</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> New Return</button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Returns" value={returns.length} icon={RotateCcw} color="#065f46" />
        <StatCard title="Pending" value={pending} icon={Clock} color="#D4AF37" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="#10b981" />
        <StatCard title="Total Refunded" value={`$${totalRefund.toFixed(2)}`} icon={AlertTriangle} color="#ef4444" />
      </div>

      <div className="filter-buttons">
        {FILTERS.map(f => <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>{f}</button>)}
      </div>

      {loading ? <p className="loading">Loading...</p> : <DataTable columns={columns} data={filtered} onRowClick={openEdit} />}

      {modalOpen && (
        <Modal title={editing ? `Edit ${editing.return_number}` : 'New Return'} onClose={closeModal} wide>
          {!editing && (
            <div className="form-group">
              <label>Select Original Sale</label>
              <select value={selectedSaleId} onChange={e => onSaleSelect(e.target.value)}>
                <option value="">Choose a sale...</option>
                {sales.map(s => (
                  <option key={s.id} value={s.id}>
                    {new Date(s.sale_date).toLocaleDateString()} — {s.clients?.name || 'Walk-in'} — ${(s.total_net || 0).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {returnItems.length > 0 && (
            <div style={{ margin: '12px 0' }}>
              <label style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', marginBottom: 8 }}>Items to Return</label>
              <table className="line-items-table">
                <thead><tr><th style={{ width: 40 }}></th><th>Product</th><th style={{ width: 80 }}>Max</th><th style={{ width: 100 }}>Return Qty</th><th style={{ width: 100 }}>Refund</th></tr></thead>
                <tbody>
                  {returnItems.map((item, i) => (
                    <tr key={i} style={{ opacity: item.selected ? 1 : 0.5 }}>
                      <td><input type="checkbox" checked={item.selected} onChange={() => toggleItem(i)} /></td>
                      <td>{item.product_name}</td>
                      <td>{item.max_qty || '—'}</td>
                      <td>
                        <input type="number" min="0" max={item.max_qty || 999} value={item.quantity}
                          onChange={e => updateQty(i, e.target.value)} disabled={!item.selected} />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>${(item.selected ? item.quantity * item.unit_price : 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="summary-row total"><span>Total Refund</span><span style={{ color: '#ef4444' }}>${refundAmount.toFixed(2)}</span></div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Reason</label>
              <select value={reason} onChange={e => setReason(e.target.value)}>
                {REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional details..." />
          </div>

          <div className="modal-actions">
            {editing && <button className="btn btn-danger" onClick={handleDelete} type="button"><Trash2 size={16} /> Delete</button>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={closeModal} type="button">Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create Return'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
