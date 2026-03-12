import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileUp,
  Briefcase,
  Zap,
  X,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/cv', icon: FileUp, label: 'CV Upload' },
  { to: '/dashboard/jobs', icon: Briefcase, label: 'All Jobs' },
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
          lg:w-[280px]
          ${isOpen ? 'w-[280px] translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 h-[72px] border-b border-surface-800/60 shrink-0">
          <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-[16px] font-bold text-surface-100 whitespace-nowrap tracking-tight">
              Job Scraper
            </h1>
            <p className="text-[11px] text-surface-500 whitespace-nowrap tracking-wide uppercase">
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

        {/* Navigation label */}
        <div className="px-5 pt-6 pb-3">
          <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-widest">
            Navigation
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1.5 pt-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl text-[15px] font-semibold
                 transition-all duration-200 px-4 py-3.5
                 ${
                   isActive
                     ? 'bg-brand-500/15 text-brand-300 shadow-sm shadow-brand-500/10 border border-brand-500/20'
                     : 'text-surface-300 hover:text-surface-100 hover:bg-surface-800/70 border border-transparent'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon container */}
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-all duration-200
                      ${isActive
                        ? 'bg-brand-500/20 text-brand-300'
                        : 'bg-surface-800/80 text-surface-400'
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>

                  <span className="whitespace-nowrap">{item.label}</span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-brand-400 shadow-sm shadow-brand-400/50" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* AI powered badge */}
        <div className="mx-3 mb-4 p-4 rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-brand-500/15">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-semibold text-brand-300">AI Powered</span>
          </div>
          <p className="text-[12px] text-surface-400 leading-relaxed">
            Smart matching powered by advanced AI analysis
          </p>
        </div>
      </aside>
    </>
  )
}