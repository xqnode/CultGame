import { useState } from 'react'
import { resumeAudio } from '../audio/sounds'

interface Props {
  onStart: (name: string) => void
  soundOn: boolean
  onToggleSound: () => void
}

export function StartScreen({ onStart, soundOn, onToggleSound }: Props) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    resumeAudio()
    onStart(name)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-up">
      <button
        type="button"
        onClick={onToggleSound}
        className="absolute top-4 right-4 text-sm text-[var(--color-mist)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
        aria-label={soundOn ? '关闭音效' : '开启音效'}
      >
        {soundOn ? '🔔 音效开' : '🔕 音效关'}
      </button>

      <div className="text-center max-w-lg">
        <p className="text-[var(--color-gold-dim)] text-sm tracking-[0.3em] mb-4">天道渺渺 · 仙途漫漫</p>
        <h1
          className="text-6xl md:text-7xl text-[var(--color-gold)] mb-6 animate-pulse-glow"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          修仙模拟器
        </h1>
        <p className="text-[var(--color-parchment-dim)] leading-relaxed mb-10 text-base">
          你是主角，每一次抉择皆关机缘。随机灵根定天资，在奇遇与劫难中修行，
          终至飞升成仙，或身死道消、堕魔陨落——结局，全系于你一念之间。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm text-[var(--color-mist)] mb-2 tracking-wider">
            道号
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入你的名字"
            maxLength={12}
            className="w-full px-4 py-3 bg-[rgba(232,220,200,0.06)] border border-[var(--color-jade)] rounded-sm
              text-[var(--color-parchment)] placeholder:text-[var(--color-mist)]/50
              focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30
              transition-all"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)]
            text-[var(--color-parchment)] font-semibold tracking-[0.2em] rounded-sm
            transition-all cursor-pointer border border-[var(--color-cinnabar-glow)]/50
            hover:shadow-[0_0_20px_rgba(184,58,42,0.3)]"
        >
          踏入仙途
        </button>
      </form>

      <p className="mt-12 text-xs text-[var(--color-mist)]/60">纯文字交互 · 多结局叙事</p>
    </div>
  )
}
