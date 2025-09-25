import { Badge } from './Badge'
import type { Attack } from '../services/data'

export function SeverityBadge({ level }: { level: Attack['severity'] }) {
  const color = level === 'critical' ? 'red' : level === 'high' ? 'orange' : level === 'medium' ? 'yellow' : 'green'
  return <Badge color={color as any}>{level}</Badge>
}


