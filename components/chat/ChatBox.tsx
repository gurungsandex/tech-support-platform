'use client'

import { useEffect, useState } from 'react'
import { MessageList } from '@/components/requests/MessageList'
import { MessageInput } from '@/components/requests/MessageInput'
import { subscribeToPresence, unsubscribeFromMessages, type MessageWithSender } from '@/lib/chat/realtime'
import { MessageSquare, Wifi, WifiOff, User } from 'lucide-react'
import Badge from '@/components/ui/Badge'

interface ChatBoxProps {
  requestId: string
  messages: MessageWithSender[]
  currentUserId: string
  otherUserId?: string
  otherUserName?: string
  status?: 'connected' | 'disconnected' | 'connecting'
  showHeader?: boolean
  isReadOnly?: boolean
}

export function ChatBox({ 
  requestId, 
  messages, 
  currentUserId,
  otherUserId,
  otherUserName,
  status: initialStatus = 'connecting',
  showHeader = true,
  isReadOnly = false
}: ChatBoxProps) {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>(initialStatus)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const isOtherUserOnline = otherUserId ? onlineUsers.includes(otherUserId) : false

  // Subscribe to presence for online status
  useEffect(() => {
    if (!otherUserId) return

    let presenceChannel: any = null

    const setupPresence = async () => {
      try {
        presenceChannel = subscribeToPresence(
          requestId,
          [currentUserId, otherUserId],
          (users) => {
            setOnlineUsers(users)
            setConnectionStatus('connected')
          }
        )
      } catch (err) {
        console.error('Error setting up presence:', err)
        setConnectionStatus('disconnected')
      }
    }

    setupPresence()

    return () => {
      if (presenceChannel) {
        unsubscribeFromMessages(presenceChannel)
      }
    }
  }, [requestId, currentUserId, otherUserId])

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-600" />
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-600" />
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-600 animate-pulse" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected'
      case 'disconnected':
        return 'Disconnected'
      case 'connecting':
        return 'Connecting...'
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {showHeader && (
        <div className="border-b border-gray-200 pb-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Other user status */}
              {otherUserId && otherUserName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{otherUserName}</span>
                  <Badge variant={isOtherUserOnline ? 'success' : 'default'}>
                    {isOtherUserOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              )}
              
              {/* Connection status */}
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                {getStatusIcon()}
                <span className="hidden sm:inline">{getStatusText()}</span>
              </div>
            </div>
          </div>
          
          {/* Typing indicator */}
          {isTyping && otherUserName && (
            <div className="mt-2 text-sm text-gray-500 italic">
              {otherUserName} is typing...
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          currentUserId={currentUserId}
          requestId={requestId}
          enableRealtime={true}
        />
      </div>

      {/* Input */}
      {!isReadOnly && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <MessageInput requestId={requestId} />
        </div>
      )}
    </div>
  )
}
