import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isMockMode } from '../lib/supabase'

const AuthContext = createContext({})

// All available pages and their possible actions
export const ALL_PERMISSIONS = {
  'dashboard':        { label: 'Dashboard',        section: 'Overview',    actions: ['view'] },
  'notifications':    { label: 'Notifications',    section: 'Overview',    actions: ['view'] },
  'inventory':        { label: 'Inventory',        section: 'Operations',  actions: ['view', 'add', 'edit', 'delete'] },
  'sales':            { label: 'Sales',            section: 'Operations',  actions: ['view', 'add', 'edit', 'delete'] },
  'purchase-orders':  { label: 'Purchase Orders',  section: 'Operations',  actions: ['view', 'add', 'edit', 'delete'] },
  'returns':          { label: 'Returns',          section: 'Operations',  actions: ['view', 'add', 'edit', 'delete'] },
  'invoices':         { label: 'Invoices',         section: 'Operations',  actions: ['view', 'add', 'edit'] },
  'clients':          { label: 'Clients',          section: 'Network',     actions: ['view', 'add', 'edit', 'delete'] },
  'distributors':     { label: 'Distributors',     section: 'Network',     actions: ['view', 'add', 'edit', 'delete'] },
  'batch-tracking':   { label: 'Batch Tracking',   section: 'Tracking',    actions: ['view', 'add', 'edit', 'delete'] },
  'stock-flow':       { label: 'Stock Flow',       section: 'Tracking',    actions: ['view', 'add'] },
  'sales-flow':       { label: 'Sales Flow',       section: 'Tracking',    actions: ['view'] },
  'cash-flow':        { label: 'Cash Flow',        section: 'Tracking',    actions: ['view', 'add', 'edit', 'delete'] },
  'reports':          { label: 'Reports',          section: 'Admin',       actions: ['view'] },
  'activity-log':     { label: 'Activity Log',     section: 'Admin',       actions: ['view'] },
  'features':         { label: 'Features',         section: 'Admin',       actions: ['view'] },
  'user-management':  { label: 'User Management',  section: 'Admin',       actions: ['view', 'edit'] },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        if (isMockMode) {
          // In mock mode, give admin profile
          setProfile({ is_admin: true, permissions: {} })
          setLoading(false)
        } else {
          fetchProfile(u.id).then(() => setLoading(false))
        }
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Can the user see this page? Dashboard is always accessible.
  const canAccess = (page) => {
    if (page === 'dashboard') return true
    if (!profile) return false
    if (profile.is_admin) return true
    const perms = profile.permissions?.[page]
    return Array.isArray(perms) && perms.includes('view')
  }

  // Can the user perform a specific action on a page?
  const canDo = (page, action) => {
    if (!profile) return false
    if (profile.is_admin) return true
    const perms = profile.permissions?.[page]
    return Array.isArray(perms) && perms.includes(action)
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signIn, signUp, signOut,
      canAccess, canDo,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
