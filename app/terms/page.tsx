import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-sm text-gray-500 mb-6">Last updated: March 2026</p>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h2>
                <p>
                  By creating an account or using TechSupport Platform, you agree to these Terms of Service.
                  If you do not agree, do not use the platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">2. Platform Description</h2>
                <p>
                  TechSupport Platform is a directory service that connects customers with independent IT
                  technicians. We do not provide IT services directly and are not responsible for any work
                  performed by technicians listed on the platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">3. User Accounts</h2>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>You must provide accurate and truthful information when registering</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must be 18 years or older to use this platform</li>
                  <li>You may not create accounts for others without their consent</li>
                  <li>You may not impersonate other people or entities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">4. Technician Responsibilities</h2>
                <p>Technicians who register on this platform agree to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Provide only accurate, truthful information about their skills and certifications</li>
                  <li>Comply with all applicable federal, state, and local laws</li>
                  <li>Maintain appropriate insurance for their services where required</li>
                  <li>Not engage in fraudulent, deceptive, or harmful conduct</li>
                  <li>Respond professionally to customer inquiries</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">5. Prohibited Uses</h2>
                <p>You may not use this platform to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Harass, threaten, or abuse other users</li>
                  <li>Spam or send unsolicited commercial messages</li>
                  <li>Attempt to hack, disrupt, or damage the platform</li>
                  <li>Scrape or automatically extract data from the platform</li>
                  <li>Use the platform for any illegal purpose</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">6. Reviews and Ratings</h2>
                <p>
                  Reviews may only be submitted by customers after a technician marks a job as completed.
                  Reviews must be honest and based on genuine experience. False or defamatory reviews are
                  prohibited and may result in account suspension.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">7. Content</h2>
                <p>
                  By posting content on this platform (profiles, reviews, messages), you grant TechSupport
                  Platform a non-exclusive license to display that content on the platform. You retain
                  ownership of your content.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">8. Account Termination</h2>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these terms, engage in
                  fraudulent activity, or harm other users. Technicians may be removed from the directory
                  without notice if reports indicate harmful conduct.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">9. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, TechSupport Platform is not liable for any direct,
                  indirect, incidental, or consequential damages arising from your use of the platform or
                  services arranged through it. See our <a href="/disclaimer" className="text-blue-600 hover:underline">full disclaimer</a>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">10. Governing Law</h2>
                <p>
                  These terms are governed by the laws of the United States. Any disputes shall be resolved
                  through binding arbitration, not class action lawsuits.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">11. Changes to Terms</h2>
                <p>
                  We may update these terms at any time. Continued use of the platform after changes are
                  posted constitutes acceptance of the updated terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
