import { getRealmOrder } from '../data/realms'
import type { Condition, PlayerState } from '../types/game'

export function checkConditions(state: PlayerState, conditions: Condition[] | undefined): boolean {
  if (!conditions || conditions.length === 0) return true
  return conditions.every((c) => checkCondition(state, c))
}

function checkCondition(state: PlayerState, condition: Condition): boolean {
  switch (condition.type) {
    case 'stat': {
      const value = state.stats[condition.key]
      if (condition.min !== undefined && value < condition.min) return false
      if (condition.max !== undefined && value > condition.max) return false
      return true
    }
    case 'realm':
      return getRealmOrder(state.realm) >= getRealmOrder(condition.min)
    case 'flag':
      return state.flags[condition.key] === condition.value
    case 'resource':
      return state[condition.key] >= condition.min
    case 'age': {
      if (condition.min !== undefined && state.age < condition.min) return false
      if (condition.max !== undefined && state.age > condition.max) return false
      return true
    }
    case 'cultivation': {
      if (condition.min !== undefined && state.cultivation < condition.min) return false
      if (condition.max !== undefined && state.cultivation > condition.max) return false
      return true
    }
    case 'lifespan_remaining':
      return state.lifespan - state.age <= condition.max
    default:
      return true
  }
}

export function getFailedRequirements(
  state: PlayerState,
  conditions: Condition[] | undefined,
): string[] {
  if (!conditions) return []
  const failed: string[] = []
  for (const c of conditions) {
    if (!checkCondition(state, c)) {
      failed.push(describeCondition(c))
    }
  }
  return failed
}

function describeCondition(c: Condition): string {
  switch (c.type) {
    case 'stat':
      return c.min !== undefined ? `${statName(c.key)}≥${c.min}` : `${statName(c.key)}≤${c.max}`
    case 'realm':
      return `境界需达${c.min}`
    case 'flag':
      return '需满足特定条件'
    case 'resource':
      return `灵石≥${c.min}`
    case 'age':
      return c.min !== undefined ? `年龄≥${c.min}` : `年龄≤${c.max}`
    case 'cultivation':
      return c.min !== undefined ? `修为≥${c.min}%` : `修为≤${c.max}%`
    case 'lifespan_remaining':
      return `寿元将尽`
    default:
      return '条件未满足'
  }
}

function statName(key: string): string {
  const names: Record<string, string> = {
    rootBone: '根骨',
    comprehension: '悟性',
    luck: '气运',
    karma: '因果',
    demonHeart: '心魔',
  }
  return names[key] ?? key
}
