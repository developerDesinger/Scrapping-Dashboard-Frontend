import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        let start = Math.max(1, page - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible - 1)
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }
        for (let i = start; i <= end; i++) pages.push(i)
        return pages
    }

    return (
        <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers().map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`
            min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all
            ${p === page
                            ? 'gradient-brand text-white shadow-sm shadow-brand-500/20'
                            : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                        }
          `}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    )
}
