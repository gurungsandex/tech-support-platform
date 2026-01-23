'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import { Star } from 'lucide-react'
import { submitReview } from '@/lib/reviews/actions'

export default function ReviewForm({ requestId, onSuccess }: { requestId: string; onSuccess?: () => void }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await submitReview(requestId, rating, comment)
      onSuccess?.()
    } catch (err) {
      alert('Failed to submit review')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button" onClick={() => setRating(s)}>
              <Star className={`h-8 w-8 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-secondary-300'}`} />
            </button>
          ))}
        </div>
      </div>
      <Textarea label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button type="submit" isLoading={isLoading}>Submit Review</Button>
    </form>
  )
}
