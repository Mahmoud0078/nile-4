export type Session = {
  role: "customer";
  name: string;
  phone: string;
  email: string;
  loggedInAt?: number;
};

const SESSION_KEY = "rehlti.session";
const LAST_LOGIN_KEY = "rehlti.lastLogin";

export function saveSession(session: Session): void {
  try {
    const withTime: Session = { ...session, loggedInAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(withTime));
    localStorage.setItem(LAST_LOGIN_KEY, JSON.stringify(withTime));
  } catch {
    /* storage unavailable */
  }
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed || parsed.role !== "customer") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadLastLogin(): Session | null {
  try {
    const raw = localStorage.getItem(LAST_LOGIN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed || parsed.role !== "customer") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function formatLoginTime(ts?: number): string {
  if (!ts) return "—";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}