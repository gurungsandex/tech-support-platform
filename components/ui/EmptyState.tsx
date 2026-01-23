import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && <div className="mb-4 text-secondary-400">{icon}</div>}
      <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-secondary-600">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
