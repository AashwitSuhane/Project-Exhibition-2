import React, { useState, useEffect } from 'react'
import { Link }          from 'react-router-dom'
import { PlusCircle, CalendarDays, Clock, MapPin, Users, Building2, Tag, FileText, CheckCircle, ArrowRight } from 'lucide-react'
import { createEvent, getClubs } from '../services/api'
import { useToast }      from '../context/ToastContext'
import LoadingSpinner    from '../components/LoadingSpinner'

const CATEGORIES = ['Workshop', 'Hackathon', 'Competition', 'Pitching', 'Sprint', 'Masterclass', 'Seminar', 'General']
const EMOJIS     = ['⚡','🚀','🎨','🤖','🌐','🎓','💡','🔬','📊','✨','🏆','🎯']
const COLORS     = ['neon','aqua','ember','rose']

const INIT = { title: '', description: '', clubId: '', date: '', time: '', venue: '', capacity: '', category: 'Workshop', image: '⚡', color: 'neon' }

export default function CreateEventPage() {
  const toast = useToast()

  const [form,     setForm]     = useState(INIT)
  const [clubs,    setClubs]    = useState([])
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(null) // created event
  const [errors,   setErrors]   = useState({})

  useEffect(() => {
    getClubs().then(setClubs)
  }, [])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())        e.title    = 'Event name is required'
    if (!form.clubId)              e.clubId   = 'Select a club'
    if (!form.date)                e.date     = 'Pick a date'
    if (!form.venue.trim())        e.venue    = 'Venue is required'
    if (!form.capacity || form.capacity < 1) e.capacity = 'Enter a valid capacity'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const club       = clubs.find(c => c.id === form.clubId)
      const newEvent   = await createEvent({ ...form, club: club?.name })
      setSuccess(newEvent)
      toast('Event created successfully! 🎉', 'success')
      setForm(INIT)
    } catch (err) {
      toast(err.message || 'Failed to create event', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────
  if (success) return (
    <div className="max-w-lg mx-auto animate-scale-in">
      <div className="glass-card p-10 text-center border border-neon-400/30">
        <div className="w-16 h-16 bg-neon-400/20 border border-neon-400/40 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-neon-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-surface-50">Event Created!</h2>
        <p className="text-surface-400 mt-2 text-sm">Your event has been published and is now visible to members.</p>

        <div className="glass-light rounded-xl p-4 mt-6 text-left space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{success.image}</span>
            <div>
              <p className="font-semibold text-surface-100">{success.title}</p>
              <p className="text-xs text-surface-500">{success.club} · {success.category}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-surface-400 pt-2">
            <span className="flex items-center gap-1.5"><CalendarDays size={11} />{success.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={11} />{success.time || '—'}</span>
            <span className="flex items-center gap-1.5 col-span-2"><MapPin size={11} />{success.venue}</span>
            <span className="flex items-center gap-1.5"><Users size={11} />Capacity: {success.capacity}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={() => setSuccess(null)} className="btn-secondary flex-1">
            Create Another
          </button>
          <Link to="/events" className="btn-primary flex-1 flex items-center justify-center gap-2">
            View Events <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )

  // ── Form ───────────────────────────────────────────────────────
  const Field = ({ err, children }) => (
    <div>
      {children}
      {err && <p className="text-xs text-ember-400 mt-1 flex items-center gap-1">⚠ {err}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic info ── */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="section-title flex items-center gap-2 mb-1">
            <PlusCircle size={18} className="text-neon-400" /> Event Details
          </h3>

          <Field err={errors.title}>
            <label className="label">Event Name *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. React Workshop 2025" className="input" />
          </Field>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Tell attendees what this event is about…"
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field err={errors.clubId}>
              <label className="label"><Building2 size={13} className="inline mr-1" />Club *</label>
              <select value={form.clubId} onChange={e => set('clubId', e.target.value)} className="select-input">
                <option value="">Select a club…</option>
                {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>

            <div>
              <label className="label"><Tag size={13} className="inline mr-1" />Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="select-input">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Date, time, venue, capacity ── */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="section-title flex items-center gap-2 mb-1">
            <CalendarDays size={18} className="text-aqua-400" /> Schedule & Venue
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field err={errors.date}>
              <label className="label">Date *</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input" />
            </Field>
            <div>
              <label className="label">Time</label>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className="input" />
            </div>
          </div>

          <Field err={errors.venue}>
            <label className="label"><MapPin size={13} className="inline mr-1" />Venue *</label>
            <input value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="e.g. Lab 301, Tech Block" className="input" />
          </Field>

          <Field err={errors.capacity}>
            <label className="label"><Users size={13} className="inline mr-1" />Capacity *</label>
            <input type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="50" className="input" />
          </Field>
        </div>

        {/* ── Appearance ── */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="section-title mb-1">Appearance</h3>
          <div>
            <label className="label">Event Emoji</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EMOJIS.map(em => (
                <button key={em} type="button" onClick={() => set('image', em)}
                  className={`w-10 h-10 text-xl rounded-xl transition-all duration-150
                    ${form.image === em
                      ? 'bg-neon-400/20 border-2 border-neon-400 scale-110'
                      : 'bg-surface-800 border border-surface-700 hover:border-surface-500'}`}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Color Accent</label>
            <div className="flex gap-3 mt-2">
              {COLORS.map(col => {
                const DOT = { neon: 'bg-neon-400', aqua: 'bg-aqua-400', ember: 'bg-ember-400', rose: 'bg-rose-400' }
                return (
                  <button key={col} type="button" onClick={() => set('color', col)}
                    className={`w-9 h-9 rounded-full ${DOT[col]} transition-all duration-150
                      ${form.color === col ? 'ring-2 ring-offset-2 ring-offset-surface-900 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                    title={col}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
          {loading ? (
            <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
            </svg> Creating Event…</>
          ) : (
            <><PlusCircle size={18} /> Create Event</>
          )}
        </button>

      </form>
    </div>
  )
}
