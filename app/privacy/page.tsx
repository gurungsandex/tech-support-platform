import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-sm text-gray-500 mb-6">Last updated: March 2026</p>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-gray-900">1. Information We Collect</h2>
                <p>We collect only the information necessary to operate the platform:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Account information:</strong> Name, email address, and role (technician or customer)</li>
                  <li><strong>Technician profile data:</strong> Bio, skills, location (city/state/ZIP), certifications, and pricing</li>
                  <li><strong>Communications:</strong> Messages sent through our platform chat system</li>
                  <li><strong>Reviews:</strong> Ratings and comments submitted after job completion</li>
                  <li><strong>Usage data:</strong> IP address, browser type, and pages visited (for security purposes)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">2. What We Do NOT Collect</h2>
                <p>We are committed to minimal data collection. We do <strong>not</strong> collect or store:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Government-issued ID documents</li>
                  <li>Social Security numbers</li>
                  <li>Financial information or payment card details</li>
                  <li>Bank account information</li>
                  <li>Identity verification documents</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">3. How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>To create and maintain your account</li>
                  <li>To display your profile in search results (technicians only)</li>
                  <li>To facilitate communication between users and technicians</li>
                  <li>To display verified reviews on technician profiles</li>
                  <li>To ensure platform security and prevent abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">4. Contact Information Visibility</h2>
                <p>
                  Technicians control the visibility of their contact information. Phone numbers and email
                  addresses may be set to:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Public:</strong> Visible to all visitors</li>
                  <li><strong>Registered users only:</strong> Visible only to logged-in users</li>
                  <li><strong>Hidden:</strong> Never displayed publicly</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">5. Data Sharing</h2>
                <p>We do not sell your personal data. We share data only:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>With Supabase (our database provider) under their data processing agreement</li>
                  <li>With Vercel (our hosting provider) for platform operation</li>
                  <li>When required by law or valid legal process</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">6. Data Security</h2>
                <p>
                  We implement industry-standard security measures including encrypted connections (HTTPS),
                  row-level security on the database, and regular security reviews. However, no system is
                  completely secure and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Correct inaccurate information in your profile</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                </ul>
                <p className="mt-2">To exercise these rights, contact us through the platform or use the account deletion option in your settings.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">8. Cookies</h2>
                <p>
                  We use only essential session cookies required for authentication. We do not use advertising
                  cookies or tracking pixels.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">9. Children</h2>
                <p>
                  This platform is not intended for users under 18 years of age. We do not knowingly collect
                  data from children.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900">10. Contact</h2>
                <p>
                  For privacy-related questions or requests, please contact us through the platform. We aim to
                  respond within 30 days.
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
