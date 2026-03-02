import { Inbox } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
    icon: Icon = Inbox,
    title = 'No data found',
    description = 'There is nothing to display at the moment.',
    actionLabel,
    onAction,
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl glass-light flex items-center justify-center mb-4">
                <Icon className="h-8 w-8 text-surface-500" />
            </div>
            <h3 className="text-lg font-semibold text-surface-300 mb-1">{title}</h3>
            <p className="text-sm text-surface-500 text-center max-w-sm mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>{actionLabel}</Button>
            )}
        </div>
    )
}
