import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { Shield, MessageSquare, CheckCircle2, Clock, Users, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl md:text-6xl">
                Connect with{' '}
                <span className="text-primary-600">Verified IT Professionals</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-secondary-600">
                Get expert technical support in real-time. Our platform connects you with verified IT professionals who can solve your tech issues quickly and securely.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg">Get Support Now</Button>
                </Link>
                <Link href="/register?role=professional">
                  <Button size="lg" variant="outline">Become a Professional</Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-secondary-900">Privacy Protected</h3>
                  <p className="mt-2 text-sm text-secondary-600">Your information is only shared after you accept help</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <CheckCircle2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-secondary-900">Verified Experts</h3>
                  <p className="mt-2 text-sm text-secondary-600">All IT professionals are verified and approved</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <MessageSquare className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-secondary-900">Real-time Chat</h3>
                  <p className="mt-2 text-sm text-secondary-600">Communicate securely with instant messaging</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-secondary-600">Get help in three simple steps</p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
                    1
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-secondary-900">Post Your Request</h3>
                <p className="mt-4 text-secondary-600">
                  Describe your technical issue with as much detail as possible. Your contact information remains private.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
                    2
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-secondary-900">Get Matched</h3>
                <p className="mt-4 text-secondary-600">
                  Verified IT professionals review your request and one will accept it. You'll be notified immediately.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
                    3
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-secondary-900">Resolve & Review</h3>
                <p className="mt-4 text-secondary-600">
                  Work with your IT professional through secure messaging until resolved. Leave a review when complete.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-secondary-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">Why Choose Our Platform</h2>
              <p className="mt-4 text-lg text-secondary-600">Built with security and privacy as our top priority</p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <Shield className="h-10 w-10 text-primary-600" />
                <h3 className="mt-4 text-lg font-semibold text-secondary-900">Privacy First</h3>
                <p className="mt-2 text-secondary-600">
                  Your contact information is only revealed after you approve a professional to help you.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <Users className="h-10 w-10 text-primary-600" />
                <h3 className="mt-4 text-lg font-semibold text-secondary-900">Verified Professionals</h3>
                <p className="mt-2 text-secondary-600">
                  All IT professionals go through a thorough verification process before joining the platform.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <MessageSquare className="h-10 w-10 text-primary-600" />
                <h3 className="mt-4 text-lg font-semibold text-secondary-900">Secure Messaging</h3>
                <p className="mt-2 text-secondary-600">
                  Communicate through our encrypted real-time messaging system for complete privacy.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <Clock className="h-10 w-10 text-primary-600" />
                <h3 className="mt-4 text-lg font-semibold text-secondary-900">Fast Response</h3>
                <p className="mt-2 text-secondary-600">
                  Get quick responses from professionals who are actively monitoring for new requests.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <Star className="h-10 w-10 text-primary-600" />
                <h3 className="mt-4 text-lg font-semibold text-secondary-900">Rated Experts</h3>
                <p className="mt-2 text-secondary-600">
                  Review and rating system helps you choose the best professionals for your needs.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-primary-600" />
                <h3 className="mt-4 text-lg font-semibold text-secondary-900">Quality Guaranteed</h3>
                <p className="mt-2 text-secondary-600">
                  Report system ensures all interactions maintain professional standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Get Started?</h2>
              <p className="mt-4 text-lg text-primary-100">
                Join thousands of users getting help from verified IT professionals
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-secondary-50">
                    Create Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
