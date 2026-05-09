import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSearch from '@/components/layout/HeroSearch'
import { createClient } from '@/lib/supabase/server'
import {
  Search, MapPin, MessageSquare, Star, Shield, Users,
  Wifi, Monitor, Printer, Database, Cloud,
  CheckCircle2, ArrowRight, DollarSign, HardDrive, Lock
} from 'lucide-react'

const categories = [
  { icon: Wifi,      label: 'Networking',    color: 'text-primary-600',  bg: 'bg-primary-50' },
  { icon: Monitor,   label: 'Hardware',      color: 'text-info-700',     bg: 'bg-info-50' },
  { icon: HardDrive, label: 'Software',      color: 'text-ink-700',      bg: 'bg-ink-100' },
  { icon: Lock,      label: 'Security',      color: 'text-success-700',  bg: 'bg-success-50' },
  { icon: Database,  label: 'Data Recovery', color: 'text-danger-700',   bg: 'bg-danger-50' },
  { icon: Cloud,     label: 'Cloud',         color: 'text-info-500',     bg: 'bg-info-50' },
  { icon: Shield,    label: 'Cybersecurity', color: 'text-ink-600',      bg: 'bg-ink-100' },
  { icon: Printer,   label: 'Printers',      color: 'text-warn-700',     bg: 'bg-warn-50' },
]

