import { useToast } from '../../context/ToastContext'
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react'

const toastConfig = {
    success: {
        icon: CheckCircle,
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        bgIcon: 'bg-emerald-500/20',
    },
    error: {
        icon: XCircle,
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        bgIcon: 'bg-red-500/20',
    },
    warning: {
        icon: AlertCircle,
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        bgIcon: 'bg-amber-500/20',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        bgIcon: 'bg-blue-500/20',
    },
}

function Toast({ toast }) {
    const { removeToast } = useToast()
    const config = toastConfig[toast.type] || toastConfig.info
    const Icon = config.icon

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl 
                ${config.bg} border ${config.border}
                backdrop-blur-sm shadow-lg
                animate-slide-in
            `}
        >
            <div className={`w-8 h-8 rounded-lg ${config.bgIcon} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${config.text}`} />
            </div>
            <p className={`text-sm font-medium ${config.text} flex-1`}>
                {toast.message}
            </p>
            <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

export default function ToastContainer() {
    const { toasts } = useToast()

    return (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none space-y-2">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast toast={toast} />
                </div>
            ))}
        </div>
    )
}
