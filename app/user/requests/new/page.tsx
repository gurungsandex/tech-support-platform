import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RequestForm } from '@/components/requests/RequestForm'
import Card from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewRequestPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/user/requests" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Requests
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Support Request</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill out the form below to submit a new support request. Our IT professionals will be notified and can start helping you.
        </p>
      </div>

      <Card>
        <RequestForm mode="create" />
      </Card>
    </div>
  )
}
