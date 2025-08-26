// src/services/api.ts
export type FetchError = Error & { status?: number }

function err(status: number, message: string): FetchError {
    const e = new Error(message) as FetchError
    e.status = status
    return e
}

export async function apiGET<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: 'GET', credentials: 'include' })
    if (res.status === 204) return undefined as unknown as T
    if (!res.ok) throw err(res.status, await res.text().catch(() => res.statusText))
    return res.json() as Promise<T>
}

export async function apiPOST<T>(url: string, body?: unknown): Promise<T> {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: body == null ? undefined : JSON.stringify(body),
    })
    if (!res.ok) throw err(res.status, await res.text().catch(() => res.statusText))
    return (res.status === 204 ? (undefined as unknown as T) : (res.json() as Promise<T>))
}

// === то, что ждёт твой компонент ReplaysPage ===
export async function fetchReplays(limit = 24, offset = 0, newest = true) {
    const qs = new URLSearchParams()
    qs.set('limit', String(limit))
    qs.set('offset', String(offset))
    // если у бэка другой параметр сортировки — поменяй здесь
    qs.set('sort', newest ? 'newest' : 'oldest')

    const url = `/api/v1/replays?` + qs.toString()
    const res = await fetch(url, { credentials: 'include' })
    if (res.status === 401) throw err(401, 'Unauthorized')
    if (!res.ok) throw err(res.status, await res.text().catch(() => res.statusText))
    return res.json()
}

// опционально, чтобы логиниться не уходя со страницы
export async function loginWithGooglePopup(): Promise<void> {
    const w = window.open('/api/v1/login/google', 'google_oauth',
        'width=480,height=700,menubar=no,toolbar=no,noopener,noreferrer')
    if (!w) throw new Error('Popup blocked')

    const start = Date.now()
    await new Promise<void>((resolve, reject) => {
        const t = setInterval(async () => {
            try {
                const res = await fetch('/api/v1/replays?limit=1', { credentials: 'include' })
                if (res.ok) {
                    clearInterval(t)
                    try { w.close() } catch {}
                    resolve()
                    return
                }
            } catch {}
            if (w.closed || Date.now() - start > 120_000) {
                clearInterval(t)
                reject(new Error('Login not completed'))
            }
        }, 800)
    })
}
