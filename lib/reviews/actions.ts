'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitReview(requestId: string, rating: number, comment: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: request } = await supabase.from('support_requests').select('professional_id, status').eq('id', requestId).single()
  if (!request || request.status !== 'completed') throw new Error('Can only review completed requests')
  const { data, error } = await supabase.from('reviews').insert({ request_id: requestId, professional_id: request.professional_id!, reviewer_id: user.id, rating, comment }).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function getReviewsForProfessional(professionalId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('reviews').select('*, reviewer:profiles!reviews_reviewer_id_fkey(full_name)').eq('professional_id', professionalId).order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}
