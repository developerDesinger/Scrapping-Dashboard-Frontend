import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({
    label,
    type = 'text',
    icon: Icon,
    error,
    className = '',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-surface-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon className="h-4 w-4 text-surface-500" />
                    </div>
                )}
                <input
                    type={inputType}
                    className={`
            w-full rounded-xl bg-surface-800/50 border text-surface-100 placeholder-surface-500
            focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500
            transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 text-sm
            ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-surface-700'}
          `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-500 hover:text-surface-300 transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">{error}</p>
            )}
        </div>
    )
}
