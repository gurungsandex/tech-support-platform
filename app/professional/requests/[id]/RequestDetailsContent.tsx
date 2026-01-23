'use client'

import { useState } from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { ChatBox } from '@/components/chat/ChatBox'
import { updateRequestStatus } from '@/lib/professionals/actions'
import { Clock, Tag, User, Mail, Phone } from 'lucide-react'
import type { SupportRequest } from '@/lib/types/database'
import type { MessageWithSender } from '@/lib/types/database'

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

interface RequestWithDetails extends SupportRequest {
  requester?: {
    id: string
    full_name: string
    email: string
  }[] | null
  messages?: MessageWithSender[]
}

interface RequestDetailsContentProps {
  request: RequestWithDetails
  currentUserId: string
}

export function RequestDetailsContent({ request, currentUserId }: RequestDetailsContentProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState(request.status)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusUpdate = async (newStatus: 'in_progress' | 'completed') => {
    setIsUpdating(true)
    setError(null)

    const result = await updateRequestStatus(request.id, newStatus)

    if (result.error) {
      setError(result.error)
    } else {
      setCurrentStatus(newStatus)
      // Note: completed_requests count is incremented by database trigger
    }
    setIsUpdating(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      {/* Request Header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{request.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusColors[currentStatus]}>
                {currentStatus.replace('_', ' ')}
              </Badge>
              <Badge variant={urgencyColors[request.urgency]}>
                {request.urgency} priority
              </Badge>
              <Badge variant="default">{request.category}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Created {formatDate(request.created_at)}</span>
          </div>
        </div>
      </Card>

      {/* Requester Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Requester Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">{request.requester && request.requester.length > 0 ? request.requester[0].full_name : 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <a
                href={`mailto:${request.contact_email || (request.requester && request.requester.length > 0 ? request.requester[0].email : '')}`}
                className="text-blue-600 hover:underline"
              >
                {request.contact_email || (request.requester && request.requester.length > 0 ? request.requester[0].email : '')}
              </a>
            </div>
            {request.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a
                  href={`tel:${request.contact_phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {request.contact_phone}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Actions */}
      {currentStatus !== 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentStatus === 'accepted' && (
                <Button
                  onClick={() => handleStatusUpdate('in_progress')}
                  isLoading={isUpdating}
                >
                  Mark as In Progress
                </Button>
              )}
              {(currentStatus === 'accepted' || currentStatus === 'in_progress') && (
                <Button
                  onClick={() => handleStatusUpdate('completed')}
                  isLoading={isUpdating}
                  variant="secondary"
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ChatBox
            requestId={request.id}
            messages={request.messages || []}
            currentUserId={currentUserId}
            otherUserId={request.requester_id}
            otherUserName={request.requester && request.requester.length > 0 ? request.requester[0].full_name : 'User'}
            showHeader={false}
            isReadOnly={currentStatus === 'completed'}
          />
        </CardContent>
      </Card>
    </div>
  )
}
