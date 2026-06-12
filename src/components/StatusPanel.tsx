import { getRealmName } from '../engine/gameEngine'
import type { PlayerState } from '../types/game'

interface Props {
  player: PlayerState
  turn: number
}

export function StatusPanel({ player, turn }: Props) {
  const remaining = player.lifespan - player.age

  return (
    <header className="border-b border-[var(--color-jade)]/40 pb-4 mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-xl text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
          {player.name}
        </h2>
        <span className="text-xs text-[var(--color-mist)]">第 {turn} 回合</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-parchment-dim)] mb-3">
        <span>{getRealmName(player.realm)}</span>
        <span>·</span>
        <span>{player.spiritRoot}</span>
        <span>·</span>
        <span>{player.age} 岁</span>
        <span>·</span>
        <span className={remaining <= 10 ? 'text-[var(--color-cinnabar)]' : ''}>
          寿元 {remaining} 年
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-[var(--color-mist)] mb-1">
          <span>修为</span>
          <span>{player.cultivation}%</span>
        </div>
        <div className="h-1.5 bg-[rgba(0,0,0,0.3)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-jade)] to-[var(--color-gold)] transition-all duration-500"
            style={{ width: `${player.cultivation}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
        <MiniStat label="根骨" value={player.stats.rootBone} />
        <MiniStat label="悟性" value={player.stats.comprehension} />
        <MiniStat label="气运" value={player.stats.luck} />
        <MiniStat label="因果" value={player.stats.karma} />
        <MiniStat label="心魔" value={player.stats.demonHeart} warn={player.stats.demonHeart >= 50} />
        <MiniStat label="灵石" value={player.spiritStones} />
      </div>

      {player.artifacts.length > 0 && (
        <p className="mt-2 text-xs text-[var(--color-mist)]">
          法宝：{player.artifacts.join('、')}
        </p>
      )}
    </header>
  )
}

function MiniStat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="bg-[rgba(0,0,0,0.2)] px-2 py-1.5 rounded-sm text-center">
      <p className="text-[var(--color-mist)]">{label}</p>
      <p className={warn ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-parchment)]'}>{value}</p>
    </div>
  )
}
