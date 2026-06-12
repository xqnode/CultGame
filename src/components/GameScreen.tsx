import type { GameSession } from '../types/game'
import { ChoiceList } from './ChoiceList'
import { EventCard } from './EventCard'
import { LogPanel } from './LogPanel'
import { StatusPanel } from './StatusPanel'

interface Props {
  session: GameSession
  onChoose: (choiceId: string) => void
  soundOn: boolean
  onToggleSound: () => void
}

export function GameScreen({ session, onChoose, soundOn, onToggleSound }: Props) {
  const { player, currentEvent, turn } = session

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-mist)]">天道渺渺，机缘未至……</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8 max-w-6xl mx-auto">
      <button
        type="button"
        onClick={onToggleSound}
        className="absolute top-4 right-4 text-sm text-[var(--color-mist)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
      >
        {soundOn ? '🔔' : '🔕'}
      </button>

      <StatusPanel player={player} turn={turn} />

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        <main className="border border-[var(--color-jade)]/30 bg-[rgba(12,15,13,0.6)] p-6 rounded-sm">
          <EventCard event={currentEvent} />
          <ChoiceList choices={currentEvent.choices} player={player} onChoose={onChoose} />
        </main>

        <div className="border border-[var(--color-jade)]/20 bg-[rgba(12,15,13,0.4)] p-5 rounded-sm">
          <LogPanel logs={player.log} />
        </div>
      </div>
    </div>
  )
}
