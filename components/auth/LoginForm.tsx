'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from '@/lib/auth/flows'
import Alert from '@/components/ui/Alert'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn(email, password)

      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
        const redirectTo = searchParams?.get('redirect')
        const role = result.data?.user?.user_metadata?.role as string | undefined

        if (redirectTo && redirectTo.startsWith('/')) {
          router.push(redirectTo)
        } else if (role === 'admin') {
          router.push('/admin/dashboard')
        } else if (role === 'it_professional') {
          router.push('/professional/dashboard')
        } else {
          router.push('/user/requests')
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="error" title="Login Failed">
          {error}
        </Alert>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {isLoading ? 'Signing in…' : 'Sign In'}
      </button>

    </form>
  )
}
