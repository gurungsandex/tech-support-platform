'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signUp } from '@/lib/auth/flows'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Alert from '@/components/ui/Alert'
import type { UserRole } from '@/lib/types/database'

const SPECIALIZATIONS = [
  'Hardware',
  'Software',
  'Network',
  'Security',
  'Cloud',
  'Database',
  'DevOps',
  'Mobile',
  'Web Development',
  'Other',
]

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams?.get('role') === 'professional' ? 'it_professional' : 'end_user'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: defaultRole as UserRole,
    specialization: [] as string[],
    yearsOfExperience: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      const metadata = formData.role === 'it_professional' ? {
        specialization: formData.specialization,
        years_of_experience: formData.yearsOfExperience,
      } : undefined

      const result = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role,
        metadata
      )

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpecializationChange = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" title="Registration Failed">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title="Registration Successful">
          Account created successfully! Redirecting to login...
        </Alert>
      )}

      <Select
        label="I want to"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
        options={[
          { value: 'end_user', label: 'Get Technical Support' },
          { value: 'it_professional', label: 'Provide Technical Support' },
        ]}
        required
      />

      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="John Doe"
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="you@example.com"
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="••••••••"
        helperText="Must be at least 8 characters"
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        placeholder="••••••••"
        required
      />

      {formData.role === 'it_professional' && (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-secondary-700">
              Specializations <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <label key={spec} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.specialization.includes(spec)}
                    onChange={() => handleSpecializationChange(spec)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                  />
                  <span className="text-sm text-secondary-700">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Years of Experience"
            type="number"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
            min="0"
            required
          />
        </>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  )
}
