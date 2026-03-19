import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isMockMode } from '../lib/supabase'

const AuthContext = createContext({})

// Role definitions with permissions
const ROLES = {
  admin: {
    label: 'Admin',
    permissions: ['*'], // everything
  },
  manager: {
    label: 'Manager',
    permissions: [
      'dashboard', 'inventory', 'sales', 'clients', 'distributors',
      'purchase-orders', 'invoices', 'returns', 'batch-tracking',
      'stock-flow', 'sales-flow', 'cash-flow', 'reports', 'notifications',
    ],
  },
  staff: {
    label: 'Staff',
    permissions: [
      'dashboard', 'inventory', 'sales', 'clients',
      'stock-flow', 'batch-tracking', 'notifications',
    ],
  },
  viewer: {
    label: 'Viewer',
    permissions: [
      'dashboard', 'reports', 'sales-flow', 'notifications',
    ],
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('admin') // default role
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      // In mock mode, auto-assign admin role
      if (u && isMockMode) {
        setRole(u.user_metadata?.role || 'admin')
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

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
  }

  const hasPermission = (page) => {
    const roleConfig = ROLES[role]
    if (!roleConfig) return false
    if (roleConfig.permissions.includes('*')) return true
    return roleConfig.permissions.includes(page)
  }

  const setUserRole = (newRole) => {
    if (ROLES[newRole]) {
      setRole(newRole)
    }
  }

  return (
    <AuthContext.Provider value={{
      user, loading, role, roles: ROLES,
      signIn, signUp, signOut,
      hasPermission, setUserRole,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
