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
    AlertCircle,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { dashboardAPI, DashboardChartApi } from '../services/api'


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
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [chartData, setChartData] = useState([])
    const [sourceData, setSourceData] = useState({ linkedin: 0, indeed: 0, lintberg: 0 })

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await dashboardAPI.getDashboardStats()
                
                console.log('📊 Dashboard stats data:', data)

                // Map API response to stats structure
                const mappedStats = [
                    {
                        label: 'Total Matched Jobs',
                        value: data.stats.total_matched_jobs || 0,
                        icon: Briefcase,
                        color: 'text-blue-400',
                        bg: 'bg-blue-500/15',
                      
                    },
                    {
                        label: 'CVs Analyzed',
                        value: data.stats.cv_analyzed || 0,
                        icon: FileText,
                        color: 'text-emerald-400',
                        bg: 'bg-emerald-500/15',
                      
                    },
                    {
                        label: 'Active Scrapes',
                        value: 3,
                        icon: Activity,
                        color: 'text-amber-400',
                        bg: 'bg-amber-500/15',
                       
                    },
                    {
                        label: 'Average Match Score',
                        value: data.stats.average_match_score || 0,
                        icon: TrendingUp,
                        color: 'text-purple-400',
                        bg: 'bg-purple-500/15',
                       
                    },
                ]

                setStats(mappedStats)
            } catch (err) {
                console.error('❌ Error fetching dashboard stats:', err)
                setError('Failed to load dashboard statistics. Please try again later.')
                
                // Set default stats in case of error
                setStats([
                    { label: 'Total Matched Jobs', value: 0, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/15' },
                    { label: 'CVs Analyzed', value: 0, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
                    { label: 'Active Scrapes', value: 0, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/15' },
                    { label: 'Average Match Score', value: 0, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/15' },
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardStats()
    }, [])

    // Fetch chart data
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                console.log('📈 Fetching chart data...')
                const chartResponse = await DashboardChartApi.getDashboardChart()
                console.log('✅ Chart data received:', chartResponse)

                // Process graph_data - already contains source breakdown per month
                if (chartResponse.graph_data && Array.isArray(chartResponse.graph_data)) {
                    const graphData = chartResponse.graph_data
                    
                    // Data is already in correct format with month, indeed, linkedin, lintberg
                    console.log('✅ Chart data ready for display:', graphData)
                    setChartData(graphData)

                    // Calculate totals from source_data
                    const sourceDataArray = chartResponse.source_data || []
                    let linkedinTotal = 0
                    let indeedTotal = 0
                    let lintbergTotal = 0

                    sourceDataArray.forEach((item) => {
                        if (item.source === 'linkedin') linkedinTotal = item.total_jobs
                        if (item.source === 'indeed') indeedTotal = item.total_jobs
                        if (item.source === 'lintberg') lintbergTotal = item.total_jobs
                    })

                    console.log('📊 Source totals - LinkedIn:', linkedinTotal, 'Indeed:', indeedTotal, 'Lintberg:', lintbergTotal)

                    // Set source data for summary
                    setSourceData({
                        linkedin: linkedinTotal,
                        indeed: indeedTotal,
                        lintberg: lintbergTotal,
                    })
                }
            } catch (err) {
                console.error('❌ Error fetching chart data:', err)
                // Keep using default/empty state if API fails
            }
        }

        fetchChartData()
    }, [])

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

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={stat.label} hover className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-surface-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-surface-100">
                                    {loading ? (
                                        <span className="animate-pulse">--</span>
                                    ) : (
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix || ''} />
                                    )}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1">
                          
                            <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
                            
                        </div>
                    </Card>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Monthly Scraping Activity Chart */}
                <Card className="xl:col-span-2">
                    <h2 className="text-lg font-semibold text-surface-100 mb-6">Monthly Scraping Activity</h2>
                    <div className="w-full h-80 -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.length > 0 ? chartData : []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis 
                                    dataKey="month" 
                                    stroke="#9CA3AF"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                    stroke="#9CA3AF"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#E5E7EB',
                                    }}
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                />
                                <Legend 
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    iconType="square"
                                />
                                <Bar dataKey="linkedin" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="indeed" fill="#A855F7" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="lintberg" fill="#10B981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-surface-700/30">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                                <span className="text-xs text-surface-400">LinkedIn</span>
                            </div>
                            <p className="text-lg font-semibold text-blue-400">{sourceData.linkedin}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
                                <span className="text-xs text-surface-400">Indeed</span>
                            </div>
                            <p className="text-lg font-semibold text-purple-400">{sourceData.indeed}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                                <span className="text-xs text-surface-400">Lintberg</span>
                            </div>
                            <p className="text-lg font-semibold text-emerald-400">{sourceData.lintberg}</p>
                        </div>
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
