import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverage',
  'Health & Beauty',
  'Home & Garden',
  'Office Supplies',
  'Other',
]

const emptyForm = {
  name: '',
  sku: '',
  category: '',
  unit_price: '',
  cost_price: '',
  stock_quantity: '',
  min_stock_level: '',
  description: '',
}

function formatCurrency(value) {
  const num = Number(value)
  if (isNaN(num)) return '₱0.00'
  return '₱' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      unit_price: product.unit_price ?? '',
      cost_price: product.cost_price ?? '',
      stock_quantity: product.stock_quantity ?? '',
      min_stock_level: product.min_stock_level ?? '',
      description: product.description || '',
    })
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      unit_price: parseFloat(form.unit_price) || 0,
      cost_price: parseFloat(form.cost_price) || 0,
      stock_quantity: parseInt(form.stock_quantity, 10) || 0,
      min_stock_level: parseInt(form.min_stock_level, 10) || 0,
      description: form.description.trim(),
    }

    let result
    if (editing) {
      result = await supabase
        .from('products')
        .update(payload)
        .eq('id', editing.id)
    } else {
      result = await supabase
        .from('products')
        .insert([payload])
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    closeModal()
    fetchProducts()
  }

  const handleDelete = async () => {
    if (!editing) return
    if (!window.confirm(`Are you sure you want to delete "${editing.name}"?`)) return

    setSaving(true)
    setError('')

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', editing.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    closeModal()
    fetchProducts()
  }

  const columns = [
    { header: 'SKU', accessor: 'sku' },
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Cost Price',
      accessor: 'cost_price',
      render: (row) => formatCurrency(row.cost_price),
    },
    {
      header: 'Unit Price',
      accessor: 'unit_price',
      render: (row) => formatCurrency(row.unit_price),
    },
    { header: 'Stock Qty', accessor: 'stock_quantity' },
    { header: 'Min Stock', accessor: 'min_stock_level' },
    {
      header: 'Status',
      accessor: 'stock_quantity',
      render: (row) => {
        const isLow = row.stock_quantity < row.min_stock_level
        return (
          <span className={`badge ${isLow ? 'badge-red' : 'badge-green'}`}>
            {isLow ? 'Low Stock' : 'In Stock'}
          </span>
        )
      },
    },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h2>Inventory</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          onRowClick={openEdit}
        />
      )}

      {modalOpen && (
        <Modal
          title={editing ? 'Edit Product' : 'Add Product'}
          onClose={closeModal}
        >
          <form onSubmit={handleSave}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product name"
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. PRD-001"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cost Price</label>
                <input
                  type="number"
                  name="cost_price"
                  value={form.cost_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit Price</label>
                <input
                  type="number"
                  name="unit_price"
                  value={form.unit_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Min Stock Level</label>
                <input
                  type="number"
                  name="min_stock_level"
                  value={form.min_stock_level}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product description (optional)"
                rows={3}
              />
            </div>

            <div className="form-actions">
              {editing && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
              <div className="form-actions-right">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
