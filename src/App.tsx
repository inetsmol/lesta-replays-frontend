import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ReplaysPage from './pages/ReplaysPage'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import UserBadge from './components/UserBadge'


export default function App() {
    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                <Link to="/">Lesta Replays</Link>
                <UserBadge />
            </header>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <ReplaysPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<div style={{ padding: 24 }}>Страница не найдена</div>} />
            </Routes>
        </div>
    )
}