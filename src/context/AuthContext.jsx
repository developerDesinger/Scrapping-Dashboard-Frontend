import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const defaultAuthContext = {
    user: null,
    isAuthenticated: false,
    loading: true,
    login: async () => { throw new Error('AuthProvider not initialized') },
    logout: () => {},
}

const AuthContext = createContext(defaultAuthContext)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem('admin_user')
        const savedToken = localStorage.getItem('admin_token')
        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser))
            } catch {
                localStorage.removeItem('admin_user')
                localStorage.removeItem('admin_token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const result = await authAPI.login(email, password)
            localStorage.setItem('admin_token', result.token)
            localStorage.setItem('admin_user', JSON.stringify(result.user))
            setUser(result.user)
            toast.success('Welcome back!')
            return result
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Login failed'
            throw new Error(message)
        }
    }

    const logout = () => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        setUser(null)
        toast.success('Logged out successfully')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context || Object.keys(context).length === 0) {
        console.warn('⚠️ useAuth called outside AuthProvider, using default context')
        return defaultAuthContext
    }
    return context
}

export function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login', { replace: true })
        }
    }, [isAuthenticated, loading, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-900">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-brand-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-surface-400 text-sm">Loading...</p>
                </div>
            </div>
        )
    }

    return isAuthenticated ? children : null
}
