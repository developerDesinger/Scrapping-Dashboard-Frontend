import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, ChevronRight } from 'lucide-react'

const breadcrumbMap = {
    '/dashboard': 'Overview',
    '/dashboard/cv': 'CV Upload',
    '/dashboard/linkedin': 'LinkedIn Jobs',
    '/dashboard/indeed': 'Indeed Jobs',
    '/dashboard/lintberg': 'Lintberg Jobs',
}

export default function Topbar({ onMenuClick }) {
    const { user, logout, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const currentPage = breadcrumbMap[location.pathname] || 'Dashboard'

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    // Render minimal topbar during loading
    if (loading) {
        return (
            <header className="h-[64px] shrink-0 bg-surface-900/80 backdrop-blur-xl border-b border-surface-800/60 flex items-center justify-between px-5 lg:px-8 z-30">
                <div className="text-sm text-surface-500">Loading...</div>
            </header>
        )
    }

    return (
        <header className="h-[64px] shrink-0 bg-surface-900/80 backdrop-blur-xl border-b border-surface-800/60 flex items-center justify-between px-5 lg:px-8 z-30">
            {/* Left: hamburger + breadcrumb */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-sm">
                    <span className="text-surface-500">Dashboard</span>
                    {currentPage !== 'Overview' && (
                        <>
                            <ChevronRight className="h-3.5 w-3.5 text-surface-600" />
                            <span className="text-surface-100 font-medium">{currentPage}</span>
                        </>
                    )}
                </div>
                <h2 className="sm:hidden text-sm font-semibold text-surface-200">{currentPage}</h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1.5">
                {/* Divider */}
                <div className="w-px h-8 bg-surface-800 mx-2 hidden sm:block" />

                {/* Profile */}
                <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-800/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-[13px] font-medium text-surface-200 leading-none">{user?.name || 'Admin'}</p>
                        <p className="text-[10px] text-surface-500 mt-0.5 capitalize">{user?.role || 'administrator'}</p>
                    </div>
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Logout"
                >
                    <LogOut className="h-[18px] w-[18px]" />
                </button>
            </div>
        </header>
    )
}
