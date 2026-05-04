import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Star } from 'lucide-react'

export default async function ProfessionalReviewsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviews_reviewer_id_fkey(full_name), request:support_requests(title)')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: false })

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">Feedback from clients after completed jobs.</p>
        </div>
        {avgRating && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-3 text-center">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{reviews!.length} review{reviews!.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm py-16 text-center">
          <Star className="mx-auto h-10 w-10 text-gray-200 mb-3" />
          <p className="text-base font-semibold text-gray-700">No reviews yet</p>
          <p className="mt-1 text-sm text-gray-400">Reviews will appear here after clients rate completed jobs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-bold text-sm flex-shrink-0">
                    {review.reviewer?.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.reviewer?.full_name ?? 'Client'}</p>
                    {review.request?.title && (
                      <p className="text-xs text-gray-400 mt-0.5">{review.request.title}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                ))}
                <span className="ml-1.5 text-sm font-semibold text-gray-700">{review.rating}/5</span>
              </div>

              {review.comment && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
