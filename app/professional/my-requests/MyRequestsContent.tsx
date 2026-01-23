'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import { getMyRequests } from '@/lib/professionals/actions'
import { Clock, Tag, AlertCircle, User } from 'lucide-react'
import type { SupportRequest } from '@/lib/types/database'

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  accepted: 'warning',
  in_progress: 'warning',
  completed: 'success'
}

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
    email: string
  }[] | null
}

export function MyRequestsContent() {
  const [requests, setRequests] = useState<RequestWithRequester[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')

  const loadRequests = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const filters: any = {}
    if (statusFilter) filters.status = statusFilter

    const result = await getMyRequests(filters)

    if (result.error) {
      setError(result.error)
    } else {
      setRequests(result.data || [])
    }
    setIsLoading(false)
  }, [statusFilter])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

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

      {/* Filter */}
      <Card>
        <div className="max-w-xs">
          <Select
            label="Status"
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </div>
      </Card>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No requests found"
          description="You haven't accepted any requests yet. Browse open requests to get started."
          action={
            <Link href="/professional/dashboard">
              <Button>Browse Requests</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/professional/requests/${request.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 block"
                      >
                        {request.title}
                      </Link>
                    </div>
                    <Badge variant={statusColors[request.status]}>
                      {request.status.replace('_', ' ')}
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
                      <AlertCircle className="w-4 h-4" />
                      <Badge variant={urgencyColors[request.urgency]}>
                        {request.urgency}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(request.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{request.requester && request.requester.length > 0 ? request.requester[0].full_name : 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <Link href={`/professional/requests/${request.id}`} className="flex-1 sm:flex-initial">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
