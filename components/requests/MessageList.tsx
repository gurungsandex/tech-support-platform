'use client'

import Avatar from '@/components/ui/Avatar'
import type { Message } from '@/lib/types/database'

interface MessageWithSender extends Message {
  sender: {
    full_name: string
    role: string
  } | null
}

interface MessageListProps {
  messages: MessageWithSender[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
                  {formatTime(message.created_at)}
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
            </div>
          </div>
        )
      })}
    </div>
  )
}
