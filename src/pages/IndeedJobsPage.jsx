import { Search, Sparkles, Loader } from 'lucide-react'
import { useState } from 'react'
import useJobs from '../hooks/useJobs'
import JobCard from '../components/jobs/JobCard'
import MatchedJobCard from '../components/jobs/MatchedJobCard'
import IndeedJobFilters from '../components/jobs/IndeedJobFilters'
import JobSkeleton from '../components/jobs/JobSkeleton'
import Pagination from '../components/jobs/Pagination'
import EmptyState from '../components/ui/EmptyState'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { cvAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function IndeedJobsPage() {
    const { jobs, loading, error, page, totalPages, total, filters, searchValue, setPage, updateFilters, resetFilters } = useJobs('indeed')

    const [showMatchedJobs, setShowMatchedJobs] = useState(false)
    const [matchedJobs, setMatchedJobs] = useState([])
    const [matchedLoading, setMatchedLoading] = useState(false)
    const [matchedError, setMatchedError] = useState(null)
    const [matchedMessage, setMatchedMessage] = useState('')
    const [matchedPage, setMatchedPage] = useState(1)
    const [matchedTotalPages, setMatchedTotalPages] = useState(1)

    const handleShowMatchedJobs = async () => {
        if (showMatchedJobs) {
            setShowMatchedJobs(false)
            setMatchedJobs([])
            setMatchedPage(1)
            setMatchedMessage('')
            return
        }

        setMatchedLoading(true)
        setMatchedError(null)
        setMatchedMessage('Searching for matched jobs... This may take a moment.')
        try {
            const response = await cvAPI.getMatchedIndeedJobs(1, 12)
            const data = response.data

            // Extract matches from response
            const matches = data.matches || data.data || []
            setMatchedJobs(matches)
            setMatchedMessage(data.message || `Found ${matches.length} matched job(s)`)
            setMatchedTotalPages(Math.ceil(matches.length / 12))
            setShowMatchedJobs(true)
            toast.success('Matched jobs loaded!')
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to load matched jobs'
            setMatchedError(errorMsg)
            setMatchedMessage('')
            toast.error(errorMsg)
        } finally {
            setMatchedLoading(false)
        }
    }

    const handleMatchedPageChange = async (newPage) => {
        setMatchedPage(newPage)
    }

    const displayJobs = showMatchedJobs ? matchedJobs : jobs
    const displayLoading = showMatchedJobs ? matchedLoading : loading
    const displayError = showMatchedJobs ? matchedError : error
    const displayTotalPages = showMatchedJobs ? matchedTotalPages : totalPages
    const displayPage = showMatchedJobs ? matchedPage : page
    const displayTotal = showMatchedJobs ? matchedJobs.length : total

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                        <Search className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-100">Indeed Jobs</h1>
                        <p className="text-sm text-surface-500 mt-0.5">
                            {showMatchedJobs
                                ? matchedMessage || 'Processing matches...'
                                : total > 0 ? `${total} jobs found from Indeed` : 'Discover matched jobs from Indeed'}
                        </p>
                    </div>
                </div>
                <Button 
                    onClick={handleShowMatchedJobs} 
                    icon={Sparkles}
                    variant={showMatchedJobs ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={matchedLoading}
                >
                    {matchedLoading ? (
                        <>
                            <Loader className="h-4 w-4 animate-spin" />
                            Searching...
                        </>
                    ) : showMatchedJobs ? (
                        'All Jobs'
                    ) : (
                        'Matched Jobs'
                    )}
                </Button>
            </div>

            {/* Filters */}
            {!showMatchedJobs && (
                <IndeedJobFilters
                    filters={filters}
                    searchValue={searchValue}
                    onFilterChange={updateFilters}
                    onReset={resetFilters}
                    total={total}
                />
            )}

            {/* Loading Message */}
            {matchedLoading && (
                <Card className="animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Loader className="h-8 w-8 text-brand-400 animate-spin" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-surface-200">Processing your CV against Indeed jobs...</p>
                            <p className="text-xs text-surface-500 mt-1">This may take a few moments as we analyze the matches.</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Error */}
            {displayError && (
                <div className="glass rounded-xl p-4 border-red-500/30">
                    <p className="text-sm text-red-400">{displayError}</p>
                </div>
            )}

            {/* Content */}
            {displayLoading && !matchedLoading ? (
                <JobSkeleton count={6} />
            ) : (displayJobs?.length || 0) === 0 ? (
                <EmptyState
                    icon={Search}
                    title={showMatchedJobs ? 'No matched Indeed jobs found' : 'No Indeed jobs found'}
                    description={showMatchedJobs ? 'Upload a CV to find matched jobs.' : 'Try adjusting your filters or upload a CV to find matched jobs.'}
                    actionLabel={showMatchedJobs ? 'Back to All' : 'Clear Filters'}
                    onAction={showMatchedJobs ? () => setShowMatchedJobs(false) : resetFilters}
                />
            ) : (
                <div className={`grid gap-4 ${showMatchedJobs ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
                    {displayJobs.map((job, idx) =>
                        showMatchedJobs ? (
                            <MatchedJobCard key={idx} match={job} />
                        ) : (
                            <JobCard key={job.id} job={job} />
                        )
                    )}
                </div>
            )}

            {/* Pagination */}
            {!displayLoading && (displayJobs?.length || 0) > 0 && (
                <Pagination 
                    page={displayPage} 
                    totalPages={displayTotalPages} 
                    onPageChange={showMatchedJobs ? handleMatchedPageChange : setPage}
                />
            )}
        </div>
    )
}
