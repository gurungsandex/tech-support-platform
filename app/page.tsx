import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import {
  Search, MapPin, MessageSquare, Star, Shield, Users,
  Wifi, Monitor, Printer, Network, Home, Tv,
  CheckCircle2, ArrowRight, DollarSign
} from 'lucide-react'

const services = [
  { icon: Wifi, label: 'Internet Troubleshooting' },
  { icon: Monitor, label: 'Computer Setup' },
  { icon: Printer, label: 'Printer Setup' },
  { icon: Network, label: 'Network Support' },
  { icon: Home, label: 'Home Office Setup' },
  { icon: Tv, label: 'Smart TV Setup' },
]

const steps = [
  {
    number: '1',
    title: 'Search by Location',
    description: 'Enter your city or ZIP code to find IT technicians near you. Filter by service, rating, or support type.',
  },
  {
    number: '2',
    title: 'Browse & Compare',
    description: 'View profiles, skills, certifications, and reviews. See price estimates before reaching out.',
  },
  {
    number: '3',
    title: 'Contact Directly',
    description: 'Message, call, or email your chosen technician. No middleman, no platform fees. You negotiate directly.',
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
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/30 px-4 py-1.5 text-sm font-medium text-blue-100 mb-6">
                <MapPin className="h-4 w-4" />
                United States Only — Free to Use
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Find Local IT Technicians
                <br />
                <span className="text-blue-200">Without the Middleman</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
                Browse verified IT professionals near you. View their skills, certifications, and reviews.
                Contact them directly — the platform never handles payments or takes a cut.
              </p>

              {/* Search Bar */}
              <div className="mx-auto mt-10 max-w-2xl">
                <div className="flex gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-sm">
                  <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-4 py-3">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 text-sm">City or ZIP code</span>
                  </div>
                  <Link href="/find-technicians">
                    <Button className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Find Technicians
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap justify-center gap-8">
                <div className="flex items-center gap-2 text-blue-100">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">No Platform Fees</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Verified Technicians</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Star className="h-5 w-5" />
                  <span className="text-sm font-medium">Real Reviews</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">Direct Contact</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Popular IT Services</h2>
              <p className="mt-3 text-gray-600">Find a technician for any tech need</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {services.map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href={`/find-technicians?service=${encodeURIComponent(label)}`}
                  className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/find-technicians" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                See all services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-gray-600">Connect with IT help in minutes</p>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-4 text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Use Us */}
        <section id="features" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Skip the MSP Fees.
                  <br />
                  <span className="text-blue-600">Go Direct.</span>
                </h2>
                <p className="mt-6 text-lg text-gray-600">
                  Managed Service Providers often charge $50–$150/hour with heavy markups. Our platform
                  lets you discover independent IT professionals and negotiate rates directly — no commissions, no platform fees.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    'Verified technicians with certifications',
                    'Real reviews from real customers',
                    'See price estimates upfront',
                    'Remote and on-site support options',
                    'Direct phone, email, and chat contact',
                    'Map-based search to find local experts',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-blue-50 p-6">
                  <Shield className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">Verified Profiles</h3>
                  <p className="mt-2 text-sm text-gray-600">All technicians are admin-approved before listing</p>
                </div>
                <div className="rounded-xl bg-green-50 p-6">
                  <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">Zero Commission</h3>
                  <p className="mt-2 text-sm text-gray-600">We never touch payments. 100% between you and the tech</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-6">
                  <MapPin className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">Local Search</h3>
                  <p className="mt-2 text-sm text-gray-600">Find nearby technicians with map-based discovery</p>
                </div>
                <div className="rounded-xl bg-yellow-50 p-6">
                  <Star className="h-8 w-8 text-yellow-500 mb-3" />
                  <h3 className="font-semibold text-gray-900">Honest Reviews</h3>
                  <p className="mt-2 text-sm text-gray-600">Reviews only unlocked after job completion</p>
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
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-300 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex gap-4">
                  <Link href="/register?role=professional">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      Join as a Technician
                    </Button>
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

        {/* Disclaimer Banner */}
        <section className="bg-gray-100 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              <strong>Disclaimer:</strong> This platform connects users with independent IT technicians.
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
            <p className="mt-4 text-lg text-gray-600">Browse hundreds of verified IT professionals near you</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/find-technicians">
                <Button size="lg">
                  <Search className="h-5 w-5 mr-2" />
                  Find Technicians Now
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
