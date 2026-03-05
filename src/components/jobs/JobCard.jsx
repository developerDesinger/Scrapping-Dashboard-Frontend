import { MapPin, Clock, ExternalLink, Building2, Award, TrendingUp, Briefcase, Lightbulb, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import Badge from '../ui/Badge'
import { useState } from 'react'

const platformColors = {
    linkedin: 'text-blue-400',
    indeed: 'text-purple-400',
    lintberg: 'text-emerald-400',
}

const getMatchScoreColor = (score) => {
    if (score >= 85) return 'from-green-500 to-green-400'
    if (score >= 70) return 'from-amber-500 to-amber-400'
    return 'from-orange-500 to-orange-400'
}

const getMatchScoreBadgeColor = (score) => {
    if (score >= 85) return 'bg-green-500/20 text-green-300 border-green-500/40'
    if (score >= 70) return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    return 'bg-orange-500/20 text-orange-300 border-orange-500/40'
}

const getBorderAccentColor = (score) => {
    if (score >= 85) return 'border-l-green-500/60'
    if (score >= 70) return 'border-l-amber-500/60'
    return 'border-l-orange-500/60'
}

export default function JobCard({ job }) {
    const [showReasoning, setShowReasoning] = useState(true)
    const [showDescription, setShowDescription] = useState(false)

    const handleViewDetails = () => {
        if (job.url && (job.url.startsWith('http://') || job.url.startsWith('https://'))) {
            window.open(job.url, '_blank')
        }
    }

    return (
        <div className={`glass rounded-2xl hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300 group animate-fade-in flex flex-col h-full border border-surface-700/30 border-l-4 ${getBorderAccentColor(job.matchScore)} hover:scale-[1.01]`}>
            {/* Header: Two Column Layout */}
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                    {/* Job Title */}
                    <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-surface-50 group-hover:text-brand-300 transition-colors line-clamp-2 hover:underline flex-1"
                    >
                        {job.title}
                    </a>
                    
                    {/* Compact Match Score Pill Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0 whitespace-nowrap text-xs font-semibold ${getMatchScoreBadgeColor(job.matchScore)}`}>
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>{job.matchScore}%</span>
                    </div>
                </div>

                {/* Company Name - Prominent */}
                <div className="flex items-center gap-2 text-sm font-medium text-brand-300 mb-3">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span>{job.company}</span>
                </div>

                {/* Metadata Row: Location · Salary · Type · Date */}
                <div className="flex items-center gap-2 text-xs text-surface-400 flex-wrap">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-surface-500" />
                        <span>{job.location}</span>
                    </div>
                    
                    {job.salary && (
                        <>
                            <span className="text-surface-600">·</span>
                            <span className="font-medium text-brand-400">{job.salary}</span>
                        </>
                    )}
                    
                    {job.type && (
                        <>
                            <span className="text-surface-600">·</span>
                            <Badge variant="neutral" className="!text-xs py-0 px-2">
                                {job.type}
                            </Badge>
                        </>
                    )}

                    {job.postedAt && (
                        <>
                            <span className="text-surface-600">·</span>
                            <span>{job.postedAt}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Candidate & Sector Info */}
            {(job.candidateName || job.sector) && (
                <div className="px-6 py-3 bg-surface-900/40 border-y border-surface-700/20 flex items-center gap-4 flex-wrap">
                    {job.candidateName && (
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-brand-400" />
                            <div className="text-xs">
                                <span className="text-surface-500 block">Candidate</span>
                                <span className="font-medium text-surface-100">{job.candidateName}</span>
                            </div>
                        </div>
                    )}
                    {job.sector && (
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-brand-400" />
                            <Badge variant="secondary" className="!text-xs">
                                {job.sector}
                            </Badge>
                        </div>
                    )}
                </div>
            )}

            {/* Collapsible Sections */}
            <div className="flex-1 px-6 py-4 space-y-3">
                {/* Match Reasoning - Default Open */}
                {job.reasoning && (
                    <div className="bg-surface-900/30 rounded-lg border border-surface-700/20 overflow-hidden">
                        <button
                            onClick={() => setShowReasoning(!showReasoning)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-900/50 transition-colors group/header"
                        >
                            <div className="flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-brand-400" />
                                <h4 className="text-sm font-semibold text-surface-100">Match Reasoning</h4>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-surface-500 transition-transform ${showReasoning ? 'rotate-180' : ''}`} />
                        </button>
                        {showReasoning && (
                            <div className="px-4 pb-3 pt-0 border-t border-surface-700/20">
                                <p className="text-xs text-surface-300 leading-relaxed">
                                    {job.reasoning}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Description - Default Collapsed */}
                {job.description && (
                    <div className="bg-surface-900/30 rounded-lg border border-surface-700/20 overflow-hidden">
                        <button
                            onClick={() => setShowDescription(!showDescription)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-900/50 transition-colors group/header"
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-brand-400" />
                                <h4 className="text-sm font-semibold text-surface-100">Job Description</h4>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-surface-500 transition-transform ${showDescription ? 'rotate-180' : ''}`} />
                        </button>
                        {showDescription && (
                            <div className="px-4 pb-3 pt-0 border-t border-surface-700/20 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-500/30 scrollbar-track-surface-900/20">
                                <p className="text-xs text-surface-400 leading-relaxed">
                                    {job.description}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            
           

            {/* Footer: Full Width Button + Platform */}
            <div className="mt-auto border-t border-surface-700/30 flex items-center gap-3 p-4 bg-surface-950/40">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${platformColors[job.platform] || 'text-surface-400'}`}>
                    <span className="text-lg leading-none">●</span>
                    <span className="uppercase tracking-wider">{job.platform}</span>
                </span>
                <button
                    onClick={handleViewDetails}
                    disabled={!job.url || (!job.url.startsWith('http://') && !job.url.startsWith('https://'))}
                    className="ml-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-400 border border-brand-500/40 rounded-lg hover:bg-brand-500/10 hover:border-brand-500/60 transition-all disabled:text-surface-600 disabled:border-surface-700/30 disabled:cursor-not-allowed"
                    title={job.url ? 'Open job posting' : 'No job URL available'}
                >
                    View Job <ExternalLink className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}
