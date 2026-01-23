'use client'

import { useEffect, useRef, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import Alert from '@/components/ui/Alert'
import { formatRelativeTime } from '@/lib/utils'
import { subscribeToMessages, unsubscribeFromMessages, markAllAsRead, type MessageWithSender } from '@/lib/chat/realtime'
import { Check, CheckCheck } from 'lucide-react'

interface MessageListProps {
  messages: MessageWithSender[]
  currentUserId: string
  requestId: string
  enableRealtime?: boolean
}

export function MessageList({ 
  messages: initialMessages, 
  currentUserId, 
  requestId,
  enableRealtime = true 
}: MessageListProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const previousMessageCountRef = useRef(initialMessages.length)

  // Auto-scroll to latest message
  const scrollToBottom = (smooth = false) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto' 
    })
  }

  // Update messages when initialMessages prop changes
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!enableRealtime) return

    setIsLoading(true)
    let subscription: any = null

    const setupSubscription = async () => {
      try {
        subscription = subscribeToMessages(requestId, (newMessage) => {
          setMessages((prev) => {
            // Prevent duplicates
            if (prev.some((msg) => msg.id === newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })
          
          // Auto-scroll to new message
          setTimeout(() => scrollToBottom(true), 100)
        })

        // Mark messages as read when viewing
        await markAllAsRead(requestId)
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error setting up real-time subscription:', err)
        setError('Failed to connect to real-time updates')
        setIsLoading(false)
      }
    }

    setupSubscription()

    return () => {
      if (subscription) {
        unsubscribeFromMessages(subscription)
      }
    }
  }, [requestId, enableRealtime])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > previousMessageCountRef.current) {
      scrollToBottom(true)
    }
    previousMessageCountRef.current = messages.length
  }, [messages.length])

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom(false)
  }, [])

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
      
      <div className="space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto pr-2">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === currentUserId
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar
                name={message.sender?.full_name || 'User'}
              />
              <div className={`flex-1 max-w-xl ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {message.sender?.full_name || 'User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(message.created_at)}
                  </span>
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {isOwnMessage && (
                  <div className="flex items-center gap-1 mt-1">
                    {message.is_read ? (
                      <CheckCheck className="w-3 h-3 text-blue-600" />
                    ) : (
                      <Check className="w-3 h-3 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">
                      {message.is_read ? 'Read' : 'Sent'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <Spinner size="sm" />
          <span className="ml-2 text-sm text-gray-500">Connecting...</span>
        </div>
      )}
    </div>
  )
}
