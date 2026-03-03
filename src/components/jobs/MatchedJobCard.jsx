import { Badge, ExternalLink, TrendingUp } from 'lucide-react'

export default function MatchedJobCard({ match }) {
    const { candidate_name, match_score, sector, matched_criteria, reasoning, job } = match

    return (
        <div className="glass rounded-2xl p-6 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300 border border-surface-700/50 hover:border-brand-500/30 group">
            {/* Header with Candidate Name and Score */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-surface-100 mb-1">{candidate_name}</h3>
                    <p className="text-sm text-brand-400">{sector}</p>
                </div>
                <div className="flex flex-col items-center gap-1 ml-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gradient">{match_score}%</span>
                    </div>
                    <p className="text-xs text-surface-500">Match</p>
                </div>
            </div>

            {/* Job Details */}
            <div className="space-y-3 mb-4 pb-4 border-b border-surface-700/50">
                <div>
                    <p className="text-xs text-surface-500 mb-1">Job Title</p>
                    <p className="text-lg font-semibold text-surface-100">{job.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-surface-500 mb-1">Company</p>
                        <p className="text-sm font-medium text-surface-200">{job.company}</p>
                    </div>
                    <div>
                        <p className="text-xs text-surface-500 mb-1">Location</p>
                        <p className="text-sm font-medium text-surface-200">{job.location}</p>
                    </div>
                </div>

                {job.description_preview && (
                    <div>
                        <p className="text-xs text-surface-500 mb-1">Job Description</p>
                        <p className="text-sm text-surface-300 line-clamp-2">{job.description_preview}</p>
                    </div>
                )}

                <div className="flex items-center justify-between text-xs">
                    <span className="text-surface-500">{job.validity_text}</span>
                    <span className="text-brand-400 capitalize">{job.source}</span>
                </div>
            </div>

            {/* Matched Criteria */}
            <div className="mb-4">
                <p className="text-xs font-semibold text-surface-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    Matched Criteria ({matched_criteria.length})
                </p>
                <div className="flex flex-wrap gap-2">
                    {matched_criteria.map((criterion, idx) => (
                        <Badge key={idx} variant="brand">
                            {criterion}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Reasoning */}
            <div className="mb-4">
                <p className="text-xs font-semibold text-surface-300 mb-2">Matching Reasoning</p>
                <p className="text-xs text-surface-400 leading-relaxed line-clamp-4">{reasoning}</p>
            </div>

            {/* Action Button */}
            <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 hover:text-brand-300 transition-all group-hover:gap-3 text-sm font-medium"
            >
                View Job
                <ExternalLink className="h-4 w-4" />
            </a>
        </div>
    )
}
