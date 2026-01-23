'use client'

import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { VerificationBadge } from './VerificationBadge'
import { Star, Award, Briefcase } from 'lucide-react'
import type { ITProfessionalProfile } from '@/lib/types/database'

interface ProfileCardProps {
  profile: ITProfessionalProfile & {
    profile?: {
      full_name: string
      email: string
    }
  }
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar
            name={profile.profile?.full_name || 'Professional'}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <CardTitle>{profile.profile?.full_name || 'Professional'}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{profile.profile?.email}</p>
            <div className="mt-2">
              <VerificationBadge status={profile.verification_status} />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {profile.bio && (
          <p className="text-sm text-gray-700 mb-4">{profile.bio}</p>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{profile.years_of_experience} years of experience</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700">
              {profile.average_rating > 0 ? profile.average_rating.toFixed(1) : 'No ratings yet'}
              {profile.total_reviews > 0 && ` (${profile.total_reviews} reviews)`}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{profile.completed_requests} requests completed</span>
          </div>
        </div>

        {profile.specialization && profile.specialization.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Specializations</p>
            <div className="flex flex-wrap gap-2">
              {profile.specialization.map((spec) => (
                <Badge key={spec} variant="default">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {profile.certifications && profile.certifications.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Certifications</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {profile.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
