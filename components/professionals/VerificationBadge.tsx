'use client'

import Badge from '@/components/ui/Badge'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import type { VerificationStatus } from '@/lib/types/database'

interface VerificationBadgeProps {
  status: VerificationStatus
  showIcon?: boolean
}

export function VerificationBadge({ status, showIcon = true }: VerificationBadgeProps) {
  const config = {
    pending: {
      variant: 'warning' as const,
      label: 'Pending Verification',
      icon: Clock
    },
    approved: {
      variant: 'success' as const,
      label: 'Verified',
      icon: CheckCircle
    },
    rejected: {
      variant: 'danger' as const,
      label: 'Verification Rejected',
      icon: XCircle
    }
  }

  const { variant, label, icon: Icon } = config[status]

  return (
    <Badge variant={variant}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </Badge>
  )
}
