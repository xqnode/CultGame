export type RealmId =
  | 'mortal'
  | 'qi_refining_1'
  | 'qi_refining_2'
  | 'qi_refining_3'
  | 'foundation'
  | 'golden_core'
  | 'nascent_soul'
  | 'deity'

export interface RealmInfo {
  id: RealmId
  name: string
  order: number
  lifespanBonus: number
  breakthroughThreshold: number
}

export interface SpiritRoot {
  id: string
  name: string
  description: string
  weight: number
  stats: {
    rootBone: [number, number]
    comprehension: [number, number]
    luck: [number, number]
  }
  lifespan: [number, number]
}

export interface PlayerStats {
  rootBone: number
  comprehension: number
  luck: number
  karma: number
  demonHeart: number
}

export interface PlayerState {
  name: string
  spiritRoot: string
  realm: RealmId
  age: number
  lifespan: number
  cultivation: number
  stats: PlayerStats
  spiritStones: number
  artifacts: string[]
  flags: Record<string, boolean>
  history: string[]
  log: string[]
}

export type Condition =
  | { type: 'stat'; key: keyof PlayerStats; min?: number; max?: number }
  | { type: 'realm'; min: RealmId }
  | { type: 'flag'; key: string; value: boolean }
  | { type: 'resource'; key: 'spiritStones'; min: number }
  | { type: 'age'; min?: number; max?: number }
  | { type: 'cultivation'; min?: number; max?: number }
  | { type: 'lifespan_remaining'; max: number }

export type Effect =
  | { type: 'stat'; key: keyof PlayerStats; value: number }
  | { type: 'cultivation'; value: number }
  | { type: 'lifespan'; value: number }
  | { type: 'spiritStones'; value: number }
  | { type: 'flag'; key: string; value: boolean }
  | { type: 'artifact'; id: string; name?: string }
  | { type: 'log'; text: string }
  | { type: 'age'; value: number }
  | { type: 'breakthrough' }

export interface Outcome {
  chance: number
  luckBonus?: number
  successEffects: Effect[]
  failEffects: Effect[]
  narrative: { success: string; fail: string }
}

export interface Choice {
  id: string
  text: string
  requirements?: Condition[]
  effects?: Effect[]
  outcomes?: Outcome[]
}

export interface GameEvent {
  id: string
  title: string
  description: string
  weight: number
  years?: number
  once?: boolean
  conditions?: Condition[]
  choices: Choice[]
}

export interface Ending {
  id: string
  title: string
  description: string
  priority: number
  conditions: Condition[]
}

export type GamePhase = 'start' | 'root_reveal' | 'playing' | 'ending'

export interface GameSession {
  phase: GamePhase
  player: PlayerState
  currentEvent: GameEvent | null
  ending: Ending | null
  turn: number
  revealedRoot: SpiritRoot | null
}
