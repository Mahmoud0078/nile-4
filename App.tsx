import { useEffect, useState } from "react";
import { Car } from "lucide-react";
import { CustomerLogin } from "@/components/CustomerLogin";
import { CustomerSignup } from "@/components/CustomerSignup";
import { CustomerHome } from "@/components/CustomerHome";
import { clearSession, loadSession, saveSession, type Session } from "@/lib/auth";

type View = "login" | "signup" | "home";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>("login");

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setSession(saved);
      setView("home");
    }
  }, []);

  function handleLogin(s: Session) {
    saveSession(s);
    setSession(s);
    setView("home");
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setView("login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Car className="size-5" />
            </span>
            <div>
              <p className="font-serif text-lg font-bold leading-tight text-slate-900">
                رحلتي
              </p>
              <p className="text-xs text-muted-foreground">تطبيق النقل الذكي</p>
            </div>
          </div>
          {session && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              عميل
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {view === "home" && session ? (
          <CustomerHome session={session} onLogout={handleLogout} />
        ) : view === "signup" ? (
          <CustomerSignup onCreated={handleLogin} />
        ) : (
          <CustomerLogin onLogin={handleLogin} onSignup={() => setView("signup")} />
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-8 pt-2 text-center text-xs text-muted-foreground">
        © ٢٠٢٥ رحلتي — كل الحقوق محفوظة
      </footer>
    </div>
  );
}