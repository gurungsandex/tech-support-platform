import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, CheckCircle, MessageSquare } from 'lucide-react'
import type { TechnicianSearchResult } from '@/lib/types/database'

interface Props {
  technician: TechnicianSearchResult
}

export default function TechnicianCard({ technician }: Props) {
  const isOnline = technician.availability_status === 'online'

  const tags: string[] = []
  if (technician.support_type === 'remote' || technician.support_type === 'both') tags.push('Remote')
  if (technician.support_type === 'onsite' || technician.support_type === 'both') tags.push('On-site')
  if (technician.verification_status === 'approved') tags.push('Verified')

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-100">
            {technician.profile_photo_url ? (
              <Image
                src={technician.profile_photo_url}
                alt={technician.full_name}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {technician.full_name?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          <span
            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-semibold text-gray-900 truncate">{technician.full_name}</h3>
            {technician.verification_status === 'approved' && (
              <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )}
          </div>
          {technician.tagline && (
            <p className="text-sm text-gray-500 truncate">{technician.tagline}</p>
          )}

          {/* Rating + distance */}
          <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
            {technician.average_rating > 0 ? (
              <>
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-gray-700">{technician.average_rating.toFixed(1)}</span>
                <span>({technician.total_reviews})</span>
              </>
            ) : (
              <span className="text-gray-400">No reviews yet</span>
            )}
            {technician.distance_miles !== null && technician.distance_miles !== undefined && (
              <>
                <span className="text-gray-300">·</span>
                <MapPin className="h-3 w-3" />
                <span>{technician.distance_miles.toFixed(1)} km away</span>
              </>
            )}
            {(technician.city || technician.state) && !technician.distance_miles && (
              <>
                <span className="text-gray-300">·</span>
                <MapPin className="h-3 w-3" />
                <span>{[technician.city, technician.state].filter(Boolean).join(', ')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Link href={`/user/conversations?tech=${technician.user_id}`} className="flex-1">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            <MessageSquare className="h-4 w-4" />
            Message
          </button>
        </Link>
        <Link href={`/technicians/${technician.user_id}`} className="flex-1">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  )
}
