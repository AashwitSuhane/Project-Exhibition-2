import React from 'react'
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { formatDate, capacityPercent, spotsLeft, getColor } from '../utils/helpers'

/**
 * EventCard — shows event info + register / view action
 * Props: event, onRegister, onViewQR, isRegistered, loading
 */
export default function EventCard({ event, onRegister, onViewQR, isRegistered, loading }) {
  const c      = getColor(event.color)
  const pct    = capacityPercent(event.registered, event.capacity)
  const spots  = spotsLeft(event.registered, event.capacity)
  const isFull = spots === 0

  return (
    <div className={`
      glass-card p-5 flex flex-col gap-4 border
      hover:-translate-y-1 hover:shadow-card-lg transition-all duration-300
      ${c.border}
    `}>
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0
          ${c.bg} border ${c.border}
        `}>
          {event.image}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge ${c.bg} ${c.text} border ${c.border} text-[11px]`}>
              {event.category}
            </span>
            {event.status === 'completed' && (
              <span className="badge bg-surface-700/50 text-surface-400 text-[11px]">Completed</span>
            )}
            {isFull && event.status !== 'completed' && (
              <span className="badge bg-ember-400/15 text-ember-400 text-[11px]">Full</span>
            )}
          </div>
          <h3 className="font-display font-semibold text-surface-50 mt-1 leading-tight">
            {event.title}
          </h3>
          <p className="text-xs text-surface-400 mt-0.5">{event.club}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 text-xs text-surface-400">
        <span className="flex items-center gap-1.5"><Calendar size={12} className={c.text} />{formatDate(event.date)}</span>
        <span className="flex items-center gap-1.5"><Clock    size={12} className={c.text} />{event.time}</span>
        <span className="flex items-center gap-1.5 col-span-2"><MapPin  size={12} className={c.text} />{event.venue}</span>
      </div>

      {/* Capacity bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1 text-surface-400">
            <Users size={11} /> {event.registered}/{event.capacity}
          </span>
          <span className={pct >= 90 ? 'text-ember-400' : pct >= 70 ? 'text-neon-300' : 'text-surface-500'}>
            {isFull ? 'No spots left' : `${spots} spot${spots !== 1 ? 's' : ''} left`}
          </span>
        </div>
        <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${c.dot}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="pt-1">
        {isRegistered ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 bg-neon-400/10 border border-neon-400/30 rounded-xl px-4 py-2.5 text-neon-300 text-sm font-medium">
              <CheckCircle size={15} />
              <span>Registered</span>
            </div>
            <button
              onClick={() => onViewQR(event)}
              className="btn-outline text-sm px-3 py-2.5 flex items-center gap-1"
            >
              QR <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onRegister(event)}
            disabled={isFull || event.status === 'completed' || loading}
            className={`
              w-full btn text-sm py-2.5
              ${isFull || event.status === 'completed'
                ? 'bg-surface-800 text-surface-500 cursor-not-allowed border border-surface-700'
                : 'btn-primary'
              }
            `}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
                </svg>
                Registering…
              </span>
            ) : isFull ? 'Event Full' : event.status === 'completed' ? 'Event Ended' : 'Register Now'}
          </button>
        )}
      </div>
    </div>
  )
}
