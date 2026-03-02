import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    Mail,
    Lock,
    Zap,
    ArrowRight,
    Briefcase,
    FileSearch,
    Brain,
    Linkedin,
    Globe,
    BarChart3,
    Shield,
} from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'



const features = [
    { icon: FileSearch, title: 'AI CV Analysis', desc: 'Smart resume parsing & skill extraction' },
    { icon: Briefcase, title: 'Multi-Platform Scraping', desc: 'LinkedIn, Indeed & Lintberg in one place' },
    { icon: Brain, title: 'Intelligent Matching', desc: 'AI-powered job-to-candidate matching' },
    { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track scraping jobs & match rates live' },
]

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    if (isAuthenticated) return <Navigate to="/dashboard" replace />

    const validate = () => {
        const e = {}
        if (!form.email) e.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
        if (!form.password) e.password = 'Password is required'
        //else if (form.password.length < 6) e.password = 'Minimum 6 characters'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            await login(form.email, form.password)
            navigate('/dashboard', { replace: true })
        } catch (err) {
            toast.error(err.message || 'Login failed')
            setErrors({ password: 'Invalid credentials' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen w-screen flex overflow-hidden">
            {/* ─── Left Panel: Branding & Context ─── */}
            <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-10 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-surface-900 to-brand-900" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[120px]" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Floating shapes */}
                <div className="absolute top-20 right-20 w-20 h-20 rounded-2xl gradient-brand opacity-10 rotate-12 animate-pulse-soft" />
                <div className="absolute bottom-40 right-40 w-14 h-14 rounded-xl bg-purple-500/10 -rotate-12 animate-pulse-soft" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-32 w-10 h-10 rounded-full bg-emerald-500/10 animate-pulse-soft" style={{ animationDelay: '2s' }} />

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/25">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-surface-100">Job Scraper</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl xl:text-5xl font-extrabold text-surface-100 leading-tight mb-4">
                        AI-Powered<br />
                        <span className="text-gradient">Job Matching</span><br />
                        Dashboard
                    </h1>
                    <p className="text-surface-400 text-base leading-relaxed mb-10 max-w-md">
                        Upload CVs, scrape jobs from LinkedIn, Indeed & Lintberg, and let AI
                        find the perfect matches — all from one powerful admin panel.
                    </p>

                    {/* Feature cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                            >
                                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <f.icon className="h-4 w-4 text-brand-400" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-surface-200 leading-snug">{f.title}</p>
                                    <p className="text-[11px] text-surface-500 mt-0.5 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom: Platform logos */}
                <div className="relative z-10 flex items-center gap-6">
                    <p className="text-[11px] text-surface-600 uppercase tracking-widest font-medium">
                        Platforms
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-surface-500">
                            <Linkedin className="h-4 w-4" /> <span className="text-xs">LinkedIn</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-surface-500">
                            <Briefcase className="h-4 w-4" /> <span className="text-xs">Indeed</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-surface-500">
                            <Globe className="h-4 w-4" /> <span className="text-xs">Lintberg</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Right Panel: Login Form ─── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
                {/* BG for right panel */}
                <div className="absolute inset-0 bg-surface-950" />
                <div className="absolute top-1/3 -right-20 w-80 h-80 bg-brand-500/5 rounded-full blur-[100px]" />

                <div className="relative z-10 w-full max-w-[400px] animate-slide-up">
                    {/* Mobile logo (hidden on lg) */}
                    <div className="text-center mb-8 lg:hidden">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand shadow-lg shadow-brand-500/25 mb-4">
                            <Zap className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-surface-100">Job Scraper Admin</h1>
                    </div>

                    {/* Welcome text */}
                    <div className="mb-7">
                        <h2 className="text-2xl font-bold text-surface-100">Welcome back</h2>
                        <p className="text-sm text-surface-500 mt-1">Enter your credentials to access the dashboard</p>
                    </div>

                    {/* Form card */}
                    <div className="glass rounded-2xl p-7">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Email Address"
                                type="email"
                                icon={Mail}
                                placeholder="admin@scraper.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                error={errors.email}
                                autoComplete="email"
                            />
                            <Input
                                label="Password"
                                type="password"
                                icon={Lock}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                error={errors.password}
                                autoComplete="current-password"
                            />

                            <Button type="submit" loading={loading} className="w-full" size="lg">
                                Sign In <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>

                        {/* Demo credentials */}
                        <div className="mt-6 pt-5 border-t border-surface-800">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="h-3.5 w-3.5 text-surface-600" />
                                <p className="text-[11px] text-surface-600 uppercase tracking-wider font-medium">Demo Access</p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-800/40 space-y-1.5">
                                <p className="text-xs text-surface-400">
                                    <span className="text-surface-600 w-12 inline-block">Email</span>
                                    <code className="text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded text-[11px]">
                                        admin@scraper.com
                                    </code>
                                </p>
                                <p className="text-xs text-surface-400">
                                    <span className="text-surface-600 w-12 inline-block">Pass</span>
                                    <code className="text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded text-[11px]">
                                        admin123
                                    </code>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-[11px] text-surface-600 mt-6">
                        Secured admin access • AI-Powered Job Matching Platform
                    </p>
                </div>
            </div>
        </div>
    )
}
