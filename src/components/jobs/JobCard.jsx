import { MapPin, Clock, ExternalLink, Building2 } from 'lucide-react'
import Badge from '../ui/Badge'

const platformColors = {
    linkedin: 'text-blue-400',
    indeed: 'text-purple-400',
    lintberg: 'text-emerald-400',
}

export default function JobCard({ job }) {
    const matchColor =
        job.matchScore >= 80 ? 'success' : job.matchScore >= 60 ? 'warning' : 'neutral'

    const handleViewDetails = () => {
        if (job.url && (job.url.startsWith('http://') || job.url.startsWith('https://'))) {
            window.open(job.url, '_blank')
        }
    }

    return (
        <div className="glass rounded-2xl p-5 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 group animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-surface-100 group-hover:text-brand-400 transition-colors truncate">
                        {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3.5 w-3.5 text-surface-500 shrink-0" />
                        <span className="text-xs text-surface-400 truncate">{job.company}</span>
                    </div>
                </div>
            
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-surface-500">
                <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {job.postedAt}
                </span>
            </div>

            {/* Salary + Type */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-gradient">{job.salary || 'Salary not listed'}</span>
                {job.type && <Badge variant="brand">{job.type}</Badge>}
            </div>

            {/* Tags */}
          
          
            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-800">
                <span className={`text-xs font-medium capitalize ${platformColors[job.platform] || 'text-surface-400'}`}>
                    {job.platform}
                </span>
                <button
                    onClick={handleViewDetails}
                    disabled={!job.url || (!job.url.startsWith('http://') && !job.url.startsWith('https://'))}
                    className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors disabled:text-surface-600 disabled:cursor-not-allowed"
                    title={job.url ? 'Open job posting' : 'No job URL available'}
                >
                    View Details <ExternalLink className="h-3 w-3" />
                </button>
            </div>
        </div>
    )
}
