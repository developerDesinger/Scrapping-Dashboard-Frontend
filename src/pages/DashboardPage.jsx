import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Briefcase,
    FileText,
    Activity,
    TrendingUp,
    Upload,
    Search,
    ArrowUpRight,
    Linkedin,
    Globe,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const stats = [
    { label: 'Total Jobs', value: 62, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/15', change: '+12%' },
    { label: 'CVs Analyzed', value: 8, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/15', change: '+3' },
    { label: 'Active Scrapes', value: 3, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/15', change: 'Live' },
    { label: 'Match Rate', value: 78, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/15', change: '+5%', suffix: '%' },
]

const recentActivity = [
    { text: 'LinkedIn scrape completed — 24 jobs found', time: '2 min ago', color: 'bg-blue-400' },
    { text: 'CV uploaded: john_doe_resume.pdf', time: '15 min ago', color: 'bg-emerald-400' },
    { text: 'Indeed scrape completed — 20 jobs found', time: '1 hour ago', color: 'bg-purple-400' },
    { text: 'Lintberg scrape completed — 18 jobs found', time: '2 hours ago', color: 'bg-teal-400' },
    { text: 'CV analyzed: match score 85%', time: '3 hours ago', color: 'bg-amber-400' },
]

function AnimatedCounter({ end, suffix = '', duration = 1500 }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const increment = end / (duration / 16)
        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [end, duration])

    return <>{count}{suffix}</>
}

export default function DashboardPage() {
    const navigate = useNavigate()

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-100">Dashboard Overview</h1>
                    <p className="text-sm text-surface-500 mt-1">Monitor your scraping jobs and CV analytics</p>
                </div>
                <div className="flex gap-2">
                    <Button icon={Upload} onClick={() => navigate('/dashboard/cv')}>
                        Upload CV
                    </Button>
                    <Button variant="secondary" icon={Search} onClick={() => navigate('/dashboard/linkedin')}>
                        Browse Jobs
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={stat.label} hover className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-surface-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-surface-100">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1">
                            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
                            <span className="text-xs text-surface-600 ml-1">from last week</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="xl:col-span-2">
                    <h2 className="text-lg font-semibold text-surface-100 mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                        {recentActivity.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-800/30 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-surface-300">{item.text}</p>
                                    <p className="text-xs text-surface-600 mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <h2 className="text-lg font-semibold text-surface-100 mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/dashboard/cv')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/50 transition-colors text-left group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                                <Upload className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-200 group-hover:text-surface-100">Upload CV</p>
                                <p className="text-xs text-surface-500">Analyze a new resume</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/linkedin')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/50 transition-colors text-left group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                                <Linkedin className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-200 group-hover:text-surface-100">LinkedIn Jobs</p>
                                <p className="text-xs text-surface-500">24 new matches</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/indeed')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/50 transition-colors text-left group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                                <Search className="h-4 w-4 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-200 group-hover:text-surface-100">Indeed Jobs</p>
                                <p className="text-xs text-surface-500">20 new matches</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/lintberg')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/50 transition-colors text-left group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
                                <Globe className="h-4 w-4 text-teal-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-200 group-hover:text-surface-100">Lintberg Jobs</p>
                                <p className="text-xs text-surface-500">18 new matches</p>
                            </div>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
