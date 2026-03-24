import Link from 'next/link'
import { MapPin, Star, Wifi, Home, Monitor, CheckCircle } from 'lucide-react'
import type { TechnicianSearchResult } from '@/lib/types/database'
import Badge from '@/components/ui/Badge'

interface Props {
  technician: TechnicianSearchResult
}

export default function TechnicianCard({ technician }: Props) {
  const isOnline = technician.availability_status === 'online'

  return (
    <Link
      href={`/technicians/${technician.user_id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {technician.profile_photo_url ? (
              <img
                src={technician.profile_photo_url}
                alt={technician.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Monitor className="h-7 w-7 text-gray-400" />
            )}
          </div>
          {/* Online indicator */}
          <span
            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{technician.full_name}</h3>
              {technician.tagline && (
                <p className="text-sm text-gray-500 truncate mt-0.5">{technician.tagline}</p>
              )}
            </div>
            <span
              className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Location */}
          {(technician.city || technician.state) && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span>
                {[technician.city, technician.state].filter(Boolean).join(', ')}
                {technician.distance_miles !== null && technician.distance_miles !== undefined && (
                  <span className="ml-1 text-blue-600 font-medium">
                    · {technician.distance_miles.toFixed(1)} mi away
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            {technician.average_rating > 0 ? (
              <>
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium text-gray-700">
                  {technician.average_rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">({technician.total_reviews} reviews)</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">No reviews yet</span>
            )}
            {technician.completed_requests > 0 && (
              <span className="ml-2 text-xs text-gray-400">
                · {technician.completed_requests} jobs done
              </span>
            )}
          </div>

          {/* Support type badges */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(technician.support_type === 'remote' || technician.support_type === 'both') && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                <Wifi className="h-3 w-3" /> Remote
              </span>
            )}
            {(technician.support_type === 'onsite' || technician.support_type === 'both') && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                <Home className="h-3 w-3" /> On-site {technician.service_radius_miles ? `(${technician.service_radius_miles}mi)` : ''}
              </span>
            )}
            {technician.verification_status === 'approved' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                <CheckCircle className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
