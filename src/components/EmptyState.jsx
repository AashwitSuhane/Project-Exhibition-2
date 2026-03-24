import React from 'react'

export default function EmptyState({ icon = '📭', title = 'Nothing here', subtitle = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-5xl mb-4 animate-float">{icon}</div>
      <h3 className="font-display text-lg font-semibold text-surface-200">{title}</h3>
      {subtitle && <p className="text-surface-500 text-sm mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
