import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-surface-950">
            {/* Sidebar — fixed width, full height */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area — grows to fill remaining space */}
            <div className="flex flex-col flex-1 min-w-0 lg:ml-[260px] transition-all duration-300">
                {/* Top bar — fixed at top */}
                <Topbar onMenuClick={() => setSidebarOpen(true)} />

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-5 lg:p-8 max-w-[1400px] mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
