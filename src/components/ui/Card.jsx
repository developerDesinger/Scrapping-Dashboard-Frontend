export default function Card({ children, className = '', hover = false, ...props }) {
    return (
        <div
            className={`
        glass rounded-2xl p-6
        ${hover ? 'hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    )
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className = '' }) {
    return <h3 className={`text-lg font-semibold text-surface-100 ${className}`}>{children}</h3>
}
