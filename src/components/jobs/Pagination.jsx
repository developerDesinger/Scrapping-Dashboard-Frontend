import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) {
        return null
    }

    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleNext = () => {
        if (page < totalPages) {
            onPageChange(page + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handlePageClick = (pageNum) => {
        onPageChange(pageNum)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Calculate visible page numbers (show current, +/- 1)
    const pages = []
    const startPage = Math.max(1, page - 1)
    const endPage = Math.min(totalPages, page + 1)

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return (
        <div className="flex items-center justify-center gap-2 py-6">
            {/* Previous Button */}
            <button
                onClick={handlePrevious}
                disabled={page === 1}
                className="p-2 rounded-lg border border-surface-600 hover:bg-surface-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-5 h-5 text-surface-300" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageClick(1)}
                            className="px-3 py-2 rounded-lg border border-surface-600 text-surface-300 hover:bg-surface-600/50 transition-colors"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2 text-surface-500">...</span>}
                    </>
                )}

                {pages.map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => handlePageClick(pageNum)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                            pageNum === page
                                ? 'bg-purple-500/30 border-purple-400 text-purple-300'
                                : 'border-surface-600 text-surface-300 hover:bg-surface-600/50'
                        }`}
                    >
                        {pageNum}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2 text-surface-500">...</span>}
                        <button
                            onClick={() => handlePageClick(totalPages)}
                            className="px-3 py-2 rounded-lg border border-surface-600 text-surface-300 hover:bg-surface-600/50 transition-colors"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            {/* Next Button */}
            <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-surface-600 hover:bg-surface-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
            >
                <ChevronRight className="w-5 h-5 text-surface-300" />
            </button>

            {/* Page Info */}
            <span className="ml-4 text-sm text-surface-400">
                Page {page} of {totalPages}
            </span>
        </div>
    )
}