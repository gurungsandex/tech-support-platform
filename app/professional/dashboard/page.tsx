import { Suspense } from 'react'
import { getOpenRequests } from '@/lib/professionals/actions'
import { BrowseRequestsContent } from './BrowseRequestsContent'
import Spinner from '@/components/ui/Spinner'

export default async function ProfessionalDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Support Requests</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and accept open support requests from users
        </p>
      </div>

      <Suspense fallback={<Spinner />}>
        <BrowseRequestsContent />
      </Suspense>
    </div>
  )
}
