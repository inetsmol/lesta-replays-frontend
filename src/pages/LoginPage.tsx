import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'


export default function LoginPage() {
    const { user, loginWithGoogle } = useAuth()
    const loc = useLocation() as unknown as { state?: { from?: Location } }


    if (user) {
        const to = (loc.state?.from?.pathname as string) || '/'
        return <Navigate to={to} replace />
    }


    return (
        <div style={{ maxWidth: 420, margin: '72px auto', padding: 24, border: '1px solid #eee', borderRadius: 12 }}>
            <h2 style={{ marginBottom: 16 }}>Вход</h2>
            <p style={{ marginBottom: 16 }}>Авторизация через Google. Мы не храним ваш пароль, используем безопасный OAuth.</p>
            <button onClick={loginWithGoogle} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>
                Войти с Google
            </button>
        </div>
    )
}