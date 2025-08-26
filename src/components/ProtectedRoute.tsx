import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth()
    const loc = useLocation()


    if (loading) return <div style={{ padding: 24 }}>Загрузка…</div>
    if (!user) return <Navigate to="/login" state={{ from: loc }} replace />
    return children
}