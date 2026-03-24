import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AlertTriangle } from 'lucide-react'

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Disclaimer</h1>
            </div>
            <p className="text-sm text-gray-500 mb-6">Last updated: March 2026</p>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-gray-900">1. Nature of the Platform</h2>
                <p>
                  TechSupport Platform is a <strong>directory and communication service only</strong>. We provide
                  a marketplace that connects independent IT technicians (&quot;Technicians&quot;) with end users
                  (&quot;Customers&quot;) seeking IT services. We do not employ, endorse, or directly supervise any
                  Technician listed on this platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">2. No Employment Relationship</h2>
                <p>
                  All Technicians on this platform are independent contractors. TechSupport Platform is not
                  their employer, agent, or representative. Any engagement between a Customer and a Technician
                  is an independent agreement between those parties only.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">3. No Payment Processing</h2>
                <p>
                  <strong>TechSupport Platform does not process, handle, facilitate, or guarantee any payments.</strong>
                  All financial arrangements, including but not limited to pricing, payment methods, invoicing,
                  refunds, and disputes, must be agreed upon and handled exclusively between the Customer and
                  the Technician outside of this platform. We have no visibility into and bear no responsibility
                  for any financial transactions.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">4. No Warranty or Guarantee of Services</h2>
                <p>
                  TechSupport Platform makes no warranty, express or implied, regarding the quality, accuracy,
                  timeliness, or fitness for any particular purpose of the services provided by Technicians.
                  Customer reviews and ratings on this platform are user-generated content and do not constitute
                  an endorsement by TechSupport Platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">5. Limitation of Liability</h2>
                <p>
                  TechSupport Platform is <strong>not responsible for</strong> any of the following that may
                  arise from or relate to the use of this platform:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Fraud, scams, or dishonest conduct by any Technician or Customer</li>
                  <li>Damage to hardware, software, data, or property during or after a service</li>
                  <li>Financial disputes between Customers and Technicians</li>
                  <li>Misrepresentation of skills, credentials, or certifications by any user</li>
                  <li>Personal injury or property damage arising from on-site visits</li>
                  <li>Privacy breaches or unauthorized access resulting from a service interaction</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">6. User Due Diligence</h2>
                <p>
                  All users are strongly encouraged to perform their own due diligence before engaging any
                  Technician. This includes, but is not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Verifying certifications independently through official issuer websites</li>
                  <li>Reading and evaluating all available reviews and ratings</li>
                  <li>Discussing and agreeing on scope of work and pricing in writing</li>
                  <li>Requesting references where appropriate</li>
                  <li>Using secure payment methods with buyer protection where available</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">7. Geographic Scope</h2>
                <p>
                  This platform is intended for use within the <strong>United States only</strong>. Users outside
                  the United States are not the intended audience and use this platform at their own risk.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">8. Content Accuracy</h2>
                <p>
                  Technician profiles, service descriptions, certifications, and pricing listed on this platform
                  are provided by the Technicians themselves. TechSupport Platform does not independently verify
                  all information and makes no guarantee of its accuracy or completeness.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">9. Changes to This Disclaimer</h2>
                <p>
                  This disclaimer may be updated at any time. Continued use of the platform after changes are
                  posted constitutes acceptance of the updated disclaimer.
                </p>
              </section>

              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 mt-6">
                <p className="text-sm text-yellow-800">
                  <strong>Summary:</strong> We connect you with IT technicians. We don&apos;t employ them, handle
                  payments, or guarantee their work. Please research before hiring and arrange payments directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
