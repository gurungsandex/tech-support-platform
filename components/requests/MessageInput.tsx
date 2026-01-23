'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Alert from '@/components/ui/Alert'
import { Send } from 'lucide-react'
import { sendMessage } from '@/lib/chat/realtime'
import { MAX_MESSAGE_LENGTH, MESSAGE_WARNING_THRESHOLD } from '@/lib/chat/constants'

interface MessageInputProps {
  requestId: string
  onMessageSent?: () => void
}

export function MessageInput({ requestId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!content.trim() || loading) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await sendMessage(requestId, content)

      if (result.error) {
        setError(result.error)
      } else {
        setContent('')
        onMessageSent?.()
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const remainingChars = MAX_MESSAGE_LENGTH - content.length
  const isOverLimit = remainingChars < 0

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          rows={3}
          disabled={loading}
          className={isOverLimit ? 'border-red-500' : ''}
        />
        <div className={`absolute bottom-2 right-2 text-xs ${
          isOverLimit ? 'text-red-600' : 
          remainingChars < MESSAGE_WARNING_THRESHOLD ? 'text-orange-600' : 
          'text-gray-400'
        }`}>
          {remainingChars} / {MAX_MESSAGE_LENGTH}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> to send, 
          <kbd className="ml-1 px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Shift+Enter</kbd> for new line
        </p>
        <Button 
          type="submit" 
          disabled={loading || !content.trim() || isOverLimit}
          isLoading={loading}
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  )
}
