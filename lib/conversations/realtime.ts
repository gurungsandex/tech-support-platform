'use client'

import { createClient } from '@/lib/supabase/client'
import type { ConversationMessage } from '@/lib/types/database'

export function subscribeToConversationMessages(
  conversationId: string,
  onMessage: (message: ConversationMessage) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'conversation_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as ConversationMessage)
      }
    )
    .subscribe()

  return subscription
}

export function unsubscribeFromConversation(subscription: ReturnType<typeof subscribeToConversationMessages>) {
  const supabase = createClient()
  supabase.removeChannel(subscription)
}

export function subscribeToConversationUpdates(
  conversationId: string,
  onUpdate: (conversation: Record<string, unknown>) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`conversation_status:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `id=eq.${conversationId}`,
      },
      (payload) => {
        onUpdate(payload.new as Record<string, unknown>)
      }
    )
    .subscribe()

  return subscription
}
