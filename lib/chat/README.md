# Real-time Chat System

This directory contains the real-time messaging functionality for the tech support platform using Supabase Realtime.

## Features

- **Real-time message delivery**: Messages appear instantly without page refresh
- **Read receipts**: Visual indicators showing message status (sent/read)
- **Online presence**: Shows when the other party is online/offline
- **Character limit**: Messages limited to 2000 characters with live counter
- **Keyboard shortcuts**: 
  - `Enter` to send message
  - `Shift+Enter` for new line
- **Auto-scroll**: Automatically scrolls to latest messages
- **Connection status**: Visual feedback for connection state

## Files

- `realtime.ts`: Core real-time functionality
  - `subscribeToMessages()`: Subscribe to new messages
  - `sendMessage()`: Send a message
  - `markAsRead()`: Mark message as read
  - `markAllAsRead()`: Mark all messages in a request as read
  - `subscribeToPresence()`: Track online/offline status
  - `unsubscribeFromMessages()`: Clean up subscriptions

## Usage

### Basic Chat (with ChatBox component)

```tsx
import { ChatBox } from '@/components/chat/ChatBox'

<ChatBox
  requestId={request.id}
  messages={request.messages || []}
  currentUserId={user.id}
  otherUserId={otherUser.id}
  otherUserName={otherUser.name}
  showHeader={true}
  isReadOnly={false}
/>
```

### Custom Implementation

```tsx
import { subscribeToMessages, sendMessage, unsubscribeFromMessages } from '@/lib/chat/realtime'

// Subscribe to messages
useEffect(() => {
  const channel = subscribeToMessages(requestId, (newMessage) => {
    setMessages(prev => [...prev, newMessage])
  })

  return () => {
    unsubscribeFromMessages(channel)
  }
}, [requestId])

// Send a message
const handleSend = async () => {
  const result = await sendMessage(requestId, content)
  if (result.error) {
    console.error(result.error)
  }
}
```

## Database Requirements

The system requires Supabase Realtime to be enabled for the `messages` table. The subscription listens for INSERT events on the messages table filtered by `request_id`.

## Connection States

- **connecting**: Initial state while establishing connection
- **connected**: Successfully connected to Realtime
- **disconnected**: Connection lost or failed

## Best Practices

1. Always clean up subscriptions in `useEffect` cleanup functions
2. Handle connection errors gracefully
3. Show visual feedback for all states (loading, sending, error)
4. Validate message content before sending
5. Use presence channels to show online/offline status
