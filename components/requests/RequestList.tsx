'use client'

import { useState, useMemo } from 'react'
import { RequestCard } from './RequestCard'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import { Inbox } from 'lucide-react'
import type { SupportRequest } from '@/lib/types/database'

interface RequestListProps {
  requests: SupportRequest[]
}

export function RequestList({ requests }: RequestListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = [...requests]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(req => req.category === categoryFilter)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'urgency':
          const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 }
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
        default:
          return 0
      }
    })

    return filtered
  }, [requests, statusFilter, categoryFilter, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select
            id="status-filter"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
          />
        </div>

        <div className="flex-1">
          <Select
            id="category-filter"
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Hardware', label: 'Hardware' },
              { value: 'Software', label: 'Software' },
              { value: 'Network', label: 'Network' },
              { value: 'Security', label: 'Security' },
              { value: 'Other', label: 'Other' }
            ]}
          />
        </div>

        <div className="flex-1">
          <Select
            id="sort-by"
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'urgency', label: 'Urgency' }
            ]}
          />
        </div>
      </div>

      {filteredAndSortedRequests.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-16 h-16" />}
          title="No requests found"
          description={
            statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters to see more requests.'
              : 'Get started by creating your first support request.'
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredAndSortedRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {filteredAndSortedRequests.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          Showing {filteredAndSortedRequests.length} of {requests.length} request(s)
        </p>
      )}
    </div>
  )
}
