import { Shield } from 'lucide-react'
import { Card } from '../components/Card'

export default function Settings() {
  return (
    <div className="space-y-6">
      <Card title="Notification Settings" icon={<Shield className="h-4 w-4 text-neutral-400" />}>
        <form className="space-y-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-fuchsia-600" /> Email alerts
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-fuchsia-600" /> Desktop notifications
          </label>
        </form>
      </Card>
    </div>
  )
}


