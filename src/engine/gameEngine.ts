import { ENDINGS } from '../data/endings'
import { EVENTS } from '../data/events'
import { REALMS } from '../data/realms'
import { SPIRIT_ROOTS } from '../data/spiritRoots'
import { checkConditions } from './conditions'
import { applyEffects } from './effects'
import { pickNextEvent } from './eventPicker'
import type {
  Choice,
  Ending,
  GameEvent,
  GameSession,
  Outcome,
  PlayerState,
  SpiritRoot,
} from '../types/game'

function randBetween([min, max]: [number, number]): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function rollSpiritRoot(): SpiritRoot {
  const totalWeight = SPIRIT_ROOTS.reduce((sum, r) => sum + r.weight, 0)
  let roll = Math.random() * totalWeight
  for (const root of SPIRIT_ROOTS) {
    roll -= root.weight
    if (roll <= 0) return root
  }
  return SPIRIT_ROOTS[SPIRIT_ROOTS.length - 1]
}

export function createPlayer(name: string, root: SpiritRoot): PlayerState {
  return {
    name,
    spiritRoot: root.name,
    realm: 'mortal',
    age: 16,
    lifespan: randBetween(root.lifespan),
    cultivation: 0,
    stats: {
      rootBone: randBetween(root.stats.rootBone),
      comprehension: randBetween(root.stats.comprehension),
      luck: randBetween(root.stats.luck),
      karma: 0,
      demonHeart: 0,
    },
    spiritStones: 10,
    artifacts: [],
    flags: {},
    history: [],
    log: [`${16}岁：踏入修仙之路，测得${root.name}。`],
  }
}

export function createNewGame(name: string): GameSession {
  const root = rollSpiritRoot()
  const player = createPlayer(name, root)
  const startEvent = EVENTS.find((e) => e.id === 'enter_sect') ?? null

  return {
    phase: 'root_reveal',
    player,
    currentEvent: startEvent,
    ending: null,
    turn: 0,
    revealedRoot: root,
  }
}

export function beginPlaying(session: GameSession): GameSession {
  const event = session.currentEvent ?? pickNextEvent(session.player, EVENTS)
  return {
    ...session,
    phase: 'playing',
    currentEvent: event,
    turn: 1,
  }
}

export function checkEnding(state: PlayerState): Ending | null {
  const sorted = [...ENDINGS].sort((a, b) => b.priority - a.priority)
  for (const ending of sorted) {
    if (checkConditions(state, ending.conditions)) return ending
  }
  return null
}

function resolveOutcome(state: PlayerState, outcome: Outcome): { state: PlayerState; narrative: string; success: boolean } {
  let chance = outcome.chance
  if (outcome.luckBonus) {
    chance += state.stats.luck * outcome.luckBonus
  }
  chance = Math.max(0.05, Math.min(0.95, chance))

  const success = Math.random() < chance
  const effects = success ? outcome.successEffects : outcome.failEffects
  const narrative = success ? outcome.narrative.success : outcome.narrative.fail
  const newState = applyEffects(state, effects)

  return { state: newState, narrative, success }
}

function findChoice(event: GameEvent, choiceId: string): Choice | undefined {
  return event.choices.find((c) => c.id === choiceId)
}

export function resolveChoice(session: GameSession, choiceId: string): GameSession {
  if (!session.currentEvent || session.phase !== 'playing') return session

  const choice = findChoice(session.currentEvent, choiceId)
  if (!choice) return session
  if (!checkConditions(session.player, choice.requirements)) return session

  let player = { ...session.player }
  let narrative = ''

  if (choice.outcomes && choice.outcomes.length > 0) {
    const result = resolveOutcome(player, choice.outcomes[0])
    player = result.state
    narrative = result.narrative
  } else if (choice.effects) {
    player = applyEffects(player, choice.effects)
    narrative = choice.text
  }

  const years = session.currentEvent.years ?? 1
  player = { ...player, age: player.age + years }

  const ageLog = `${player.age}岁：${narrative}`
  player = { ...player, log: [...player.log, ageLog] }

  if (!player.history.includes(session.currentEvent.id)) {
    player = { ...player, history: [...player.history, session.currentEvent.id] }
  }

  const ending = checkEnding(player)
  if (ending) {
    return {
      ...session,
      player,
      currentEvent: null,
      ending,
      phase: 'ending',
      turn: session.turn + 1,
    }
  }

  if (player.age >= player.lifespan) {
    const naturalEnding = ENDINGS.find((e) => e.id === 'natural_death')!
    return {
      ...session,
      player: {
        ...player,
        log: [...player.log, `${player.age}岁：寿元耗尽，魂归天地。`],
      },
      currentEvent: null,
      ending: naturalEnding,
      phase: 'ending',
      turn: session.turn + 1,
    }
  }

  const nextEvent = pickNextEvent(player, EVENTS)
  if (!nextEvent) {
    const wanderEnding = ENDINGS.find((e) => e.id === 'wandering_hermit')!
    return {
      ...session,
      player,
      currentEvent: null,
      ending: wanderEnding,
      phase: 'ending',
      turn: session.turn + 1,
    }
  }

  return {
    ...session,
    player,
    currentEvent: nextEvent,
    turn: session.turn + 1,
  }
}

export function getRealmName(realm: PlayerState['realm']): string {
  return REALMS[realm].name
}

const SAVE_KEY = 'cultgame_save'

export function saveGame(session: GameSession): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(session))
  } catch {
    // ignore storage errors
  }
}

export function loadGame(): GameSession | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as GameSession
  } catch {
    return null
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY)
}
