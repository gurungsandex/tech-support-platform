import Link from 'next/link'
import { getPlatformStats, getPendingProfessionals, getAllReports } from '@/lib/admin/actions'
import { redirect } from 'next/navigation'
import { Users, UserCheck, Clock, AlertTriangle, Check, X } from 'lucide-react'

export default async function AdminDashboard() {
  const stats = await getPlatformStats()
  const pendingPros = await getPendingProfessionals()
  const reports = await getAllReports()

  const recentReports = reports.slice(0, 3)

  async function approve(fd: FormData) {
    'use server'
    const { approveProfessional } = await import('@/lib/admin/actions')
    await approveProfessional(fd.get('id') as string)
    redirect('/admin/dashboard')
  }
  async function reject(fd: FormData) {
    'use server'
    const { rejectProfessional } = await import('@/lib/admin/actions')
    await rejectProfessional(fd.get('id') as string)
    redirect('/admin/dashboard')
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Verified Technicians', value: stats.totalProfessionals.toLocaleString(), icon: UserCheck, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Pending Approvals', value: pendingPros.length, icon: Clock, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
    { label: 'Active Reports', value: recentReports.filter((r: any) => r.status === 'open').length || reports.length, icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">{today}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Main content: approvals + reports */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending Approvals */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">Pending Technician Approvals</h2>
              {pendingPros.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                  {pendingPros.length}
                </span>
              )}
            </div>
            <Link href="/admin/approve-professionals" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          {pendingPros.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">No pending approvals</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_80px_100px] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <span>Applicant</span>
                <span>Specialty</span>
                <span>Location</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {pendingPros.slice(0, 5).map((p: any) => (
                <div key={p.id} className="grid grid-cols-[1fr_1fr_1fr_80px_100px] gap-4 items-center px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.profile?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">
                      Submitted {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 truncate">{p.specialization?.join(', ') || '—'}</span>
                  <span className="text-sm text-gray-600">{[p.city, p.state].filter(Boolean).join(', ') || 'Remote'}</span>
                  <span className="inline-flex h-6 items-center justify-center rounded-full bg-orange-100 px-2.5 text-xs font-medium text-orange-700">
                    Pending
                  </span>
                  <div className="flex items-center gap-1.5">
                    <form action={approve}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="flex h-7 w-7 items-center justify-center rounded-md border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </form>
                    <form action={reject}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Reports</h2>
          </div>
          {recentReports.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">No reports</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentReports.map((r: any) => (
                <div key={r.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-xs font-semibold ${r.type === 'user_report' ? 'text-orange-600' : 'text-purple-600'}`}>
                      {r.type === 'user_report' ? 'User Report' : 'Review Flag'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{r.reason || 'No reason provided'}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    {r.reporter ? `Reported by ${r.reporter.full_name}` : `Reported by User`}
                  </p>
                  <Link href="/admin/reports">
                    <button className="w-full rounded-lg bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                      Resolve
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
