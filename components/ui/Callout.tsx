import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutProps {
  type: 'info' | 'warning' | 'success' | 'error'
  title?: string
  content: string
  className?: string
}

const calloutStyles = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: Info,
    iconColor: 'text-blue-600',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-900',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-900',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
}

export function Callout({ type, title, content, className }: CalloutProps) {
  const style = calloutStyles[type]
  const Icon = style.icon

  return (
    <div
      className={cn(
        'border rounded-mb-lg p-4 my-6',
        style.container,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', style.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm leading-relaxed">{content}</div>
        </div>
      </div>
    </div>
  )
}
