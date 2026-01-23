import { Suspense } from 'react'
import { MyRequestsContent } from './MyRequestsContent'
import Spinner from '@/components/ui/Spinner'

export default async function MyRequestsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage requests you&apos;ve accepted
        </p>
      </div>

      <Suspense fallback={<Spinner />}>
        <MyRequestsContent />
      </Suspense>
    </div>
  )
}
