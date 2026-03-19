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

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
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
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/distributors" element={<ProtectedRoute><Distributors /></ProtectedRoute>} />
      <Route path="/stock-flow" element={<ProtectedRoute><StockFlow /></ProtectedRoute>} />
      <Route path="/sales-flow" element={<ProtectedRoute><SalesFlow /></ProtectedRoute>} />
      <Route path="/cash-flow" element={<ProtectedRoute><CashFlow /></ProtectedRoute>} />
      <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/batch-tracking" element={<ProtectedRoute><BatchTracking /></ProtectedRoute>} />
      <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
      <Route path="/activity-log" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
      <Route path="/features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
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
