// src/lib/apiClient.ts

import axios from 'axios'
import { getOperatorConfig } from '@/configs/environment'
import { canSeeCurlStatic, useSessionHandler } from '@/shared'

// ═══════════════════════════════════════════════════════════════════════════
// ✅ FIX: apiClient should be CLIENT-SIDE ONLY
// ═══════════════════════════════════════════════════════════════════════════

function getApiUrl(): string {
  return getOperatorConfig().apiUrl
}

const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ar',
    'Access-Control-Allow-Origin': '*'
  }
})

// ✅ Update baseURL on every request (ensures it's always current)
apiClient.interceptors.request.use(config => {
  config.baseURL = getApiUrl()
  return config
})

// ✅ Add auth token interceptor (CLIENT-SIDE ONLY)
apiClient.interceptors.request.use(
  config => {
    // ✅ Check if running in browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// ═══════════════════════════════════════════════════════════════════════════
// ✅ Helper: Get header value (case-insensitive)
// ═══════════════════════════════════════════════════════════════════════════
const getHeaderValue = (headers: any, headerName: string): string | null => {
  if (!headers) return null

  // Try exact match first
  if (headers[headerName]) return headers[headerName]

  // Try lowercase
  const lowerName = headerName.toLowerCase()
  if (headers[lowerName]) return headers[lowerName]

  // Try case-insensitive search
  const keys = Object.keys(headers)
  for (const key of keys) {
    if (key.toLowerCase() === lowerName) {
      return headers[key]
    }
  }

  return null
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ Helper: Generate CURL command
// ═══════════════════════════════════════════════════════════════════════════
const generateCurl = (response: any): string => {
  const { config } = response
  const baseURL = config.baseURL || getApiUrl()

  // ✅ Build full URL with query params
  let url = `${baseURL}${config.url || ''}`

  if (config.params) {
    const params = new URLSearchParams(config.params).toString()
    if (params) {
      url += `?${params}`
    }
  }

  const method = (config.method || 'GET').toUpperCase()
  const token = config.headers?.Authorization || ''

  // ✅ Build headers
  const headers = [
    token ? `-H 'Authorization: ${token}'` : null,
    `-H 'Content-Type: application/json'`,
    `-H 'Accept-Language: ${config.headers?.['Accept-Language'] || 'ar'}'`
  ]
    .filter(Boolean)
    .join(' \\\n  ')

  // ✅ Build body
  let body = ''
  if (config.data) {
    try {
      const data = typeof config.data === 'string' ? config.data : JSON.stringify(config.data, null, 2)
      body = ` \\\n  -d '${data}'`
    } catch (e) {
      console.error('Failed to stringify data:', e)
    }
  }

  return `curl -X ${method} '${url}' \\\n  ${headers}${body}`.trim()
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ Pending queries queue
// ═══════════════════════════════════════════════════════════════════════════
const pendingQueries: any[] = []

export const flushPendingQueries = () => {
  const copy = [...pendingQueries]
  pendingQueries.length = 0

  copy.forEach(detail => {
    window.dispatchEvent(new CustomEvent('sql-debug', { detail }))
  })
}

export const setListenerReady = () => {
  // Keep for compatibility
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ Response interceptor with SQL Debug
// ═══════════════════════════════════════════════════════════════════════════
apiClient.interceptors.response.use(
  response => {
    if (typeof window !== 'undefined') {
      // ✅ Try multiple header variations
      const sqlQuery =
        getHeaderValue(response.headers, 'x-debug-sql') ||
        getHeaderValue(response.headers, 'X-Debug-Sql') ||
        getHeaderValue(response.headers, 'X-DEBUG-SQL')

      if (sqlQuery) {
        const detail = {
          query: sqlQuery,
          endpoint: response.config.url || '',
          method: (response.config.method || 'GET').toUpperCase(),
          curl: canSeeCurlStatic() ? generateCurl(response) : ''
        }

        // ✅ Store in pending queue
        pendingQueries.push(detail)

        // ✅ Try to dispatch immediately
        try {
          window.dispatchEvent(new CustomEvent('sql-debug', { detail }))
        } catch (e) {
          console.error('Failed to dispatch sql-debug event:', e)
        }
      }
    }

    return response
  },
  error => {
    if (typeof window !== 'undefined') {
      const response = error.response
      const config = error.config || {}

      const sqlQuery =
        getHeaderValue(response?.headers, 'x-debug-sql') ||
        getHeaderValue(response?.headers, 'X-Debug-Sql') ||
        getHeaderValue(response?.headers, 'X-DEBUG-SQL') ||
        'No SQL Query'

      const detail = {
        query: sqlQuery,
        endpoint: config.url || '',
        method: (config.method || 'GET').toUpperCase(),
        curl: canSeeCurlStatic() ? generateCurl({ config }) : '',
        status: response?.status || 0,
        error: response?.data?.message || error.message || 'Request failed'
      }

      pendingQueries.push(detail)

      try {
        window.dispatchEvent(new CustomEvent('sql-debug', { detail }))
      } catch (e) {
        console.error('Failed to dispatch sql-debug error event:', e)
      }
    }

    // existing 401 logic
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      // window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default apiClient
