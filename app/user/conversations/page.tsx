import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getMyConversations } from '@/lib/conversations/actions'
import { MessageSquare, Clock, CheckCircle } from 'lucide-react'

export default async function UserConversationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conversations } = await getMyConversations()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Your conversations with IT technicians</p>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-700">No conversations yet</p>
          <p className="mt-1 text-sm text-gray-500">Find a technician and send them a message</p>
          <Link href="/find-technicians" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Find Technicians
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const tech = conv.technician as { full_name: string; it_professional_profiles?: Array<{ profile_photo_url?: string; availability_status?: string; tagline?: string }> }
            const techProfile = tech?.it_professional_profiles?.[0]
            const isOnline = techProfile?.availability_status === 'online'
            const isCompleted = conv.status === 'completed'

            return (
              <Link key={conv.id} href={`/user/conversations/${conv.id}`}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {techProfile?.profile_photo_url ? (
                      <Image src={techProfile.profile_photo_url} alt={`${tech?.full_name ?? 'Technician'}'s avatar`} width={48} height={48} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold text-gray-500">
                        {tech?.full_name?.[0]?.toUpperCase() ?? '?'}
                      </span>
                    )}
                  </div>
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{tech?.full_name ?? 'Technician'}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </span>
                  </div>
                  {techProfile?.tagline && (
                    <p className="text-xs text-gray-500 truncate">{techProfile.tagline}</p>
                  )}
                  {conv.last_message && (
                    <p className="text-sm text-gray-600 truncate mt-1">{(conv.last_message as { content: string }).content}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 rounded-full px-2 py-0.5">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">
                        <Clock className="h-3 w-3" /> Active
                      </span>
                    )}
                    {(conv.unread_count ?? 0) > 0 && (
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                        {conv.unread_count} new
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
