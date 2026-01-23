'use client'

import { Star } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function ReviewList({ reviews }: { reviews: any[] }) {
  return (
    <div className="space-y-4">
      {reviews.map((r: any) => (
        <Card key={r.id}>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-secondary-300'}`} />
            ))}
          </div>
          {r.comment && <p className="text-secondary-700">{r.comment}</p>}
          <p className="mt-2 text-xs text-secondary-500">{r.reviewer?.full_name}</p>
        </Card>
      ))}
    </div>
  )
}
