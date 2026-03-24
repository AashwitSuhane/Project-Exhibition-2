import React from 'react'
import { TrendingUp } from 'lucide-react'

/**
 * StatCard — dashboard metric card
 * Props: title, value, icon, color ('neon'|'aqua'|'ember'|'rose'), trend, sub
 */
export default function StatCard({ title, value, icon: Icon, color = 'neon', trend, sub }) {
  const STYLES = {
    neon:  { wrap: 'bg-neon-400/10  border-neon-400/20',  icon: 'bg-neon-400/20  text-neon-300',  glow: 'shadow-neon-sm',   bar: 'bg-neon-400'  },
    aqua:  { wrap: 'bg-aqua-400/10  border-aqua-400/20',  icon: 'bg-aqua-400/20  text-aqua-400',  glow: '',                bar: 'bg-aqua-400'  },
    ember: { wrap: 'bg-ember-400/10 border-ember-400/20', icon: 'bg-ember-400/20 text-ember-400', glow: '',                bar: 'bg-ember-400' },
    rose:  { wrap: 'bg-rose-400/10  border-rose-400/20',  icon: 'bg-rose-400/20  text-rose-400',  glow: '',                bar: 'bg-rose-400'  },
  }
  const s = STYLES[color] || STYLES.neon

  return (
    <div className={`
      glass-card p-5 flex items-start gap-4 relative overflow-hidden
      hover:-translate-y-1 transition-all duration-300 hover:shadow-card-lg
      border ${s.wrap} ${s.glow}
    `}>
      {/* Decorative blurred blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${s.bar}`} />

      {/* Icon */}
      <div className={`p-3 rounded-xl shrink-0 ${s.icon}`}>
        <Icon size={20} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-surface-400 font-medium">{title}</p>
        <p className="font-display text-3xl font-bold text-surface-50 mt-0.5 leading-none">
          {value ?? '—'}
        </p>
        {(trend || sub) && (
          <p className="flex items-center gap-1 text-xs text-surface-500 mt-2">
            {trend && <TrendingUp size={12} className="text-neon-400" />}
            {trend || sub}
          </p>
        )}
      </div>
    </div>
  )
}
