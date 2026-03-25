import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getMyConversations } from '@/lib/conversations/actions'
import { MessageSquare, Clock, CheckCircle } from 'lucide-react'

export default async function TechnicianConversationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conversations } = await getMyConversations()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Conversations from customers who contacted you</p>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-700">No messages yet</p>
          <p className="mt-1 text-sm text-gray-500">Customers will contact you when they find your profile</p>
          <Link href="/professional/profile" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Complete Your Profile
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const customer = conv.user as { full_name: string; avatar_url?: string }
            const isCompleted = conv.status === 'completed'

            return (
              <Link key={conv.id} href={`/professional/conversations/${conv.id}`}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {customer?.avatar_url ? (
                    <Image src={customer.avatar_url} alt="" width={48} height={48} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span className="text-lg font-semibold text-gray-500">
                      {customer?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{customer?.full_name ?? 'Customer'}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </span>
                  </div>
                  {conv.last_message && (
                    <p className="text-sm text-gray-600 truncate mt-0.5">{(conv.last_message as { content: string }).content}</p>
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
