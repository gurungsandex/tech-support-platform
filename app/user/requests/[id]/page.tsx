import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Alert from '@/components/ui/Alert'
import { ArrowLeft, Calendar, Tag, AlertCircle, User } from 'lucide-react'
import { ChatBox } from '@/components/chat/ChatBox'
import { CancelRequestButton } from '@/components/requests/CancelRequestButton'

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

export default async function RequestDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const { data: request, error } = await supabase
    .from('support_requests')
    .select(`
      *,
      assigned_professional:it_professional_profiles(
        user_id,
        specialization,
        experience_years,
        rating,
        certifications,
        profiles(full_name, email)
      ),
      messages(
        id,
        content,
        sender_id,
        is_read,
        created_at,
        sender:profiles(full_name, role)
      )
    `)
    .eq('id', params.id)
    .eq('requester_id', user.id)
    .single()

  if (error || !request) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canCancel = request.status === 'open' || request.status === 'accepted'
  const showChat = request.status !== 'open' && request.status !== 'cancelled'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/user/requests" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Requests
        </Link>
      </div>

      <div className="space-y-6">
        {/* Request Header */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {request.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant={statusColors[request.status]}>
                  {request.status.replace('_', ' ')}
                </Badge>
                <Badge variant={urgencyColors[request.urgency]}>
                  {request.urgency} urgency
                </Badge>
              </div>
            </div>
            {canCancel && <CancelRequestButton requestId={request.id} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium">{formatDate(request.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{request.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium">{formatDate(request.updated_at)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
        </Card>

        {/* Contact Information */}
        {(request.contact_email || request.contact_phone) && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h2>
            <div className="space-y-2 text-sm">
              {request.contact_email && (
                <div>
                  <span className="text-gray-500">Email:</span>{' '}
                  <a href={`mailto:${request.contact_email}`} className="text-blue-600 hover:underline">
                    {request.contact_email}
                  </a>
                </div>
              )}
              {request.contact_phone && (
                <div>
                  <span className="text-gray-500">Phone:</span>{' '}
                  <a href={`tel:${request.contact_phone}`} className="text-blue-600 hover:underline">
                    {request.contact_phone}
                  </a>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Assigned Professional */}
        {request.assigned_professional && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Assigned Professional
            </h2>
            <div className="flex items-start gap-4">
              <Avatar 
                name={request.assigned_professional.profiles?.full_name || 'Professional'}
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {request.assigned_professional.profiles?.full_name || 'Professional'}
                </h3>
                <p className="text-sm text-gray-600">
                  {request.assigned_professional.specialization}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {request.assigned_professional.experience_years} years of experience
                </p>
                {request.assigned_professional.rating && (
                  <p className="text-sm text-gray-500">
                    ⭐ {request.assigned_professional.rating.toFixed(1)} rating
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Status Message */}
        {request.status === 'open' && (
          <Alert>
            Your request is waiting to be accepted by an IT professional. You&apos;ll be notified when someone picks it up.
          </Alert>
        )}

        {request.status === 'cancelled' && (
          <Alert variant="warning">
            This request has been cancelled.
          </Alert>
        )}

        {/* Chat Section */}
        {showChat && (
          <Card>
            <ChatBox
              requestId={request.id}
              messages={request.messages || []}
              currentUserId={user.id}
              otherUserId={request.professional_id || undefined}
              otherUserName={request.assigned_professional?.profiles?.full_name || undefined}
              showHeader={true}
              isReadOnly={request.status === 'completed'}
            />
          </Card>
        )}
      </div>
    </div>
  )
}
