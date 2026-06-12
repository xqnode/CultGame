interface Props {
  logs: string[]
}

export function LogPanel({ logs }: Props) {
  const recent = logs.slice(-12)

  return (
    <aside className="h-full flex flex-col">
      <h4
        className="text-lg text-[var(--color-gold-dim)] mb-4 shrink-0"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        修仙日志
      </h4>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[50vh] lg:max-h-none">
        {recent.length === 0 ? (
          <p className="text-sm text-[var(--color-mist)]/50">尚无记录……</p>
        ) : (
          recent.map((entry, i) => (
            <p
              key={`${i}-${entry.slice(0, 20)}`}
              className="text-sm text-[var(--color-parchment-dim)] leading-relaxed border-l-2 border-[var(--color-jade)]/30 pl-3 animate-fade-up"
            >
              {entry}
            </p>
          ))
        )}
      </div>
    </aside>
  )
}
