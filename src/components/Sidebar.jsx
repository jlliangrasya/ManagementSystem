import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck,
  ArrowLeftRight, TrendingUp, DollarSign, LogOut, Menu, X,
  ClipboardList, FileText, BarChart3, Bell, Layers, RotateCcw,
  Activity, Shield
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/notifications', icon: Bell, label: 'Notifications' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { to: '/inventory', icon: Package, label: 'Inventory' },
      { to: '/sales', icon: ShoppingCart, label: 'Sales' },
      { to: '/purchase-orders', icon: ClipboardList, label: 'Purchase Orders' },
      { to: '/returns', icon: RotateCcw, label: 'Returns' },
      { to: '/invoices', icon: FileText, label: 'Invoices' },
    ]
  },
  {
    label: 'Network',
    items: [
      { to: '/clients', icon: Users, label: 'Clients' },
      { to: '/distributors', icon: Truck, label: 'Distributors' },
    ]
  },
  {
    label: 'Tracking',
    items: [
      { to: '/batch-tracking', icon: Layers, label: 'Batch Tracking' },
      { to: '/stock-flow', icon: ArrowLeftRight, label: 'Stock Flow' },
      { to: '/sales-flow', icon: TrendingUp, label: 'Sales Flow' },
      { to: '/cash-flow', icon: DollarSign, label: 'Cash Flow' },
    ]
  },
  {
    label: 'Admin',
    items: [
      { to: '/reports', icon: BarChart3, label: 'Reports' },
      { to: '/activity-log', icon: Activity, label: 'Activity Log' },
    ]
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { signOut } = useAuth()

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>Cavella</h2>}
        <button className="btn-icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navSections.map(section => (
          <div key={section.label}>
            {!collapsed && (
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                color: 'rgba(255,255,255,0.25)',
                padding: '16px 14px 6px',
              }}>
                {section.label}
              </div>
            )}
            {section.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && label === 'Notifications' && <NotificationBell />}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={signOut}>
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
