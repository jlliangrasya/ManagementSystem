// ============================================
// Mock Supabase Client — works fully offline
// Mimics the Supabase JS query builder API
// ============================================

import {
  products, clients, distributors, sales, sale_items, stock_movements, transactions,
  purchase_orders, purchase_order_items, invoices, batches,
  returns, return_items, activity_log, notifications
} from './mockData'

// Deep clone to avoid mutation issues
const clone = (data) => JSON.parse(JSON.stringify(data))

// In-memory data store
const store = {
  products: clone(products),
  clients: clone([...clients, ...distributors]),
  sales: clone(sales),
  sale_items: clone(sale_items),
  stock_movements: clone(stock_movements),
  transactions: clone(transactions),
  purchase_orders: clone(purchase_orders),
  purchase_order_items: clone(purchase_order_items),
  invoices: clone(invoices),
  batches: clone(batches),
  returns: clone(returns),
  return_items: clone(return_items),
  activity_log: clone(activity_log),
  notifications: clone(notifications),
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

// Simulates the chained query builder
function createQueryBuilder(tableName) {
  let data = clone(store[tableName] || [])
  let selectFields = '*'
  let filters = []
  let orderCol = null
  let orderAsc = true
  let limitCount = null
  let isInsert = false
  let isUpdate = false
  let isDelete = false
  let insertData = null
  let updateData = null

  const builder = {
    select(fields = '*') {
      selectFields = fields
      return builder
    },

    eq(col, val) {
      filters.push({ type: 'eq', col, val })
      return builder
    },

    neq(col, val) {
      filters.push({ type: 'neq', col, val })
      return builder
    },

    gt(col, val) {
      filters.push({ type: 'gt', col, val })
      return builder
    },

    gte(col, val) {
      filters.push({ type: 'gte', col, val })
      return builder
    },

    lt(col, val) {
      filters.push({ type: 'lt', col, val })
      return builder
    },

    lte(col, val) {
      filters.push({ type: 'lte', col, val })
      return builder
    },

    in(col, vals) {
      filters.push({ type: 'in', col, vals })
      return builder
    },

    order(col, opts = {}) {
      orderCol = col
      orderAsc = opts.ascending !== false
      return builder
    },

    limit(n) {
      limitCount = n
      return builder
    },

    single() {
      limitCount = 1
      return builder.then(result => {
        if (result.data && Array.isArray(result.data)) {
          return { data: result.data[0] || null, error: null }
        }
        return result
      })
    },

    // Terminal: resolve the query
    then(resolve) {
      const result = builder._execute()
      return Promise.resolve(result).then(resolve)
    },

    _execute() {
      // INSERT
      if (isInsert) {
        const rows = insertData.map(row => ({
          id: uuid(),
          created_at: new Date().toISOString(),
          ...row,
        }))
        store[tableName] = [...store[tableName], ...rows]
        return { data: rows, error: null }
      }

      // UPDATE
      if (isUpdate) {
        let updated = []
        store[tableName] = store[tableName].map(row => {
          const match = filters.every(f => applyFilter(row, f))
          if (match) {
            const newRow = { ...row, ...updateData, updated_at: new Date().toISOString() }
            updated.push(newRow)
            return newRow
          }
          return row
        })
        return { data: updated, error: null }
      }

      // DELETE
      if (isDelete) {
        const before = store[tableName].length
        store[tableName] = store[tableName].filter(row => {
          return !filters.every(f => applyFilter(row, f))
        })
        return { data: null, error: null, count: before - store[tableName].length }
      }

      // SELECT
      let result = clone(store[tableName])

      // Apply filters
      result = result.filter(row => filters.every(f => applyFilter(row, f)))

      // Handle relational selects like '*, clients(name), sale_items(*)'
      if (selectFields && selectFields !== '*') {
        result = result.map(row => resolveRelations(row, selectFields, tableName))
      }

      // Order
      if (orderCol) {
        result.sort((a, b) => {
          const aVal = a[orderCol] ?? ''
          const bVal = b[orderCol] ?? ''
          const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
          return orderAsc ? cmp : -cmp
        })
      }

      // Limit
      if (limitCount) {
        result = result.slice(0, limitCount)
      }

      return { data: result, error: null }
    },
  }

  // Attach insert/update/delete as initial methods
  builder.insert = (rows) => {
    isInsert = true
    insertData = Array.isArray(rows) ? rows : [rows]
    return builder
  }

  builder.update = (data) => {
    isUpdate = true
    updateData = data
    return builder
  }

  builder.delete = () => {
    isDelete = true
    return builder
  }

  return builder
}

function applyFilter(row, filter) {
  const val = row[filter.col]
  switch (filter.type) {
    case 'eq': return val === filter.val
    case 'neq': return val !== filter.val
    case 'gt': return val > filter.val
    case 'gte': return val >= filter.val
    case 'lt': return val < filter.val
    case 'lte': return val <= filter.val
    case 'in': return filter.vals.includes(val)
    default: return true
  }
}

// Resolve relational fields from the select string
// e.g., '*, clients(name), sale_items(*)' will look up related data
function resolveRelations(row, selectStr) {
  // Already have embedded relations from mock data? Keep them.
  // Parse for patterns like "tableName(fields)"
  const relationRegex = /(\w+)\(([^)]*)\)/g
  let match
  while ((match = relationRegex.exec(selectStr)) !== null) {
    const relTable = match[1]
    const relFields = match[2]

    // If the relation data is already embedded (from mock), skip
    if (row[relTable]) continue

    // Try to find by foreign key convention: relTable_id or singularized
    const fkCol = relTable.replace(/s$/, '') + '_id'
    if (row[fkCol] && store[relTable]) {
      const related = store[relTable].filter(r => r.id === row[fkCol])
      if (relFields === '*') {
        row[relTable] = related.length === 1 ? related[0] : related
      } else {
        const fields = relFields.split(',').map(f => f.trim())
        const picked = related.map(r => {
          const obj = {}
          fields.forEach(f => { obj[f] = r[f] })
          return obj
        })
        row[relTable] = picked.length === 1 ? picked[0] : picked
      }
    }

    // For sale_items, look up by sale_id
    if (relTable === 'sale_items' && row.id) {
      const items = clone(store.sale_items || []).filter(si => si.sale_id === row.id)
      if (relFields.includes('products')) {
        items.forEach(item => {
          if (!item.products && item.product_id) {
            const prod = store.products.find(p => p.id === item.product_id)
            item.products = prod ? { name: prod.name } : null
          }
        })
      }
      row.sale_items = items
    }

    // For purchase_order_items, look up by purchase_order_id
    if (relTable === 'purchase_order_items' && row.id) {
      const items = clone(store.purchase_order_items || []).filter(poi => poi.purchase_order_id === row.id)
      if (relFields.includes('products')) {
        items.forEach(item => {
          if (!item.products && item.product_id) {
            const prod = store.products.find(p => p.id === item.product_id)
            item.products = prod ? { name: prod.name } : null
          }
        })
      }
      row.purchase_order_items = items
    }

    // For return_items, look up by return_id
    if (relTable === 'return_items' && row.id) {
      const items = clone(store.return_items || []).filter(ri => ri.return_id === row.id)
      if (relFields.includes('products')) {
        items.forEach(item => {
          if (!item.products && item.product_id) {
            const prod = store.products.find(p => p.id === item.product_id)
            item.products = prod ? { name: prod.name } : null
          }
        })
      }
      row.return_items = items
    }
  }

  return row
}

