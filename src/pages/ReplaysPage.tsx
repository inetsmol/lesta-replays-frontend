import React from "react";
import { fetchReplays } from "../services/api";
import type { Replay } from "../services/types";
import ReplayCard from "../components/ReplayCard";
import "./ReplaysPage.css";

export default function ReplaysPage() {
    const [items, setItems] = React.useState<Replay[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [unauth, setUnauth] = React.useState(false);

    const load = React.useCallback(async () => {
        let ok = false;
        setLoading(true);
        setError(null);
        setUnauth(false);
        try {
            const data = await fetchReplays(24, 0, true);
            setItems(data);
            ok = true;
        } catch (e: any) {
            const msg = e?.message || "";
            const status = e?.status ?? e?.response?.status;
            if (status === 401 || /401|unauthorized/i.test(msg)) {
                setUnauth(true);
            } else {
                setError(msg || "Ошибка загрузки");
            }
        } finally {
            setLoading(false);
        }
        return ok;
    }, []);

    React.useEffect(() => {
        let cancelled = false;
        (async () => {
            await load();
            if (cancelled) return;
        })();
        return () => {
            cancelled = true;
        };
    }, [load]);

    async function loginWithGooglePopup(): Promise<void> {
        const w = window.open(
            "/api/v1/login/google",
            "google_oauth",
            "width=480,height=700,menubar=no,toolbar=no,noopener,noreferrer"
        );
        if (!w) throw new Error("Popup blocked");

        const start = Date.now();
        await new Promise<void>((resolve, reject) => {
            const t = setInterval(async () => {
                // как только кука появится — /api/v1/replays начнёт отдавать 200
                try {
                    const res = await fetch("/api/v1/replays?limit=1", { credentials: "include" });
                    if (res.ok) {
                        clearInterval(t);
                        try { w.close(); } catch {}
                        resolve();
                        return;
                    }
                } catch {}
                if (w.closed || Date.now() - start > 120_000) {
                    clearInterval(t);
                    reject(new Error("Login not completed"));
                }
            }, 800);
        });
    }

    const handleLogin = async () => {
        setError(null);
        try {
            await loginWithGooglePopup();
            await load(); // после логина повторно грузим список
        } catch (e: any) {
            setError(e?.message || "Не удалось войти");
        }
    };

    return (
        <main className="replays-page">
            <header className="replays-page__header">
                <h1>Свежие реплеи</h1>
                <p className="muted">Список последних загруженных боёв (без фильтров).</p>
            </header>

            {loading && (
                <div className="skeleton-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div className="skeleton-card" key={i} />
                    ))}
                </div>
            )}

            {unauth && !loading && (
                <div className="auth-required">
                    <p>Войдите через Google, чтобы увидеть список реплеев.</p>
                    <button onClick={handleLogin} className="btn">Войти с Google</button>
                </div>
            )}

            {error && !loading && <div className="error">{error}</div>}

            {!loading && !error && !unauth && (
                <section className="replays-grid">
                    {items.map((it) => (
                        <ReplayCard
                            key={it.id}
                            item={it}
                            onClick={(id) => {
                                // позже откроем страницу карточки боя
                                console.debug("Open replay", id);
                            }}
                        />
                    ))}
                    {items.length === 0 && <div className="empty">Пока нет реплеев.</div>}
                </section>
            )}
        </main>
    );
}
