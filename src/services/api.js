import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
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
   AUTH APIs
========================================================= */

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/login', { email, password })
      const data = response.data
      const token = data.token || data.access_token
      const user = data.user || data

      if (!token) throw new Error('Authentication failed: token not received')

      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(user))

      return { token, user }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message)
      throw error
    }
  },
}

/* =========================================================
   CV APIs
========================================================= */

export const cvAPI = {
  upload: async (file, candidateName, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('candidate_name', candidateName)

    try {
      const response = await api.post('/api/upload_cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

  deleteCv: async (candidateId) => {
    try {
      const response = await api.delete(`/api/delete_cv/${candidateId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  getUserCVs: async () => {
    try {
      const response = await api.get('/api/get_user_cv')
      return response
    } catch (error) {
      throw error
    }
  },
}

/* =========================================================
   TRANSFORM HELPERS
========================================================= */

function transformBackendJob(result) {
  if (!result || !result.job) return null

  const jobData = result.job
  const source = jobData.source || 'unknown'
  const matchScore = result.match_score ? Math.round(result.match_score) : 50

  const tags = extractTags(
    jobData.title + ' ' + (jobData.description_preview || jobData.snippet || '')
  )

  let jobType = jobData.job_types || ''
  if (!jobType) jobType = extractJobType(jobData.title || '')

  const salary = jobData.salary || extractSalary(jobData.title || '')

  return {
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
    matchScore,
    candidateName: result.candidate_name || '',
    reasoning: result.reasoning || '',
    sector: result.sector || '',
    vectorId: result.vector_id || '',
  }
}

function extractTags(text) {
  if (!text) return []
  const keywords = [
    'react', 'javascript', 'python', 'node', 'java', 'sql', 'aws', 'docker',
    'kubernetes', 'typescript', 'api', 'rest', 'graphql', 'mongodb',
    'postgresql', 'devops', 'ci/cd', 'machine learning', 'ai',
    'backend', 'frontend', 'fullstack',
  ]
  const lowerText = text.toLowerCase()
  return keywords.filter((k) => lowerText.includes(k)).slice(0, 3)
}

function extractJobType(title) {
  const typeMap = {
    'full-time': 'Full-time',
    'full time': 'Full-time',
    'part-time': 'Part-time',
    'part time': 'Part-time',
    contract: 'Contract',
    freelance: 'Freelance',
    temporary: 'Temporary',
    remote: 'Remote',
  }
  const lowerTitle = title.toLowerCase()
  for (const [key, value] of Object.entries(typeMap)) {
    if (lowerTitle.includes(key)) return value
  }
  return ''
}

function extractSalary(title) {
  const salaryMatch = title.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\/\w+)?/i)
  return salaryMatch ? salaryMatch[0] : null
}

function normalizeJobResponse(response) {
  if (!response?.data) {
    return {
      data: { jobs: [], total: 0, page: 1, perPage: 9, totalPages: 0 },
    }
  }

  let results = response.data.results || response.data.data || []
  if (!Array.isArray(results)) results = []

  const filteredResults = results.filter(
    (result) => result.job !== null && result.job !== undefined
  )

  const transformedJobs = filteredResults
    .map((result) => transformBackendJob(result))
    .filter((job) => job !== null)

  const total = response.data.total || response.data.total_records || transformedJobs.length
  const page = response.data.page || 1
  const perPage = response.data.page_size || 9
  const totalPages = Math.ceil(total / perPage)

  return {
    data: { jobs: transformedJobs, total, page, perPage, totalPages },
  }
}

/* =========================================================
   JOBS APIs
========================================================= */

export const jobsAPI = {
  /**
   * Fetch all jobs with pagination
   * GET /api/get_results?page=1&page_size=10
   */
  getJobs: async (page = 1, pageSize = 9) => {
    try {
      const response = await api.get('/api/get_results', {
        params: { page, page_size: pageSize },
      })
      return normalizeJobResponse(response)
    } catch (error) {
      console.error('Jobs fetch error:', error.message, error.response?.data)
      throw error
    }
  },

  /**
   * Delete a job by ID
   * DELETE /api/delete_result/{job_id}
   */
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/api/delete_result/${jobId}`)
      return response
    } catch (error) {
      console.error('Delete job error:', error.message, error.response?.data)
      throw error
    }
  },
}

/* =========================================================
   DASHBOARD APIs
========================================================= */

export const dashboardAPI = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/dashboard_stats')
      return response.data
    } catch (error) {
      console.error('Dashboard stats error:', error.message, error.response?.data)
      throw error
    }
  },
}

export const DashboardChartApi = {
  getDashboardChart: async () => {
    try {
      const response = await api.get('/api/dashboard_graph')
      return response.data
    } catch (error) {
      console.error('Dashboard chart error:', error.message, error.response?.data)
      throw error
    }
  },
}

export default api