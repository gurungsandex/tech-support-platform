'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { cancelRequest } from '@/lib/requests/actions'
import { XCircle } from 'lucide-react'

interface CancelRequestButtonProps {
  requestId: string
}

export function CancelRequestButton({ requestId }: CancelRequestButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleCancel = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await cancelRequest(requestId)

      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
        setShowConfirm(false)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!showConfirm) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowConfirm(true)}
      >
        <XCircle className="w-4 h-4 mr-2" />
        Cancel Request
      </Button>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      {error && (
        <Alert variant="error" className="mb-3">
          {error}
        </Alert>
      )}
      <p className="text-sm text-red-800 mb-3">
        Are you sure you want to cancel this request? This action cannot be undone.
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
          className="bg-red-600 text-white hover:bg-red-700 border-red-600"
        >
          {loading ? 'Cancelling...' : 'Yes, Cancel Request'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={loading}
        >
          Keep Request
        </Button>
      </div>
    </div>
  )
}
