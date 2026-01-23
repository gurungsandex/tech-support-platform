import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Message } from '@/lib/types/database'

export interface MessageWithSender extends Message {
  sender: {
    full_name: string
    role: string
  } | null
}

export type MessageCallback = (message: MessageWithSender) => void

/**
 * Subscribe to new messages for a specific support request
 * @param requestId - The ID of the support request
 * @param callback - Function to call when a new message arrives
 * @returns RealtimeChannel subscription object
 */
export function subscribeToMessages(
  requestId: string,
  callback: MessageCallback
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase
    .channel(`messages:${requestId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `request_id=eq.${requestId}`,
      },
      async (payload) => {
        // Fetch the complete message with sender information
        const { data: message, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles(full_name, role)
          `)
          .eq('id', payload.new.id)
          .single()

        if (error) {
          console.error('Error fetching message:', error)
          return
        }

        callback(message as MessageWithSender)
      }
    )
    .subscribe()

  return channel
}

/**
 * Send a message to a support request
 * @param requestId - The ID of the support request
 * @param content - The message content
 * @returns Promise with the created message or error
 */
export async function sendMessage(
  requestId: string,
  content: string
): Promise<{ data?: Message; error?: string }> {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to send messages' }
  }

  // Validate content
  const trimmedContent = content.trim()
  if (!trimmedContent) {
    return { error: 'Message cannot be empty' }
  }

  if (trimmedContent.length > 2000) {
    return { error: 'Message cannot exceed 2000 characters' }
  }

  // Insert message
  const { data, error } = await supabase
    .from('messages')
    .insert({
      request_id: requestId,
      sender_id: user.id,
      content: trimmedContent,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

/**
 * Mark a message as read
 * @param messageId - The ID of the message to mark as read
 * @returns Promise with success status or error
 */
export async function markAsRead(
  messageId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Mark all messages in a request as read for the current user
 * @param requestId - The ID of the support request
 * @returns Promise with success status or error
 */
export async function markAllAsRead(
  requestId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  // Mark all messages as read that were sent by others
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('request_id', requestId)
    .neq('sender_id', user.id)
    .eq('is_read', false)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Unsubscribe from a messages channel
 * @param subscription - The RealtimeChannel to unsubscribe from
 */
export async function unsubscribeFromMessages(
  subscription: RealtimeChannel
): Promise<void> {
  await subscription.unsubscribe()
}

/**
 * Get online status of users in a request
 * @param requestId - The ID of the support request
 * @param userIds - Array of user IDs to track
 * @param callback - Function to call when presence changes
 * @returns RealtimeChannel subscription object
 */
export function subscribeToPresence(
  requestId: string,
  userIds: string[],
  callback: (onlineUsers: string[]) => void
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase.channel(`presence:${requestId}`, {
    config: {
      presence: {
        key: requestId,
      },
    },
  })

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const onlineUserIds = Object.values(state)
        .flat()
        .map((presence) => {
          // Supabase presence objects have a user_id property we set during tracking
          const presenceData = presence as Record<string, unknown>
          return typeof presenceData.user_id === 'string' ? presenceData.user_id : null
        })
        .filter((id): id is string => id !== null && userIds.includes(id))

      callback([...new Set(onlineUserIds)])
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() })
        }
      }
    })

  return channel
}
