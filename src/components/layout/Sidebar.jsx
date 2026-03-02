import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    FileUp,
    Linkedin,
    Search,
    Globe,
    Zap,
    X,
    Sparkles,
} from 'lucide-react'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/cv', icon: FileUp, label: 'CV Upload' },
    { to: '/dashboard/linkedin', icon: Linkedin, label: 'LinkedIn Jobs' },
    { to: '/dashboard/indeed', icon: Search, label: 'Indeed Jobs' },
    { to: '/dashboard/lintberg', icon: Globe, label: 'Lintberg Jobs' },
]

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 bottom-0 z-50 flex flex-col
          bg-surface-900 border-r border-surface-800/80
          transition-all duration-300 ease-in-out
          lg:w-[260px]
          ${isOpen ? 'w-[260px] translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* ─── Logo area ─── */}
                <div className="flex items-center gap-3 px-4 h-[64px] border-b border-surface-800/60 shrink-0">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="text-[15px] font-bold text-surface-100 whitespace-nowrap tracking-tight">
                            Job Scraper
                        </h1>
                        <p className="text-[10px] text-surface-500 whitespace-nowrap tracking-wide uppercase">
                            Admin Panel
                        </p>
                    </div>
                    {/* Mobile close */}
                    <button
                        onClick={onClose}
                        className="ml-auto p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 lg:hidden transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* ─── Navigation label ─── */}
                <div className="px-5 pt-5 pb-2">
                    <p className="text-[10px] font-semibold text-surface-600 uppercase tracking-widest">
                        Navigation
                    </p>
                </div>

                {/* ─── Nav links ─── */}
                <nav className="flex-1 overflow-y-auto px-3 space-y-1 pt-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl text-[13px] font-medium
                 transition-all duration-200 relative group px-3 py-2.5
                 ${isActive
                                    ? 'bg-brand-500/10 text-brand-400 nav-active'
                                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60'
                                }`
                            }
                        >
                            <item.icon className="h-[18px] w-[18px] shrink-0" />
                            <span className="whitespace-nowrap">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* ─── AI powered badge ─── */}
                <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-brand-500/10">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-brand-400" />
                        <span className="text-xs font-semibold text-brand-300">AI Powered</span>
                    </div>
                    <p className="text-[11px] text-surface-500 leading-relaxed">
                        Smart matching powered by advanced AI analysis
                    </p>
                </div>
            </aside>
        </>
    )
}
