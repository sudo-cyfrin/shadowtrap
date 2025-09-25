import { useEffect, useState } from 'react'
import type { Attack, Totals } from '../services/data'
import { fetchRecentAttacks, fetchTotals } from '../services/data'

export function useData() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [totals, setTotals] = useState<Totals>({
    totalAttacks: 0,
    totalAttacks24hAgo: 0,
    critical: 0,
    redirected: 0,
    alertsSent: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        const [apiAttacks, apiTotals] = await Promise.all([fetchRecentAttacks(), fetchTotals()])
        if (!cancelled) {
          setAttacks(apiAttacks.slice(0, 12)) // limit to 12 recent attacks
          setTotals(apiTotals)
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()

    const interval = setInterval(loadData, 10000) // update every 10s
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return { attacks, totals, loading }
}
