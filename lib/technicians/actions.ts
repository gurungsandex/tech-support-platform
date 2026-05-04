'use server'

import { createClient } from '@/lib/supabase/server'
import type {
  ITProfessionalProfile,
  TechnicianService,
  TechnicianCertification,
  TechnicianPortfolioItem,
  TechnicianSearchResult,
  TechnicianPublicProfile,
} from '@/lib/types/database'

export interface SearchParams {
  lat?: number
  lng?: number
  radiusMiles?: number
  service?: string
  supportType?: 'remote' | 'onsite' | 'both'
  minRating?: number
  city?: string
  state?: string
  zipCode?: string
}

// Geocode a ZIP code or city using Nominatim (free OpenStreetMap service)
export async function geocodeLocation(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const encoded = encodeURIComponent(query)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      {
        headers: { 'User-Agent': 'TechSupportPlatform/1.0' },
        next: { revalidate: 3600 },
      }
    )
    const data = await res.json()
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
    return null
  } catch {
    return null
  }
}

// Search technicians with location and filters
export async function searchTechnicians(params: SearchParams): Promise<{
  data: TechnicianSearchResult[]
  error?: string
}> {
  const supabase = await createClient()

  try {
    let lat = params.lat
    let lng = params.lng

    // Geocode ZIP or city if no coordinates provided
    if (!lat && !lng && (params.zipCode || params.city)) {
      const query = params.zipCode || `${params.city}, ${params.state || ''}`
      const coords = await geocodeLocation(query)
      if (coords) {
        lat = coords.lat
        lng = coords.lng
      }
    }

    const { data, error } = await supabase.rpc('search_technicians', {
      search_lat: lat ?? null,
      search_lng: lng ?? null,
      radius_miles: params.radiusMiles ?? 25,
      service_filter: params.service ?? null,
      support_type_filter: params.supportType ?? null,
      min_rating: params.minRating ?? null,
    })

    if (error) throw error

    return { data: data as TechnicianSearchResult[] }
  } catch (err) {
    console.error('searchTechnicians error:', err)
    return { data: [], error: 'Failed to search technicians' }
  }
}

