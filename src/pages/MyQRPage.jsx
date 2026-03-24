import React, { useState, useEffect, useRef } from 'react'
import { useLocation }   from 'react-router-dom'
import { QRCodeSVG }     from 'qrcode.react'
import { Download, Share2, CalendarDays, MapPin, Clock, CheckCircle } from 'lucide-react'
import { useAuth }       from '../context/AuthContext'
import { getMyRegistrations } from '../services/api'
import LoadingSpinner    from '../components/LoadingSpinner'
import EmptyState        from '../components/EmptyState'
import { formatDate }    from '../utils/helpers'
import { Link }          from 'react-router-dom'

export default function MyQRPage() {
  const { user }       = useAuth()
  const location       = useLocation()
  const highlight      = location.state?.highlightEvent

  const [regs,    setRegs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [active,  setActive]  = useState(null)

  useEffect(() => {
    getMyRegistrations(user?.id).then(r => {
      setRegs(r)
      setLoading(false)
      if (highlight) setActive(r.find(x => x.eventId === highlight) || r[0])
      else if (r.length > 0) setActive(r[0])
    })
  }, [user])

  // Download QR as PNG via canvas
  const downloadQR = (reg) => {
    const svg   = document.getElementById(`qr-${reg.id}`)
    if (!svg) return
    const data  = new XMLSerializer().serializeToString(svg)
    const blob  = new Blob([data], { type: 'image/svg+xml' })
    const url   = URL.createObjectURL(blob)
    const a     = document.createElement('a')
    a.href      = url
    a.download  = `qr-${reg.eventTitle.replace(/\s+/g, '-')}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingSpinner size="lg" text="Loading your QR codes…" />

  if (regs.length === 0) return (
    <EmptyState
      icon="🎫"
      title="No registrations yet"
      subtitle="Register for events to get your unique QR check-in code."
      action={<Link to="/events" className="btn-primary">Browse Events</Link>}
    />
  )

  return (
    <div className="animate-fade-in">
      <div className="grid lg:grid-cols-5 gap-6">

        {/* ── Registration list (left) ── */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-xs text-surface-500 uppercase tracking-widest font-semibold px-1">
            {regs.length} registration{regs.length !== 1 ? 's' : ''}
          </p>
          {regs.map(reg => (
            <button
              key={reg.id}
              onClick={() => setActive(reg)}
              className={`
                w-full text-left glass-card p-4 transition-all duration-200
                ${active?.id === reg.id
                  ? 'border-neon-400/40 shadow-neon-sm'
                  : 'hover:border-surface-600 hover:-translate-y-0.5'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors
                  ${active?.id === reg.id ? 'bg-neon-400' : 'bg-surface-600'}
                `} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-surface-100 text-sm truncate">{reg.eventTitle}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{reg.club}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-surface-500">
                    <span className="flex items-center gap-1"><CalendarDays size={10} />{formatDate(reg.date)}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{reg.time}</span>
                  </div>
                </div>
                {active?.id === reg.id && (
                  <CheckCircle size={16} className="text-neon-400 shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* ── QR Display (right) ── */}
        <div className="lg:col-span-3">
          {active ? (
            <div className="glass-card p-8 text-center border border-neon-400/20 animate-fade-in sticky top-6">
              <div className="inline-flex items-center gap-2 bg-neon-400/10 border border-neon-400/30 text-neon-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <CheckCircle size={12} /> Verified Registration
              </div>

              {/* QR Code */}
              <div className="inline-block p-5 bg-white rounded-3xl shadow-card-lg mb-6 animate-glow-pulse">
                <QRCodeSVG
                  id={`qr-${active.id}`}
                  value={active.qrData}
                  size={200}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0a0a15"
                />
              </div>

              {/* Event details */}
              <h3 className="font-display text-xl font-bold text-surface-50">{active.eventTitle}</h3>
              <p className="text-surface-400 text-sm mt-1">{active.club}</p>

              <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-left">
                {[
                  { icon: CalendarDays, label: 'Date',  val: formatDate(active.date) },
                  { icon: Clock,        label: 'Time',  val: active.time  },
                  { icon: MapPin,       label: 'Venue', val: active.venue },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className={`glass-light rounded-xl px-4 py-3 ${label === 'Venue' ? 'col-span-2' : ''}`}>
                    <p className="text-xs text-surface-500 flex items-center gap-1 mb-1"><Icon size={10} />{label}</p>
                    <p className="font-medium text-surface-100 text-sm">{val}</p>
                  </div>
                ))}
              </div>

              {/* Registration ID */}
              <div className="mt-4 glass-light rounded-xl px-4 py-3">
                <p className="text-xs text-surface-500 mb-1">Registration ID</p>
                <p className="font-mono text-xs text-neon-300 tracking-wider">{active.id}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button onClick={() => downloadQR(active)} className="btn-secondary flex-1 gap-2 text-sm">
                  <Download size={15} /> Download QR
                </button>
                <button
                  onClick={() => navigator.share?.({ title: active.eventTitle, text: `My registration for ${active.eventTitle}` })}
                  className="btn-ghost px-4"
                >
                  <Share2 size={15} />
                </button>
              </div>

              <p className="text-xs text-surface-600 mt-4">
                Show this QR code at the event entrance for check-in
              </p>
            </div>
          ) : (
            <div className="glass-card p-10 text-center text-surface-500 text-sm">
              Select a registration to view QR
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
