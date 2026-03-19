import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, Trash2, X } from 'lucide-react'

const emptyItem = { product_id: '', quantity: 1, unit_price: 0 }

const statusColors = {
  completed: '#16a34a',
  pending: '#ca8a04',
  cancelled: '#dc2626',
  refunded: '#6b7280',
}

export default function Sales() {
  const [sales, setSales] = useState([])
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    client_id: '',
    sale_date: new Date().toISOString().slice(0, 10),
    status: 'pending',
    discount: 0,
    tax: 0,
    notes: '',
  })
  const [items, setItems] = useState([{ ...emptyItem }])

  useEffect(() => {
    fetchSales()
    fetchClients()
    fetchProducts()
  }, [])

  async function fetchSales() {
    setLoading(true)
    const { data, error } = await supabase
      .from('sales')
      .select('*, clients(name), sale_items(*)')
      .order('sale_date', { ascending: false })
    if (!error) setSales(data || [])
    setLoading(false)
  }

  async function fetchClients() {
    const { data } = await supabase.from('clients').select('id, name').order('name')
    if (data) setClients(data)
  }

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('id, name, price, stock_quantity').order('name')
    if (data) setProducts(data)
  }

  function openNew() {
    setEditing(null)
    setForm({
      client_id: '',
      sale_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      discount: 0,
      tax: 0,
      notes: '',
    })
    setItems([{ ...emptyItem }])
    setModalOpen(true)
  }

  function openEdit(sale) {
    setEditing(sale)
    setForm({
      client_id: sale.client_id || '',
      sale_date: sale.sale_date ? sale.sale_date.slice(0, 10) : '',
      status: sale.status || 'pending',
      discount: sale.discount || 0,
      tax: sale.tax || 0,
      notes: sale.notes || '',
    })
    setItems(
      sale.sale_items && sale.sale_items.length > 0
        ? sale.sale_items.map(si => ({
            product_id: si.product_id || '',
            quantity: si.quantity || 1,
            unit_price: si.unit_price || 0,
          }))
        : [{ ...emptyItem }]
    )
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function updateItem(index, field, value) {
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }

      if (field === 'product_id') {
        const product = products.find(p => p.id === value)
        if (product) {
          updated[index].unit_price = product.price || 0
        }
      }

      return updated
    })
  }

  function addItem() {
    setItems(prev => [...prev, { ...emptyItem }])
  }

  function removeItem(index) {
    setItems(prev => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const totalGross = subtotal + Number(form.tax || 0)
  const totalNet = subtotal - Number(form.discount || 0)

  async function handleSave() {
    setSaving(true)
    try {
      const saleRecord = {
        client_id: form.client_id || null,
        sale_date: form.sale_date,
        status: form.status,
        discount: Number(form.discount) || 0,
        tax: Number(form.tax) || 0,
        subtotal,
        total_gross: totalGross,
        total_net: totalNet,
        notes: form.notes || null,
      }

      let saleId = editing?.id

      if (editing) {
        const { error } = await supabase
          .from('sales')
          .update(saleRecord)
          .eq('id', editing.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('sales')
          .insert(saleRecord)
          .select()
          .single()
        if (error) throw error
        saleId = data.id
      }

      // Delete old sale_items and insert new ones
      await supabase.from('sale_items').delete().eq('sale_id', saleId)

      const saleItems = items
        .filter(item => item.product_id)
        .map(item => ({
          sale_id: saleId,
          product_id: item.product_id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          line_total: Number(item.quantity) * Number(item.unit_price),
        }))

      if (saleItems.length > 0) {
        const { error } = await supabase.from('sale_items').insert(saleItems)
        if (error) throw error
      }

      // For new sales, create stock_movements and decrement stock
      if (!editing) {
        for (const item of saleItems) {
          await supabase.from('stock_movements').insert({
            product_id: item.product_id,
            type: 'out',
            quantity: item.quantity,
            reference_type: 'sale',
            reference_id: saleId,
          })

          const product = products.find(p => p.id === item.product_id)
          if (product) {
            await supabase
              .from('products')
              .update({ stock_quantity: (product.stock_quantity || 0) - item.quantity })
              .eq('id', item.product_id)
          }
        }

        // Create transaction record
        await supabase.from('transactions').insert({
          type: 'income',
          category: 'sale',
          amount: totalNet,
          reference_type: 'sale',
          reference_id: saleId,
          description: `Sale #${saleId}`,
          transaction_date: form.sale_date,
        })
      }

      closeModal()
      fetchSales()
      fetchProducts()
    } catch (err) {
      alert('Error saving sale: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!editing) return
    if (!confirm('Are you sure you want to delete this sale?')) return

    try {
      await supabase.from('sale_items').delete().eq('sale_id', editing.id)
      const { error } = await supabase.from('sales').delete().eq('id', editing.id)
      if (error) throw error
      closeModal()
      fetchSales()
    } catch (err) {
      alert('Error deleting sale: ' + err.message)
    }
  }

  const columns = [
    {
      header: 'Date',
      accessor: 'sale_date',
      render: row => row.sale_date ? new Date(row.sale_date).toLocaleDateString() : '',
    },
    {
      header: 'Client',
      accessor: 'client_name',
      render: row => row.clients?.name || '—',
    },
    {
      header: 'Items',
      accessor: 'items_count',
      render: row => row.sale_items?.length || 0,
    },
    {
      header: 'Subtotal',
      accessor: 'subtotal',
      render: row => Number(row.subtotal || 0).toLocaleString(),
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: row => Number(row.discount || 0).toLocaleString(),
    },
    {
      header: 'Tax',
      accessor: 'tax',
      render: row => Number(row.tax || 0).toLocaleString(),
    },
    {
      header: 'Gross',
      accessor: 'total_gross',
      render: row => Number(row.total_gross || 0).toLocaleString(),
    },
    {
      header: 'Net',
      accessor: 'total_net',
      render: row => Number(row.total_net || 0).toLocaleString(),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: row => (
        <span
          className="badge"
          style={{
            backgroundColor: statusColors[row.status] || '#6b7280',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {row.status}
        </span>
      ),
    },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h2>Sales</h2>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={18} />
          New Sale
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={sales} onRowClick={openEdit} />
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Sale' : 'New Sale'} onClose={closeModal} wide>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Client</label>
              <select
                value={form.client_id}
                onChange={e => setForm({ ...form, client_id: e.target.value })}
              >
                <option value="">Select client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sale Date</label>
              <input
                type="date"
                value={form.sale_date}
                onChange={e => setForm({ ...form, sale_date: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 600 }}>Line Items</label>
              <button className="btn btn-sm" onClick={addItem} type="button">
                <Plus size={14} />
                Add Item
              </button>
            </div>

            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ width: '100px' }}>Qty</th>
                  <th style={{ width: '130px' }}>Unit Price</th>
                  <th style={{ width: '130px' }}>Line Total</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        value={item.product_id}
                        onChange={e => updateItem(index, 'product_id', e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="">Select product...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {(item.quantity * item.unit_price).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn-icon"
                        onClick={() => removeItem(index)}
                        type="button"
                        title="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginTop: '1rem' }}>
            <div className="form-group">
              <label>Discount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.discount}
                onChange={e => setForm({ ...form, discount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Tax</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.tax}
                onChange={e => setForm({ ...form, tax: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
            <span>Subtotal: {subtotal.toLocaleString()}</span>
            <span>Gross: {totalGross.toLocaleString()}</span>
            <span>Net: {totalNet.toLocaleString()}</span>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional notes..."
            />
          </div>

          <div className="modal-actions">
            {editing && (
              <button className="btn btn-danger" onClick={handleDelete} type="button">
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button className="btn" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Sale' : 'Create Sale'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
