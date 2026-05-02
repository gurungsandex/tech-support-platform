import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { VerificationBadge } from '@/components/professionals/VerificationBadge'
import { LayoutDashboard, User, LogOut, MessageSquare, Briefcase, Star, Wrench } from 'lucide-react'
import { signOut } from '@/lib/auth/flows'
import { getProfessionalStats } from '@/lib/professionals/actions'

export default async function ProfessionalLayout({
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

  if (!profile || profile.role !== 'it_professional') {
    redirect('/login')
  }

  const { data: professionalProfile } = await supabase
    .from('it_professional_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const statsResult = await getProfessionalStats()
  const stats = statsResult.data

  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'T'

  const navItems = [
    { href: '/professional/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/professional/profile', label: 'My Profile', icon: User },
    { href: '/professional/services', label: 'Services', icon: Wrench },
    { href: '/professional/conversations', label: 'Messages', icon: MessageSquare, badge: stats?.active_requests },
    { href: '/professional/my-requests', label: 'Jobs', icon: Briefcase },
    { href: '/professional/reviews', label: 'Reviews', icon: Star },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-56 flex-shrink-0 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-100 px-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-base font-bold text-gray-900">TechLink</span>
          </Link>
        </div>

        {/* Portal label */}
        <div className="px-5 pt-4 pb-2">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            Technician Portal
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 pt-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" style={{ width: '1.125rem', height: '1.125rem' }} />
                {item.label}
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="px-3 pb-3">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>

        {/* Bottom user strip */}
        <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {initials}
            </div>
            {professionalProfile?.availability_status === 'online' && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{profile.full_name || 'Technician'}</p>
            <p className="truncate text-xs text-gray-400">IT Technician</p>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <nav className="flex justify-around py-1">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-2 px-3 text-xs font-medium text-gray-600 hover:text-blue-600 relative"
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.label}
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8 pb-20 md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