const steps = [
  {
    number: '01',
    title: 'Describe your issue',
    description: 'Tell us what you need help with and where you are. Filter by rating, distance, or specialty.',
  },
  {
    number: '02',
    title: 'Compare profiles',
    description: 'See real reviews, response times, portfolios, and verifications — trust signals up front.',
  },
  {
    number: '03',
    title: 'Get it resolved',
    description: 'Message directly, discuss the job, agree on terms — all on your terms. No middlemen.',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: topTechs } = await supabase
    .from('it_professional_profiles')
    .select('user_id, average_rating, total_reviews, availability_status, tagline, profile:profiles!it_professional_profiles_user_id_fkey(full_name)')
    .eq('verification_status', 'approved')
    .order('average_rating', { ascending: false })
    .limit(4)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ── Hero — warm cream surface ── */}
        <section className="bg-surface-warm py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Eyebrow badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500 inline-block"></span>
                Verified IT professionals — browse for free
              </span>

              <h1 className="text-4xl font-extrabold tracking-tightest text-ink-900 sm:text-5xl md:text-6xl text-balance leading-tight">
                IT support that{' '}
                <span className="text-primary-500">actually works.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-500 leading-relaxed">
                Find trusted local technicians for networking, hardware, software, and security.
                Browse profiles, read reviews, message directly — no fees, no middlemen.
              </p>

              <HeroSearch />

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap justify-center gap-6">
                {[
                  { icon: DollarSign, label: 'No Platform Fees' },
                  { icon: Shield,     label: 'Verified Professionals' },
                  { icon: Star,       label: 'Real Reviews' },
                  { icon: MessageSquare, label: 'Instant Messaging' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-ink-500">
                    <Icon className="h-4 w-4 text-primary-500" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Browse by category ── */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">What do you need help with?</h2>
              <p className="mt-2 text-ink-500">Select a category to find specialized technicians.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {categories.map(({ icon: Icon, label, color, bg }) => (
                <Link
                  key={label}
                  href={`/find-technicians?service=${encodeURIComponent(label)}`}
                  className="flex flex-col items-center gap-3 rounded-xl border border-ink-200 bg-white p-6 hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <span className="text-sm font-semibold text-ink-800 group-hover:text-primary-600 transition-colors">{label}</span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/find-technicians" className="inline-flex items-center gap-2 rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50 hover:border-ink-300 transition-colors">
                Browse all categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Top-rated technicians — muted bg ── */}
        <section className="bg-surface-muted py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink-900">Top-rated technicians</h2>
                <p className="mt-1 text-ink-500">Available right now to help you.</p>
              </div>
              <Link href="/find-technicians" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                View all experts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {topTechs && topTechs.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {topTechs.map((tech: any) => {
                  const name = tech.profile?.full_name ?? 'Technician'
                  const isOnline = tech.availability_status === 'online'
                  return (
                    <div key={tech.user_id} className="rounded-xl bg-white border border-ink-200 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative inline-block mb-3">
                        <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center text-xl font-bold text-white mx-auto">
                          {name[0]?.toUpperCase()}
                        </div>
                        <span className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-success-500' : 'bg-ink-300'}`} />
                      </div>
                      <p className="font-semibold text-ink-900 text-sm">{name}</p>
                      {tech.tagline && (
                        <p className="text-xs text-ink-500 mt-0.5 mb-2 line-clamp-1">{tech.tagline}</p>
                      )}
                      {tech.average_rating > 0 && (
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <Star className="h-3.5 w-3.5 text-warn-500 fill-warn-500" />
                          <span className="text-xs font-semibold text-ink-700">{tech.average_rating.toFixed(1)}</span>
                          <span className="text-xs text-ink-400">({tech.total_reviews})</span>
                        </div>
                      )}
                      <Link href={`/technicians/${tech.user_id}`}>
                        <button className="w-full rounded-lg border border-ink-200 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50 hover:border-ink-300 transition-colors">
                          View Profile
                        </button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-white border border-ink-200 py-12 text-center shadow-sm">
                <p className="text-sm text-ink-400">Technicians will appear here once approved.</p>
                <Link href="/find-technicians" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Browse all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── How It Works — warm cream ── */}
        <section id="how-it-works" className="bg-surface-warm py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Get help in three simple steps</h2>
              <p className="mt-4 text-ink-500">No accounts to set up before you browse. No payment middleman. Just connection.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="relative bg-white rounded-xl border border-ink-200 p-8 shadow-sm text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary-50 text-primary-600 text-sm font-extrabold mb-5 mx-auto">
                    {step.number}
                  </div>
                  <h3 className="text-base font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-ink-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why TechLink ── */}
        <section className="bg-surface-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                  Skip the MSP Fees.{' '}
                  <span className="text-primary-500">Go Direct.</span>
                </h2>
                <p className="mt-6 text-ink-500 leading-relaxed">
                  MSPs often charge $50–$150/hour with heavy markups. TechLink lets you discover independent IT professionals and negotiate rates directly — no commissions, no platform fees.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    'Verified technicians with certifications',
                    'Real reviews from real customers',
                    'See price estimates upfront',
                    'Remote and on-site support options',
                    'Direct phone, email, and chat contact',
                    'Map-based search to find local experts',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0" />
                      <span className="text-ink-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-primary-50 border border-primary-100 p-6">
                  <Shield className="h-7 w-7 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-ink-900 text-sm">Verified Profiles</h3>
                  <p className="mt-2 text-sm text-ink-500">All technicians are admin-approved before listing</p>
                </div>
                <div className="rounded-xl bg-success-50 border border-success-500/20 p-6">
                  <DollarSign className="h-7 w-7 text-success-700 mb-3" />
                  <h3 className="font-semibold text-ink-900 text-sm">Zero Commission</h3>
                  <p className="mt-2 text-sm text-ink-500">We never touch payments. 100% between you and the tech</p>
                </div>
                <div className="rounded-xl bg-ink-100 border border-ink-200 p-6">
                  <MapPin className="h-7 w-7 text-ink-600 mb-3" />
                  <h3 className="font-semibold text-ink-900 text-sm">Local Search</h3>
                  <p className="mt-2 text-sm text-ink-500">Find nearby technicians with map-based discovery</p>
                </div>
                <div className="rounded-xl bg-warn-50 border border-warn-500/20 p-6">
                  <Star className="h-7 w-7 text-warn-700 mb-3" />
                  <h3 className="font-semibold text-ink-900 text-sm">Honest Reviews</h3>
                  <p className="mt-2 text-sm text-ink-500">Reviews only unlocked after job completion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── For Technicians — dark strip ── */}
        <section className="bg-ink-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Are You an IT Professional?</h2>
                <p className="mt-4 text-lg text-ink-300">
                  Create your free profile and get discovered by customers in your area.
                  Showcase your skills, certifications, and set your own rates.
                </p>
                <ul className="mt-6 space-y-3 text-ink-300">
                  {[
                    'Free to join — no subscription fees',
                    'Set your own service radius',
                    'Choose remote, on-site, or both',
                    'Control your contact info visibility',
                    'Pause your profile anytime',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/register?role=professional">
                    <button className="rounded-lg bg-primary-500 hover:bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors shadow-sm">
                      Join as a Technician
                    </button>
                  </Link>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-white backdrop-blur">
                <Users className="h-10 w-10 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold">Your Profile Includes:</h3>
                <div className="mt-4 space-y-2 text-ink-300 text-sm">
                  <p>✓ Skills &amp; certifications</p>
                  <p>✓ Portfolio of past projects</p>
                  <p>✓ Service area map</p>
                  <p>✓ Price estimates per service</p>
                  <p>✓ Customer reviews &amp; ratings</p>
                  <p>✓ Online/offline availability status</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <section className="bg-ink-50 border-t border-ink-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-ink-400">
              <strong className="text-ink-500">Disclaimer:</strong> TechLink connects users with independent IT technicians worldwide.
              We do not employ technicians, process payments, or take responsibility for services rendered.
              Users should perform due diligence before hiring. See our{' '}
              <Link href="/disclaimer" className="text-primary-600 hover:underline transition-colors">full disclaimer</Link>.
            </p>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900">Ready to Find IT Help?</h2>
            <p className="mt-4 text-ink-500">Browse hundreds of verified IT professionals near you.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/find-technicians">
                <button className="flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors shadow-sm">
                  <Search className="h-4 w-4" />
                  Find Technicians Now
                </button>
              </Link>
              <Link href="/register">
                <button className="rounded-lg border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 hover:border-ink-300 transition-colors">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
