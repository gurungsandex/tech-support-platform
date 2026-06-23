import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/find-technicians`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/login`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/register`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const supabase = await createClient()
  const { data: technicians } = await supabase
    .from('it_professional_profiles')
    .select('user_id')
    .eq('verification_status', 'approved')

  const technicianRoutes: MetadataRoute.Sitemap = (technicians ?? []).map((tech) => ({
    url: `${baseUrl}/technicians/${tech.user_id}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...technicianRoutes]
}
