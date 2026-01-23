import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRequestById } from '@/lib/professionals/actions'
import { RequestDetailsContent } from './RequestDetailsContent'
import Alert from '@/components/ui/Alert'

export default async function RequestDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const result = await getRequestById(params.id)

  if (result.error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="error">{result.error}</Alert>
      </div>
    )
  }

  return <RequestDetailsContent request={result.data} currentUserId={user.id} />
}
