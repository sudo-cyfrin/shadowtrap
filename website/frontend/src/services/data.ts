export type AttackSeverity = 'low' | 'medium' | 'high' | 'critical'

export type Attack = {
  id: string
  timestamp: string
  sourceIp: string
  geo: string
  vector: string
  severity: AttackSeverity
}

export type Totals = {
  totalAttacks: number
  totalAttacks24hAgo: number
  critical: number
  redirected: number
  alertsSent: number
}

// Backend API URL
const API_URL = "http://localhost:5001/api"

// --- Fetch totals from backend ---
export async function fetchTotals(): Promise<Totals> {
  try {
    const res = await fetch(`${API_URL}/totals`)
    const data = await res.json()

    return {
      totalAttacks: data.totalAttacks ?? 0,
      totalAttacks24hAgo: data.totalAttacks24hAgo ?? 0,
      critical: data.critical ?? 0,
      redirected: data.redirected ?? 0,
      alertsSent: data.alertsSent ?? 0,
    }
  } catch {
    return { totalAttacks: 0, totalAttacks24hAgo: 0, critical: 0, redirected: 0, alertsSent: 0 }
  }
}
// --- Fetch recent attacks from /attacks endpoint ---
export async function fetchRecentAttacks(): Promise<Attack[]> {
  try {
    const res = await fetch(`${API_URL}/attacks`)  // <-- fetch /attacks
    const data = await res.json()

    return data.map((a: any) => ({
      id: String(a.id),
      timestamp: a.last_seen ?? a.first_seen ?? new Date().toISOString(),
      sourceIp: a.ip ?? 'unknown',
      geo: a.geo ?? '??',
      vector: a.vector ?? 'unknown',
      severity: (a.status === 'pending' ? 'high' : a.status === 'redirected' ? 'medium' : 'low') as AttackSeverity,
    }))
  } catch {
    return []
  }
}

// --- Fetch single attack by ID ---
export async function fetchAttackById(id: string): Promise<Attack | undefined> {
  try {
    const res = await fetch(`${API_URL}/attack/${id}`)
    if (!res.ok) return undefined
    const a = await res.json()
    return {
      id: String(a.id),
      timestamp: a.last_seen ?? a.first_seen ?? new Date().toISOString(),
      sourceIp: a.ip ?? 'unknown',
      geo: a.geo ?? '??',
      vector: a.vector ?? 'unknown',
      severity: (a.status === 'pending' ? 'high' : a.status === 'redirected' ? 'medium' : 'low') as AttackSeverity,
    }
  } catch {
    return undefined
  }
}
