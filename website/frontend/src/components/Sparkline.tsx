export function Sparkline({ values = [] as number[] }: { values?: number[] }) {
  const max = Math.max(1, ...values)
  const points = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ')
  return (
    <svg viewBox="0 0 100 100" className="h-10 w-full">
      <polyline fill="none" stroke="rgb(147 197 253)" strokeWidth="2" points={points} />
    </svg>
  )
}


