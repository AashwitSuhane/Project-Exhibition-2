import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarDays, PlusCircle,
  ScanLine, LogOut, QrCode, X, Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { initials } from '../utils/helpers'

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/events',       icon: CalendarDays,    label: 'Events'       },
  { to: '/create-event', icon: PlusCircle,      label: 'Create Event' },
  { to: '/my-qr',        icon: QrCode,          label: 'My QR Codes'  },
  { to: '/scanner',      icon: ScanLine,        label: 'QR Scanner'   },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const toast            = useToast()
  const navigate         = useNavigate()

  const handleLogout = () => {
    logout()
    toast('Logged out successfully', 'info')
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-surface-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-neon-400 rounded-lg flex items-center justify-center shadow-neon-sm">
            <Zap size={16} className="text-surface-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-surface-50 tracking-tight">QRClub</span>
        </div>
        {/* Mobile close */}
        <button onClick={onClose} className="lg:hidden btn-icon">
          <X size={18} />
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-4 mb-3 text-xs font-semibold text-surface-600 uppercase tracking-widest">
          Navigation
        </p>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div className="px-3 py-4 border-t border-surface-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-800/50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-neon-400/20 border border-neon-400/30 flex items-center justify-center">
            <span className="text-neon-300 text-sm font-bold font-mono">
              {user ? initials(user.name) : '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-100 truncate">{user?.name}</p>
            <p className="text-xs text-surface-500 truncate">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-surface-500 hover:text-ember-400 transition-colors rounded-lg hover:bg-ember-400/10"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-64 flex-col glass border-r border-surface-800/50 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="relative w-72 flex flex-col glass border-r border-surface-800/50 h-full animate-slide-in-r">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
