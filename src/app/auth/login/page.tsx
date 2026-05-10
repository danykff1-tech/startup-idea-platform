'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles } from 'lucide-react'

type Mode = 'login' | 'signup' | 'reset'

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
)

function GlassInput({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/50 focus-within:bg-foreground/10">
      {children}
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setError(error.message); return }
        router.push('/')
        router.refresh()
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) { setError(error.message); return }
        setMessage('Check your email to confirm your account!')
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        })
        if (error) { setError(error.message); return }
        setMessage('Password reset link sent — check your email!')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">

      {/* ── Left: Form ── */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Sparkles size={20} className="text-amber-500" />
            <span className="text-lg font-bold text-foreground">idealike</span>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-semibold text-foreground leading-tight mb-2">
                {mode === 'login' && 'Welcome back'}
                {mode === 'signup' && 'Create account'}
                {mode === 'reset' && 'Reset password'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {mode === 'login' && 'Sign in to discover AI-curated startup ideas'}
                {mode === 'signup' && 'Start exploring ideas for free, no credit card'}
                {mode === 'reset' && 'Enter your email and we\'ll send a reset link'}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Email Address
                </label>
                <GlassInput>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </GlassInput>
              </div>

              {/* Password (not for reset) */}
              {mode !== 'reset' && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                    Password
                  </label>
                  <GlassInput>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword
                          ? <EyeOff className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                          : <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                        }
                      </button>
                    </div>
                  </GlassInput>
                </div>
              )}

              {/* Forgot password link */}
              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(''); setMessage('') }}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error / Success messages */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-xl">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 rounded-xl">
                  {message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading
                  ? '...'
                  : mode === 'login' ? 'Sign In'
                  : mode === 'signup' ? 'Create Account'
                  : 'Send Reset Link'
                }
              </button>
            </form>

            {/* Divider */}
            {mode !== 'reset' && (
              <>
                <div className="relative flex items-center justify-center">
                  <span className="w-full border-t border-border" />
                  <span className="px-4 text-xs text-muted-foreground bg-background absolute whitespace-nowrap">
                    Or continue with
                  </span>
                </div>

                {/* Google */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  <GoogleIcon />
                  <span className="text-sm font-medium">Continue with Google</span>
                </button>
              </>
            )}

            {/* Toggle mode */}
            <p className="text-center text-sm text-muted-foreground">
              {mode === 'login' && (
                <>
                  New here?{' '}
                  <button
                    onClick={() => { setMode('signup'); setError(''); setMessage('') }}
                    className="text-primary hover:underline font-medium"
                  >
                    Create Account
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setMode('login'); setError(''); setMessage('') }}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </>
              )}
              {mode === 'reset' && (
                <button
                  onClick={() => { setMode('login'); setError(''); setMessage('') }}
                  className="text-primary hover:underline font-medium"
                >
                  ← Back to Sign In
                </button>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── Right: Hero image ── */}
      <section className="hidden md:block flex-1 relative p-4">
        <div
          className="absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80)`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 rounded-3xl bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-sm">
              <div className="text-4xl font-bold mb-1">✦</div>
              <p className="text-lg font-semibold leading-snug mb-2">
                AI-curated startup ideas, every day
              </p>
              <p className="text-sm text-white/70">
                We filter the noise so you can focus on building.
                Join founders who discover their next idea on idealike.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
