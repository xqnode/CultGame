import { useCallback, useEffect, useState } from 'react'
import { playSound, setMuted } from '../audio/sounds'
import {
  beginPlaying,
  clearSave,
  createNewGame,
  leaveShop,
  loadGame,
  purchaseShopItem,
  resolveChoice,
  saveGame,
} from '../engine/gameEngine'
import type { GameSession, Milestone, NewGameOptions, OriginId } from '../types/game'

export function useGame() {
  const [session, setSession] = useState<GameSession | null>(() => loadGame())
  const [soundOn, setSoundOn] = useState(true)
  const [milestone, setMilestone] = useState<Milestone | null>(null)
  const [achievementToast, setAchievementToast] = useState<string[]>([])

  useEffect(() => {
    if (session && (session.phase === 'playing' || session.phase === 'shop' || session.phase === 'ending')) {
      saveGame(session)
    }
  }, [session])

  useEffect(() => {
    setMuted(!soundOn)
  }, [soundOn])

  const showAchievements = useCallback((ids: string[]) => {
    if (ids.length > 0) setAchievementToast(ids)
  }, [])

  const startGame = useCallback(
    (options: NewGameOptions) => {
      if (soundOn) playSound('start')
      setSession(createNewGame(options))
      setMilestone(null)
      setAchievementToast([])
    },
    [soundOn],
  )

  const confirmRoot = useCallback(() => {
    if (!session) return
    if (soundOn) playSound('rootReveal')
    const next = beginPlaying(session)
    setSession(next)
    if (next.lastMilestone) {
      setMilestone(next.lastMilestone)
      if (soundOn) playSound('success')
    } else if (soundOn) {
      playSound('event')
    }
  }, [session, soundOn])

  const choose = useCallback(
    (choiceId: string) => {
      if (!session || session.phase !== 'playing') return

      if (soundOn) playSound('choice')

      const prevAch = session.newAchievements.length
      const next = resolveChoice(session, choiceId)

      if (next.phase === 'ending') {
        setMilestone(null)
      } else if (next.lastMilestone) {
        setMilestone(next.lastMilestone)
        if (soundOn) {
          if (next.lastMilestone.type === 'breakthrough') playSound('breakthrough')
          else if (next.lastMilestone.type === 'rare_event') playSound('success')
          else if (next.lastMilestone.type === 'lifespan_low') playSound('fail')
        }
      }

      const newLog = next.player.log.slice(session.player.log.length)
      if (soundOn && !next.lastMilestone) {
        const lastLog = newLog[newLog.length - 1] ?? ''
        if (lastLog.includes('突破') || lastLog.includes('晋升')) playSound('breakthrough')
        else if (lastLog.includes('失败') || lastLog.includes('重伤') || lastLog.includes('身死')) {
          playSound('fail')
        } else if (lastLog.includes('成功') || lastLog.includes('获')) {
          playSound('success')
        }
      }

      if (next.phase === 'ending') {
        if (soundOn) {
          playSound('ending')
          if (next.newEndingUnlock) playSound('success')
        }
      } else if (next.phase === 'playing' && soundOn) {
        playSound('event')
      } else if (next.phase === 'shop' && soundOn) {
        playSound('click')
      }

      const freshAch = next.newAchievements.slice(prevAch)
      if (freshAch.length > 0) {
        showAchievements(freshAch)
        if (soundOn) playSound('success')
      }

      setSession(next)
    },
    [session, soundOn, showAchievements],
  )

  const buyItem = useCallback(
    (itemId: string) => {
      if (!session || session.phase !== 'shop') return
      if (soundOn) playSound('click')
      const prev = session.newAchievements.length
      const next = purchaseShopItem(session, itemId)
      if (next.player.spiritStones < session.player.spiritStones && soundOn) {
        playSound('success')
      }
      const fresh = next.newAchievements.slice(prev)
      if (fresh.length > 0) showAchievements(fresh)
      setSession(next)
    },
    [session, soundOn, showAchievements],
  )

  const exitShop = useCallback(() => {
    if (!session) return
    const next = leaveShop(session)
    setSession(next)
    if (next.lastMilestone) {
      setMilestone(next.lastMilestone)
      if (soundOn) playSound('success')
    } else if (soundOn) {
      playSound('event')
    }
  }, [session, soundOn])

  const dismissMilestone = useCallback(() => setMilestone(null), [])
  const dismissAchievements = useCallback(() => setAchievementToast([]), [])

  const restart = useCallback(() => {
    clearSave()
    setSession(null)
    setMilestone(null)
    setAchievementToast([])
    if (soundOn) playSound('click')
  }, [soundOn])

  const toggleSound = useCallback(() => {
    if (soundOn) playSound('click')
    setSoundOn((prev) => !prev)
  }, [soundOn])

  return {
    session,
    soundOn,
    milestone,
    achievementToast,
    startGame,
    confirmRoot,
    choose,
    buyItem,
    exitShop,
    restart,
    toggleSound,
    dismissMilestone,
    dismissAchievements,
  }
}

export type StartGameParams = {
  name: string
  dailyMode: boolean
  useInnateBody: boolean
  origin: OriginId
}
