'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Alert from '@/components/ui/Alert'
import { createRequest, updateRequest } from '@/lib/requests/actions'
import type { SupportRequest } from '@/lib/types/database'

interface RequestFormProps {
  request?: SupportRequest
  mode?: 'create' | 'edit'
}

export function RequestForm({ request, mode = 'create' }: RequestFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    description: string
    category: 'Hardware' | 'Software' | 'Network' | 'Security' | 'Other'
    urgency: 'low' | 'medium' | 'high' | 'critical'
    contact_email: string
    contact_phone: string
  }>({
    title: request?.title || '',
    description: request?.description || '',
    category: (request?.category as 'Hardware' | 'Software' | 'Network' | 'Security' | 'Other') || 'Software',
    urgency: (request?.urgency as 'low' | 'medium' | 'high' | 'critical') || 'medium',
    contact_email: request?.contact_email || '',
    contact_phone: request?.contact_phone || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = mode === 'create' 
        ? await createRequest(formData)
        : await updateRequest(request!.id, formData)

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/user/requests')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief description of your issue"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <Textarea
          id="description"
          name="description"
          required
          rows={6}
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide detailed information about your issue..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Select
            id="category"
            name="category"
            label="Category"
            required
            value={formData.category}
            onChange={handleChange}
            options={[
              { value: 'Hardware', label: 'Hardware' },
              { value: 'Software', label: 'Software' },
              { value: 'Network', label: 'Network' },
              { value: 'Security', label: 'Security' },
              { value: 'Other', label: 'Other' }
            ]}
          />
        </div>

        <div>
          <Select
            id="urgency"
            name="urgency"
            label="Urgency"
            required
            value={formData.urgency}
            onChange={handleChange}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <Input
            id="contact_phone"
            name="contact_phone"
            type="tel"
            value={formData.contact_phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : mode === 'create' ? 'Create Request' : 'Update Request'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
