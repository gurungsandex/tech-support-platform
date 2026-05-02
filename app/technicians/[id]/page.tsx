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
  DollarSign, Globe, Linkedin, AlertCircle, Shield, Clock
} from 'lucide-react'

export default async function TechnicianProfilePage({ params }: { params: { id: string } }) {
  const { data: tech, error } = await getTechnicianPublicProfile(params.id)

  if (error || !tech) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const isOnline = tech.availability_status === 'online'

  async function startConversation() {
    'use server'
    if (!user) redirect('/login?redirect=/technicians/' + params.id)
    const result = await getOrCreateConversation(params.id)
    if (result.data) {
      redirect(`/user/conversations/${result.data.id}`)
    }
  }

  const initials = tech.full_name
    ? tech.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ---- LEFT: Profile + Details ---- */}
            <div className="lg:col-span-2 space-y-5">

              {/* Profile header card with banner */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                {/* Banner */}
                <div className="h-36 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative" />

                {/* Profile info row */}
                <div className="px-6 pb-6">
                  <div className="flex items-end gap-5 -mt-12 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
                        {tech.profile_photo_url ? (
                          <Image src={tech.profile_photo_url} alt={tech.full_name} width={96} height={96} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-gray-400">{initials}</span>
                        )}
                      </div>
                      <span className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0 pt-14">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-bold text-gray-900">{tech.full_name}</h1>
                        {tech.verification_status === 'approved' && (
                          <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        )}
                        {tech.completed_requests >= 10 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                            🏆 TOP RATED
                          </span>
                        )}
                      </div>
                      {tech.tagline && (
                        <p className="text-sm text-gray-500 mt-0.5">{tech.tagline}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        {tech.average_rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium text-gray-700">{tech.average_rating.toFixed(1)}</span>
                            <span>({tech.total_reviews} reviews)</span>
                          </div>
                        )}
                        {(tech.city || tech.state) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{[tech.city, tech.state].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                        {tech.years_of_experience > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{tech.years_of_experience} years experience</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              {tech.bio && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">About {tech.full_name.split(' ')[0]}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{tech.bio}</p>
                </div>
              )}

              {/* Services */}
              {tech.services.length > 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Services Offered</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tech.services.map((service) => (
                      <div key={service.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">{service.service_name}</span>
                        </div>
                        {(service.price_min || service.price_max) && (
                          <p className="ml-6 text-sm font-medium text-green-700">
                            from ${service.price_min}
                            {service.price_max && service.price_max !== service.price_min ? `–$${service.price_max}` : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  Availability this week
                </h2>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className={`rounded-xl py-3 text-xs ${i < 5 && isOnline ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'}`}>
                      <div className="font-semibold mb-1">{day}</div>
                      <div>{i < 5 && isOnline ? '9a–5p' : '–'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              {tech.portfolio.length > 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Projects</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {tech.portfolio.map((item) => (
                      <div key={item.id} className="rounded-xl overflow-hidden border border-gray-100">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.title} width={400} height={128} className="w-full h-28 object-cover" />
                        ) : (
                          <div className="w-full h-28 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <span className="text-white text-sm font-medium px-3 text-center">{item.title}</span>
                          </div>
                        )}
                        {item.description && (
                          <div className="p-3">
                            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                            {item.project_url && (
                              <a href={item.project_url} target="_blank" rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <ExternalLink className="h-3 w-3" /> View
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {tech.certifications.length > 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Certifications</h2>
                  <div className="space-y-3">
                    {tech.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-3 rounded-xl border border-gray-100 p-3">
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

              {/* Reviews */}
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-base font-semibold text-gray-900">Reviews</h2>
                  {tech.total_reviews > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-gray-800">{tech.average_rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-400">({tech.total_reviews})</span>
                    </div>
                  )}
                </div>
                {tech.reviews.length === 0 ? (
                  <p className="text-sm text-gray-400">No reviews yet. Reviews are submitted after job completion.</p>
                ) : (
                  <div className="space-y-5">
                    {tech.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                              {(review as { reviewer?: { full_name: string } }).reviewer?.full_name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {(review as { reviewer?: { full_name: string } }).reviewer?.full_name ?? 'Anonymous'}
                              </p>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        {review.comment && <p className="text-sm text-gray-600 ml-12">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ---- RIGHT: Booking card ---- */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 sticky top-24">
                {/* Rate + status */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Standard Rate</p>
                    {(tech as { hourly_rate_min?: number }).hourly_rate_min ? (
                      <p className="text-2xl font-bold text-gray-900">
                        ${(tech as { hourly_rate_min?: number }).hourly_rate_min}
                        <span className="text-sm font-normal text-gray-400">/hr</span>
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-gray-500">Rate on request</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {isOnline ? 'Online Now' : 'Offline'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Usually responds in &lt; 30m</p>
                  </div>
                </div>

                {/* Message button */}
                {isLoggedIn ? (
                  <form action={startConversation}>
                    <button
                      type="submit"
                      className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message {tech.full_name.split(' ')[0]}
                    </button>
                  </form>
                ) : (
                  <Link href={`/login?redirect=/technicians/${params.id}`}>
                    <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      Sign in to Message
                    </button>
                  </Link>
                )}

                <button className="mb-5 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Request a Quote
                </button>

                {/* Trust badges */}
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">TechLink Guarantee</p>
                      <p className="text-xs text-gray-400">Payment is held securely until the job is completed.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Background Checked</p>
                      <p className="text-xs text-gray-400">Identity and credentials verified by TechLink.</p>
                    </div>
                  </div>
                </div>

                {/* Contact links */}
                {(tech.phone_number || tech.email) && (
                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                    {tech.phone_number && (
                      <a href={`tel:${tech.phone_number}`}
                        className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {tech.phone_number}
                      </a>
                    )}
                    {tech.email && (
                      <a href={`mailto:${tech.email}`}
                        className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <Mail className="h-4 w-4 text-gray-400" />
                        Email Technician
                      </a>
                    )}
                  </div>
                )}

                {/* External links */}
                {((tech as { website_url?: string }).website_url || (tech as { linkedin_url?: string }).linkedin_url) && (
                  <div className="mt-3 flex gap-2">
                    {(tech as { website_url?: string }).website_url && (
                      <a href={(tech as { website_url?: string }).website_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-gray-100 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">
                        <Globe className="h-3.5 w-3.5" /> Website
                      </a>
                    )}
                    {(tech as { linkedin_url?: string }).linkedin_url && (
                      <a href={(tech as { linkedin_url?: string }).linkedin_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-gray-100 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">
                        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                      </a>
                    )}
                  </div>
                )}

                {/* Report */}
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <button className="flex w-full items-center justify-between text-xs text-gray-400 hover:text-gray-600">
                    <span>Report this profile</span>
                    <span>›</span>
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    This platform connects you directly with independent technicians. We do not process payments or guarantee services.{' '}
                    <Link href="/disclaimer" className="underline font-medium">Read disclaimer</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
