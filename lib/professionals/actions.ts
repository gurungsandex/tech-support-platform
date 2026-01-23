'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ITProfessionalProfile } from '@/lib/types/database'

export async function getOpenRequests(filters?: {
  category?: string
  urgency?: string
}) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  let query = supabase
    .from('support_requests')
    .select(`
      id,
      title,
      description,
      category,
      urgency,
      status,
      created_at,
      requester:profiles!support_requests_requester_id_fkey(
        id,
        full_name
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.urgency) {
    query = query.eq('urgency', filters.urgency)
  }

  const { data: requests, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { data: requests }
}

export async function getMyRequests(filters?: {
  status?: string
}) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  let query = supabase
    .from('support_requests')
    .select(`
      *,
      requester:profiles!support_requests_requester_id_fkey(
        id,
        full_name,
        email
      )
    `)
    .eq('professional_id', user.id)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data: requests, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { data: requests }
}

export async function acceptRequest(requestId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  // Check if professional is verified
  const { data: professional, error: profError } = await supabase
    .from('it_professional_profiles')
    .select('verification_status')
    .eq('user_id', user.id)
    .single()

  if (profError || !professional) {
    return { error: 'Professional profile not found' }
  }

  if (professional.verification_status !== 'approved') {
    return { error: 'Only verified professionals can accept requests' }
  }

  // Accept the request
  const { data: request, error } = await supabase
    .from('support_requests')
    .update({
      professional_id: user.id,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .eq('status', 'open')
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/professional/dashboard')
  revalidatePath('/professional/my-requests')
  return { data: request }
}

export async function updateRequestStatus(requestId: string, status: 'in_progress' | 'completed') {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  }

  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
  }

  const { data: request, error } = await supabase
    .from('support_requests')
    .update(updateData)
    .eq('id', requestId)
    .eq('professional_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Note: completed_requests count should be incremented by a database trigger
  // If trigger doesn't exist, you may need to manually increment here

  revalidatePath('/professional/my-requests')
  revalidatePath(`/professional/requests/${requestId}`)
  return { data: request }
}

export async function getRequestById(requestId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const { data: request, error } = await supabase
    .from('support_requests')
    .select(`
      *,
      requester:profiles!support_requests_requester_id_fkey(
        id,
        full_name,
        email
      ),
      messages(
        id,
        content,
        sender_id,
        is_read,
        created_at,
        sender:profiles(full_name, role)
      )
    `)
    .eq('id', requestId)
    .eq('professional_id', user.id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data: request }
}

export async function getProfessionalProfile(userId?: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const targetUserId = userId || user.id

  const { data: profile, error } = await supabase
    .from('it_professional_profiles')
    .select(`
      *,
      profile:profiles!it_professional_profiles_user_id_fkey(
        id,
        email,
        full_name
      )
    `)
    .eq('user_id', targetUserId)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data: profile }
}

export async function updateProfessionalProfile(data: {
  specialization?: string[]
  bio?: string
  years_of_experience?: number
  certifications?: string[]
  verification_documents_url?: string
}) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const { data: profile, error } = await supabase
    .from('it_professional_profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/professional/profile')
  return { data: profile }
}

export async function getProfessionalStats() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  // Get professional profile with stats
  const { data: profile, error: profileError } = await supabase
    .from('it_professional_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    return { error: profileError.message }
  }

  // Get total active requests
  const { count: activeCount } = await supabase
    .from('support_requests')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', user.id)
    .in('status', ['accepted', 'in_progress'])

  return {
    data: {
      verification_status: profile.verification_status,
      completed_requests: profile.completed_requests,
      average_rating: profile.average_rating,
      total_reviews: profile.total_reviews,
      active_requests: activeCount || 0
    }
  }
}
