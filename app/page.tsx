import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSearch from '@/components/layout/HeroSearch'
import {
  Search, MapPin, MessageSquare, Star, Shield, Users,
  Wifi, Monitor, Printer, Network, Database, Cloud,
  CheckCircle2, ArrowRight, DollarSign, HardDrive, Lock
} from 'lucide-react'

const categories = [
  { icon: Wifi, label: 'Networking', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { icon: Monitor, label: 'Hardware', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: HardDrive, label: 'Software', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Lock, label: 'Security', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: Database, label: 'Data Recovery', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: Cloud, label: 'Cloud', color: 'text-sky-500', bg: 'bg-sky-50' },
  { icon: Shield, label: 'Cybersecurity', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { icon: Printer, label: 'Printers', color: 'text-orange-500', bg: 'bg-orange-50' },
]

const steps = [
  {
    number: '1',
    title: 'Describe your issue',
    description: 'Tell us what you need help with.',
  },
  {
    number: '2',
    title: 'Match with an expert',
    description: 'We find the best local technician.',
  },
  {
    number: '3',
    title: 'Get it resolved',
    description: 'Chat online or arrange a visit.',
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                IT support that
                <br />
                <span className="text-blue-200">actually works.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
                Connect with certified IT professionals in seconds. Resolve issues faster, securely, and seamlessly.
              </p>

              <HeroSearch />

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap justify-center gap-8">
                <div className="flex items-center gap-2 text-blue-100">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">No Platform Fees</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Verified Professionals</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Star className="h-5 w-5" />
                  <span className="text-sm font-medium">Real Reviews</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">Instant Messaging</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What do you need help with — 8 categories */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What do you need help with?</h2>
              <p className="mt-2 text-gray-500">Select a category to find specialized technicians.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
              {categories.map(({ icon: Icon, label, color, bg }) => (
                <Link
                  key={label}
                  href={`/find-technicians?service=${encodeURIComponent(label)}`}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
                    <Icon className={`h-7 w-7 ${color}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{label}</span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/find-technicians" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Browse all categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Top-rated technicians */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top-rated technicians</h2>
                <p className="mt-1 text-gray-500">Available right now to help you.</p>
              </div>
              <Link href="/find-technicians" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all experts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Alex Martinez', role: 'Network Specialist', rating: 4.9, reviews: 127, online: true },
                { name: 'Sarah Jenkins', role: 'Hardware Specialist', rating: 5.0, reviews: 84, online: true },
                { name: 'David Chen', role: 'Data Recovery Expert', rating: 4.8, reviews: 203, online: false },
                { name: 'Michael Ross', role: 'Cloud Architect', rating: 4.9, reviews: 156, online: true },
              ].map((tech) => (
                <div key={tech.name} className="rounded-2xl bg-white border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative inline-block mb-3">
                    <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white mx-auto">
                      {tech.name[0]}
                    </div>
                    <span className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${tech.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{tech.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">{tech.role}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-gray-700">{tech.rating}</span>
                    <span className="text-xs text-gray-400">({tech.reviews})</span>
                  </div>
                  <Link href="/find-technicians">
                    <button className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      Message
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-gray-500">Connect with IT help in minutes</p>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="flex justify-center mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-500 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why TechLink */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Skip the MSP Fees.
                  <br />
                  <span className="text-blue-600">Go Direct.</span>
                </h2>
                <p className="mt-6 text-lg text-gray-500">
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
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-blue-50 p-6">
                  <Shield className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">Verified Profiles</h3>
                  <p className="mt-2 text-sm text-gray-500">All technicians are admin-approved before listing</p>
                </div>
                <div className="rounded-2xl bg-green-50 p-6">
                  <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">Zero Commission</h3>
                  <p className="mt-2 text-sm text-gray-500">We never touch payments. 100% between you and the tech</p>
                </div>
                <div className="rounded-2xl bg-purple-50 p-6">
                  <MapPin className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">Local Search</h3>
                  <p className="mt-2 text-sm text-gray-500">Find nearby technicians with map-based discovery</p>
                </div>
                <div className="rounded-2xl bg-yellow-50 p-6">
                  <Star className="h-8 w-8 text-yellow-500 mb-3" />
                  <h3 className="font-semibold text-gray-900">Honest Reviews</h3>
                  <p className="mt-2 text-sm text-gray-500">Reviews only unlocked after job completion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Technicians */}
        <section className="bg-blue-600 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold sm:text-4xl">Are You an IT Professional?</h2>
                <p className="mt-4 text-lg text-blue-100">
                  Create your free profile and get discovered by customers in your area.
                  Showcase your skills, certifications, and set your own rates.
                </p>
                <ul className="mt-6 space-y-3 text-blue-100">
                  {[
                    'Free to join — no subscription fees',
                    'Set your own service radius',
                    'Choose remote, on-site, or both',
                    'Control your contact info visibility',
                    'Pause your profile anytime',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-300 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/register?role=professional">
                    <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                      Join as a Technician
                    </button>
                  </Link>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 text-white backdrop-blur">
                <Users className="h-12 w-12 text-blue-200 mb-4" />
                <h3 className="text-xl font-semibold">Your Profile Includes:</h3>
                <div className="mt-4 space-y-2 text-blue-100 text-sm">
                  <p>✓ Skills & certifications</p>
                  <p>✓ Portfolio of past projects</p>
                  <p>✓ Service area map</p>
                  <p>✓ Price estimates per service</p>
                  <p>✓ Customer reviews & ratings</p>
                  <p>✓ Online/offline availability status</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-gray-100 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400">
              <strong className="text-gray-500">Disclaimer:</strong> TechLink connects users with independent IT technicians worldwide.
              We do not employ technicians, process payments, or take responsibility for services rendered.
              Users should perform due diligence before hiring. See our{' '}
              <Link href="/disclaimer" className="text-blue-600 hover:underline">full disclaimer</Link>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Find IT Help?</h2>
            <p className="mt-4 text-gray-500">Browse hundreds of verified IT professionals near you</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/find-technicians">
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  <Search className="h-5 w-5" />
                  Find Technicians Now
                </button>
              </Link>
              <Link href="/register">
                <button className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
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
