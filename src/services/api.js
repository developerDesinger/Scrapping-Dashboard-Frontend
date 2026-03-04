import axios from 'axios'



const API_BASE_URL =
  import.meta.env.VITE_API_URL 

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/* =========================================================
   AUTH APIs (JSON LOGIN)
========================================================= */

export const authAPI = {
  login: async (email, password) => {
    try {
      // ✅ Send JSON body
      const response = await api.post('/login', {
        email: email,
        password: password,
      })

      const data = response.data

      const token = data.token || data.access_token
      const user = data.user || data

      if (!token) {
        throw new Error('Authentication failed: token not received')
      }

      // Save session
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(user))

      return { token, user }
    } catch (error) {
      console.error(
        'Login Error:',
        error.response?.data || error.message
      )
      throw error
    }
  },
}



export const cvAPI = {
  // Upload CV file to backend with candidate name
  upload: async (file, candidateName, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('candidate_name', candidateName)

    try {
      const response = await api.post('/api/upload_cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress?.(percentCompleted)
        },
      })

      return response
    } catch (error) {
      throw error
    }
  },

  // Delete CV from backend using candidate ID
  deleteCv: async (candidateId) => {
    try {
      const response = await api.delete(`/api/delete_cv/${candidateId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get all user CVs from database
  getUserCVs: async () => {
    try {
      const response = await api.get('/api/get_user_cv')
      console.log('Fetched user CVs:', response.data)
      return response
    } catch (error) {
      console.error('Error fetching user CVs:', error)
      throw error
    }
  },

  
   





}

// Transform unified API result object to UI format
// Handles the full result with job matching metadata
function transformBackendJob(result) {
  if (!result || !result.job) return null
  
  const jobData = result.job
  const source = jobData.source || 'unknown'
  const matchScore = result.match_score ? Math.round(result.match_score) : 50
  
  // Extract skills/tags from title and description
  const tags = extractTags(jobData.title + ' ' + (jobData.description_preview || jobData.snippet || ''))
  
  // Use job_types from backend if available, otherwise extract from title
  let jobType = jobData.job_types || ''
  if (!jobType) {
    jobType = extractJobType(jobData.title || '')
  }
  
  // Extract salary from job data
  const salary = jobData.salary || extractSalary(jobData.title || '')
  
  return {
    // Job core info
    id: jobData.job_id || jobData.id,
    title: jobData.title || 'Untitled Position',
    company: jobData.company || 'Unknown Company',
    location: jobData.location || 'Remote',
    type: jobType,
    salary,
    tags,
    postedAt: jobData.date || 'Recently posted',
    platform: source,
    description: jobData.description_preview || jobData.snippet || jobData.title || '',
    url: jobData.link || '#',
    source,
    snippet: jobData.snippet || '',
    
    // Match metadata
    matchScore,
    candidateName: result.candidate_name || '',
    reasoning: result.reasoning || '',
    sector: result.sector || '',
    vectorId: result.vector_id || '',
  }
}

// Extract skills from text
function extractTags(text) {
  if (!text) return []
  const keywords = ['react', 'javascript', 'python', 'node', 'java', 'sql', 'aws', 'docker', 'kubernetes', 'typescript', 'api', 'rest', 'graphql', 'mongodb', 'postgresql', 'devops', 'ci/cd', 'machine learning', 'ai', 'backend', 'frontend', 'fullstack']
  const lowerText = text.toLowerCase()
  return keywords.filter(keyword => lowerText.includes(keyword)).slice(0, 3)
}

// Extract job type from title
function extractJobType(title) {
  const typeMap = {
    'full-time': 'Full-time',
    'full time': 'Full-time',
    'part-time': 'Part-time',
    'part time': 'Part-time',
    'contract': 'Contract',
    'freelance': 'Freelance',
    'temporary': 'Temporary',
    'remote': 'Remote',
  }
  
  const lowerTitle = title.toLowerCase()
  for (const [key, value] of Object.entries(typeMap)) {
    if (lowerTitle.includes(key)) return value
  }
  return ''
}

// Extract salary from title
function extractSalary(title) {
  const salaryMatch = title.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\/\w+)?/i)
  return salaryMatch ? salaryMatch[0] : null
}

// Normalize unified API response (/api/get_results)
// Processes results array and filters by source
function normalizeJobResponse(response, filterBySource = null) {
  console.log('🔍 Raw backend response:', response?.data)
  
  if (!response?.data) {
    console.error('❌ No response data')
    return {
      data: {
        jobs: [],
        total: 0,
        page: 1,
        perPage: 6,
        totalPages: 0,
      }
    }
  }
  
  // Extract results array from unified API response
  let results = response.data.results || []
  
  if (!Array.isArray(results)) {
    console.warn('⚠️ Results is not an array:', results)
    results = []
  }
  
  console.log(`✅ Fetched ${results.length} results from unified endpoint`)
  
  // Filter results by source if specified
  let filteredResults = results
  
  if (filterBySource) {
    const beforeFilter = results.length
    filteredResults = results.filter(result => {
      const job = result.job
      const jobSource = job?.source || ''
      const sourceMatch = jobSource.toLowerCase() === filterBySource.toLowerCase()
      return sourceMatch && job !== null && job !== undefined
    })
    console.log(`✅ Filtered results by source '${filterBySource}': ${beforeFilter} → ${filteredResults.length}`)
  } else {
    // Filter out invalid results if no source filter
    filteredResults = results.filter(result => result.job !== null && result.job !== undefined)
  }
  
  // Transform results to UI format
  const transformedJobs = filteredResults
    .map(result => transformBackendJob(result))
    .filter(job => job !== null)
  
  console.log(`✅ Transformed ${transformedJobs.length} jobs for display`)
  
  // Calculate pagination (simple pagination based on array length)
  const perPage = 6
  const total = transformedJobs.length
  const totalPages = Math.ceil(total / perPage)
  
  return {
    data: {
      jobs: transformedJobs,
      total,
      page: 1,
      perPage,
      totalPages,
    }
  }
}

export const jobsAPI = {
  /**
   * Fetch ALL jobs from unified endpoint: /api/get_results
   * Returns jobs with source field that can be filtered by each page
   * 
   * @returns {Promise} Response with all jobs from all sources
   */
  getAllResults: async () => {
    try {
      console.log('📡 Fetching all results from unified endpoint: /api/get_results')
      const response = await api.get('/api/get_results')
      console.log('✅ Results received:', response)
      return response
    } catch (error) {
      console.error('❌ Error fetching results:', error.message, error.response?.data)
      throw error
    }
  },

  /**
   * Fetch jobs filtered by source
   * Calls unified endpoint and filters results by source
   * 
   * @param {string} source - The job source to filter by (linkedin, indeed, lintberg)
   * @param {object} params - Query parameters (for future use - pagination, etc.)
   * @returns {Promise} Normalized job response filtered by source
   */
  getJobs: async (source = 'linkedin', params = {}) => {
    try {
      console.log(`📡 Fetching jobs for source: ${source}`)
      
      // Fetch from unified endpoint
      const response = await api.get('/api/get_results')
      console.log(`✅ Response received for ${source}:`, response)
      
      // Normalize and filter by source
      return normalizeJobResponse(response, source)
    } catch (error) {
      console.error(`❌ Jobs fetch error for ${source}:`, error.message, error.response?.data)
      throw error
    }
  },
  
  /**
   * Fetch LinkedIn jobs
   * Routes through the unified getJobs API with 'linkedin' source
   */
  getLinkedInJobs: async (params = {}) => {
    return jobsAPI.getJobs('linkedin', params)
  },
  
  /**
   * Fetch Indeed jobs
   * Routes through the unified getJobs API with 'indeed' source
   */
  getIndeedJobs: async (params = {}) => {
    return jobsAPI.getJobs('indeed', params)
  },
  
  /**
   * Fetch Lintberg jobs
   * Routes through the unified getJobs API with 'lintberg' source
   */
  getLintbergJobs: async (params = {}) => {
    return jobsAPI.getJobs('lintberg', params)
  },
}

/* =========================================================
   DASHBOARD API
========================================================= */

export const dashboardAPI = {
  /**
   * Fetch dashboard statistics
   * Returns aggregated stats including:
   * - Average Match Score (computed from results)
   * - Total Matched Jobs Count
   * - CV Analyzed Count
   * - Active Scrapes Count
   * 
   * @returns {Promise} Response with dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      console.log('📡 Fetching dashboard statistics from /api/dashboard_stats')
      const response = await api.get('/api/dashboard_stats')
      console.log('✅ Dashboard stats received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error.message, error.response?.data)
      throw error
    }
  },
}

export default api


