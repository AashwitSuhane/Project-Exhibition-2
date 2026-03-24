import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider }      from './context/AuthContext'
import { ToastProvider }     from './context/ToastContext'
import ProtectedRoute        from './components/ProtectedRoute'
import DashboardLayout       from './components/DashboardLayout'
import LoginPage             from './pages/LoginPage'
import DashboardPage         from './pages/DashboardPage'
import EventsPage            from './pages/EventsPage'
import CreateEventPage       from './pages/CreateEventPage'
import MyQRPage              from './pages/MyQRPage'
import ScannerPage           from './pages/ScannerPage'
import NotFoundPage          from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected — all behind DashboardLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard"    element={<DashboardPage    />} />
                <Route path="/events"       element={<EventsPage       />} />
                <Route path="/create-event" element={<CreateEventPage  />} />
                <Route path="/my-qr"        element={<MyQRPage         />} />
                <Route path="/scanner"      element={<ScannerPage      />} />
              </Route>
            </Route>

            {/* Redirects */}
            <Route path="/"   element={<Navigate to="/dashboard" replace />} />
            <Route path="*"   element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
