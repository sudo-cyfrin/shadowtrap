import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Card } from '../components/Card'

type Alert = {
  id: string
  timestamp: string
  alert_signature: string
  src_ip: string
  dest_ip: string
  proto: string
  vector: string
  geo: string
  severity: string
  alert_category: string
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
          setAlerts(data)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setLoading(false)
      }
    }

    fetchAlerts()

    // optional: refresh every 10s
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
        ) : alerts.length === 0 ? (
          <div className="text-neutral-400 text-sm">No alerts yet.</div>
        ) : (
          <ul className="space-y-3 text-sm">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="border-b border-neutral-800 pb-2 flex flex-col space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-medium">{a.alert_signature}</span>
                  <span className="text-neutral-500 text-xs">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-neutral-500 text-xs">
                  <strong>Category:</strong> {a.alert_category} |{' '}
                  <strong>Vector:</strong> {a.vector} |{' '}
                  <strong>Geo:</strong> {a.geo} |{' '}
                  <strong>Severity:</strong> {a.severity}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
