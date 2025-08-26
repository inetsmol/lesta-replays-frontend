import React, { createContext, useContext, useState, ReactNode } from 'react'
import { apiPOST } from '../services/api'
import type { User } from '../types/auth'

export type AuthState = {
    user: User | null
    loading: boolean
    refreshMe: () => Promise<void> // временно заглушка
    loginWithGoogle: () => void
    logout: () => Promise<void>
}

const AuthCtx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading] = useState(false) // сразу false — /api/v1/me не используем

    const refreshMe = async () => {
        // no-op: пока не используем /api/v1/me
        return
    }

    const loginWithGoogle = () => {
        // редиректим в OAuth
        window.location.href = '/api/v1/login/google'
    }

    const logout = async () => {
        await apiPOST<unknown>('/api/v1/auth/logout')
        setUser(null)
    }

    const value: AuthState = { user, loading, refreshMe, loginWithGoogle, logout }
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthCtx)
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
    return ctx
}
