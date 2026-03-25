import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getTechnicianPublicProfile } from '@/lib/technicians/actions'
import { getOrCreateConversation } from '@/lib/conversations/actions'
import { createClient } from '@/lib/supabase/server'
import {
  MapPin, Star, Wifi, Home, Monitor, CheckCircle, Phone,
  Mail, MessageSquare, ExternalLink, Award, Calendar,
  DollarSign, Globe, Linkedin, AlertCircle
} from 'lucide-react'

export default async function TechnicianProfilePage({ params }: { params: { id: string } }) {
  const { data: tech, error } = await getTechnicianPublicProfile(params.id)

  if (error || !tech) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const isOnline = tech.availability_status === 'online'

  // Start conversation action
  async function startConversation() {
    'use server'
    if (!user) redirect('/login?redirect=/technicians/' + params.id)
    const result = await getOrCreateConversation(params.id)
    if (result.data) {
      redirect(`/user/conversations/${result.data.id}`)
    }
  }

  const ratingStars = tech.average_rating > 0
    ? Math.round(tech.average_rating)
    : 0

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ---- LEFT COLUMN: Profile Card ---- */}
            <div className="lg:col-span-1 space-y-4">
              {/* Main card */}
              <div className="rounded-xl bg-white border border-gray-200 p-6">
                {/* Avatar + status */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow">
                      {tech.profile_photo_url ? (
                        <Image src={tech.profile_photo_url} alt={tech.full_name} width={96} height={96} className="h-full w-full object-cover" />
                      ) : (
                        <Monitor className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <span className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>

                  <h1 className="mt-3 text-xl font-bold text-gray-900">{tech.full_name}</h1>
                  {tech.tagline && <p className="mt-1 text-sm text-gray-500 italic">{tech.tagline}</p>}

                  <span className={`mt-2 text-xs font-medium px-3 py-1 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {isOnline ? '🟢 Available Now' : '⚫ Currently Offline'}
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-4 flex items-center justify-center gap-1">
                  {ratingStars > 0 ? (
                    <>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < ratingStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                      <span className="ml-1 text-sm font-medium text-gray-700">{tech.average_rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-400">({tech.total_reviews})</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">No reviews yet</span>
                  )}
                </div>

                {/* Location */}
                {(tech.city || tech.state) && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {[tech.city, tech.state].filter(Boolean).join(', ')}
                  </div>
                )}

                {/* Support type */}
                <div className="mt-3 flex justify-center gap-2 flex-wrap">
                  {(tech.support_type === 'remote' || tech.support_type === 'both') && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                      <Wifi className="h-3 w-3" /> Remote
                    </span>
                  )}
                  {(tech.support_type === 'onsite' || tech.support_type === 'both') && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-700">
                      <Home className="h-3 w-3" /> On-site ({tech.service_radius_miles} mi)
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{tech.completed_requests}</div>
                    <div className="text-xs text-gray-500">Jobs Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{tech.years_of_experience}</div>
                    <div className="text-xs text-gray-500">Years Exp.</div>
                  </div>
                </div>

                {/* Pricing */}
                {(tech as { hourly_rate_min?: number; hourly_rate_max?: number }).hourly_rate_min && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>${(tech as { hourly_rate_min?: number }).hourly_rate_min}–${(tech as { hourly_rate_max?: number }).hourly_rate_max}/hr (estimated)</span>
                  </div>
                )}

                {/* Contact Actions */}
                <div className="mt-5 space-y-2">
                  {isLoggedIn ? (
                    <form action={startConversation}>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Send Message
                      </button>
                    </form>
                  ) : (
                    <Link href={`/login?redirect=/technicians/${params.id}`}>
                      <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        Sign in to Message
                      </button>
                    </Link>
                  )}

                  {/* Phone */}
                  {tech.phone_number ? (
                    <a href={`tel:${tech.phone_number}`} className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Phone className="h-4 w-4" />
                      {tech.phone_number}
                    </a>
                  ) : tech.phone_visibility !== 'hidden' && !isLoggedIn ? (
                    <Link href="/register">
                      <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-pointer hover:bg-gray-100">
                        <Phone className="h-4 w-4" />
                        Register to view phone
                      </div>
                    </Link>
                  ) : null}

                  {/* Email */}
                  {tech.email ? (
                    <a href={`mailto:${tech.email}`} className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Mail className="h-4 w-4" />
                      Email Technician
                    </a>
                  ) : tech.email_visibility !== 'hidden' && !isLoggedIn ? (
                    <Link href="/register">
                      <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-pointer hover:bg-gray-100">
                        <Mail className="h-4 w-4" />
                        Register to view email
                      </div>
                    </Link>
                  ) : null}
                </div>

                {/* External links */}
                {(tech as { website_url?: string; linkedin_url?: string }).website_url || (tech as { website_url?: string; linkedin_url?: string }).linkedin_url ? (
                  <div className="mt-3 flex justify-center gap-3">
                    {(tech as { website_url?: string }).website_url && (
                      <a href={(tech as { website_url?: string }).website_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {(tech as { linkedin_url?: string }).linkedin_url && (
                      <a href={(tech as { linkedin_url?: string }).linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    This platform connects you directly with independent technicians. We do not process payments or guarantee services.{' '}
                    <Link href="/disclaimer" className="underline">Read disclaimer</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* ---- RIGHT COLUMN: Details ---- */}
            <div className="lg:col-span-2 space-y-6">

              {/* About */}
              {tech.bio && (
                <div className="rounded-xl bg-white border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{tech.bio}</p>
                </div>
              )}

              {/* Services */}
              {tech.services.length > 0 && (
                <div className="rounded-xl bg-white border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tech.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-700">{service.service_name}</span>
                        </div>
                        {(service.price_min || service.price_max) && (
                          <span className="text-sm text-green-700 font-medium">
                            ${service.price_min}
                            {service.price_max && service.price_max !== service.price_min ? `–$${service.price_max}` : ''}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {tech.certifications.length > 0 && (
                <div className="rounded-xl bg-white border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
                  <div className="space-y-3">
                    {tech.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                        <Award className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 text-sm">{cert.name}</span>
                            {cert.verification_url && (
                              <a href={cert.verification_url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <ExternalLink className="h-3 w-3" /> Verify
                              </a>
                            )}
                          </div>
                          {cert.issuer && <p className="text-xs text-gray-500 mt-0.5">{cert.issuer}</p>}
                          {cert.issued_date && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              Issued: {new Date(cert.issued_date).toLocaleDateString()}
                              {cert.expiry_date && ` · Expires: ${new Date(cert.expiry_date).toLocaleDateString()}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {tech.portfolio.length > 0 && (
                <div className="rounded-xl bg-white border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio & Past Projects</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tech.portfolio.map((item) => (
                      <div key={item.id} className="rounded-lg border border-gray-100 overflow-hidden">
                        {item.image_url && (
                          <Image src={item.image_url} alt={item.title} width={400} height={128} className="w-full h-32 object-cover" />
                        )}
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                          {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                          {item.project_url && (
                            <a href={item.project_url} target="_blank" rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                              <ExternalLink className="h-3 w-3" /> View Project
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="rounded-xl bg-white border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Reviews{tech.total_reviews > 0 ? ` (${tech.total_reviews})` : ''}
                </h2>
                {tech.reviews.length === 0 ? (
                  <p className="text-sm text-gray-400">No reviews yet. Reviews are submitted after job completion.</p>
                ) : (
                  <div className="space-y-4">
                    {tech.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                            {(review as { reviewer?: { full_name: string } }).reviewer?.full_name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {(review as { reviewer?: { full_name: string } }).reviewer?.full_name ?? 'Anonymous'}
                            </div>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && <p className="text-sm text-gray-600 ml-10">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
