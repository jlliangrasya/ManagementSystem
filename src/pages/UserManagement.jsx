import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth, ALL_PERMISSIONS } from '../context/AuthContext'
import Modal from '../components/Modal'
import { Shield, Edit2, Users, CheckCircle } from 'lucide-react'

const sections = ['Overview', 'Operations', 'Network', 'Tracking', 'Admin']

export default function UserManagement() {
  const { profile: currentProfile, canDo } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [editPermissions, setEditPermissions] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })
    setUsers(data || [])
    setLoading(false)
  }

  function openEdit(user) {
    setEditingUser(user)
    setEditPermissions(user.permissions || {})
  }

  function closeEdit() {
    setEditingUser(null)
    setEditPermissions({})
  }

  function toggleAction(page, action) {
    setEditPermissions(prev => {
      const current = prev[page] || []
      let updated

      if (action === 'view' && current.includes('view')) {
        // Removing view removes all actions for this page
        updated = { ...prev }
        delete updated[page]
        return updated
      }

      if (action !== 'view' && !current.includes('view')) {
        // Adding any action auto-adds view
        updated = { ...prev, [page]: [...new Set([...current, 'view', action])] }
      } else if (current.includes(action)) {
        updated = { ...prev, [page]: current.filter(a => a !== action) }
      } else {
        updated = { ...prev, [page]: [...current, action] }
      }

      // Clean up empty arrays
      if (updated[page]?.length === 0) {
        delete updated[page]
      }

      return updated
    })
  }

  function selectAll() {
    const allPerms = {}
    Object.entries(ALL_PERMISSIONS).forEach(([page, config]) => {
      allPerms[page] = [...config.actions]
    })
    setEditPermissions(allPerms)
  }

  function clearAll() {
    setEditPermissions({})
  }

  async function handleSave() {
    if (!editingUser) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ permissions: editPermissions, updated_at: new Date().toISOString() })
      .eq('id', editingUser.id)

    if (error) {
      alert('Error updating permissions: ' + error.message)
    } else {
      closeEdit()
      fetchUsers()
    }
    setSaving(false)
  }

  const permCount = (perms) => {
    if (!perms || typeof perms !== 'object') return 0
    return Object.keys(perms).filter(k => perms[k]?.includes('view')).length
  }

  const totalPages = Object.keys(ALL_PERMISSIONS).length

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="page-subtitle">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#06594615', color: '#065f46' }}>
            <Users size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Total Users</span>
            <span className="stat-card-value">{users.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: '#D4AF3715', color: '#D4AF37' }}>
            <Shield size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">Admins</span>
            <span className="stat-card-value">{users.filter(u => u.is_admin).length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {users.map(u => (
            <div
              key={u.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)',
                borderRadius: 12, padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: u.is_admin ? '#065f46' : '#e7e5e4',
                  color: u.is_admin ? '#fff' : '#57534e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 15,
                }}>
                  {(u.full_name || u.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {u.full_name || 'No name'}
                    {u.is_admin && (
                      <span style={{
                        marginLeft: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: 0.8, color: '#D4AF37', background: '#D4AF3715',
                        padding: '2px 8px', borderRadius: 4,
                      }}>
                        Admin
                      </span>
                    )}
                    {u.id === currentProfile?.id && (
                      <span style={{
                        marginLeft: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: 0.8, color: '#065f46', background: '#06594615',
                        padding: '2px 8px', borderRadius: 4,
                      }}>
                        You
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#78716c' }}>{u.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#78716c' }}>
                  {u.is_admin ? 'Full access' : `${permCount(u.permissions)} / ${totalPages} pages`}
                </span>
                {canDo('user-management', 'edit') && !u.is_admin && (
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openEdit(u)}>
                    <Edit2 size={14} /> Permissions
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingUser && (
        <Modal title={`Permissions — ${editingUser.full_name || editingUser.email}`} onClose={closeEdit} wide>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 12px' }} onClick={selectAll}>
              Select All
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 12px' }} onClick={clearAll}>
              Clear All
            </button>
          </div>

          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {sections.map(section => {
              const pages = Object.entries(ALL_PERMISSIONS).filter(([, c]) => c.section === section)
              if (pages.length === 0) return null
              return (
                <div key={section} style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 1.2, color: '#78716c', marginBottom: 8,
                  }}>
                    {section}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e7e5e4' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600 }}>Page</th>
                        <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, fontWeight: 600, width: 70 }}>View</th>
                        <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, fontWeight: 600, width: 70 }}>Add</th>
                        <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, fontWeight: 600, width: 70 }}>Edit</th>
                        <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, fontWeight: 600, width: 70 }}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.map(([pageKey, config]) => {
                        const currentPerms = editPermissions[pageKey] || []
                        return (
                          <tr key={pageKey} style={{ borderBottom: '1px solid #f5f5f4' }}>
                            <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 500 }}>{config.label}</td>
                            {['view', 'add', 'edit', 'delete'].map(action => {
                              const isLocked = pageKey === 'dashboard' && action === 'view'
                              return (
                                <td key={action} style={{ textAlign: 'center', padding: '8px 12px' }}>
                                  {config.actions.includes(action) ? (
                                    <input
                                      type="checkbox"
                                      checked={isLocked || currentPerms.includes(action)}
                                      onChange={() => !isLocked && toggleAction(pageKey, action)}
                                      disabled={isLocked}
                                      style={{ width: 16, height: 16, cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.5 : 1 }}
                                      title={isLocked ? 'Dashboard is always accessible' : ''}
                                    />
                                  ) : (
                                    <span style={{ color: '#d6d3d1' }}>—</span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>

          <div className="modal-actions" style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#78716c' }}>
              <CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {Object.keys(editPermissions).filter(k => editPermissions[k]?.includes('view')).length} pages enabled
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={closeEdit}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
