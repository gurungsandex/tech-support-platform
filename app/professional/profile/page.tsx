import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ProfileCard } from '@/components/professionals/ProfileCard'
import { ProfileForm } from '@/components/professionals/ProfileForm'
import { StatsCard } from '@/components/professionals/StatsCard'
import { getProfessionalProfile, getProfessionalStats } from '@/lib/professionals/actions'
import { CheckCircle, Clock, Star, Briefcase } from 'lucide-react'
import Alert from '@/components/ui/Alert'

export default async function ProfessionalProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profileResult = await getProfessionalProfile()
  const statsResult = await getProfessionalStats()

  if (profileResult.error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="error">{profileResult.error}</Alert>
      </div>
    )
  }

  const profile = profileResult.data
  const stats = statsResult.data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Professional Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your professional information and track your performance
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Verification Status"
            value={stats.verification_status === 'approved' ? 'Verified' : 'Pending'}
            icon={stats.verification_status === 'approved' ? CheckCircle : Clock}
          />
          <StatsCard
            title="Active Requests"
            value={stats.active_requests}
            icon={Briefcase}
          />
          <StatsCard
            title="Completed"
            value={stats.completed_requests}
            icon={CheckCircle}
          />
          <StatsCard
            title="Average Rating"
            value={stats.average_rating > 0 ? stats.average_rating.toFixed(1) : 'N/A'}
            icon={Star}
            description={stats.total_reviews > 0 ? `${stats.total_reviews} reviews` : 'No reviews yet'}
          />
        </div>
      )}

      {/* Profile Display */}
      <ProfileCard profile={profile} />

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      {/* Verification Info */}
      {profile.verification_status === 'pending' && (
        <Alert variant="warning">
          Your profile is pending verification. You&apos;ll be able to accept requests once an admin approves your account.
        </Alert>
      )}
      {profile.verification_status === 'rejected' && (
        <Alert variant="error">
          Your verification was rejected. Please contact support for more information.
        </Alert>
      )}
    </div>
  )
}
