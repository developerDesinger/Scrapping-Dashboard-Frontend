import { Briefcase } from 'lucide-react'
import useJobs from '../hooks/useJobs'
import JobCard from '../components/jobs/JobCard'
import SimpleSearchFilter from '../components/jobs/SimpleSearchFilter'
import JobSkeleton from '../components/jobs/JobSkeleton'
import Pagination from '../components/jobs/Pagination'
import EmptyState from '../components/ui/EmptyState'

export default function AllJobsPage() {
  const {
    jobs,
    loading,
    error,
    page,
    totalPages,
    total,
    searchValue,
    setPage,
    updateFilters,
    resetFilters,
    deleteJob,
  } = useJobs()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">All Jobs</h1>
            <p className="text-sm text-surface-500 mt-0.5">
              {total > 0
                ? `${total} jobs found across all sources`
                : 'Discover matched jobs from all sources'}
            </p>
          </div>
        </div>
      </div>

      {/* Search / Filter */}
      <SimpleSearchFilter
        searchValue={searchValue}
        onSearchChange={updateFilters}
        onReset={resetFilters}
        total={total}
      />

      {/* Error */}
      {error && (
        <div className="glass rounded-xl p-4 border border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <JobSkeleton count={6} />
      ) : (jobs?.length || 0) === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try adjusting your filters or check back later."
          actionLabel="Clear Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={deleteJob} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && (jobs?.length || 0) > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}