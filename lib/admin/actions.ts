'use server'

import { createClient } from '@/lib/supabase/server'

export async function approveProfessional(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('it_professional_profiles').update({ verification_status: 'approved', approved_at: new Date().toISOString(), approved_by: user?.id }).eq('id', id)
}

export async function rejectProfessional(id: string) {
  const supabase = await createClient()
  await supabase.from('it_professional_profiles').update({ verification_status: 'rejected' }).eq('id', id)
}

export async function getPlatformStats() {
  const supabase = await createClient()
  const [users, pros, reqs] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('it_professional_profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'approved'),
    supabase.from('support_requests').select('id', { count: 'exact', head: true }),
  ])
  return { totalUsers: users.count || 0, totalProfessionals: pros.count || 0, totalRequests: reqs.count || 0, averageRating: '4.5' }
}

export async function getPendingProfessionals() {
  const supabase = await createClient()
  const { data } = await supabase.from('it_professional_profiles').select('*, profile:profiles!it_professional_profiles_user_id_fkey(*)').eq('verification_status', 'pending')
  return data || []
}

export async function getAllReports() {
  const supabase = await createClient()
  const { data } = await supabase.from('reports').select('*, reporter:profiles!reports_reporter_id_fkey(full_name, email), reported_user:profiles!reports_reported_user_id_fkey(full_name, email)')
  return data || []
}

export async function getAllUsers() {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  return data || []
}
