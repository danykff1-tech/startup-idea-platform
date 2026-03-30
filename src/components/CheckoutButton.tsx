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
        setError(data.error ?? '오류가 발생했습니다.')
        return
      }

      window.location.href = data.checkoutUrl
    } catch {
      setError('네트워크 오류가 발생했습니다.')
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
        {loading ? '처리 중...' : 'Pro 업그레이드 시작'}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  )
}
