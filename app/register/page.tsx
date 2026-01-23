import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'
import { Suspense } from 'react'

function RegisterContent() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-secondary-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-2xl font-bold text-white">TS</span>
          </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-secondary-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
