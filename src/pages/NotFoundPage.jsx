import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <p className="font-display text-9xl font-black text-surface-800 select-none">404</p>
        <h2 className="font-display text-2xl font-bold text-surface-200 mt-4">Page not found</h2>
        <p className="text-surface-500 text-sm mt-2">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary mt-8 inline-flex">
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
