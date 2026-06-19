'use server'

import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return null
  return { supabase, user }
}

export async function approveProfessional(id: string) {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'Forbidden' }
  const { supabase, user } = ctx
  await supabase.from('it_professional_profiles').update({ verification_status: 'approved', approved_at: new Date().toISOString(), approved_by: user.id }).eq('id', id)
}

export async function rejectProfessional(id: string) {
  const ctx = await requireAdmin()
  if (!ctx) return { error: 'Forbidden' }
  await ctx.supabase.from('it_professional_profiles').update({ verification_status: 'rejected' }).eq('id', id)
}

export async function getPlatformStats() {
  const ctx = await requireAdmin()
  if (!ctx) return { totalUsers: 0, totalProfessionals: 0, totalRequests: 0, averageRating: '0' }
  const { supabase } = ctx
  const [users, pros, reqs] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('it_professional_profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'approved'),
    supabase.from('support_requests').select('id', { count: 'exact', head: true }),
  ])
  return { totalUsers: users.count || 0, totalProfessionals: pros.count || 0, totalRequests: reqs.count || 0, averageRating: '4.5' }
}

export async function getPendingProfessionals() {
  const ctx = await requireAdmin()
  if (!ctx) return []
  const { data } = await ctx.supabase.from('it_professional_profiles').select('*, profile:profiles!it_professional_profiles_user_id_fkey(*)').eq('verification_status', 'pending')
  return data || []
}

export async function getAllReports() {
  const ctx = await requireAdmin()
  if (!ctx) return []
  const { data } = await ctx.supabase.from('reports').select('*, reporter:profiles!reports_reporter_id_fkey(full_name, email), reported_user:profiles!reports_reported_user_id_fkey(full_name, email)')
  return data || []
}

export async function getAllUsers() {
  const ctx = await requireAdmin()
  if (!ctx) return []
  const { data } = await ctx.supabase.from('profiles').select('*').order('created_at', { ascending: false })
  return data || []
}
