import Image from 'next/image'
import { cn, getInitials } from '@/lib/utils'

export interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={48}
        height={48}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary-600 font-medium text-white',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
