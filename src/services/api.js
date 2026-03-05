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
      const response = await api.post('/api/login', {
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
// Backend already filters by source, so just transform results
function normalizeJobResponse(response) {
  console.log('🔍 Raw backend response:', response?.data)
  
  if (!response?.data) {
    console.error('❌ No response data')
    return {
      data: {
        jobs: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      }
    }
  }
  
  // Extract results array from unified API response - backend already filters by source
  let results = response.data.results || response.data.data || []
  
  if (!Array.isArray(results)) {
    console.warn('⚠️ Results is not an array:', results)
    results = []
  }
  
  console.log(`✅ Fetched ${results.length} results from unified endpoint`)
  
  // Filter out invalid results
  let filteredResults = results.filter(result => result.job !== null && result.job !== undefined)
  
  // Transform results to UI format
  const transformedJobs = filteredResults
    .map(result => transformBackendJob(result))
    .filter(job => job !== null)
  
  console.log(`✅ Transformed ${transformedJobs.length} jobs for display`)
  
  // Get pagination info from API
  const total = response.data.total || response.data.total_records || transformedJobs.length
  const page = response.data.page || 1
  const perPage = response.data.page_size || 10
  const totalPages = Math.ceil(total / perPage)
  
  console.log(`📊 Total: ${total}, Page: ${page}, PerPage: ${perPage}, TotalPages: ${totalPages}`)
  
  return {
    data: {
      jobs: transformedJobs,
      total,
      page,
      perPage,
      totalPages,
    }
  }
}

export const jobsAPI = {
  /**
   * Fetch jobs with pagination and source filter
   * Calls /api/get_results with source, page, and page_size query parameters
   * 
   * @param {string} source - The job source to filter by (linkedin, indeed, lintberg)
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Items per page
   * @returns {Promise} Response with jobs and pagination info
   */
  getJobs: async (source = 'linkedin', page = 1, pageSize = 10) => {
    try {
      console.log(`📡 Fetching jobs for source: ${source}, page: ${page}, pageSize: ${pageSize}`)
      
      // Fetch from unified endpoint with page, page_size, and source as query parameters (backend expects this order)
      const response = await api.get('/api/get_results', {
        params: {
          page,
          page_size: pageSize,
          source,
        }
      })
      console.log(`✅ Response received for ${source}:`, response)
      
      // Normalize response (backend already filters by source)
      return normalizeJobResponse(response)
    } catch (error) {
      console.error(`❌ Jobs fetch error for ${source}:`, error.message, error.response?.data)
      throw error
    }
  },
  
  /**
   * Fetch LinkedIn jobs with pagination
   */
  getLinkedInJobs: async (page = 1, pageSize = 10) => {
    return jobsAPI.getJobs('linkedin', page, pageSize)
  },
  
  /**
   * Fetch Indeed jobs with pagination
   */
  getIndeedJobs: async (page = 1, pageSize = 10) => {
    return jobsAPI.getJobs('indeed', page, pageSize)
  },
  
  /**
   * Fetch Lintberg jobs with pagination
   */
  getLintbergJobs: async (page = 1, pageSize = 10) => {
    return jobsAPI.getJobs('lintberg', page, pageSize)
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
export const DashboardChartApi = {
  /**
   * Fetch dashboard chart data
   * Returns graph data by month and source breakdown
   * 
   * @returns {Promise} Response with graph_data and source_data
   */
  getDashboardChart: async () => {
    try {
      console.log('📡 Fetching dashboard chart data from /api/dashboard_graph')
      const response = await api.get('/api/dashboard_graph')
      console.log('✅ Dashboard chart data received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching dashboard chart data:', error.message, error.response?.data)
      throw error
    }
  },
}




export default api