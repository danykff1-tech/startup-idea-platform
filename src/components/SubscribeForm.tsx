'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setMessage(data.already ? 'Already subscribed ✓' : 'Subscribed! Your first idea arrives tomorrow ✓')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
      aria-label="Email subscription form"
    >
      <label htmlFor="subscribe-email" className="sr-only">
        Email address
      </label>
      <input
        id="subscribe-email"
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
        className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading' || !email}
        className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>

      {message && (
        <p
          role="status"
          className={`col-span-full text-sm mt-2 ${
            status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
