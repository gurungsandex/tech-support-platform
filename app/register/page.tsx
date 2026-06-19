import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'
import { Suspense } from 'react'
import { Shield, MessageSquare, Users } from 'lucide-react'

function RegisterContent() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1e2a4a] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-lg font-bold text-white">TechLink</span>
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            IT support that
            <br />
            actually works.
          </h1>
          <p className="mt-4 text-blue-200 text-lg">
            Connect with certified IT professionals in seconds. Resolve issues faster, securely, and seamlessly.
          </p>

          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Shield className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="font-semibold text-white">Verified Professionals</p>
                <p className="text-sm text-blue-200">Every technician is vetted and certified.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <MessageSquare className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="font-semibold text-white">Instant Messaging</p>
                <p className="text-sm text-blue-200">Connect instantly with the right expert.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Users className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="font-semibold text-white">Growing Network of IT Experts</p>
                <p className="text-sm text-blue-200">A vast network ready to solve any problem.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-blue-300/60">© 2026 TechLink. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="mb-8 flex lg:hidden justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-lg font-bold text-gray-900">TechLink</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-gray-500">Join TechLink and get started today.</p>
          </div>

          {/* Tab toggle */}
          <div className="mb-8 flex rounded-xl border border-gray-200 p-1 bg-gray-50">
            <Link
              href="/login"
              className="flex-1 rounded-lg py-2 text-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-lg bg-white py-2 text-center text-sm font-semibold text-gray-900 shadow-sm"
            >
              Register
            </Link>
          </div>

          <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-gray-100" />}>
            <RegisterForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>}>
      <RegisterContent />
    </Suspense>
  )
}
