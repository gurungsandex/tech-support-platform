import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Avatar from '@/components/ui/Avatar'
import { FileText, PlusCircle, User, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/flows'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
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

  const navItems = [
    { href: '/user/requests', label: 'Requests', icon: FileText },
    { href: '/user/requests/new', label: 'New Request', icon: PlusCircle },
    { href: '/user/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <h1 className="text-xl font-bold text-gray-900">User Dashboard</h1>
              </div>

              {/* User Profile Card */}
              <div className="px-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={profile.full_name || profile.email}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {profile.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Sign Out */}
              <div className="px-2 mt-4">
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-700 hover:text-red-900 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <nav className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center py-2 px-3 text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                <item.icon className="h-6 w-6 mb-1" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8 pb-20 md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
