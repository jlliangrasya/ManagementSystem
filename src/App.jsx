import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import Clients from './pages/Clients'
import Distributors from './pages/Distributors'
import StockFlow from './pages/StockFlow'
import SalesFlow from './pages/SalesFlow'
import CashFlow from './pages/CashFlow'
import PurchaseOrders from './pages/PurchaseOrders'
import Invoices from './pages/Invoices'
import Reports from './pages/Reports'
import Notifications from './pages/Notifications'
import BatchTracking from './pages/BatchTracking'
import Returns from './pages/Returns'
import ActivityLog from './pages/ActivityLog'
import Features from './pages/Features'
import UserManagement from './pages/UserManagement'

function ProtectedRoute({ children, permission }) {
  const { user, loading, canAccess } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (permission && !canAccess(permission)) {
    return <Navigate to="/" replace />
  }

  return <Layout>{children}</Layout>
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute permission="dashboard"><Dashboard /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute permission="inventory"><Inventory /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute permission="sales"><Sales /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute permission="clients"><Clients /></ProtectedRoute>} />
      <Route path="/distributors" element={<ProtectedRoute permission="distributors"><Distributors /></ProtectedRoute>} />
      <Route path="/stock-flow" element={<ProtectedRoute permission="stock-flow"><StockFlow /></ProtectedRoute>} />
      <Route path="/sales-flow" element={<ProtectedRoute permission="sales-flow"><SalesFlow /></ProtectedRoute>} />
      <Route path="/cash-flow" element={<ProtectedRoute permission="cash-flow"><CashFlow /></ProtectedRoute>} />
      <Route path="/purchase-orders" element={<ProtectedRoute permission="purchase-orders"><PurchaseOrders /></ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute permission="invoices"><Invoices /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute permission="reports"><Reports /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute permission="notifications"><Notifications /></ProtectedRoute>} />
      <Route path="/batch-tracking" element={<ProtectedRoute permission="batch-tracking"><BatchTracking /></ProtectedRoute>} />
      <Route path="/returns" element={<ProtectedRoute permission="returns"><Returns /></ProtectedRoute>} />
      <Route path="/activity-log" element={<ProtectedRoute permission="activity-log"><ActivityLog /></ProtectedRoute>} />
      <Route path="/features" element={<ProtectedRoute permission="features"><Features /></ProtectedRoute>} />
      <Route path="/user-management" element={<ProtectedRoute permission="user-management"><UserManagement /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
