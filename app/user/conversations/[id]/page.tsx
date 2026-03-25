'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  getConversation, getConversationMessages, sendConversationMessage, submitConversationReview
} from '@/lib/conversations/actions'
import {
  subscribeToConversationMessages, unsubscribeFromConversation,
  subscribeToConversationUpdates
} from '@/lib/conversations/realtime'
import type { ConversationWithDetails, ConversationMessage } from '@/lib/types/database'
import { Send, ArrowLeft, Star, Monitor, CheckCircle, AlertCircle } from 'lucide-react'

export default function UserConversationPage() {
  const params = useParams()
  const conversationId = params.id as string

  const [conversation, setConversation] = useState<ConversationWithDetails | null>(null)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadData = useCallback(async () => {
    const [convRes, msgRes] = await Promise.all([
      getConversation(conversationId),
      getConversationMessages(conversationId),
    ])
    if (convRes.error || !convRes.data) {
      setError(convRes.error || 'Not found')
      setLoading(false)
      return
    }
    setConversation(convRes.data)
    setMessages(msgRes.data ?? [])
    setLoading(false)
    setTimeout(scrollToBottom, 100)
  }, [conversationId])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!conversationId) return

    const msgSub = subscribeToConversationMessages(conversationId, (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
      setTimeout(scrollToBottom, 50)
    })

    const convSub = subscribeToConversationUpdates(conversationId, (updated) => {
      setConversation((prev) => prev ? { ...prev, ...updated } as ConversationWithDetails : prev)
    })

    return () => {
      unsubscribeFromConversation(msgSub)
      unsubscribeFromConversation(convSub as ReturnType<typeof subscribeToConversationMessages>)
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const { error: sendError } = await sendConversationMessage(conversationId, input)
    if (sendError) setError(sendError)
    else setInput('')
    setSending(false)
  }

  const handleSubmitReview = async () => {
    if (!reviewRating) return
    setReviewSubmitting(true)
    const result = await submitConversationReview(conversationId, reviewRating, reviewComment)
    setReviewSubmitting(false)
    if (result.error) setError(result.error)
    else {
      setReviewSubmitted(true)
      setShowReviewForm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error && !conversation) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">{error}</p>
        <Link href="/user/conversations" className="mt-4 inline-block text-blue-600 hover:underline">← Back to messages</Link>
      </div>
    )
  }

  const tech = conversation?.technician as { full_name: string; it_professional_profiles?: Array<{ profile_photo_url?: string; availability_status?: string; tagline?: string }> }
  const techProfile = tech?.it_professional_profiles?.[0]
  const isOnline = techProfile?.availability_status === 'online'
  const isCompleted = conversation?.status === 'completed'

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white p-4 rounded-t-xl">
        <Link href="/user/conversations" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {techProfile?.profile_photo_url
              ? <Image src={techProfile.profile_photo_url} alt="" width={40} height={40} className="h-full w-full object-cover" />
              : <Monitor className="h-5 w-5 text-gray-400" />}
          </div>
          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{tech?.full_name ?? 'Technician'}</div>
          <div className="text-xs text-gray-500">{isOnline ? '🟢 Online' : '⚫ Offline'}</div>
        </div>
        {conversation && (
          <Link href={`/technicians/${conversation.technician_id}`} className="text-xs text-blue-600 hover:underline">
            View Profile
          </Link>
        )}
        {isCompleted && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Job Done
          </span>
        )}
      </div>

      {/* Job completed + review prompt */}
      {isCompleted && !reviewSubmitted && (
        <div className="bg-green-50 border-b border-green-200 p-4">
          <p className="text-sm text-green-800 font-medium">
            🎉 The technician marked this job as complete!
          </p>
          {!showReviewForm ? (
            <button onClick={() => setShowReviewForm(true)}
              className="mt-2 text-sm text-green-700 underline hover:text-green-900">
              Leave a review
            </button>
          ) : (
            <div className="mt-3 space-y-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setReviewRating(star)}>
                    <Star className={`h-6 w-6 ${star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                placeholder="Tell others about your experience..." rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              <div className="flex gap-2">
                <button onClick={handleSubmitReview} disabled={!reviewRating || reviewSubmitting}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button onClick={() => setShowReviewForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {reviewSubmitted && (
        <div className="bg-green-50 border-b border-green-200 p-3">
          <p className="text-sm text-green-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Review submitted! Thank you.</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageIcon />
            <p className="mt-2 text-sm">Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === conversation?.user_id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
              }`}>
                {msg.content}
                <div className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!isCompleted ? (
        <div className="border-t border-gray-200 bg-white p-3 rounded-b-xl">
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Type a message..."
              maxLength={2000}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSend} disabled={!input.trim() || sending}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{input.length}/2000</p>
        </div>
      ) : (
        <div className="border-t border-gray-200 bg-gray-50 p-3 text-center text-sm text-gray-500 rounded-b-xl">
          This conversation is closed. The job has been completed.
        </div>
      )}
    </div>
  )
}

function MessageIcon() {
  return <div className="text-4xl mx-auto">💬</div>
}
