import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

const jobTypes = ['Full-time', 'Part-time']

export default function IndeedJobFilters({ filters, searchValue, onFilterChange, onReset, total }) {
    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className="space-y-3">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                    <input
                        type="text"
                        placeholder="Search jobs, companies, skills..."
                        value={searchValue || ''}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border
              ${showFilters
                                ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                : 'bg-surface-800/50 text-surface-400 border-surface-700 hover:text-surface-200 hover:bg-surface-800'
                            }
            `}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </button>

                    {(filters.search || filters.type) && (
                        <button
                            onClick={onReset}
                            className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
                        >
                            <X className="h-3.5 w-3.5" /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Filter dropdowns */}
            {showFilters && (
                <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl glass-light animate-slide-up">
                    <select
                        value={filters.type || ''}
                        onChange={(e) => onFilterChange({ type: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-sm text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 sm:w-48"
                    >
                        <option value="">All Jobs</option>
                        {jobTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <div className="flex items-center ml-auto">
                        <span className="text-xs text-surface-500">{total} results found</span>
                    </div>
                </div>
            )}
        </div>
    )
}
