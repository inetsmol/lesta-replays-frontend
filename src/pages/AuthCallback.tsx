import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'


export default function AuthCallback() {
    const { refreshMe } = useAuth()
    const nav = useNavigate()
    const loc = useLocation() as unknown as { state?: { from?: Location } }


    useEffect(() => {
        (async () => {
            await refreshMe()
            const to = (loc.state?.from?.pathname as string) || '/'
            nav(to, { replace: true })
        })()
    }, [nav, refreshMe])


    return <div style={{ padding: 24 }}>Завершаем вход…</div>
}