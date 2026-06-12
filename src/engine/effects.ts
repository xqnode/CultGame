import { getNextRealm, REALMS } from '../data/realms'
import type { Effect, PlayerState } from '../types/game'

export function applyEffects(state: PlayerState, effects: Effect[]): PlayerState {
  let next = { ...state, stats: { ...state.stats }, flags: { ...state.flags }, artifacts: [...state.artifacts], log: [...state.log] }

  for (const effect of effects) {
    next = applyEffect(next, effect)
  }

  return next
}

function applyEffect(state: PlayerState, effect: Effect): PlayerState {
  switch (effect.type) {
    case 'stat': {
      const value = clamp(state.stats[effect.key] + effect.value, effect.key === 'karma' ? -100 : 0, effect.key === 'karma' ? 100 : effect.key === 'demonHeart' ? 100 : 999)
      return {
        ...state,
        stats: { ...state.stats, [effect.key]: value },
      }
    }
    case 'cultivation': {
      let cultivation = state.cultivation + effect.value
      let realm = state.realm
      let lifespan = state.lifespan

      while (cultivation >= 100) {
        const nextRealm = getNextRealm(realm)
        if (!nextRealm) {
          cultivation = 100
          break
        }
        cultivation -= 100
        realm = nextRealm
        lifespan += REALMS[nextRealm].lifespanBonus
      }

      cultivation = clamp(cultivation, 0, 100)
      return { ...state, cultivation, realm, lifespan }
    }
    case 'lifespan':
      return { ...state, lifespan: Math.max(state.age + 1, state.lifespan + effect.value) }
    case 'spiritStones':
      return { ...state, spiritStones: Math.max(0, state.spiritStones + effect.value) }
    case 'flag':
      return { ...state, flags: { ...state.flags, [effect.key]: effect.value } }
    case 'artifact':
      if (state.artifacts.includes(effect.id)) return state
      return { ...state, artifacts: [...state.artifacts, effect.id] }
    case 'log':
      return { ...state, log: [...state.log, effect.text] }
    case 'age':
      return { ...state, age: state.age + effect.value }
    case 'breakthrough': {
      const nextRealm = getNextRealm(state.realm)
      if (!nextRealm) return state
      return {
        ...state,
        realm: nextRealm,
        cultivation: 0,
        lifespan: state.lifespan + REALMS[nextRealm].lifespanBonus,
        log: [...state.log, `突破成功！晋升${REALMS[nextRealm].name}！`],
      }
    }
    default:
      return state
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
