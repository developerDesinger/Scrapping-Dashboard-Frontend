import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([])

    const addNotification = useCallback((notification) => {
        const newNotif = {
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            read: false,
            ...notification,
        }
        setNotifications((prev) => [newNotif, ...prev].slice(0, 50))
    }, [])

    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const ctx = useContext(NotificationContext)
    if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
    return ctx
}
