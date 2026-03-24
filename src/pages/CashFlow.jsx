import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#065f46', '#D4AF37', '#10b981', '#C49B2D', '#059669', '#BFA14A']

const INCOME_CATEGORIES = ['Sale', 'Investment', 'Refund', 'Other Income']
const EXPENSE_CATEGORIES = ['Inventory Purchase', 'Salary', 'Rent', 'Utilities', 'Marketing', 'Shipping', 'Other Expense']

const emptyForm = {
  type: 'income',
  category: '',
  amount: '',
  description: '',
  transaction_date: new Date().toISOString().split('T')[0],
}

function formatCurrency(value) {
  const num = Number(value)
  if (isNaN(num)) return '₱0.00'
  return '₱' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CashFlow() {
  const { canDo } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchTransactions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const netBalance = totalIncome - totalExpenses

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter)

  // Monthly income vs expenses for bar chart (last 6 months)
  const monthlyData = (() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleString('default', { month: 'short', year: 'numeric' })
      months.push({ key, month: label, income: 0, expenses: 0 })
    }

    transactions.forEach(t => {
      const date = new Date(t.transaction_date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const entry = months.find(m => m.key === key)
      if (entry) {
        if (t.type === 'income') {
          entry.income += t.amount || 0
        } else {
          entry.expenses += t.amount || 0
        }
      }
    })

    return months
  })()

  // Expense breakdown by category for pie chart
  const expenseByCategory = (() => {
    const categoryMap = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category || 'Uncategorized'
        if (!categoryMap[cat]) {
          categoryMap[cat] = { name: cat, value: 0 }
        }
        categoryMap[cat].value += t.amount || 0
      })
    return Object.values(categoryMap)
  })()

  const openAdd = () => {
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      // Reset category when type changes
      if (name === 'type') {
        updated.category = ''
      }
      return updated
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount) || 0,
      description: form.description.trim(),
      transaction_date: form.transaction_date,
    }

    const { error } = await supabase
      .from('transactions')
      .insert([payload])

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    closeModal()
    fetchTransactions()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }

    fetchTransactions()
  }

  const categoryOptions = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const columns = [
    {
      header: 'Date',
      accessor: 'transaction_date',
      render: (row) => row.transaction_date
        ? new Date(row.transaction_date).toLocaleDateString()
        : '',
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <span className={`badge ${row.type === 'income' ? 'badge-green' : 'badge-red'}`}>
          {row.type === 'income' ? 'Income' : 'Expense'}
        </span>
      ),
    },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span style={{ color: row.type === 'income' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    { header: 'Description', accessor: 'description' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1>Cash Flow</h1>
        {canDo('cash-flow', 'add') && (
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={18} />
            Add Transaction
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Total Income</span>
            <span className="stat-card-value" style={{ color: '#10b981' }}>
              {formatCurrency(totalIncome)}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>
            <TrendingDown size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Total Expenses</span>
            <span className="stat-card-value" style={{ color: '#ef4444' }}>
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#05966915', color: '#059669' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Net Balance</span>
            <span className="stat-card-value" style={{ color: '#059669' }}>
              {formatCurrency(netBalance)}
            </span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2 className="chart-title">Income vs Expenses (Last 6 Months)</h2>
          {monthlyData.some(m => m.income > 0 || m.expenses > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(val) => `₱${val.toLocaleString()}`} />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name === 'income' ? 'Income' : 'Expenses',
                  ]}
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No transaction data available</p>
          )}
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Expense Breakdown by Category</h2>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No expense data available</p>
          )}
        </div>
      </div>

      <div className="filter-buttons" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`btn ${filter === 'income' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('income')}
        >
          Income
        </button>
        <button
          className={`btn ${filter === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('expense')}
        >
          Expenses
        </button>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredTransactions}
        />
      )}

      {modalOpen && (
        <Modal title="Add Transaction" onClose={closeModal}>
          <form onSubmit={handleSave}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Transaction description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Transaction Date</label>
              <input
                type="date"
                name="transaction_date"
                value={form.transaction_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-actions">
              <div className="modal-actions-right">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Create Transaction'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
