import { useCallback, useEffect, useState } from 'react'
import { playSound, setMuted } from '../audio/sounds'
import {
  beginPlaying,
  clearSave,
  createNewGame,
  loadGame,
  resolveChoice,
  saveGame,
} from '../engine/gameEngine'
import type { GameSession } from '../types/game'

export function useGame() {
  const [session, setSession] = useState<GameSession | null>(() => loadGame())
  const [soundOn, setSoundOn] = useState(true)

  useEffect(() => {
    if (session && session.phase === 'playing') {
      saveGame(session)
    }
  }, [session])

  const startGame = useCallback(
    (name: string) => {
      if (soundOn) playSound('start')
      const game = createNewGame(name.trim() || '无名修士')
      setSession(game)
    },
    [soundOn],
  )

  const confirmRoot = useCallback(() => {
    if (!session) return
    if (soundOn) playSound('rootReveal')
    setSession(beginPlaying(session))
    if (soundOn) playSound('event')
  }, [session, soundOn])

  const choose = useCallback(
    (choiceId: string) => {
      if (!session || session.phase !== 'playing') return

      if (soundOn) playSound('choice')

      const prevLogLen = session.player.log.length
      const next = resolveChoice(session, choiceId)
      const newLog = next.player.log.slice(prevLogLen)

      if (soundOn) {
        const lastLog = newLog[newLog.length - 1] ?? ''
        if (lastLog.includes('突破') || lastLog.includes('晋升')) {
          playSound('breakthrough')
        } else if (
          lastLog.includes('失败') ||
          lastLog.includes('重伤') ||
          lastLog.includes('身死') ||
          lastLog.includes('陨落')
        ) {
          playSound('fail')
        } else if (lastLog.includes('成功') || lastLog.includes('获')) {
          playSound('success')
        }
      }

      if (next.phase === 'ending' && soundOn) {
        playSound('ending')
      } else if (next.phase === 'playing' && soundOn) {
        playSound('event')
      }

      setSession(next)
    },
    [session, soundOn],
  )

  const restart = useCallback(() => {
    clearSave()
    setSession(null)
    if (soundOn) playSound('click')
  }, [soundOn])

  const toggleSound = useCallback(() => {
    if (soundOn) playSound('click')
    setSoundOn((prev) => {
      const next = !prev
      setMuted(!next)
      return next
    })
  }, [soundOn])

  useEffect(() => {
    setMuted(!soundOn)
  }, [soundOn])

  return {
    session,
    soundOn,
    startGame,
    confirmRoot,
    choose,
    restart,
    toggleSound,
  }
}
