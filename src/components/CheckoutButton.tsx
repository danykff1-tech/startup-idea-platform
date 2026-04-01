'use client'

import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'An error occurred.')
        return
      }

      window.location.href = data.checkoutUrl
    } catch {
      setError('A network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-medium bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Processing...' : 'Upgrade to Pro'}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  )
}
