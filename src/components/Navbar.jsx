import React from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, Search } from 'lucide-react'

const ROUTE_TITLES = {
  '/dashboard':    { title: 'Dashboard',    subtitle: 'Welcome back! Here\'s what\'s happening.' },
  '/events':       { title: 'Events',       subtitle: 'Browse and register for upcoming events.' },
  '/create-event': { title: 'Create Event', subtitle: 'Launch a new event for your club.' },
  '/my-qr':        { title: 'My QR Codes',  subtitle: 'Your registration QR codes.' },
  '/scanner':      { title: 'QR Scanner',   subtitle: 'Scan attendee QR codes at the venue.' },
}

export default function Navbar({ onMenuOpen }) {
  const { pathname } = useLocation()
  const meta = ROUTE_TITLES[pathname] || { title: 'QRClub', subtitle: '' }

  return (
    <header className="sticky top-0 z-40 glass border-b border-surface-800/50">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 gap-4">

        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuOpen}
            className="lg:hidden btn-icon shrink-0"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-surface-50 text-lg leading-tight truncate">
              {meta.title}
            </h1>
            <p className="text-xs text-surface-500 truncate hidden sm:block">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-icon hidden sm:flex">
            <Search size={18} />
          </button>
          <button className="btn-icon relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-neon-400 rounded-full" />
          </button>
        </div>

      </div>
    </header>
  )
}
