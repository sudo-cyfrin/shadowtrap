export function Badge({ children, color = 'neutral' }: { children: React.ReactNode; color?: 'neutral' | 'green' | 'yellow' | 'orange' | 'red' }) {
  const map: Record<string, string> = {
    neutral: 'bg-neutral-700/30 text-neutral-300 border-neutral-600/40',
    green: 'bg-emerald-600/20 text-emerald-300 border-emerald-700/40',
    yellow: 'bg-yellow-600/20 text-yellow-300 border-yellow-700/40',
    orange: 'bg-orange-600/20 text-orange-300 border-orange-700/40',
    red: 'bg-red-600/20 text-red-300 border-red-700/40',
  }
  return <span className={`border ${map[color]} rounded px-2 py-0.5 text-xs`}>{children}</span>
}


