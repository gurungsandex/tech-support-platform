import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-secondary-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-lg font-bold text-white">TS</span>
              </div>
              <span className="text-xl font-bold text-secondary-900">TechSupport</span>
            </div>
            <p className="mt-4 text-sm text-secondary-600">
              Connecting end users with verified IT professionals for secure, real-time technical support.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/#features" className="text-sm text-secondary-600 hover:text-primary-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-secondary-600 hover:text-primary-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-secondary-600 hover:text-primary-600">
                  Become a Professional
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/help" className="text-sm text-secondary-600 hover:text-primary-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-secondary-600 hover:text-primary-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-secondary-600 hover:text-primary-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-secondary-600 hover:text-primary-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm text-secondary-600 hover:text-primary-600">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-secondary-200 pt-8">
          <p className="text-center text-sm text-secondary-600">
            © {new Date().getFullYear()} TechSupport Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
