'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefersDark
    setDark(isDark)
    applyTheme(isDark)
  }, [])

  function applyTheme(isDark: boolean) {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
  }

  function toggle() {
    const next = !dark
    setDark(next)
    applyTheme(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
