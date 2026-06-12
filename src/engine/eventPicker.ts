import { checkConditions } from './conditions'
import type { GameEvent, PlayerState } from '../types/game'

export function pickNextEvent(state: PlayerState, events: GameEvent[]): GameEvent | null {
  const eligible = events.filter((event) => {
    if (event.once && state.history.includes(event.id)) return false
    return checkConditions(state, event.conditions)
  })

  if (eligible.length === 0) return null

  const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0)
  let roll = Math.random() * totalWeight

  for (const event of eligible) {
    roll -= event.weight
    if (roll <= 0) return event
  }

  return eligible[eligible.length - 1]
}
