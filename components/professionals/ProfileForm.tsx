'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { updateProfessionalProfile } from '@/lib/professionals/actions'
import Alert from '@/components/ui/Alert'
import type { ITProfessionalProfile } from '@/lib/types/database'

interface ProfileFormProps {
  profile: ITProfessionalProfile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
    years_of_experience: profile.years_of_experience || 0,
    specialization: profile.specialization?.join(', ') || '',
    certifications: profile.certifications?.join(', ') || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Validate years of experience
    const yearsOfExperience = Number(formData.years_of_experience)
    if (isNaN(yearsOfExperience) || yearsOfExperience < 0) {
      setError('Please enter a valid number for years of experience')
      setIsLoading(false)
      return
    }

    const result = await updateProfessionalProfile({
      bio: formData.bio,
      years_of_experience: yearsOfExperience,
      specialization: formData.specialization
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      certifications: formData.certifications
        .split(',')
        .map(c => c.trim())
        .filter(Boolean),
    })

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">Profile updated successfully!</Alert>}

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself and your expertise..."
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="years_of_experience" className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience
        </label>
        <Input
          id="years_of_experience"
          type="number"
          min="0"
          value={formData.years_of_experience}
          onChange={(e) => setFormData({ ...formData, years_of_experience: Number(e.target.value) })}
        />
      </div>

      <div>
        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
          Specializations (comma-separated)
        </label>
        <Input
          id="specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder="Network Security, Cloud Computing, Database Management"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter your areas of expertise separated by commas
        </p>
      </div>

      <div>
        <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-2">
          Certifications (comma-separated)
        </label>
        <Textarea
          id="certifications"
          value={formData.certifications}
          onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
          placeholder="CompTIA A+, CISSP, AWS Certified Solutions Architect"
          rows={3}
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter your certifications separated by commas
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
