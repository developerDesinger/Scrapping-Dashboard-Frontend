const badgeVariants = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/15 text-red-400 border-red-500/20',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    neutral: 'bg-surface-500/15 text-surface-400 border-surface-500/20',
    brand: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeVariants[variant]} ${className}`}
        >
            {children}
        </span>
    )
}
