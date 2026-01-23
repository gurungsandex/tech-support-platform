'use client'

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import { getOpenRequests, acceptRequest } from '@/lib/professionals/actions'
import { Clock, Tag, AlertCircle, User } from 'lucide-react'
import type { SupportRequest } from '@/lib/types/database'

const urgencyColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'default',
  high: 'warning',
  critical: 'danger'
}

interface RequestWithRequester {
  id: string
  title: string
  description: string
  category: string
  urgency: string
  status: string
  created_at: string
  requester?: {
    id: string
    full_name: string
  }[] | null
}

export function BrowseRequestsContent() {
  const [requests, setRequests] = useState<RequestWithRequester[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('')
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

  const loadRequests = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const filters: any = {}
    if (categoryFilter) filters.category = categoryFilter
    if (urgencyFilter) filters.urgency = urgencyFilter

    const result = await getOpenRequests(filters)

    if (result.error) {
      setError(result.error)
    } else {
      setRequests(result.data || [])
    }
    setIsLoading(false)
  }, [categoryFilter, urgencyFilter])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  const handleAccept = async (requestId: string) => {
    setAcceptingId(requestId)
    const result = await acceptRequest(requestId)

    if (result.error) {
      setError(result.error)
    } else {
      // Remove the accepted request from the list
      setRequests(requests.filter(r => r.id !== requestId))
    }
    setAcceptingId(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Category"
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: '', label: 'All Categories' },
                { value: 'Hardware', label: 'Hardware' },
                { value: 'Software', label: 'Software' },
                { value: 'Network', label: 'Network' },
                { value: 'Security', label: 'Security' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>

          <div>
            <Select
              label="Urgency"
              id="urgency"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              options={[
                { value: '', label: 'All Urgency Levels' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No open requests"
          description="There are currently no open support requests matching your filters."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.title}
                      </h3>
                    </div>
                    <Badge variant={urgencyColors[request.urgency]}>
                      {request.urgency}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {request.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>{request.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(request.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="text-gray-400">
                        {request.requester && request.requester.length > 0 && request.requester[0].full_name ? 
                          (() => {
                            const nameParts = request.requester[0].full_name.split(' ')
                            return `${nameParts[0]} ${nameParts.slice(1).map(() => '*').join('')}`
                          })() : 
                          'Anonymous'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <Button
                    onClick={() => handleAccept(request.id)}
                    isLoading={acceptingId === request.id}
                    disabled={acceptingId !== null}
                    className="flex-1 sm:flex-initial"
                  >
                    Accept Request
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
