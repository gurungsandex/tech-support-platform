'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UserCheck, Flag, Users, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/flows'
import Button from '@/components/ui/Button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const nav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Approve Professionals', href: '/admin/approve-professionals', icon: UserCheck },
    { name: 'Reports', href: '/admin/reports', icon: Flag },
    { name: 'Users', href: '/admin/users', icon: Users },
  ]

  return (
    <div className="flex h-screen bg-secondary-50">
      <aside className="hidden w-64 border-r bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-4"><Link href="/"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600"><span className="text-lg font-bold text-white">TS</span></div></Link></div>
          <nav className="flex-1 space-y-1 p-4">{nav.map((item) => <Link key={item.name} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${pathname === item.href ? 'bg-primary-50 text-primary-600' : 'text-secondary-700'}`}><item.icon className="h-5 w-5" />{item.name}</Link>)}</nav>
          <div className="border-t p-4"><Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}><LogOut className="mr-3 h-5 w-5" />Sign Out</Button></div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto"><div className="mx-auto max-w-7xl p-6">{children}</div></main>
    </div>
  )
}
