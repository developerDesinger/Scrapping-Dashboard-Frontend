import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import {
    Bell,
    X,
    Linkedin,
    Search,
    Globe,
    FileText,
    CheckCheck,
    Trash2,
} from 'lucide-react'

const platformIcons = {
    linkedin: { icon: Linkedin, color: 'text-blue-400', bg: 'bg-blue-500/15' },
    indeed: { icon: Search, color: 'text-purple-400', bg: 'bg-purple-500/15' },
    lintberg: { icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    cv: { icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    system: { icon: Bell, color: 'text-surface-400', bg: 'bg-surface-500/15' },
}

function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

export default function NotificationPanel() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications()
    const [open, setOpen] = useState(false)
    const panelRef = useRef(null)

    // Close on click outside
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        if (open) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2.5 rounded-xl text-surface-500 hover:text-surface-300 hover:bg-surface-800/60 transition-colors"
            >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-500 text-[10px] font-bold text-white flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] rounded-2xl bg-surface-900 border border-surface-800/80 shadow-2xl shadow-black/40 z-50 flex flex-col overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-surface-800/60 shrink-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-surface-100">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-brand-500/15 text-[10px] font-bold text-brand-400">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-colors"
                                    title="Mark all read"
                                >
                                    <CheckCheck className="h-4 w-4" />
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Clear all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notification list */}
                    <div className="flex-1 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <Bell className="h-10 w-10 text-surface-700 mb-3" />
                                <p className="text-sm text-surface-500 font-medium">No notifications yet</p>
                                <p className="text-xs text-surface-600 mt-1">
                                    Scrape jobs to see updates here
                                </p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const platform = platformIcons[notif.type] || platformIcons.system
                                const Icon = platform.icon
                                return (
                                    <button
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`
                      w-full flex items-start gap-3 px-4 py-3 text-left transition-colors
                      hover:bg-surface-800/40
                      ${!notif.read ? 'bg-brand-500/[0.03]' : ''}
                    `}
                                    >
                                        <div className={`w-8 h-8 rounded-lg ${platform.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                            <Icon className={`h-4 w-4 ${platform.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[13px] leading-snug ${!notif.read ? 'text-surface-200 font-medium' : 'text-surface-400'}`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-[11px] text-surface-600 mt-1">{timeAgo(notif.timestamp)}</p>
                                        </div>
                                        {!notif.read && (
                                            <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2" />
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
