'use client'

import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'

interface Props {
  email: string
  initialSubscribed: boolean
}

export default function SubscribeToggle({ email, initialSubscribed }: Props) {
  const [subscribed, setSubscribed] = useState(initialSubscribed)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleToggle = async () => {
    setLoading(true)
    setMessage('')
    try {
      if (subscribed) {
        // 구독 취소
        const res = await fetch('/api/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        if (res.ok) {
          setSubscribed(false)
          setMessage('구독이 취소됐어요.')
        }
      } else {
        // 구독
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        if (res.ok) {
          setSubscribed(true)
          setMessage('구독 완료! 내일 첫 아이디어를 보내드릴게요.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">
          {subscribed ? '일일 아이디어 이메일 수신 중' : '일일 아이디어 이메일'}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {subscribed
            ? `${email} 으로 매일 AI 추천 아이디어 1개를 보내드려요`
            : '매일 AI가 고른 사업 아이디어 1개를 이메일로 받아보세요'}
        </p>
        {message && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{message}</p>
        )}
      </div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 shrink-0 ${
          subscribed
            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        {subscribed ? <BellOff size={15} /> : <Bell size={15} />}
        {loading ? '...' : subscribed ? '구독 취소' : '구독하기'}
      </button>
    </div>
  )
}
