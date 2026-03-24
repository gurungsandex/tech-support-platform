'use server'

import { createClient } from '@/lib/supabase/server'
import type { Conversation, ConversationMessage, ConversationWithDetails } from '@/lib/types/database'

// Start or get an existing conversation between user and technician
export async function getOrCreateConversation(technicianId: string): Promise<{
  data: Conversation | null
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Please sign in to send messages' }
  if (user.id === technicianId) return { data: null, error: 'Cannot message yourself' }

  // Look for existing active conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .eq('technician_id', technicianId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) return { data: existing as Conversation }

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, technician_id: technicianId })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Conversation }
}

// Get all conversations for the current user
export async function getMyConversations(): Promise<{
  data: ConversationWithDetails[]
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isUser = profile?.role === 'end_user'

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      user:profiles!conversations_user_id_fkey(id, full_name, avatar_url, email),
      technician:profiles!conversations_technician_id_fkey(
        id, full_name, avatar_url, email,
        it_professional_profiles(profile_photo_url, availability_status, tagline)
      )
    `)
    .eq(isUser ? 'user_id' : 'technician_id', user.id)
    .neq('status', 'archived')
    .order('last_message_at', { ascending: false })

  if (error) return { data: [], error: error.message }

  // Get last message and unread count for each conversation
  const conversationsWithDetails = await Promise.all(
    ((data as ConversationWithDetails[]) ?? []).map(async (conv) => {
      const [lastMsgRes, unreadRes] = await Promise.all([
        supabase
          .from('conversation_messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('conversation_messages')
          .select('id', { count: 'exact' })
          .eq('conversation_id', conv.id)
          .eq('is_read', false)
          .neq('sender_id', user.id),
      ])

      return {
        ...conv,
        last_message: lastMsgRes.data as ConversationMessage ?? undefined,
        unread_count: unreadRes.count ?? 0,
      }
    })
  )

  return { data: conversationsWithDetails }
}

// Get a single conversation with messages
export async function getConversation(conversationId: string): Promise<{
  data: ConversationWithDetails | null
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      user:profiles!conversations_user_id_fkey(id, full_name, avatar_url, email, phone_number),
      technician:profiles!conversations_technician_id_fkey(
        id, full_name, avatar_url, email, phone_number,
        it_professional_profiles(profile_photo_url, availability_status, tagline, phone_number, phone_visibility, email_visibility)
      )
    `)
    .eq('id', conversationId)
    .single()

  if (error || !data) return { data: null, error: 'Conversation not found' }

  // Verify user is a participant
  const conv = data as ConversationWithDetails
  if (conv.user_id !== user.id && conv.technician_id !== user.id) {
    return { data: null, error: 'Access denied' }
  }

  return { data: conv }
}

// Get messages for a conversation
export async function getConversationMessages(conversationId: string): Promise<{
  data: ConversationMessage[]
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('conversation_messages')
    .select(`
      *,
      sender:profiles!conversation_messages_sender_id_fkey(full_name, avatar_url, role)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) return { data: [], error: error.message }

  // Mark messages from other party as read
  await supabase
    .from('conversation_messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .eq('is_read', false)
    .neq('sender_id', user.id)

  return { data: (data ?? []) as ConversationMessage[] }
}

// Send a message
export async function sendConversationMessage(conversationId: string, content: string): Promise<{
  data: ConversationMessage | null
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated' }

  const trimmed = content.trim()
  if (!trimmed) return { data: null, error: 'Message cannot be empty' }
  if (trimmed.length > 2000) return { data: null, error: 'Message too long (max 2000 characters)' }

  const { data, error } = await supabase
    .from('conversation_messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, content: trimmed })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as ConversationMessage }
}

// Mark job as completed (technician action)
export async function markJobComplete(conversationId: string): Promise<{
  success?: boolean
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify user is the technician for this conversation
  const { data: conv } = await supabase
    .from('conversations')
    .select('technician_id')
    .eq('id', conversationId)
    .single()

  if (!conv || conv.technician_id !== user.id) {
    return { error: 'Only the technician can mark a job as complete' }
  }

  const { error } = await supabase
    .from('conversations')
    .update({
      status: 'completed',
      job_completed_at: new Date().toISOString(),
      job_completed_by: user.id,
    })
    .eq('id', conversationId)

  if (error) return { error: error.message }
  return { success: true }
}

// Submit review for a conversation (user action, after job complete)
export async function submitConversationReview(
  conversationId: string,
  rating: number,
  comment: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  if (rating < 1 || rating > 5) return { error: 'Rating must be between 1 and 5' }

  // Verify conversation is completed and user is the end user
  const { data: conv } = await supabase
    .from('conversations')
    .select('user_id, technician_id, status')
    .eq('id', conversationId)
    .single()

  if (!conv) return { error: 'Conversation not found' }
  if (conv.user_id !== user.id) return { error: 'Only the user can submit a review' }
  if (conv.status !== 'completed') return { error: 'Job must be marked as complete before reviewing' }

  // Check if review already exists
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('conversation_id', conversationId)
    .single()

  if (existingReview) return { error: 'You have already reviewed this job' }

  const { error } = await supabase.from('reviews').insert({
    conversation_id: conversationId,
    professional_id: conv.technician_id,
    reviewer_id: user.id,
    rating,
    comment: comment.trim() || null,
  })

  if (error) return { error: error.message }
  return { success: true }
}
