import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ columns, data, onRowClick, searchable = true, pageSize = 10 }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const filtered = data.filter(row =>
    !search || columns.some(col => {
      const val = col.accessor ? row[col.accessor] : ''
      return String(val).toLowerCase().includes(search.toLowerCase())
    })
  )

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0
    const aVal = a[sortCol] ?? ''
    const bVal = b[sortCol] ?? ''
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const handleSort = (accessor) => {
    if (sortCol === accessor) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(accessor)
      setSortDir('asc')
    }
  }

  return (
    <div className="data-table-wrapper">
      {searchable && (
        <div className="data-table-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
      )}

      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.accessor || col.header}
                  onClick={() => col.accessor && handleSort(col.accessor)}
                  style={{ cursor: col.accessor ? 'pointer' : 'default' }}
                >
                  {col.header}
                  {sortCol === col.accessor && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length} className="empty-row">No data found</td></tr>
            ) : (
              paged.map((row, i) => (
                <tr
                  key={row.id || i}
                  onClick={() => onRowClick?.(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map(col => (
                    <td key={col.accessor || col.header}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="data-table-pagination">
          <span>{sorted.length} total results</span>
          <div className="pagination-controls">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={16} />
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
