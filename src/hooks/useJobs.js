import { useState, useEffect, useCallback, useRef } from 'react'
import { jobsAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const apiMap = {
    linkedin: jobsAPI.getLinkedInJobs,
    indeed: jobsAPI.getIndeedJobs,
    lintberg: jobsAPI.getLintbergJobs,
}

const platformLabels = {
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    lintberg: 'Lintberg',
}

export default function useJobs(platform) {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState({ search: '', type: '', location: '', remote: '' })
    const [searchValue, setSearchValue] = useState('') // Immediate UI update
    const { addToast } = useToast()
    const toastShownRef = useRef(false)
    const debounceTimeoutRef = useRef(null)

    const fetchJobs = useCallback(async () => {
        setLoading(true)
        setError(null)
        toastShownRef.current = false
        try {
            const apiFn = apiMap[platform]
            if (!apiFn) throw new Error(`Unknown platform: ${platform}`)
            
            const pageSize = 10 // Page size for API
            console.log('🚀 Fetching jobs for platform:', platform, 'with page:', page)
            const response = await apiFn(page, pageSize)
            console.log('📦 Response received:', response)
            
            let fetchedJobs = []

            if (response?.data) {
                if (Array.isArray(response.data.jobs)) {
                    fetchedJobs = response.data.jobs
                    console.log('✅ Jobs extracted:', fetchedJobs.length)
                } else if (Array.isArray(response.data)) {
                    fetchedJobs = response.data
                    console.log('✅ Jobs extracted (array):', fetchedJobs.length)
                }
            }

            console.log('💾 Setting state with jobs:', fetchedJobs.length)
            setJobs(fetchedJobs)
            setTotalPages(response?.data?.totalPages || 1)
            setTotal(response?.data?.total || fetchedJobs.length)

            // Show success toast only once
            if (!toastShownRef.current) {
                const label = platformLabels[platform] || platform
                addToast({
                    message: `✓ ${label} scrape complete — ${response?.data?.total || fetchedJobs.length} jobs found`,
                    type: 'success',
                    duration: 4000,
                })
                toastShownRef.current = true
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch jobs')

            // Show error toast only once
            if (!toastShownRef.current) {
                const label = platformLabels[platform] || platform
                addToast({
                    message: `✗ ${label} scrape failed: ${err.message || 'Unknown error'}`,
                    type: 'error',
                    duration: 5000,
                })
                toastShownRef.current = true
            }
        } finally {
            setLoading(false)
        }
    }, [platform, page, addToast])

    useEffect(() => {
        fetchJobs()
    }, [fetchJobs])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [])

    const updateFilters = useCallback((newFilters) => {
        // If search is being updated, debounce API call but update UI immediately
        if ('search' in newFilters) {
            setSearchValue(newFilters.search) // Update UI immediately
            
            // Clear existing timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
            
            // Set new debounced timeout (800ms) for API call
            debounceTimeoutRef.current = setTimeout(() => {
                setFilters((prev) => ({ ...prev, search: newFilters.search }))
                setPage(1)
            }, 800)
        } else {
            // For non-search filters, apply immediately
            setFilters((prev) => ({ ...prev, ...newFilters }))
            setPage(1)
        }
    }, [])

    const resetFilters = () => {
        // Clear any pending debounced searches
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        setSearchValue('')
        setFilters({ search: '', type: '', location: '', remote: '' })
        setPage(1)
    }

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
        refetch: fetchJobs,
    }
}
