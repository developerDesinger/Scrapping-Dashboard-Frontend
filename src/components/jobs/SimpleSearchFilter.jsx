import { Search, X } from 'lucide-react'

export default function SimpleSearchFilter({ searchValue, onSearchChange, onReset, total }) {
    return (
        <div className="space-y-3">
            {/* Top row - Search only */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                    <input
                        type="text"
                        placeholder="Search jobs, companies, skills..."
                        value={searchValue || ''}
                        onChange={(e) => onSearchChange({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    />
                </div>

                {/* Clear button */}
                {searchValue && (
                    <button
                        onClick={onReset}
                        className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
                    >
                        <X className="h-3.5 w-3.5" /> Clear
                    </button>
                )}

                {/* Results count */}
                <div className="hidden sm:flex items-center">
                    <span className="text-xs text-surface-500">{total} results</span>
                </div>
            </div>
        </div>
    )
}
