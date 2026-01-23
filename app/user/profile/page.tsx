import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-4 pb-6 border-b">
            <Avatar 
              name={profile.full_name || profile.email} 
              size="lg"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.full_name || 'User'}
              </h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <ProfileForm profile={profile} />
          </div>
        </Card>
      </div>
    </div>
  )
}
