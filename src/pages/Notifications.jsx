import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import StatCard from '../components/StatCard'
import { Bell, AlertTriangle, Clock, ShoppingCart, Settings, CheckCheck } from 'lucide-react'

const FILTERS = ['All', 'Unread', 'Low Stock', 'Expiry', 'Orders', 'System']
const typeIcons = { low_stock: AlertTriangle, expiry: Clock, order: ShoppingCart, system: Settings }
const typeColors = { low_stock: '#ef4444', expiry: '#d97706', order: '#065f46', system: '#78716c' }

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => { fetchNotifications() }, [])

  async function fetchNotifications() {
    setLoading(true)
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false })
    setNotifications(data || [])
    setLoading(false)
  }

  async function markAsRead(id) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  async function markAllRead() {
    for (const n of notifications.filter(n => !n.read)) {
      await supabase.from('notifications').update({ read: true }).eq('id', n.id)
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length
  const lowStock = notifications.filter(n => n.type === 'low_stock').length
  const expiry = notifications.filter(n => n.type === 'expiry').length

  const filtered = filter === 'All' ? notifications
    : filter === 'Unread' ? notifications.filter(n => !n.read)
    : filter === 'Low Stock' ? notifications.filter(n => n.type === 'low_stock')
    : filter === 'Expiry' ? notifications.filter(n => n.type === 'expiry')
    : filter === 'Orders' ? notifications.filter(n => n.type === 'order')
    : notifications.filter(n => n.type === 'system')

  if (loading) return <div className="loading">Loading notifications...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button className="btn btn-secondary" onClick={markAllRead}><CheckCheck size={16} /> Mark All Read</button>
        )}
      </div>

      <div className="stats-grid">
        <StatCard title="Total" value={notifications.length} icon={Bell} color="#065f46" />
        <StatCard title="Unread" value={unread} icon={Bell} color="#D4AF37" />
        <StatCard title="Low Stock Alerts" value={lowStock} icon={AlertTriangle} color="#ef4444" />
        <StatCard title="Expiry Alerts" value={expiry} icon={Clock} color="#d97706" />
      </div>

      <div className="filter-buttons">
        {FILTERS.map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#a8a29e' }}>No notifications</div>
        )}
        {filtered.map(n => {
          const Icon = typeIcons[n.type] || Bell
          const color = typeColors[n.type] || '#78716c'
          return (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              style={{
                display: 'flex', gap: 14, padding: 16, borderRadius: 10,
                border: `1px solid ${n.read ? '#e7e5e4' : '#d6d3d1'}`,
                borderLeft: n.read ? '1px solid #e7e5e4' : '3px solid #D4AF37',
                background: n.read ? '#fafaf9' : 'white',
                cursor: n.read ? 'default' : 'pointer',
                transition: 'background 0.15s ease',
                boxShadow: n.read ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${color}12`, color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: n.read ? 500 : 700, fontSize: 14, color: '#1c1917' }}>{n.title}</span>
                  <span style={{ fontSize: 11, color: '#a8a29e', whiteSpace: 'nowrap', marginLeft: 12 }}>
                    {new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#57534e', margin: '4px 0 0', lineHeight: 1.5 }}>{n.message}</p>
              </div>
              {!n.read && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4AF37', flexShrink: 0, marginTop: 6 }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
