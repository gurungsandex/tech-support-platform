import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-extrabold tracking-tighter text-ink-900">TechLink</span>
            </div>
            <p className="mt-4 text-sm text-ink-500">
              Connecting customers with independent IT professionals worldwide. No middleman. No platform fees.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-ink-900">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/find-technicians" className="text-sm text-ink-500 hover:text-primary-600 transition-colors">Find Technicians</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-ink-500 hover:text-primary-600 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/register?role=professional" className="text-sm text-ink-500 hover:text-primary-600 transition-colors">Join as a Technician</Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-ink-500 hover:text-primary-600 transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-ink-900">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/disclaimer" className="text-sm text-ink-500 hover:text-primary-600 transition-colors">Platform Disclaimer</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-ink-500 hover:text-primary-600 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-ink-500 hover:text-primary-600 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-ink-900">About</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-ink-500">🌍 Available Worldwide</li>
              <li className="text-sm text-ink-500">✅ Free to Browse</li>
              <li className="text-sm text-ink-500">🚫 No Platform Fees</li>
              <li className="text-sm text-ink-500">💬 Direct Contact</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-ink-200 pt-8">
          <p className="text-center text-sm text-ink-400">
            © {new Date().getFullYear()} TechLink. All rights reserved. &nbsp;·&nbsp;
            <Link href="/disclaimer" className="hover:text-primary-600 transition-colors">Disclaimer</Link>
            &nbsp;·&nbsp;
            <Link href="/privacy" className="hover:text-primary-600 transition-colors">Privacy</Link>
            &nbsp;·&nbsp;
            <Link href="/terms" className="hover:text-primary-600 transition-colors">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
