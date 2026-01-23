'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Clock, Tag, AlertCircle } from 'lucide-react'
import type { SupportRequest } from '@/lib/types/database'

interface RequestCardProps {
  request: SupportRequest
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  open: 'default',
  accepted: 'warning',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'danger'
}

const urgencyColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'default',
  high: 'warning',
  critical: 'danger'
}

export function RequestCard({ request }: RequestCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <Link 
                href={`/user/requests/${request.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 block truncate"
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
              <Badge variant={urgencyColors[request.urgency]} >
                {request.urgency}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(request.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2">
          <Link href={`/user/requests/${request.id}`} className="flex-1 sm:flex-initial">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
