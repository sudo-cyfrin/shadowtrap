import { NavLink } from 'react-router-dom'
import { Bug } from 'lucide-react'
import { Card } from '../components/Card'
import { SeverityBadge } from '../components/SeverityBadge'
import { useData } from '../hooks/useData'

export default function Attacks() {
  const { attacks, loading } = useData()
  return (
    <div className="space-y-6">
      <Card title="All Attacks" icon={<Bug className="h-4 w-4 text-neutral-400" />}>
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr className="border-b border-neutral-800">
              <th className="py-2">Time</th>
              <th>Source</th>
              <th>Geo</th>
              <th>Vector</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="py-4 text-neutral-400" colSpan={5}>Loading…</td></tr>
            ) : attacks.map((a) => (
              <tr key={a.id} className="border-b border-neutral-900 hover:bg-neutral-800/40">
                <td className="py-2 text-neutral-300"><NavLink to={`/attacks/${a.id}`} className="hover:underline">{a.timestamp}</NavLink></td>
                <td className="text-neutral-300">{a.sourceIp}</td>
                <td className="text-neutral-400">{a.geo}</td>
                <td className="text-neutral-300">{a.vector}</td>
                <td><SeverityBadge level={a.severity} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}