// Mock auth
const authListeners = new Set()
let currentUser = {
  id: 'mock-user-001',
  email: 'demo@cavella.com',
  user_metadata: { name: 'Demo User' },
}

export const mockSupabase = {
  from(tableName) {
    return createQueryBuilder(tableName)
  },

  auth: {
    getSession() {
      return Promise.resolve({
        data: {
          session: currentUser ? { user: currentUser } : null
        }
      })
    },

    onAuthStateChange(callback) {
      authListeners.add(callback)
      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners.delete(callback)
            }
          }
        }
      }
    },

    signInWithPassword({ email }) {
      currentUser = { id: 'mock-user-001', email, user_metadata: { name: 'Demo User' } }
      authListeners.forEach(cb => cb('SIGNED_IN', { user: currentUser }))
      return Promise.resolve({ data: { user: currentUser }, error: null })
    },

    signUp({ email }) {
      currentUser = { id: 'mock-user-001', email, user_metadata: { name: 'Demo User' } }
      authListeners.forEach(cb => cb('SIGNED_IN', { user: currentUser }))
      return Promise.resolve({ data: { user: currentUser }, error: null })
    },

    signOut() {
      currentUser = null
      authListeners.forEach(cb => cb('SIGNED_OUT', null))
      return Promise.resolve({ error: null })
    }
  }
}
