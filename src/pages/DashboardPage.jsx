import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays, Users, Building2, Zap,
  ArrowRight, Clock, TrendingUp,
} from 'lucide-react'
import { useAuth }     from '../context/AuthContext'
import { getDashboardStats, getMyRegistrations } from '../services/api'
import StatCard        from '../components/StatCard'
import LoadingSpinner  from '../components/LoadingSpinner'
import { formatDate, getColor, capacityPercent } from '../utils/helpers'

export default function DashboardPage() {
  const { user }  = useAuth()
  const [stats,   setStats]   = useState(null)
  const [myRegs,  setMyRegs]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [s, r] = await Promise.all([
        getDashboardStats(),
        getMyRegistrations(user?.id),
      ])
      setStats(s)
      setMyRegs(r)
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) return <LoadingSpinner size="lg" text="Loading dashboard…" />

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Greeting banner ── */}
      <div className="glass-card p-6 flex items-center gap-5 border border-neon-400/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-400/5 to-transparent pointer-events-none" />
        <div className="w-12 h-12 bg-neon-400/20 border border-neon-400/30 rounded-2xl flex items-center justify-center text-2xl shrink-0">
          {user?.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-surface-400 text-sm">{greeting},</p>
          <h2 className="font-display text-2xl font-bold text-surface-50 truncate">{user?.name} 👋</h2>
          <p className="text-xs text-surface-500 mt-0.5">
            {myRegs.length > 0
              ? `You have ${myRegs.length} event registration${myRegs.length > 1 ? 's' : ''}. Keep it up!`
              : 'Browse events and register for your first one!'}
          </p>
        </div>
        <Link to="/events" className="btn-primary shrink-0 hidden sm:flex">
          Browse Events <ArrowRight size={15} />
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div>
        <h3 className="section-title">Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={CalendarDays}
            color="neon"
            trend="+2 this month"
          />
          <StatCard
            title="Upcoming"
            value={stats.upcomingEvents}
            icon={Clock}
            color="aqua"
            sub="events scheduled"
          />
          <StatCard
            title="My Registrations"
            value={myRegs.length}
            icon={TrendingUp}
            color="ember"
            sub="events joined"
          />
          <StatCard
            title="Clubs"
            value={stats.totalClubs}
            icon={Building2}
            color="rose"
            sub="active clubs"
          />
        </div>
      </div>

      {/* ── Two-column layout: Recent events + My registrations ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent events */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">Recent Events</h3>
            <Link to="/events" className="text-xs text-neon-300 hover:text-neon-400 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentEvents.map((evt, i) => {
              const c   = getColor(evt.color)
              const pct = capacityPercent(evt.registered, evt.capacity)
              return (
                <div
                  key={evt.id}
                  className="glass-card p-4 flex items-center gap-4 hover:border-surface-600 transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${c.bg} border ${c.border}`}>
                    {evt.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-surface-100 text-sm truncate">{evt.title}</p>
                    <p className="text-xs text-surface-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><CalendarDays size={10} />{formatDate(evt.date)}</span>
                      <span>·</span>
                      <span>{evt.club}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`badge ${c.bg} ${c.text} border ${c.border} text-[10px]`}>
                      {evt.status === 'completed' ? 'Done' : evt.status === 'full' ? 'Full' : 'Open'}
                    </span>
                    <p className="text-xs text-surface-500 mt-1">{pct}% full</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* My registrations */}
        <div>
          <h3 className="section-title">My Registrations</h3>
          {myRegs.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-surface-400 text-sm">No registrations yet.</p>
              <Link to="/events" className="btn-outline text-xs mt-4 inline-flex">
                Find Events
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myRegs.slice(0, 4).map((reg, i) => (
                <div
                  key={reg.id}
                  className="glass-card p-4 animate-slide-up"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <p className="font-semibold text-surface-100 text-sm truncate">{reg.eventTitle}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{reg.club}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-surface-500 flex items-center gap-1">
                      <CalendarDays size={10} /> {formatDate(reg.date)}
                    </span>
                    <Link to="/my-qr" className="text-xs text-neon-300 hover:text-neon-400 flex items-center gap-1">
                      View QR <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))}
              {myRegs.length > 4 && (
                <Link to="/my-qr" className="block text-center text-xs text-surface-500 hover:text-surface-300 py-2">
                  +{myRegs.length - 4} more registrations
                </Link>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ── Quick actions ── */}
      <div>
        <h3 className="section-title">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { to: '/events',       emoji: '🎟️', label: 'Browse Events',   sub: 'Find & register', color: 'border-neon-400/20  hover:border-neon-400/40'  },
            { to: '/create-event', emoji: '✨', label: 'Create Event',    sub: 'Launch new event', color: 'border-aqua-400/20  hover:border-aqua-400/40'  },
            { to: '/scanner',      emoji: '📷', label: 'Scan QR Code',   sub: 'Check in attendees', color: 'border-ember-400/20 hover:border-ember-400/40' },
          ].map(({ to, emoji, label, sub, color }) => (
            <Link
              key={to}
              to={to}
              className={`glass-card p-5 flex items-center gap-4 border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-lg group ${color}`}
            >
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="font-semibold text-surface-100 text-sm group-hover:text-surface-50">{label}</p>
                <p className="text-xs text-surface-500">{sub}</p>
              </div>
              <ArrowRight size={14} className="ml-auto text-surface-600 group-hover:text-surface-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
