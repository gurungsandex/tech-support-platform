'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { SupportRequest } from '@/lib/types/database'

export async function createRequest(data: {
  title: string
  description: string
  category: 'Hardware' | 'Software' | 'Network' | 'Security' | 'Other'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  contact_email?: string
  contact_phone?: string
}) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const { data: request, error } = await supabase
    .from('support_requests')
    .insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      urgency: data.urgency,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      status: 'open'
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/user/requests')
  return { data: request }
}

export async function updateRequest(id: string, data: {
  title?: string
  description?: string
  category?: 'Hardware' | 'Software' | 'Network' | 'Security' | 'Other'
  urgency?: 'low' | 'medium' | 'high' | 'critical'
  contact_email?: string
  contact_phone?: string
}) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const { data: request, error } = await supabase
    .from('support_requests')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/user/requests')
  revalidatePath(`/user/requests/${id}`)
  return { data: request }
}

export async function deleteRequest(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('support_requests')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/user/requests')
  return { success: true }
}

export async function getRequests(filters?: {
  status?: string
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
      *,
      assigned_professional:it_professional_profiles(
        user_id,
        specialization,
        rating,
        profiles(full_name, email)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
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

export async function getRequestById(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const { data: request, error } = await supabase
    .from('support_requests')
    .select(`
      *,
      assigned_professional:it_professional_profiles(
        user_id,
        specialization,
        experience_years,
        rating,
        certifications,
        profiles(full_name, email)
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
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data: request }
}

export async function cancelRequest(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'User not authenticated' }
  }

  const { data: request, error } = await supabase
    .from('support_requests')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/user/requests')
  revalidatePath(`/user/requests/${id}`)
  return { data: request }
}
