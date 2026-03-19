import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatCard from '../components/StatCard'
import { Plus, FileText, DollarSign, AlertTriangle, CheckCircle, Printer, X } from 'lucide-react'

const statusColors = { draft: 'gray', sent: 'blue', paid: 'green', overdue: 'red' }

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [viewInvoice, setViewInvoice] = useState(null)
  const [selectedSaleId, setSelectedSaleId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('Net 30')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [invRes, salesRes] = await Promise.all([
      supabase.from('invoices').select('*, clients(name, email, address)').order('invoice_date', { ascending: false }),
      supabase.from('sales').select('*, clients(name), sale_items(*, products(name))').eq('status', 'completed').order('sale_date', { ascending: false }),
    ])
    setInvoices(invRes.data || [])
    setSales(salesRes.data || [])
    setLoading(false)
  }

  const paid = invoices.filter(i => i.status === 'paid')
  const unpaidAmt = invoices.filter(i => ['sent', 'draft', 'overdue'].includes(i.status)).reduce((s, i) => s + (i.amount || 0), 0)
  const overdueCount = invoices.filter(i => i.status === 'overdue').length
  const nextNum = `INV-${String(invoices.length + 1).padStart(3, '0')}`

  // Sales that don't already have invoices
  const invoicedSaleIds = new Set(invoices.map(i => i.sale_id))
  const availableSales = sales.filter(s => !invoicedSaleIds.has(s.id))

  function openGenerate() {
    setSelectedSaleId(''); setDueDate(''); setPaymentTerms('Net 30'); setNotes(''); setGenerateOpen(true)
  }

  async function handleGenerate() {
    if (!selectedSaleId) return alert('Select a sale first')
    setSaving(true)
    const sale = sales.find(s => s.id === selectedSaleId)
    if (!sale) { setSaving(false); return }

    const dd = dueDate || (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10) })()

    await supabase.from('invoices').insert({
      invoice_number: nextNum, sale_id: sale.id, client_id: sale.client_id,
      invoice_date: new Date().toISOString().slice(0, 10), due_date: dd,
      amount: sale.total_net || 0, status: 'draft', payment_terms: paymentTerms, notes,
    })

    setGenerateOpen(false)
    fetchAll()
    setSaving(false)
  }

  async function markAsPaid(inv) {
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', inv.id)
    setViewInvoice(null)
    fetchAll()
  }

  function openView(inv) {
    // Enrich with sale data
    const sale = sales.find(s => s.id === inv.sale_id)
    setViewInvoice({ ...inv, sale })
  }

  const columns = [
    { header: 'Invoice #', accessor: 'invoice_number' },
    { header: 'Date', accessor: 'invoice_date', render: r => r.invoice_date ? new Date(r.invoice_date).toLocaleDateString() : '' },
    { header: 'Client', accessor: 'client', render: r => r.clients?.name || '—' },
    { header: 'Amount', accessor: 'amount', render: r => `$${(r.amount || 0).toFixed(2)}` },
    { header: 'Due Date', accessor: 'due_date', render: r => r.due_date ? new Date(r.due_date).toLocaleDateString() : '—' },
    { header: 'Status', accessor: 'status', render: r => <span className={`badge badge-${statusColors[r.status] || 'gray'}`}>{r.status}</span> },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Invoices</h1>
          <p className="page-subtitle">{invoices.length} total invoices</p>
        </div>
        <button className="btn btn-primary" onClick={openGenerate}><Plus size={18} /> Generate Invoice</button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Invoices" value={invoices.length} icon={FileText} color="#065f46" />
        <StatCard title="Paid" value={paid.length} icon={CheckCircle} color="#10b981" />
        <StatCard title="Outstanding" value={`$${unpaidAmt.toFixed(2)}`} icon={DollarSign} color="#D4AF37" />
        <StatCard title="Overdue" value={overdueCount} icon={AlertTriangle} color="#ef4444" />
      </div>

      {loading ? <p className="loading">Loading...</p> : <DataTable columns={columns} data={invoices} onRowClick={openView} />}

      {/* Generate Invoice Modal */}
      {generateOpen && (
        <Modal title="Generate Invoice" onClose={() => setGenerateOpen(false)}>
          <div className="form-group">
            <label>Select Sale</label>
            <select value={selectedSaleId} onChange={e => setSelectedSaleId(e.target.value)}>
              <option value="">Choose a completed sale...</option>
              {availableSales.map(s => (
                <option key={s.id} value={s.id}>
                  {new Date(s.sale_date).toLocaleDateString()} — {s.clients?.name || 'Walk-in'} — ${(s.total_net || 0).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          {selectedSaleId && (() => {
            const sale = sales.find(s => s.id === selectedSaleId)
            if (!sale) return null
            return (
              <div style={{ background: '#f0fdf9', border: '1px solid #d1fae5', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 13 }}>
                <strong>Client:</strong> {sale.clients?.name || 'Walk-in'}<br />
                <strong>Items:</strong> {sale.sale_items?.length || 0}<br />
                <strong>Amount:</strong> ${(sale.total_net || 0).toFixed(2)}
              </div>
            )
          })()}
          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Payment Terms</label>
              <select value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}>
                <option>Net 15</option>
                <option>Net 30</option>
                <option>Net 60</option>
                <option>Due on Receipt</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setGenerateOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleGenerate} disabled={saving}>{saving ? 'Generating...' : 'Generate Invoice'}</button>
          </div>
        </Modal>
      )}

      {/* View/Print Invoice Modal */}
      {viewInvoice && (
        <Modal title="" onClose={() => setViewInvoice(null)} wide>
          <style>{`@media print { .no-print { display: none !important; } .modal-overlay { position: static; background: none; } .modal-content { box-shadow: none; max-width: 100%; border: none; } }`}</style>

          <div style={{ padding: '24px 8px' }} id="invoice-print">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, borderBottom: '3px solid #065f46', paddingBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, color: '#065f46', margin: 0, letterSpacing: 3 }}>CAVELLA</h1>
                <p style={{ color: '#D4AF37', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, margin: '4px 0 0' }}>PREMIUM PISTACHIO CREAMS</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, margin: 0, color: '#1c1917' }}>INVOICE</h2>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37', margin: '4px 0' }}>{viewInvoice.invoice_number}</p>
                <p style={{ fontSize: 12, color: '#78716c' }}>Date: {new Date(viewInvoice.invoice_date).toLocaleDateString()}</p>
                <p style={{ fontSize: 12, color: '#78716c' }}>Due: {viewInvoice.due_date ? new Date(viewInvoice.due_date).toLocaleDateString() : '—'}</p>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#78716c', letterSpacing: 1, marginBottom: 4 }}>Bill To</p>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{viewInvoice.clients?.name || '—'}</p>
              <p style={{ fontSize: 13, color: '#57534e' }}>{viewInvoice.clients?.email || ''}</p>
              <p style={{ fontSize: 13, color: '#57534e' }}>{viewInvoice.clients?.address || ''}</p>
            </div>

            {/* Items */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #d1fae5' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#065f46', letterSpacing: 0.5 }}>Product</th>
                  <th style={{ textAlign: 'right', padding: '10px 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#065f46' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '10px 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#065f46' }}>Unit Price</th>
                  <th style={{ textAlign: 'right', padding: '10px 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#065f46' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(viewInvoice.sale?.sale_items || []).map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '10px 8px', fontSize: 13 }}>{item.products?.name || item.product_name || '—'}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13, textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13, textAlign: 'right' }}>${(item.unit_price || 0).toFixed(2)}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>${(item.total || item.quantity * item.unit_price || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: 260 }}>
                <div className="summary-row"><span>Subtotal</span><span>${(viewInvoice.sale?.subtotal || viewInvoice.amount || 0).toFixed(2)}</span></div>
                {viewInvoice.sale?.discount > 0 && <div className="summary-row"><span>Discount</span><span>-${viewInvoice.sale.discount.toFixed(2)}</span></div>}
                {viewInvoice.sale?.tax > 0 && <div className="summary-row"><span>Tax</span><span>${viewInvoice.sale.tax.toFixed(2)}</span></div>}
                <div className="summary-row total"><span>Total</span><span style={{ color: '#065f46' }}>${(viewInvoice.amount || 0).toFixed(2)}</span></div>
              </div>
            </div>

            {/* Terms */}
            {(viewInvoice.payment_terms || viewInvoice.notes) && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e7e5e4', fontSize: 12, color: '#78716c' }}>
                {viewInvoice.payment_terms && <p><strong>Payment Terms:</strong> {viewInvoice.payment_terms}</p>}
                {viewInvoice.notes && <p style={{ marginTop: 4 }}><strong>Notes:</strong> {viewInvoice.notes}</p>}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: '#a8a29e' }}>
              Thank you for your business — Cavella Premium Pistachio Creams
            </div>
          </div>

          <div className="modal-actions no-print">
            {viewInvoice.status !== 'paid' && (
              <button className="btn btn-primary" onClick={() => markAsPaid(viewInvoice)}><CheckCircle size={16} /> Mark as Paid</button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setViewInvoice(null)}>Close</button>
              <button className="btn btn-gold" onClick={() => window.print()}><Printer size={16} /> Print</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
