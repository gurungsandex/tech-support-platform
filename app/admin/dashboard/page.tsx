import { getPlatformStats } from '@/lib/admin/actions'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, UserCheck, MessageSquare, Star } from 'lucide-react'

export default async function AdminDashboard() {
  const stats = await getPlatformStats()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Overview</h1>
      <div className="grid gap-6 md:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm">Total Users</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between"><div className="text-3xl font-bold">{stats.totalUsers}</div><Users className="h-8 w-8 text-primary-600" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">IT Professionals</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between"><div className="text-3xl font-bold">{stats.totalProfessionals}</div><UserCheck className="h-8 w-8 text-primary-600" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Requests</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between"><div className="text-3xl font-bold">{stats.totalRequests}</div><MessageSquare className="h-8 w-8 text-primary-600" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Avg Rating</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between"><div className="text-3xl font-bold">{stats.averageRating}</div><Star className="h-8 w-8 text-yellow-400 fill-yellow-400" /></div></CardContent></Card>
      </div>
    </div>
  )
}
