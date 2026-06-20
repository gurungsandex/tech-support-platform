'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getConversation, getConversationMessages, sendConversationMessage, markJobComplete
} from '@/lib/conversations/actions'
import {
  subscribeToConversationMessages, unsubscribeFromConversation,
  subscribeToConversationUpdates
} from '@/lib/conversations/realtime'
import type { ConversationWithDetails, ConversationMessage } from '@/lib/types/database'
import { Send, ArrowLeft, CheckCircle, AlertCircle, CheckCheck } from 'lucide-react'

export default function TechnicianConversationPage() {
  const params = useParams()
  const conversationId = params.id as string

  const [conversation, setConversation] = useState<ConversationWithDetails | null>(null)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [markingComplete, setMarkingComplete] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

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
      setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
      setTimeout(scrollToBottom, 50)
    })
    const convSub = subscribeToConversationUpdates(conversationId, (updated) => {
      setConversation(prev => prev ? { ...prev, ...updated } as ConversationWithDetails : prev)
    })
    return () => {
      unsubscribeFromConversation(msgSub)
      unsubscribeFromConversation(convSub as ReturnType<typeof subscribeToConversationMessages>)
    }
  }, [conversationId])

  useEffect(() => { scrollToBottom() }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const { data, error: sendError } = await sendConversationMessage(conversationId, input)
    if (sendError) {
      setError(sendError)
    } else {
      setInput('')
      if (data) {
        setMessages((prev) => (prev.find((m) => m.id === data.id) ? prev : [...prev, data]))
      }
    }
    setSending(false)
  }

  const handleMarkComplete = async () => {
    setMarkingComplete(true)
    const result = await markJobComplete(conversationId)
    setMarkingComplete(false)
    if (result.error) setError(result.error)
    else {
      setShowConfirm(false)
      setConversation(prev => prev ? { ...prev, status: 'completed' } as ConversationWithDetails : prev)
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  }

  if (error && !conversation) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-600">{error}</p>
        <Link href="/professional/conversations" className="mt-4 inline-block text-blue-600 hover:underline">← Back</Link>
      </div>
    )
  }

  const customer = conversation?.user as { full_name: string }
  const isCompleted = conversation?.status === 'completed'

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white p-4 rounded-t-xl">
        <Link href="/professional/conversations" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
          {customer?.full_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{customer?.full_name ?? 'Customer'}</div>
          <div className="text-xs text-gray-500">Customer</div>
        </div>

        {!isCompleted && (
          <button onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors">
            <CheckCheck className="h-3.5 w-3.5" /> Mark Job Done
          </button>
        )}
        {isCompleted && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed
          </span>
        )}
      </div>

      {/* Confirm complete modal */}
      {showConfirm && (
        <div className="bg-green-50 border-b border-green-200 p-4">
          <p className="text-sm text-green-800 font-medium mb-2">
            Mark this job as complete? The customer will be prompted to leave a review.
          </p>
          <div className="flex gap-2">
            <button onClick={handleMarkComplete} disabled={markingComplete}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
              {markingComplete ? 'Marking...' : 'Yes, Mark Complete'}
            </button>
            <button onClick={() => setShowConfirm(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No messages yet</div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === conversation?.technician_id
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
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Type a message..." maxLength={2000}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleSend} disabled={!input.trim() || sending}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{input.length}/2000</p>
        </div>
      ) : (
        <div className="border-t border-gray-200 bg-gray-50 p-3 text-center text-sm text-gray-500 rounded-b-xl">
          Job completed. The customer may leave a review.
        </div>
      )}
    </div>
  )
}
