// ─── Date / Time ────────────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export const isUpcoming = (dateStr) => new Date(dateStr) > new Date()

export const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

// ─── Capacity ────────────────────────────────────────────────────
export const capacityPercent = (registered, capacity) =>
  capacity > 0 ? Math.min(100, Math.round((registered / capacity) * 100)) : 0

export const spotsLeft = (registered, capacity) =>
  Math.max(0, capacity - registered)

// ─── Color maps ──────────────────────────────────────────────────
export const COLOR_MAP = {
  neon:  { bg: 'bg-neon-400/10',  border: 'border-neon-400/30',  text: 'text-neon-300',  dot: 'bg-neon-400' },
  aqua:  { bg: 'bg-aqua-400/10',  border: 'border-aqua-400/30',  text: 'text-aqua-400',  dot: 'bg-aqua-400' },
  ember: { bg: 'bg-ember-400/10', border: 'border-ember-400/30', text: 'text-ember-400', dot: 'bg-ember-400' },
  rose:  { bg: 'bg-rose-400/10',  border: 'border-rose-400/30',  text: 'text-rose-400',  dot: 'bg-rose-400' },
}

export const getColor = (key) => COLOR_MAP[key] || COLOR_MAP.neon

// ─── Misc ────────────────────────────────────────────────────────
export const truncate = (str, n = 80) =>
  str && str.length > n ? str.slice(0, n) + '…' : str

export const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
