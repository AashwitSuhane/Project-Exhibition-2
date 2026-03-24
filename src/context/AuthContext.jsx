import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token    = localStorage.getItem('qrc_token')
    const userData = localStorage.getItem('qrc_user')
    if (token && userData) {
      try { setUser(JSON.parse(userData)) } catch (_) {}
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    if (!email || password.length < 4) {
      return { success: false, error: 'Enter a valid email and password (min 4 chars).' }
    }
    const namePart  = email.split('@')[0].replace(/[._-]/g, ' ')
    const mockUser  = {
      id:     'usr_' + Math.random().toString(36).slice(2, 8),
      name:   namePart.replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role:   'Admin',
      avatar: email[0].toUpperCase(),
      clubs:  ['Tech Nexus', 'Design Guild'],
    }
    const fakeToken = 'jwt_' + Date.now() + '_' + Math.random().toString(36).slice(2)
    localStorage.setItem('qrc_token', fakeToken)
    localStorage.setItem('qrc_user',  JSON.stringify(mockUser))
    setUser(mockUser)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('qrc_token')
    localStorage.removeItem('qrc_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
