'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { deleteAccount } from '@/lib/auth/flows'
import Alert from '@/components/ui/Alert'

export function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setError('')
    setIsDeleting(true)
    const result = await deleteAccount()
    if (result?.error) {
      setError(result.error)
      setIsDeleting(false)
    }
    // On success, deleteAccount() redirects — no further state update needed.
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <h2 className="font-semibold text-red-900">Danger Zone</h2>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {!confirming ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-700">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex-shrink-0 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-red-700">
            This will permanently delete your profile, conversations, and other data tied to your account.
            Type <strong>DELETE</strong> below to confirm.
          </p>
          <label htmlFor="delete-confirm" className="sr-only">
            Type DELETE to confirm account deletion
          </label>
          <input
            id="delete-confirm"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full max-w-xs rounded-lg border border-red-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || isDeleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? 'Deleting…' : 'Permanently Delete My Account'}
            </button>
            <button
              type="button"
              onClick={() => { setConfirming(false); setConfirmText('') }}
              disabled={isDeleting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
