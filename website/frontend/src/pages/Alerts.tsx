import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Card } from '../components/Card'

type Alert = {
  id: string
  t: string
  message: string
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchAlerts() {
      try {
        const res = await fetch('http://localhost:5001/api/alerts')
        const data = await res.json()

        if (!cancelled) {
          // map backend fields to frontend Alert type
          const mapped = data.map((a: any) => ({
            id: String(a.id),
            t: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : '',
            message: a.signature ?? 'No description',
          }))
          setAlerts(mapped)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setLoading(false)
      }
    }

    fetchAlerts()

    // optional: polling every 10s
    const interval = setInterval(fetchAlerts, 10000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card title="Recent Alerts" icon={<Bell className="h-4 w-4 text-neutral-400" />}>
        {loading ? (
          <div className="text-neutral-400 text-sm">Loading...</div>
        ) : (
          <ul className="space-y-3 text-sm">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between border-b border-neutral-800 pb-2"
              >
                <div className="text-neutral-300">{a.message}</div>
                <div className="text-neutral-500 text-xs">{a.t}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
