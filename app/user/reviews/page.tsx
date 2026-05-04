import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Star, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function UserReviewsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, professional:profiles!reviews_professional_id_fkey(full_name), request:support_requests(title)')
    .eq('reviewer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews Given</h1>
        <p className="mt-1 text-sm text-gray-500">Reviews you&apos;ve submitted for completed jobs.</p>
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm py-16 text-center">
          <Star className="mx-auto h-10 w-10 text-gray-200 mb-3" />
          <p className="text-base font-semibold text-gray-700">No reviews yet</p>
          <p className="mt-1 text-sm text-gray-400">Reviews appear here after you complete a job and rate the technician.</p>
          <Link href="/find-technicians" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Find a Technician
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">
                    {review.professional?.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.professional?.full_name ?? 'Technician'}</p>
                    {review.request?.title && (
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {review.request.title}
                      </p>
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
