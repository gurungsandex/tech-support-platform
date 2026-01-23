'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Alert from '@/components/ui/Alert'
import { Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface MessageInputProps {
  requestId: string
}

export function MessageInput({ requestId }: MessageInputProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in to send messages')
        return
      }

      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          request_id: requestId,
          sender_id: user.id,
          content: content.trim()
        })

      if (insertError) {
        setError(insertError.message)
      } else {
        setContent('')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
      
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        rows={3}
        disabled={loading}
      />
      
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !content.trim()}>
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  )
}