// Get full public profile of a technician
export async function getTechnicianPublicProfile(userId: string): Promise<{
  data: TechnicianPublicProfile | null
  error?: string
}> {
  const supabase = await createClient()

  try {
    // Get base profile + professional info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id, full_name, email, avatar_url, phone_number,
        it_professional_profiles!inner(*)
      `)
      .eq('id', userId)
      .single()

    if (profileError || !profile) return { data: null, error: 'Technician not found' }

    const techProfile = (profile.it_professional_profiles as ITProfessionalProfile[])[0]
    if (techProfile.verification_status !== 'approved') {
      return { data: null, error: 'Profile not available' }
    }

    // Fetch services, certs, portfolio, reviews in parallel
    const [servicesRes, certsRes, portfolioRes, reviewsRes] = await Promise.all([
      supabase
        .from('technician_services')
        .select('*')
        .eq('technician_id', userId)
        .order('created_at'),
      supabase
        .from('technician_certifications')
        .select('*')
        .eq('technician_id', userId)
        .order('issued_date', { ascending: false }),
      supabase
        .from('technician_portfolio')
        .select('*')
        .eq('technician_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('reviews')
        .select(`*, reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)`)
        .eq('professional_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
    ])

    // Determine contact visibility based on current user's registration status
    const { data: { user } } = await supabase.auth.getUser()
    const isRegistered = !!user

    let phone: string | null = techProfile.phone_number
    let email: string | null = profile.email

    if (techProfile.phone_visibility === 'hidden' || (!isRegistered && techProfile.phone_visibility === 'registered')) {
      phone = null
    }
    if (techProfile.email_visibility === 'hidden' || (!isRegistered && techProfile.email_visibility === 'registered')) {
      email = null
    }

    const result: TechnicianPublicProfile = {
      user_id: profile.id,
      full_name: profile.full_name,
      email,
      avatar_url: profile.avatar_url,
      tagline: techProfile.tagline,
      bio: techProfile.bio,
      city: techProfile.city,
      state: techProfile.state,
      zip_code: techProfile.zip_code,
      latitude: techProfile.latitude,
      longitude: techProfile.longitude,
      service_radius_miles: techProfile.service_radius_miles,
      support_type: techProfile.support_type,
      availability_status: techProfile.availability_status,
      phone_visibility: techProfile.phone_visibility,
      email_visibility: techProfile.email_visibility,
      phone_number: phone,
      average_rating: techProfile.average_rating,
      total_reviews: techProfile.total_reviews,
      completed_requests: techProfile.completed_requests,
      years_of_experience: techProfile.years_of_experience,
      verification_status: techProfile.verification_status,
      profile_photo_url: techProfile.profile_photo_url,
      distance_miles: null,
      services: (servicesRes.data as TechnicianService[]) ?? [],
      certifications: (certsRes.data as TechnicianCertification[]) ?? [],
      portfolio: (portfolioRes.data as TechnicianPortfolioItem[]) ?? [],
      reviews: reviewsRes.data ?? [],
    }

    return { data: result }
  } catch (err) {
    console.error('getTechnicianPublicProfile error:', err)
    return { data: null, error: 'Failed to load profile' }
  }
}

// Get the current technician's own profile (for editing)
export async function getMyTechnicianProfile(): Promise<{
  data: (ITProfessionalProfile & {
    services: TechnicianService[]
    certifications: TechnicianCertification[]
    portfolio: TechnicianPortfolioItem[]
  }) | null
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('it_professional_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return { data: null, error: 'Profile not found' }

  const [servicesRes, certsRes, portfolioRes] = await Promise.all([
    supabase.from('technician_services').select('*').eq('technician_id', user.id).order('created_at'),
    supabase.from('technician_certifications').select('*').eq('technician_id', user.id).order('created_at'),
    supabase.from('technician_portfolio').select('*').eq('technician_id', user.id).order('created_at', { ascending: false }),
  ])

  return {
    data: {
      ...(data as ITProfessionalProfile),
      services: (servicesRes.data as TechnicianService[]) ?? [],
      certifications: (certsRes.data ?? []) as unknown as TechnicianCertification[],
      portfolio: (portfolioRes.data as TechnicianPortfolioItem[]) ?? [],
    } as ITProfessionalProfile & {
      services: TechnicianService[]
      certifications: TechnicianCertification[]
      portfolio: TechnicianPortfolioItem[]
    },
  }
}

// Update core professional profile
export async function updateTechnicianProfile(updates: Partial<ITProfessionalProfile>): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Geocode location if city/zip provided
  let lat = updates.latitude
  let lng = updates.longitude
  if ((updates.zip_code || updates.city) && (!lat || !lng)) {
    const query = updates.zip_code || `${updates.city}, ${updates.state || ''}`
    const coords = await geocodeLocation(query)
    if (coords) {
      lat = coords.lat
      lng = coords.lng
    }
  }

  const { error } = await supabase
    .from('it_professional_profiles')
    .update({ ...updates, latitude: lat, longitude: lng })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

// Update availability status
export async function updateAvailabilityStatus(status: 'online' | 'offline'): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('it_professional_profiles')
    .update({ availability_status: status })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

// Toggle profile pause
export async function toggleProfilePause(isPaused: boolean): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('it_professional_profiles')
    .update({ is_paused: isPaused })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

// ---- SERVICES ----
export async function saveServices(services: Array<{
  id?: string
  service_name: string
  is_custom: boolean
  price_min?: number | null
  price_max?: number | null
}>): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Delete all existing, then re-insert
  await supabase.from('technician_services').delete().eq('technician_id', user.id)

  if (services.length === 0) return { success: true }

  const rows = services.map(s => ({
    technician_id: user.id,
    service_name: s.service_name,
    is_custom: s.is_custom,
    price_min: s.price_min ?? null,
    price_max: s.price_max ?? null,
  }))

  const { error } = await supabase.from('technician_services').insert(rows)
  if (error) return { error: error.message }
  return { success: true }
}

// ---- CERTIFICATIONS ----
export async function saveCertifications(certs: Array<{
  id?: string
  name: string
  issuer?: string | null
  issued_date?: string | null
  expiry_date?: string | null
  verification_url?: string | null
}>): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  await supabase.from('technician_certifications').delete().eq('technician_id', user.id)

  if (certs.length === 0) return { success: true }

  const rows = certs.map(c => ({
    technician_id: user.id,
    name: c.name,
    issuer: c.issuer ?? null,
    issued_date: c.issued_date ?? null,
    expiry_date: c.expiry_date ?? null,
    verification_url: c.verification_url ?? null,
  }))

  const { error } = await supabase.from('technician_certifications').insert(rows)
  if (error) return { error: error.message }
  return { success: true }
}

// ---- PORTFOLIO ----
export async function savePortfolioItem(item: {
  id?: string
  title: string
  description?: string | null
  image_url?: string | null
  project_url?: string | null
}): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  if (item.id) {
    const { error } = await supabase
      .from('technician_portfolio')
      .update({ title: item.title, description: item.description, image_url: item.image_url, project_url: item.project_url })
      .eq('id', item.id)
      .eq('technician_id', user.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('technician_portfolio').insert({
      technician_id: user.id,
      title: item.title,
      description: item.description ?? null,
      image_url: item.image_url ?? null,
      project_url: item.project_url ?? null,
    })
    if (error) return { error: error.message }
  }
  return { success: true }
}

export async function deletePortfolioItem(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('technician_portfolio')
    .delete()
    .eq('id', id)
    .eq('technician_id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}
