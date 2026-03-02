export default function JobSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 space-y-4 animate-pulse">
                    {/* Header */}
                    <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                            <div className="h-4 shimmer-bg rounded-lg w-3/4" />
                            <div className="h-3 shimmer-bg rounded-lg w-1/2" />
                        </div>
                        <div className="h-6 w-20 shimmer-bg rounded-full" />
                    </div>

                    {/* Meta */}
                    <div className="flex gap-4">
                        <div className="h-3 shimmer-bg rounded-lg w-24" />
                        <div className="h-3 shimmer-bg rounded-lg w-16" />
                    </div>

                    {/* Salary */}
                    <div className="flex gap-2">
                        <div className="h-4 shimmer-bg rounded-lg w-28" />
                        <div className="h-5 shimmer-bg rounded-full w-16" />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                        <div className="h-5 shimmer-bg rounded-md w-14" />
                        <div className="h-5 shimmer-bg rounded-md w-16" />
                        <div className="h-5 shimmer-bg rounded-md w-12" />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between pt-3 border-t border-surface-800">
                        <div className="h-3 shimmer-bg rounded-lg w-16" />
                        <div className="h-3 shimmer-bg rounded-lg w-20" />
                    </div>
                </div>
            ))}
        </div>
    )
}
