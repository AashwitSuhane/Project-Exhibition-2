import React, { useState, useEffect } from 'react'
import { useNavigate }    from 'react-router-dom'
import { Filter, Search } from 'lucide-react'
import { useAuth }        from '../context/AuthContext'
import { useToast }       from '../context/ToastContext'
import { getEvents, registerEvent, getMyRegistrations } from '../services/api'
import EventCard          from '../components/EventCard'
import LoadingSpinner     from '../components/LoadingSpinner'
import EmptyState         from '../components/EmptyState'

const FILTERS = ['All', 'Workshop', 'Hackathon', 'Competition', 'Pitching', 'Sprint', 'Masterclass']
const STATUS_FILTERS = ['All', 'Upcoming', 'Full', 'Completed']

export default function EventsPage() {
  const { user }          = useAuth()
  const toast             = useToast()
  const navigate          = useNavigate()

  const [events,       setEvents]       = useState([])
  const [registered,   setRegistered]   = useState([])   // eventIds
  const [loading,      setLoading]      = useState(true)
  const [regLoading,   setRegLoading]   = useState(null) // eventId being registered
  const [search,       setSearch]       = useState('')
  const [catFilter,    setCatFilter]    = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const load = async () => {
      const [{ data }, myRegs] = await Promise.all([
        getEvents(),
        getMyRegistrations(user?.id),
      ])
      setEvents(data)
      setRegistered(myRegs.map(r => r.eventId))
      setLoading(false)
    }
    load()
  }, [user])

  const handleRegister = async (event) => {
    if (registered.includes(event.id)) return
    setRegLoading(event.id)
    try {
      await registerEvent(event.id, user.id)
      setRegistered(prev => [...prev, event.id])
      // refresh event capacity
      const { data } = await getEvents()
      setEvents(data)
      toast(`Registered for "${event.title}" ✓`, 'success')
    } catch (err) {
      toast(err.message || 'Registration failed', 'error')
    } finally {
      setRegLoading(null)
    }
  }

  const handleViewQR = (event) => {
    navigate('/my-qr', { state: { highlightEvent: event.id } })
  }

  // ── Filter logic ──────────────────────────────────────────────
  const filtered = events.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.club.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'All' || e.category === catFilter
    const matchStatus = statusFilter === 'All' ||
      (statusFilter === 'Upcoming'  && e.status === 'upcoming') ||
      (statusFilter === 'Full'      && e.status === 'full') ||
      (statusFilter === 'Completed' && e.status === 'completed')
    return matchSearch && matchCat && matchStatus
  })

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Search + filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events or clubs…"
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-surface-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="select-input text-sm py-2.5 pr-8 w-auto"
          >
            {STATUS_FILTERS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* ── Category pills ── */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setCatFilter(f)}
            className={`
              px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200
              ${catFilter === f
                ? 'bg-neon-400 text-surface-950 shadow-neon-sm'
                : 'bg-surface-800 text-surface-400 hover:text-surface-200 hover:bg-surface-700 border border-surface-700'}
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Results ── */}
      {loading ? (
        <LoadingSpinner size="lg" text="Loading events…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No events found"
          subtitle="Try adjusting your search or filters."
          action={
            <button onClick={() => { setSearch(''); setCatFilter('All'); setStatusFilter('All') }} className="btn-outline">
              Clear Filters
            </button>
          }
        />
      ) : (
        <>
          <p className="text-xs text-surface-500">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((event, i) => (
              <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <EventCard
                  event={event}
                  onRegister={handleRegister}
                  onViewQR={handleViewQR}
                  isRegistered={registered.includes(event.id)}
                  loading={regLoading === event.id}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
