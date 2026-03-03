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
      const response = await api.post('/upload_cv', formData, {
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
      const response = await api.delete(`/delete_cv/${candidateId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get analysis result for a CV
  getAnalysis: async (cvId) => {
    try {
      const response = await api.get(`/get_cv_analysis/${cvId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get all user CVs from database
  getUserCVs: async () => {
    try {
      const response = await api.get('/get_user_cv')
      console.log('Fetched user CVs:', response.data)
      return response
    } catch (error) {
      console.error('Error fetching user CVs:', error)
      throw error
    }
  },



  // Get matched LinkedIn jobs for uploaded CV
  getMatchedLinkedInJobs: async (page = 1, limit = 12) => {
    try {
      const response = await api.get('/match-linkedin-jobs', {
        params: { page, limit },
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Get matched Indeed jobs for uploaded CV
  getMatchedIndeedJobs: async (page = 1, limit = 12) => {
    try {
      const response = await api.get('/match-indeed-jobs', {
        params: { page, limit },
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Get matched Lintberg jobs for uploaded CV
  getMatchedLintbergJobs: async (page = 1, limit = 12) => {
    try {
      const response = await api.get('/match-lintberg-jobs', {
        params: { page, limit },
      })
      return response
    } catch (error) {
      throw error
    }
  },
}

// Transform backend job format to UI format
function transformBackendJob(backendJob, platform) {
  // Convert score (0-1 range) to matchScore (0-100 range)
  const matchScore = backendJob.score ? Math.round(backendJob.score * 100) : 50
  
  // Extract skills/tags from title and description
  const tags = extractTags(backendJob.title + ' ' + (backendJob.description_preview || ''))
  
  // Use job_types from backend if available, otherwise extract from title
  let jobType = backendJob.job_types || ''
  if (!jobType) {
    jobType = extractJobType(backendJob.title || '')
  }
  
  return {
    id: backendJob.id || backendJob.job_id,
    title: backendJob.title || 'Untitled Position',
    company: backendJob.company || 'Unknown Company',
    location: backendJob.location || 'Remote',
    type: jobType,
    salary: extractSalary(backendJob.title || ''),
    matchScore,
    tags,
    postedAt: backendJob.validity_text || formatDateAgo(backendJob.saved_at),
    platform,
    description: backendJob.description_preview || backendJob.title || '',
    url: backendJob.link || '#',
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

// Format saved_at to relative time
function formatDateAgo(savedAt) {
  if (!savedAt) return 'Recently posted'
  const [dateStr, timeStr] = savedAt.split(' ')
  const jobDate = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now - jobDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1d ago'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}m ago`
}

// Helper to normalize backend responses into the shape expected by useJobs
function normalizeJobResponse(response, params = {}, platform = 'linkedin') {
  console.log('🔍 Raw backend response:', response?.data)
  
  // many backends return an object with `jobs` array and pagination fields
  if (response?.data?.jobs && Array.isArray(response.data.jobs)) {
    console.log('✅ Jobs found in response.data.jobs:', response.data.jobs.length)
    const transformedJobs = response.data.jobs.map(job => transformBackendJob(job, platform))
    console.log('✅ Transformed', transformedJobs.length, 'jobs for display')
    
    // Extract pagination from various possible structures
    const pagination = response.data.pagination || {}
    const total = response.data.total || pagination.total_jobs || response.data.jobs.length
    const page = response.data.page || pagination.current_page || 1
    const perPage = response.data.perPage || pagination.page_size || 6
    const totalPages = response.data.totalPages || pagination.total_pages || Math.ceil(total / perPage)
    
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

  // if the API simply returns an array, wrap it
  if (Array.isArray(response?.data)) {
    const transformedJobs = response.data.map(job => transformBackendJob(job, platform))
    const page = params.page || 1
    const perPage = params.perPage || 6
    console.log('✅ Array of jobs detected:', transformedJobs.length)
    return {
      data: {
        jobs: transformedJobs,
        total: transformedJobs.length,
        page,
        perPage,
        totalPages: Math.ceil(transformedJobs.length / perPage),
      },
    }
  }

  // Try data.data pattern
  if (response?.data?.data && Array.isArray(response.data.data)) {
    const transformedJobs = response.data.data.map(job => transformBackendJob(job, platform))
    const page = params.page || 1
    const perPage = params.perPage || 6
    console.log('✅ Jobs found in response.data.data:', transformedJobs.length)
    return {
      data: {
        jobs: transformedJobs,
        total: transformedJobs.length,
        page,
        perPage,
        totalPages: Math.ceil(transformedJobs.length / perPage),
      },
    }
  }

  // otherwise just return the original response and let caller handle it
  console.warn('⚠️ Unexpected response structure:', response?.data)
  return response
}

export const jobsAPI = {
  // Scrape LinkedIn jobs from backend
  getLinkedInJobs: async (params = {}) => {
    try {
      console.log('📡 Fetching LinkedIn jobs from:', API_BASE_URL + '/jobs/linkedin')
      // Map filter names to backend API parameter names
      const queryParams = {
        page: params.page || 1,
        page_size: params.perPage || 6,
      }
      
      // Add search filter
      if (params.search) queryParams.search = params.search
      
      // Map type to job_type
      if (params.type) queryParams.job_type = params.type.toLowerCase()
      
      // Add remote filter
      if (params.remote !== '' && params.remote !== undefined) queryParams.remote = params.remote
      
      // Add location filter
      if (params.location) queryParams.location = params.location
      
      const response = await api.get('/jobs/linkedin', { params: queryParams })
      console.log('✅ LinkedIn response received:', response)
      return normalizeJobResponse(response, params, 'linkedin')
    } catch (error) {
      console.error('❌ LinkedIn jobs fetch error:', error.message, error.response?.data)
      throw error
    }
  },

  // Scrape Indeed jobs from backend
  getIndeedJobs: async (params = {}) => {
    try {
      console.log('📡 Fetching Indeed jobs from:', API_BASE_URL + '/jobs/indeed')
      // Map filter names to backend API parameter names
      const queryParams = {
        page: params.page || 1,
        page_size: params.perPage || 6,
      }
      
      // Add search filter
      if (params.search) queryParams.search = params.search
      
      // Map type to job_type
      if (params.type) queryParams.job_type = params.type.toLowerCase()
      
      // Add remote filter
      if (params.remote !== '' && params.remote !== undefined) queryParams.remote = params.remote
      
      // Add location filter
      if (params.location) queryParams.location = params.location
      
      console.log('📤 Query params:', queryParams)
      const response = await api.get('/jobs/indeed', { params: queryParams })
      console.log('✅ Indeed response received:', response)
      return normalizeJobResponse(response, params, 'indeed')
    } catch (error) {
      console.error('❌ Indeed jobs fetch error:', error.message, error.response?.data)
      throw error
    }
  },

  // Scrape Lintberg jobs from backend
  getLintbergJobs: async (params = {}) => {
    try {
      console.log('📡 Fetching Lintberg jobs from:', API_BASE_URL + '/jobs/lintberg')
      // Map filter names to backend API parameter names
      const queryParams = {
        page: params.page || 1,
        page_size: params.perPage || 6,
      }
      
      // Add search filter
      if (params.search) queryParams.search = params.search
      
      // Map type to job_type
      if (params.type) queryParams.job_type = params.type.toLowerCase()
      
      // Add remote filter
      if (params.remote !== '' && params.remote !== undefined) queryParams.remote = params.remote
      
      // Add location filter
      if (params.location) queryParams.location = params.location
      
      const response = await api.get('/jobs/lintberg', { params: queryParams })
      console.log('✅ Lintberg response received:', response)
      return normalizeJobResponse(response, params, 'lintberg')
    } catch (error) {
      console.error('❌ Lintberg jobs fetch error:', error.message, error.response?.data)
      throw error
    }
  },
}

export default api


