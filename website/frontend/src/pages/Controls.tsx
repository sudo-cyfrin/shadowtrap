import { Server, Shield } from 'lucide-react'
import { Card } from '../components/Card'
import { useState } from 'react'

export default function Controls() {
  const [idsRunning, setIdsRunning] = useState(true)
  const [honeypotRunning, setHoneypotRunning] = useState(true)

  const toggleIDS = () => setIdsRunning(!idsRunning)
  const toggleHoneypot = () => setHoneypotRunning(!honeypotRunning)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="IDS Control" icon={<Shield className="h-4 w-4 text-neutral-400" />}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-300">
            Intrusion Detection System is <span className={idsRunning ? 'text-emerald-400' : 'text-red-400'}>
              {idsRunning ? 'Online' : 'Stopped'}
            </span>
          </p>
          <button 
            onClick={toggleIDS}
            className="rounded-lg bg-neutral-800 px-4 py-2 text-sm hover:bg-neutral-700"
          >
            {idsRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </Card>

      <Card title="Honeypot Control" icon={<Server className="h-4 w-4 text-neutral-400" />}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-300">
            Honeypot is <span className={honeypotRunning ? 'text-emerald-400' : 'text-red-400'}>
              {honeypotRunning ? 'Listening' : 'Stopped'}
            </span>
          </p>
          <button 
            onClick={toggleHoneypot}
            className="rounded-lg bg-neutral-800 px-4 py-2 text-sm hover:bg-neutral-700"
          >
            {honeypotRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </Card>
    </div>
  )
}
