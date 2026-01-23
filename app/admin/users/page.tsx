import { getAllUsers } from '@/lib/admin/actions'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default async function UsersPage() {
  const users = await getAllUsers()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Users</h1>
      <div className="space-y-4">{users.map((u: any) => (
        <Card key={u.id}><div className="flex justify-between"><div><h3 className="font-semibold">{u.full_name}</h3><p className="text-sm text-secondary-600">{u.email}</p></div><Badge>{u.role.replace('_', ' ')}</Badge></div></Card>
      ))}</div>
    </div>
  )
}
