import { getAllReports } from '@/lib/admin/actions'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default async function ReportsPage() {
  const reports = await getAllReports()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      {reports.length === 0 ? <Card><p className="text-center text-secondary-600">No reports</p></Card> :
        <div className="space-y-4">{reports.map((r: any) => (
          <Card key={r.id}><div className="space-y-3">
            <div className="flex justify-between"><h3 className="font-semibold">Report #{r.id.slice(0, 8)}</h3><Badge>{r.status}</Badge></div>
            <div className="text-sm"><p><span className="font-medium">Reporter:</span> {r.reporter?.full_name}</p><p><span className="font-medium">Reported:</span> {r.reported_user?.full_name}</p><p><span className="font-medium">Reason:</span> {r.reason}</p></div>
          </div></Card>
        ))}</div>
      }
    </div>
  )
}
