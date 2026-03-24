import React from 'react'

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const SIZES = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <svg className={`animate-spin text-neon-400 ${SIZES[size]}`} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 30" />
      </svg>
      {text && <p className="text-surface-400 text-sm">{text}</p>}
    </div>
  )
}
