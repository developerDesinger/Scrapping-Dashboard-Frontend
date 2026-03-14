import { useState, useEffect, useCallback, useRef } from 'react'
import { jobsAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

export default function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState({ search: '' })
  const { addToast } = useToast()
  const toastShownRef = useRef(false)
  const debounceTimeoutRef = useRef(null)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    toastShownRef.current = false

    try {
      const response = await jobsAPI.getJobs(page, 9)

      let fetchedJobs = []
      if (response?.data) {
        if (Array.isArray(response.data.jobs)) {
          fetchedJobs = response.data.jobs
        } else if (Array.isArray(response.data)) {
          fetchedJobs = response.data
        }
      }

      setJobs(fetchedJobs)
      setTotalPages(response?.data?.totalPages || 1)
      setTotal(response?.data?.total || fetchedJobs.length)

      if (!toastShownRef.current) {
        addToast({
          message: `✓ Jobs loaded — ${response?.data?.total || fetchedJobs.length} results found`,
          type: 'success',
          duration: 4000,
        })
        toastShownRef.current = true
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs')

      if (!toastShownRef.current) {
        addToast({
          message: `✗ Failed to load jobs: ${err.message || 'Unknown error'}`,
          type: 'error',
          duration: 5000,
        })
        toastShownRef.current = true
      }
    } finally {
      setLoading(false)
    }
  }, [page, addToast])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
    }
  }, [])

  const updateFilters = useCallback((newFilters) => {
    if ('search' in newFilters) {
      setSearchValue(newFilters.search)
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = setTimeout(() => {
        setFilters((prev) => ({ ...prev, search: newFilters.search }))
        setPage(1)
      }, 800)
    } else {
      setFilters((prev) => ({ ...prev, ...newFilters }))
      setPage(1)
    }
  }, [])

  const resetFilters = useCallback(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
    setSearchValue('')
    setFilters({ search: '' })
    setPage(1)
  }, [])

  const deleteJob = useCallback(
    async (jobId) => {
      try {
        await jobsAPI.deleteJob(jobId)
        // Optimistically remove from UI
        setJobs((prev) => prev.filter((job) => job.id !== jobId))
        setTotal((prev) => Math.max(0, prev - 1))
        addToast({
          message: '✓ Job deleted successfully',
          type: 'success',
          duration: 3000,
        })
      } catch (err) {
        addToast({
          message: `✗ Failed to delete job: ${err.message || 'Unknown error'}`,
          type: 'error',
          duration: 4000,
        })
      }
    },
    [addToast]
  )

  return {
    jobs,
    loading,
    error,
    page,
    totalPages,
    total,
    filters,
    searchValue,
    setPage,
    updateFilters,
    resetFilters,
    deleteJob,
    refetch: fetchJobs,
  }
}