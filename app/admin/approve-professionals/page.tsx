import { getPendingProfessionals, approveProfessional, rejectProfessional } from '@/lib/admin/actions'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { redirect } from 'next/navigation'

export default async function ApproveProfessionalsPage() {
  const pros = await getPendingProfessionals()
  async function approve(fd: FormData) { 'use server'; await approveProfessional(fd.get('id') as string); redirect('/admin/approve-professionals') }
  async function reject(fd: FormData) { 'use server'; await rejectProfessional(fd.get('id') as string); redirect('/admin/approve-professionals') }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Approve Professionals</h1>
      {pros.length === 0 ? <Card><p className="text-center text-secondary-600">No pending professionals</p></Card> : 
        <div className="space-y-4">{pros.map((p: any) => (
          <Card key={p.id}><div className="space-y-4">
            <div className="flex justify-between"><div><h3 className="font-semibold">{p.profile?.full_name}</h3><p className="text-sm text-secondary-600">{p.profile?.email}</p></div><Badge variant="warning">{p.verification_status}</Badge></div>
            <div className="text-sm"><div><span className="font-medium">Specializations:</span> {p.specialization?.join(', ')}</div><div><span className="font-medium">Experience:</span> {p.years_of_experience} years</div></div>
            <div className="flex gap-2"><form action={approve}><input type="hidden" name="id" value={p.id} /><Button type="submit" size="sm">Approve</Button></form><form action={reject}><input type="hidden" name="id" value={p.id} /><Button type="submit" size="sm" variant="danger">Reject</Button></form></div>
          </div></Card>
        ))}</div>
      }
    </div>
  )
}
