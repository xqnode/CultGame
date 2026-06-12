import type { GameSession } from '../types/game'

interface Props {
  session: GameSession
  onRestart: () => void
}

export function EndingScreen({ session, onRestart }: Props) {
  const { ending, player } = session
  if (!ending) return null

  const keyChoices = player.log.filter(
    (l) => l.includes('突破') || l.includes('堕') || l.includes('飞升') || l.includes('陨落') || l.includes('拜入') || l.includes('散修'),
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-up">
      <p className="text-[var(--color-gold-dim)] text-sm tracking-[0.4em] mb-4">— 天命已定 —</p>

      <h2
        className="text-5xl text-[var(--color-cinnabar-glow)] mb-6 text-center"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {ending.title}
      </h2>

      <div className="w-full max-w-lg border border-[var(--color-jade)]/40 bg-[rgba(45,90,74,0.1)] p-8 rounded-sm mb-8">
        <p className="text-[var(--color-parchment)] leading-[1.9] text-center mb-6">
          {ending.description}
        </p>
        <div className="text-sm text-[var(--color-mist)] space-y-1 text-center">
          <p>{player.name} · {player.spiritRoot} · {player.age} 岁陨落/落幕</p>
          <p>最终境界修为 · 共历 {session.turn} 回合</p>
        </div>
      </div>

      {keyChoices.length > 0 && (
        <div className="w-full max-w-lg mb-8">
          <p className="text-xs text-[var(--color-mist)] tracking-wider mb-3 text-center">关键抉择回顾</p>
          <div className="space-y-2">
            {keyChoices.slice(-5).map((entry, i) => (
              <p key={i} className="text-sm text-[var(--color-parchment-dim)] text-center">
                {entry}
              </p>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="px-10 py-3 bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)]
          text-[var(--color-parchment)] tracking-[0.2em] rounded-sm transition-all cursor-pointer
          border border-[var(--color-cinnabar-glow)]/50"
      >
        再入仙途
      </button>
    </div>
  )
}
