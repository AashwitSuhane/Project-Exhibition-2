// ─────────────────────────────────────────────────────────────
//  services/api.js  —  Mock API (no real backend needed)
//  Simulates async HTTP calls with realistic delays & data.
// ─────────────────────────────────────────────────────────────

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms))

// ── Static mock data ──────────────────────────────────────────
const CLUBS = [
  { id: 'c1', name: 'Tech Nexus',      category: 'Technology', members: 142, color: 'neon' },
  { id: 'c2', name: 'Design Guild',    category: 'Creative',   members: 89,  color: 'aqua' },
  { id: 'c3', name: 'Entrepreneurship Hub', category: 'Business', members: 210, color: 'ember' },
  { id: 'c4', name: 'AI Research Lab', category: 'Technology', members: 63,  color: 'rose' },
]

let EVENTS = [
  {
    id: 'evt_001',
    title:       'React & Vite Workshop',
    description: 'Deep-dive into modern React patterns, Vite build tooling, and component architecture.',
    club:        'Tech Nexus',
    clubId:      'c1',
    date:        '2025-02-15',
    time:        '10:00 AM',
    venue:       'Lab 301, Tech Block',
    capacity:    60,
    registered:  38,
    category:    'Workshop',
    image:       '⚡',
    color:       'neon',
    status:      'upcoming',
  },
  {
    id: 'evt_002',
    title:       'UI/UX Design Jam',
    description: 'A 3-hour design sprint. Teams compete to build the most usable interface in Figma.',
    club:        'Design Guild',
    clubId:      'c2',
    date:        '2025-02-20',
    time:        '2:00 PM',
    venue:       'Design Studio, A Block',
    capacity:    40,
    registered:  40,
    category:    'Competition',
    image:       '🎨',
    color:       'aqua',
    status:      'full',
  },
  {
    id: 'evt_003',
    title:       'Startup Pitch Night',
    description: 'Present your startup idea to a panel of investors and win seed funding.',
    club:        'Entrepreneurship Hub',
    clubId:      'c3',
    date:        '2025-03-01',
    time:        '6:00 PM',
    venue:       'Auditorium, Main Block',
    capacity:    200,
    registered:  134,
    category:    'Pitching',
    image:       '🚀',
    color:       'ember',
    status:      'upcoming',
  },
  {
    id: 'evt_004',
    title:       'ML Model Deploy Hackathon',
    description: 'Build, train, and deploy a machine learning model end-to-end in 8 hours.',
    club:        'AI Research Lab',
    clubId:      'c4',
    date:        '2025-03-08',
    time:        '9:00 AM',
    venue:       'Server Room Annex',
    capacity:    30,
    registered:  22,
    category:    'Hackathon',
    image:       '🤖',
    color:       'rose',
    status:      'upcoming',
  },
  {
    id: 'evt_005',
    title:       'Open Source Sprint',
    description: 'Contribute to popular open-source projects with mentorship from core maintainers.',
    club:        'Tech Nexus',
    clubId:      'c1',
    date:        '2025-03-15',
    time:        '11:00 AM',
    venue:       'Computer Lab 204',
    capacity:    50,
    registered:  17,
    category:    'Sprint',
    image:       '🌐',
    color:       'neon',
    status:      'upcoming',
  },
  {
    id: 'evt_006',
    title:       'Brand Identity Masterclass',
    description: 'Learn how top brands craft their visual identity. Hands-on logo creation session.',
    club:        'Design Guild',
    clubId:      'c2',
    date:        '2024-12-10',
    time:        '3:00 PM',
    venue:       'Seminar Hall B',
    capacity:    45,
    registered:  45,
    category:    'Masterclass',
    image:       '✏️',
    color:       'aqua',
    status:      'completed',
  },
]

// ── In-memory registered events (persisted to localStorage) ───
const getRegistered = () => {
  try { return JSON.parse(localStorage.getItem('qrc_registered') || '[]') }
  catch (_) { return [] }
}
const saveRegistered = (list) => localStorage.setItem('qrc_registered', JSON.stringify(list))

// ── API functions ──────────────────────────────────────────────

/** Fetch all events */
export const getEvents = async () => {
  await delay(500)
  return { data: EVENTS, total: EVENTS.length }
}

/** Fetch single event */
export const getEvent = async (id) => {
  await delay(300)
  const event = EVENTS.find(e => e.id === id)
  if (!event) throw new Error('Event not found')
  return event
}

/** Create a new event */
export const createEvent = async (payload) => {
  await delay(700)
  const newEvent = {
    id:          'evt_' + Math.random().toString(36).slice(2, 8),
    title:       payload.title,
    description: payload.description || 'No description provided.',
    club:        payload.club,
    clubId:      payload.clubId || 'c1',
    date:        payload.date,
    time:        payload.time || '10:00 AM',
    venue:       payload.venue || 'TBD',
    capacity:    Number(payload.capacity) || 50,
    registered:  0,
    category:    payload.category || 'General',
    image:       payload.image || '📅',
    color:       payload.color || 'neon',
    status:      'upcoming',
  }
  EVENTS = [newEvent, ...EVENTS]
  return newEvent
}

/** Register current user for an event */
export const registerEvent = async (eventId, userId) => {
  await delay(600)
  const event = EVENTS.find(e => e.id === eventId)
  if (!event) throw new Error('Event not found')
  if (event.registered >= event.capacity) throw new Error('Event is full')

  const registered = getRegistered()
  const alreadyIn  = registered.some(r => r.eventId === eventId && r.userId === userId)
  if (alreadyIn) throw new Error('You are already registered for this event')

  event.registered += 1
  const record = {
    id:        'reg_' + Math.random().toString(36).slice(2, 8),
    eventId,
    userId,
    eventTitle: event.title,
    club:       event.club,
    date:       event.date,
    time:       event.time,
    venue:      event.venue,
    registeredAt: new Date().toISOString(),
    qrData: JSON.stringify({ regId: 'reg_' + Math.random().toString(36).slice(2,8), eventId, userId, event: event.title, date: event.date }),
  }
  registered.push(record)
  saveRegistered(registered)
  return record
}

/** Get user's registrations */
export const getMyRegistrations = async (userId) => {
  await delay(400)
  return getRegistered().filter(r => r.userId === userId)
}

/** Get all clubs */
export const getClubs = async () => {
  await delay(300)
  return CLUBS
}

/** Get dashboard stats */
export const getDashboardStats = async () => {
  await delay(400)
  const registered = getRegistered()
  return {
    totalEvents:        EVENTS.length,
    upcomingEvents:     EVENTS.filter(e => e.status === 'upcoming').length,
    totalRegistrations: registered.length,
    totalClubs:         CLUBS.length,
    recentEvents:       [...EVENTS].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4),
  }
}
