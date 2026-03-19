import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import StatCard from '../components/StatCard'
import { Activity, Clock, User, Search } from 'lucide-react'

const ACTION_FILTERS = ['All', 'Created', 'Updated', 'Deleted']
const ENTITY_TYPES = ['All', 'Product', 'Sale', 'Client', 'Distributor', 'Purchase Order', 'Return', 'Invoice', 'Batch']
const actionColors = { created: 'green', updated: 'blue', deleted: 'red' }

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('All')
  const [entityFilter, setEntityFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false })
    setLogs(data || [])
    setLoading(false)
  }

  // Client-side filtering
  const filtered = logs.filter(log => {
    if (actionFilter !== 'All' && log.action !== actionFilter.toLowerCase()) return false
    if (entityFilter !== 'All' && log.entity_type !== entityFilter) return false
    if (search && !log.details?.toLowerCase().includes(search.toLowerCase()) && !log.entity_name?.toLowerCase().includes(search.toLowerCase())) return false
    if (dateFrom && log.created_at < dateFrom) return false
    if (dateTo && log.created_at > dateTo + 'T23:59:59') return false
    return true
  })

  // Stats
  const today = new Date().toISOString().slice(0, 10)
  const todayCount = logs.filter(l => l.created_at?.startsWith(today)).length
  const userCounts = {}
  logs.forEach(l => { userCounts[l.user_name || 'Unknown'] = (userCounts[l.user_name || 'Unknown'] || 0) + 1 })
  const mostActiveUser = Object.entries(userCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
  const actionCounts = {}
  logs.forEach(l => { actionCounts[l.action] = (actionCounts[l.action] || 0) + 1 })
  const mostCommon = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  const columns = [
    {
      header: 'Timestamp', accessor: 'created_at',
      render: r => r.created_at ? (
        <span style={{ fontSize: 12 }}>
          {new Date(r.created_at).toLocaleDateString()} <span style={{ color: '#a8a29e' }}>{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </span>
      ) : ''
    },
    { header: 'User', accessor: 'user_name', render: r => <span style={{ fontWeight: 500 }}>{r.user_name || r.user_email || '—'}</span> },
    {
      header: 'Action', accessor: 'action',
      render: r => <span className={`badge badge-${actionColors[r.action] || 'gray'}`}>{r.action}</span>
    },
    { header: 'Entity', accessor: 'entity_type', render: r => <span className="badge badge-gold">{r.entity_type}</span> },
    { header: 'Name', accessor: 'entity_name', render: r => <span style={{ fontWeight: 600 }}>{r.entity_name}</span> },
    { header: 'Details', accessor: 'details', render: r => <span style={{ fontSize: 12, color: '#57534e' }}>{r.details}</span> },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Activity Log</h1>
          <p className="page-subtitle">Audit trail of all system actions</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Actions" value={logs.length} icon={Activity} color="#065f46" />
        <StatCard title="Actions Today" value={todayCount} icon={Clock} color="#D4AF37" />
        <StatCard title="Most Active User" value={mostActiveUser} icon={User} color="#059669" />
        <StatCard title="Most Common" value={mostCommon} icon={Activity} color="#10b981" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <div className="filter-buttons" style={{ marginBottom: 0 }}>
            {ACTION_FILTERS.map(f => (
              <button key={f} className={`btn ${actionFilter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActionFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className="form-group" style={{ margin: 0, minWidth: 160 }}>
          <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)}
            style={{ padding: '7px 10px', border: '1px solid #d6d3d1', borderRadius: 6, fontSize: 13, width: '100%' }}>
            {ENTITY_TYPES.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #d6d3d1', borderRadius: 6, fontSize: 13 }} />
          <span style={{ color: '#78716c', fontSize: 12 }}>to</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #d6d3d1', borderRadius: 6, fontSize: 13 }} />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'white', border: '1px solid #e7e5e4', borderRadius: 8 }}>
          <Search size={16} color="#a8a29e" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity details..."
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: 13, background: 'transparent' }} />
        </div>
      </div>

      {loading ? <p className="loading">Loading...</p> : (
        filtered.length > 0
          ? <DataTable columns={columns} data={filtered} />
          : <div style={{ textAlign: 'center', padding: 48, color: '#a8a29e' }}>No activity logged yet</div>
      )}
    </div>
  )
}
