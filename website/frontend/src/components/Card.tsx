import type { ReactNode } from 'react'

export function Card({ title, children, icon }: { title: string; children: ReactNode; icon?: ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-3">
        {icon}
        <h3 className="text-sm font-medium text-neutral-300">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}


