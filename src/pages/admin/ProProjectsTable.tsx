import { useState, useMemo } from 'react'
import {
  Search, Plus, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  Pencil, Trash2, ExternalLink, FolderX, MoreVertical,
  CheckCircle, Zap, Shield, Sparkles, X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { type Project } from '../../context/SiteContext'
import ConfirmationModal from './ConfirmationModal'
import { TableSkeleton } from './SkeletonLoader'

interface ProProjectsTableProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onAdd: () => void
  isLoading?: boolean
}

type SortField = 'title' | 'client' | 'year' | 'capacity' | 'category'

export default function ProProjectsTable({
  projects,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: ProProjectsTableProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortField, setSortField] = useState<SortField>('year')
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  // Confirmation modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(projects.map(p => p.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [projects])

  // Filtered and sorted projects
  const filtered = useMemo(() => {
    return projects.filter(p => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.capacity.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)

      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter

      return matchesSearch && matchesCat
    })
  }, [projects, search, categoryFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA = (a[sortField] || '').toLowerCase()
      let valB = (b[sortField] || '').toLowerCase()
      if (sortField === 'year') {
        valA = a.year || ''
        valB = b.year || ''
      }
      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1 : -1
      return 0
    })
  }, [filtered, sortField, sortAsc])

  // Pagination calculation
  const totalPages = Math.ceil(sorted.length / pageSize) || 1
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      onDelete(projectToDelete.id)
      setProjectToDelete(null)
    }
  }

  if (isLoading) {
    return <TableSkeleton rows={5} />
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      {/* ── Table Top Bar & Controls ────────────────────────────────────────── */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3
                  style={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#0F172A',
                    margin: 0,
                  }}
                >
                  Engineered Power Projects
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono,monospace',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: '#FEF3C7',
                    color: '#92400E',
                  }}
                >
                  {projects.length} Total
                </span>
              </div>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', margin: '3px 0 0' }}>
                Grid substations, solar PV power plants, and industrial electrical infrastructure
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Search Input Filter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: 8,
                padding: '0 10px',
                height: 36,
                width: 'clamp(180px, 26vw, 260px)',
              }}
            >
              <Search size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search projects, client, specs…"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 12.5,
                  fontFamily: 'Outfit,sans-serif',
                  color: '#0F172A',
                  width: '100%',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#94A3B8' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Create Project CTA Button */}
            <button
              type="button"
              onClick={onAdd}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                background: '#C47D0E',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'Outfit,sans-serif',
                fontWeight: 600,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(196, 125, 14, 0.28)',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#A86C0C')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#C47D0E')}
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {categories.map(cat => {
            const isSelected = categoryFilter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategoryFilter(cat); setPage(1); }}
                style={{
                  padding: '4px 12px',
                  borderRadius: 99,
                  border: isSelected ? '1px solid #C47D0E' : '1px solid #E2E8F0',
                  background: isSelected ? '#FEF3C7' : '#FFFFFF',
                  color: isSelected ? '#92400E' : '#64748B',
                  fontSize: 11.5,
                  fontFamily: 'Outfit,sans-serif',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Main Data Table ─────────────────────────────────────────────────── */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 650 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th
                onClick={() => handleSort('title')}
                style={{
                  padding: '12px 18px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  fontFamily: 'Outfit,sans-serif',
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Project & Client</span>
                  {sortField === 'title' ? (
                    sortAsc ? <ArrowUp size={12} style={{ color: '#C47D0E' }} /> : <ArrowDown size={12} style={{ color: '#C47D0E' }} />
                  ) : (
                    <ArrowUpDown size={11} style={{ color: '#CBD5E1' }} />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('category')}
                style={{
                  padding: '12px 14px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  fontFamily: 'Outfit,sans-serif',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Category</span>
                  {sortField === 'category' ? (
                    sortAsc ? <ArrowUp size={12} style={{ color: '#C47D0E' }} /> : <ArrowDown size={12} style={{ color: '#C47D0E' }} />
                  ) : (
                    <ArrowUpDown size={11} style={{ color: '#CBD5E1' }} />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('capacity')}
                style={{
                  padding: '12px 14px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  fontFamily: 'Outfit,sans-serif',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Capacity</span>
                  {sortField === 'capacity' ? (
                    sortAsc ? <ArrowUp size={12} style={{ color: '#C47D0E' }} /> : <ArrowDown size={12} style={{ color: '#C47D0E' }} />
                  ) : (
                    <ArrowUpDown size={11} style={{ color: '#CBD5E1' }} />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('year')}
                style={{
                  padding: '12px 14px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  fontFamily: 'Outfit,sans-serif',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Year</span>
                  {sortField === 'year' ? (
                    sortAsc ? <ArrowUp size={12} style={{ color: '#C47D0E' }} /> : <ArrowDown size={12} style={{ color: '#C47D0E' }} />
                  ) : (
                    <ArrowUpDown size={11} style={{ color: '#CBD5E1' }} />
                  )}
                </div>
              </th>

              <th
                style={{
                  padding: '12px 18px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  fontFamily: 'Outfit,sans-serif',
                  textAlign: 'right',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: '#F1F5F9',
                        color: '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FolderX size={24} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
                        No projects found
                      </div>
                      <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', maxWidth: 320, margin: '4px auto 0' }}>
                        {search
                          ? `No projects matched "${search}". Try resetting your search filter.`
                          : 'You have not added any engineered projects yet.'}
                      </p>
                    </div>
                    {search ? (
                      <button
                        type="button"
                        onClick={() => { setSearch(''); setCategoryFilter('All'); }}
                        style={{
                          marginTop: 8,
                          padding: '6px 14px',
                          borderRadius: 6,
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          color: '#334155',
                          fontSize: 12,
                          fontFamily: 'Outfit,sans-serif',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Reset Filters
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onAdd}
                        style={{
                          marginTop: 8,
                          padding: '6px 16px',
                          borderRadius: 6,
                          background: '#C47D0E',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontFamily: 'Outfit,sans-serif',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={12} style={{ display: 'inline', marginRight: 4 }} />
                        Create First Project
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((p, idx) => {
                return (
                  <tr
                    key={p.id || idx}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#FBFBFB')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    {/* Project & Client */}
                    <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Thumbnail / Accent box */}
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 6,
                            background: p.img ? `url(${p.img}) center/cover no-repeat` : (p.imgColor || '#D4CFC5'),
                            border: '1px solid #E2E8F0',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {!p.img && <Zap size={15} style={{ color: 'rgba(0,0,0,0.4)' }} />}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: 'Outfit,sans-serif',
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: '#0F172A',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 300,
                            }}
                          >
                            {p.title || 'Untitled Project'}
                          </div>
                          <div
                            style={{
                              fontFamily: 'Outfit,sans-serif',
                              fontSize: 11.5,
                              color: '#64748B',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              marginTop: 2,
                            }}
                          >
                            <span>{p.client || 'Client N/A'}</span>
                            {p.location && (
                              <>
                                <span>·</span>
                                <span>{p.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: '#F1F5F9',
                          color: '#334155',
                          fontSize: 11,
                          fontFamily: 'JetBrains Mono,monospace',
                          fontWeight: 500,
                          maxWidth: 160,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.category || 'General'}
                      </span>
                    </td>

                    {/* Capacity */}
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <div
                        style={{
                          fontFamily: 'Outfit,sans-serif',
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: '#C47D0E',
                        }}
                      >
                        {p.capacity || '—'}
                      </div>
                    </td>

                    {/* Year */}
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontFamily: 'Outfit,sans-serif',
                          fontSize: 12,
                          color: '#64748B',
                          fontWeight: 500,
                        }}
                      >
                        {p.year || '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          title="Edit project"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            border: '1px solid #E2E8F0',
                            background: '#FFFFFF',
                            color: '#475569',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement
                            el.style.borderColor = '#CBD5E1'
                            el.style.color = '#C47D0E'
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement
                            el.style.borderColor = '#E2E8F0'
                            el.style.color = '#475569'
                          }}
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setProjectToDelete(p)}
                          title="Delete project"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            border: '1px solid #E2E8F0',
                            background: '#FFFFFF',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement
                            el.style.borderColor = '#FCA5A5'
                            el.style.background = '#FEE2E2'
                            el.style.color = '#DC2626'
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement
                            el.style.borderColor = '#E2E8F0'
                            el.style.background = '#FFFFFF'
                            el.style.color = '#94A3B8'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Footer ───────────────────────────────────────────────── */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: '1px solid #E2E8F0',
          background: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>
          <span>
            Showing <strong style={{ color: '#0F172A' }}>{sorted.length ? (page - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong style={{ color: '#0F172A' }}>{Math.min(page * pageSize, sorted.length)}</strong> of{' '}
            <strong style={{ color: '#0F172A' }}>{sorted.length}</strong> projects
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={{
                height: 26,
                padding: '0 4px',
                borderRadius: 4,
                border: '1px solid #CBD5E1',
                fontSize: 11.5,
                fontFamily: 'Outfit,sans-serif',
                color: '#0F172A',
                background: '#FFFFFF',
                outline: 'none',
              }}
            >
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: 6,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: page === 1 ? '#CBD5E1' : '#334155',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1
            const isCurrent = pageNum === page
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setPage(pageNum)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: isCurrent ? '1px solid #C47D0E' : '1px solid #E2E8F0',
                  background: isCurrent ? '#C47D0E' : '#FFFFFF',
                  color: isCurrent ? '#FFFFFF' : '#334155',
                  fontSize: 12,
                  fontFamily: 'Outfit,sans-serif',
                  fontWeight: isCurrent ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: 6,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: page === totalPages ? '#CBD5E1' : '#334155',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Confirmation Modal for Delete ───────────────────────────────────── */}
      <ConfirmationModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Engineered Project"
        message={`Are you sure you want to delete "${projectToDelete?.title || 'this project'}"? This action cannot be undone.`}
        confirmText="Delete Project"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  )
}
