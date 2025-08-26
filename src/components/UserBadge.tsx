import React from 'react'
import { useAuth } from '../auth/AuthContext'


export default function UserBadge() {
    const { user, logout } = useAuth()
    if (!user) return null
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user.picture && <img src={user.picture} alt={user.name || user.email} width={28} height={28} style={{ borderRadius: '50%' }} />}
            <span>{user.name || user.email}</span>
            <button onClick={logout} style={{ marginLeft: 8, padding: '6px 10px' }}>Выйти</button>
        </div>
    )
}