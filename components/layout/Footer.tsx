import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">TS</span>
              </div>
              <span className="text-lg font-bold text-gray-900">TechSupport</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Connecting customers with independent IT professionals. No middleman. No platform fees. United States only.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/find-technicians" className="text-sm text-gray-500 hover:text-blue-600">Find Technicians</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-gray-500 hover:text-blue-600">How It Works</Link>
              </li>
              <li>
                <Link href="/register?role=professional" className="text-sm text-gray-500 hover:text-blue-600">Join as a Technician</Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-gray-500 hover:text-blue-600">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/disclaimer" className="text-sm text-gray-500 hover:text-blue-600">Platform Disclaimer</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">About</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-gray-500">🇺🇸 United States Only</li>
              <li className="text-sm text-gray-500">✅ Free to Browse</li>
              <li className="text-sm text-gray-500">🚫 No Platform Fees</li>
              <li className="text-sm text-gray-500">💬 Direct Contact</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} TechSupport Platform. All rights reserved. &nbsp;·&nbsp;
            <Link href="/disclaimer" className="hover:text-blue-600">Disclaimer</Link>
            &nbsp;·&nbsp;
            <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
            &nbsp;·&nbsp;
            <Link href="/terms" className="hover:text-blue-600">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
