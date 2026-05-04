import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Shield, Bell, Globe, Database } from 'lucide-react'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { count: userCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true })

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Platform configuration and preferences.</p>
      </div>

      {/* Platform Info */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Platform Info</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { label: 'Platform Name', value: 'TechLink' },
            { label: 'Version', value: '2.0.0' },
            { label: 'Availability', value: 'Worldwide' },
            { label: 'Total Users', value: userCount?.toLocaleString() ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Settings */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Approval Settings</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { label: 'Technician Verification', value: 'Manual (Admin Approval)' },
            { label: 'Profile Visibility', value: 'Approved Only' },
            { label: 'Review Gating', value: 'Completed Jobs Only' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { label: 'New Technician Applications', enabled: true },
            { label: 'User Reports', enabled: true },
            { label: 'Low Rating Alerts (< 3 stars)', enabled: true },
          ].map(({ label, enabled }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-700">{label}</span>
              <span className={`inline-flex h-6 w-11 items-center rounded-full ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Database */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
          <Database className="h-4 w-4 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Database</h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-500 mb-3">Connected to Supabase. All data is stored with row-level security enabled.</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">Connected</span>
          </div>
        </div>
      </div>
    </div>
  )
}
