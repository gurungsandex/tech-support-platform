import { createClient } from '@/lib/supabase/server'
import { Star, Flag } from 'lucide-react'
import Link from 'next/link'

export default async function AdminReviewsPage() {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviews_reviewer_id_fkey(full_name, email), professional:profiles!reviews_professional_id_fkey(full_name, email)')
    .order('created_at', { ascending: false })

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">All platform reviews across completed jobs.</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{reviews?.length ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Platform Avg Rating</p>
          <div className="mt-1 flex items-center gap-1.5">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">5-Star Reviews</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {reviews?.filter((r: any) => r.rating === 5).length ?? 0}
          </p>
        </div>
      </div>

      {/* Reviews table */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">All Reviews</h2>
        </div>
        {!reviews || reviews.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No reviews yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_80px_1fr_100px] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <span>Reviewer</span>
              <span>Technician</span>
              <span>Rating</span>
              <span>Comment</span>
              <span>Date</span>
            </div>
            {reviews.map((review: any) => (
              <div key={review.id} className="grid grid-cols-[1fr_1fr_80px_1fr_100px] gap-4 items-start px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{review.reviewer?.full_name ?? '—'}</p>
                  <p className="text-xs text-gray-400 truncate">{review.reviewer?.email ?? ''}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{review.professional?.full_name ?? '—'}</p>
                  <p className="text-xs text-gray-400 truncate">{review.professional?.email ?? ''}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{review.comment || <span className="text-gray-300 italic">No comment</span>}</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
