import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle size={18} />,
  error:   <XCircle    size={18} />,
  info:    <Info       size={18} />,
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`
              animate-slide-up pointer-events-auto flex items-center gap-3
              px-5 py-3.5 rounded-2xl text-sm font-medium shadow-card-lg glass-card
              ${t.type === 'success' ? 'border-neon-400/40 text-neon-300' :
                t.type === 'error'   ? 'border-ember-400/40 text-ember-400' :
                                       'border-aqua-400/40 text-aqua-400'}
            `}
          >
            {ICONS[t.type]}
            <span className="text-surface-100">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="ml-2 text-surface-500 hover:text-surface-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx.toast
}
