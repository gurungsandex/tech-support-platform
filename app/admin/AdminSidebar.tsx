'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UserCheck, Flag, Users, LogOut, Star, Settings } from 'lucide-react'
import { signOut } from '@/lib/auth/flows'

const nav = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Approvals', href: '/admin/approve-professionals', icon: UserCheck, badge: 8 },
  { name: 'Reports', href: '/admin/reports', icon: Flag, badge: 2 },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 border-r border-gray-200 bg-white md:flex md:flex-col">
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
        <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
          Admin Portal
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 pt-2">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} style={{ width: '1.125rem', height: '1.125rem' }} />
                {item.name}
              </div>
              {item.badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {/* Bottom user area */}
      <div className="border-t border-gray-100 px-3 py-3">
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
    </aside>
  )
}
