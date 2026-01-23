import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { RequestList } from '@/components/requests/RequestList'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { PlusCircle, Inbox } from 'lucide-react'

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const { data: requests, error } = await supabase
    .from('support_requests')
    .select('*')
    .eq('requester_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching requests:', error)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Requests</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and track all your support requests
            </p>
          </div>
          <Link href="/user/requests/new">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      {!requests || requests.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-16 h-16" />}
          title="No support requests yet"
          description="Create your first support request to get help from IT professionals."
          action={
            <Link href="/user/requests/new">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Request
              </Button>
            </Link>
          }
        />
      ) : (
        <RequestList requests={requests} />
      )}
    </div>
  )
}
