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
          setMessage('Unsubscribed successfully.')
        }
      } else {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        if (res.ok) {
          setSubscribed(true)
          setMessage('Subscribed! Your first idea arrives tomorrow.')
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
          {subscribed ? 'Daily idea email · Active' : 'Daily idea email'}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {subscribed
            ? `Sending one AI-picked idea to ${email} every day`
            : 'Get one AI-curated startup idea in your inbox every day'}
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
        {loading ? '...' : subscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
    </div>
  )
}
