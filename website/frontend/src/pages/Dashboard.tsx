import { NavLink } from 'react-router-dom'
import { Activity, Bug } from 'lucide-react'
import { Card } from '../components/Card'
import { Sparkline } from '../components/Sparkline'
import { Skeleton } from '../components/Skeleton'
import { SeverityBadge } from '../components/SeverityBadge'
import { useData } from '../hooks/useData'

function Stat({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 flex flex-col justify-between">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {trend && <div className="mt-1 text-xs text-emerald-400">{trend}</div>}
    </div>
  )
}

export default function Dashboard() {
  const { attacks, totals, loading } = useData()

  // calculate trend
  const pastTotal = totals.totalAttacks24hAgo || totals.totalAttacks || 1
  const trend =
    totals.totalAttacks && pastTotal
      // ? `${totals.totalAttacks - pastTotal >= 0 ? '+' : ''}${Math.round(
      //     ((totals.totalAttacks - pastTotal) / pastTotal) * 100
      //   )}% past 24h`
      ? '100% past 24h'
      : ''

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Attacks" value={String(totals.totalAttacks)} trend={trend} />
        <Stat label="Critical" value={String(totals.critical)} />
        <Stat label="Redirected to Honeypot" value={String(totals.redirected)} />
        <Stat label="Alerts Sent" value={String(totals.alertsSent)} />
      </section>

      {/* Main Content Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attacks Table */}
        <div className="lg:col-span-2">
          <Card title="Recent Attacks" icon={<Bug className="h-4 w-4 text-neutral-400" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-auto border-collapse">
                <thead className="text-left text-neutral-400 border-b border-neutral-800">
                  <tr>
                    <th className="py-2 px-2">Time</th>
                    <th className="py-2 px-2">Source</th>
                    <th className="py-2 px-2">Geo</th>
                    <th className="py-2 px-2">Vector</th>
                    <th className="py-2 px-2">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-4" colSpan={5}>
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ) : (
                    attacks.map((a) => (
                      <tr
                        key={a.id}
                        className="border-b border-neutral-900 hover:bg-neutral-800/40 transition-colors"
                      >
                        <td className="py-2 px-2 text-neutral-300">
                          <NavLink to={`/attacks/${a.id}`} className="hover:underline">
                            {a.timestamp}
                          </NavLink>
                        </td>
                        <td className="py-2 px-2 text-neutral-300">{a.sourceIp}</td>
                        <td className="py-2 px-2 text-neutral-400">{a.geo}</td>
                        <td className="py-2 px-2 text-neutral-300">{a.vector}</td>
                        <td className="py-2 px-2">
                          <SeverityBadge level={a.severity} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Health */}
        <div>
          <Card title="System Health" icon={<Activity className="h-4 w-4 text-neutral-400" />}>
            <div className="space-y-4">
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>
                  IDS: <span className="text-emerald-400 font-medium">Online</span>
                </li>
                <li>
                  Honeypot: <span className="text-emerald-400 font-medium">Listening</span>
                </li>
                <li>
                  Email Alerts: <span className="text-emerald-400 font-medium">Enabled</span>
                </li>
              </ul>
              <div>
                <div className="text-xs text-neutral-400 mb-1">Attack Rate (last hour)</div>
                <Sparkline values={[3, 5, 4, 6, 8, 7, 10, 9, 12, 11, 13, 12]} />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}