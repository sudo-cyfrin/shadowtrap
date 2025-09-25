import { Download } from 'lucide-react'
import { Card } from '../components/Card'
import { useData } from '../hooks/useData'

export default function Report() {
  const { attacks, totals } = useData()

  // Simple CSV export
  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Source IP', 'Geo', 'Vector', 'Severity']
    const rows = attacks.map(a => [a.id, a.timestamp, a.sourceIp, a.geo, a.vector, a.severity])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'attack-report.csv'
    link.click()
  }

  return (
    <div className="space-y-6">
      <Card title="Attack Summary Report" icon={<Download className="h-4 w-4 text-neutral-400" />}>
        <div className="text-sm text-neutral-300 space-y-2">
          <p><strong>Total Attacks:</strong> {totals.totalAttacks}</p>
          <p><strong>Critical:</strong> {totals.critical}</p>
          <p><strong>Redirected to Honeypot:</strong> {totals.redirected}</p>
          <p><strong>Alerts Sent:</strong> {totals.alertsSent}</p>
        </div>
        <button 
          onClick={exportCSV}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-700"
        >
          Export CSV
        </button>
      </Card>
    </div>
  )
}
