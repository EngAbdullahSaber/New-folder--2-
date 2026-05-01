'use client'

import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react'
import { fetchRecords, fetchRecords_GET } from '@/shared'
import type { Option, Locale } from '@/shared'

interface LOVCache {
  data: Option[]
  loading: boolean
  timestamp: number
}

interface LOVContextValue {
  getOptions: (cacheKey: string, cache?: boolean) => Option[] | null
  setOptions: (cacheKey: string, options: Option[], cache?: boolean) => void
  fetchOptions: (params: FetchOptionsParams) => Promise<void>
  isLoading: (cacheKey: string) => boolean
  clearCache: (cacheKey: string) => void
  clearAllCache: () => void
}

interface FetchOptionsParams {
  cacheKey: string
  apiUrl: string
  accessToken: string
  locale: string
  queryParams: Record<string, any>
  keyProp: string
  labelProp: string
  searchInBackend: boolean
  displayProps: string[]
  searchProps: string[]
  searchMode: string
  search?: string
  cache?: boolean | false
  apiMethod?: 'GET' | 'POST'
  forceRefresh?: boolean
  perPage?: number
  /** When the API returns a nested object, specify the key(s) to extract the array from.
   * Use a string for a single key (e.g. 'departments') or an array of keys to merge
   * multiple arrays (e.g. ['departments', 'seasonal_departments']). */
  responseDataKey?: string | string[]
  skipDataSuffix?: boolean
}

const LOVContext = createContext<LOVContextValue | null>(null)

// ✅ Helper function
export const buildNestedObject = (fields: Set<string>, value: string): Record<string, any> => {
  const result: Record<string, any> = {}
  fields.forEach(field => {
    if (field.includes('.')) {
      const parts = field.split('.')
      let current = result

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // ✅ آخر جزء - حط الـ value
          current[part] = value
        } else {
          // ✅ مش آخر جزء - أنشئ nested object
          current[part] = current[part] || {}
          current = current[part]
        }
      })
    } else {
      // ✅ flat field عادي
      result[field] = value
    }
  })

  return result
}

export function LOVProvider({ children }: { children: ReactNode }) {
  const cacheMapRef = useRef<Map<string, LOVCache>>(new Map())
  const loadingKeysRef = useRef<Set<string>>(new Set())
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  const fetchedKeysRef = useRef<Set<string>>(new Set())
  const [, forceUpdate] = useState({})

  /* ---------------------------------- */
  /* Helper: Wrap search text with %%   */
  /* ---------------------------------- */
  const wrapSearchText = useCallback((searchText: string): string => {
    if (!searchText) return searchText

    const trimmed = searchText.trim()

    // Check if already has %
    if (trimmed.includes('%')) {
      return trimmed
    }

    // Wrap with %%
    return `%${trimmed}%`
  }, [])

  /* ---------------------------------- */
  /* Cache initialization (persistent)  */
  /* ---------------------------------- */
  const initializeCacheKey = useCallback((cacheKey: string, cache?: boolean) => {
    if (!cache) return

    if (!cacheMapRef.current.has(cacheKey)) {
      try {
        const stored = localStorage.getItem(cacheKey)
        if (stored) {
          const data = JSON.parse(stored)
          cacheMapRef.current.set(cacheKey, {
            data,
            loading: false,
            timestamp: Date.now()
          })
        }
      } catch (error) {
        console.error('Error loading cache:', error)
      }
    }
  }, [])

  const getOptions = useCallback(
    (cacheKey: string, cache: boolean = true): Option[] | null => {
      initializeCacheKey(cacheKey, cache)
      return cacheMapRef.current.get(cacheKey)?.data || null
    },
    [initializeCacheKey]
  )

  const setOptions = useCallback((cacheKey: string, options: Option[], cache: boolean = true) => {
    cacheMapRef.current.set(cacheKey, {
      data: options,
      loading: false,
      timestamp: Date.now()
    })

    if (cache) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(options))
      } catch (error) {
        console.error('Error saving cache:', error)
      }
    }

    forceUpdate({})
  }, [])

  const isLoading = useCallback((cacheKey: string): boolean => {
    return loadingKeysRef.current.has(cacheKey)
  }, [])

  const clearCache = useCallback((cacheKey: string) => {
    cacheMapRef.current.delete(cacheKey)

    try {
      localStorage.removeItem(cacheKey)
    } catch (error) {
      console.error('Error clearing cache:', error)
    }

    fetchedKeysRef.current.delete(cacheKey)

    const controller = abortControllersRef.current.get(cacheKey)
    if (controller) {
      controller.abort()
      abortControllersRef.current.delete(cacheKey)
    }

    loadingKeysRef.current.delete(cacheKey)

    forceUpdate({})
  }, [])

  const clearAllCache = useCallback(() => {
    cacheMapRef.current.forEach((_, key) => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error('Error clearing cache key:', key, error)
      }
    })

    cacheMapRef.current.clear()
    fetchedKeysRef.current.clear()
    loadingKeysRef.current.clear()

    abortControllersRef.current.forEach(controller => {
      controller.abort()
    })
    abortControllersRef.current.clear()

    forceUpdate({})
  }, [])

  /* ---------------------------------- */
  /* Fetch options                       */
  /* ---------------------------------- */
  const fetchOptions = useCallback(
    async (params: FetchOptionsParams) => {
      const {
        cacheKey,
        search = '',
        cache = true,
        apiMethod = 'POST',
        forceRefresh = false,
        perPage = 50,
        keyProp = 'value',
        labelProp = 'label'
      } = params

      if (loadingKeysRef.current.has(cacheKey)) return

      if (!forceRefresh) {
        if (!search && fetchedKeysRef.current.has(cacheKey)) {
          const cached = cacheMapRef.current.get(cacheKey)
          if (cached?.data?.length) return
        }

        if (!search && cache) {
          const cached = cacheMapRef.current.get(cacheKey)
          if (cached?.data?.length) return
        }
      }

      const existingController = abortControllersRef.current.get(cacheKey)
      if (existingController) existingController.abort()

      const controller = new AbortController()
      abortControllersRef.current.set(cacheKey, controller)
      loadingKeysRef.current.add(cacheKey)

      try {
        let payload: any = {}

        const all: Record<string, any> = {
          ...params.queryParams
        }

        if (search && params.searchInBackend) {
          const wrappedSearch = search.includes('%') ? search : `%${search}%`

          const searchFields = new Set<string>()
          const addField = (f: string) => {
            if (!f) return
            f.split(',').forEach(part => {
              const trimmed = part.trim()
              if (trimmed && trimmed !== 'value' && trimmed !== 'label') {
                searchFields.add(trimmed)
              }
            })
          }

          // ✅ ONLY searchProps
          if (params.searchProps && params.searchProps.length > 0) {
            params.searchProps.forEach(addField)
          } else if (params.labelProp) {
            // ✅ fallback
            addField(params.labelProp)
          }

          // let any: any = {}
          // searchFields.forEach(field => {
          //   any[field] = wrappedSearch
          // })

          const any = buildNestedObject(searchFields, wrappedSearch)

          payload = {
            any,
            all,
            is_granted: true
          }

          // ✅ only add operator if valid
          if (params.searchMode && params.searchMode.trim() !== '') {
            payload.operator = params.searchMode
          }
        } else {
          payload = {
            all,
            is_granted: true
          }
        }

        // cleanup empty objects
        if (payload.any && Object.keys(payload.any || {}).length === 0) {
          delete payload.any
        }

        if (payload.all && Object.keys(payload.all || {}).length === 0) {
          delete payload.all
        }

        let response: any

        if (apiMethod === 'GET') {
          const serializedParams: Record<string, string> = {}

          Object.entries(payload).forEach(([key, value]) => {
            if (value == null) return

            if (typeof value === 'object') {
              serializedParams[key] = JSON.stringify(value)
            } else {
              serializedParams[key] = String(value)
            }
          })

          const queryString = new URLSearchParams(serializedParams).toString()

          response = await fetchRecords_GET(
            params.apiUrl,
            0,
            perPage,
            queryString,
            params.accessToken,
            params.locale as Locale
          )
        } else {
          response = await fetchRecords(
            params.apiUrl,
            0,
            perPage,
            payload,
            params.accessToken,
            params.locale as Locale,
            undefined,
            undefined,
            false,
            params.skipDataSuffix
          )
        }

        // =========================
        // RESPONSE HANDLING (unchanged)
        // =========================
        let data: any[] = []
        const rawResponse = response?.data
        const actualData = rawResponse?.data || rawResponse

        if (params.responseDataKey) {
          const keys = Array.isArray(params.responseDataKey) ? params.responseDataKey : [params.responseDataKey]

          data = keys.flatMap((key: string) => actualData?.[key] ?? [])
        } else if (Array.isArray(actualData)) {
          data = actualData
        } else if (actualData && typeof actualData === 'object') {
          const firstArray = Object.values(actualData).find(v => Array.isArray(v))
          data = (firstArray as any[]) ?? []
        } else {
          data = actualData ?? []
        }
        const newOptions = data.map((item: any) => ({
          value: item[keyProp],
          label: item[labelProp],

          ...item
        }))
        if (search) {
          cacheMapRef.current.set(cacheKey, {
            data: newOptions,
            loading: false,
            timestamp: Date.now()
          })
        } else {
          if (forceRefresh) {
            setOptions(cacheKey, newOptions, cache)
          } else {
            const existing = cacheMapRef.current.get(cacheKey)?.data || []
            const merged = [...newOptions, ...existing].filter(
              (v, i, a) => a.findIndex(t => String(t.value) === String(v.value)) === i
            )
            setOptions(cacheKey, merged, cache)
          }
          fetchedKeysRef.current.add(cacheKey)
        }

        forceUpdate({})
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('❌ Fetch error:', error)
        }
      } finally {
        loadingKeysRef.current.delete(cacheKey)
        abortControllersRef.current.delete(cacheKey)
      }
    },
    [setOptions, wrapSearchText]
  )

  const value: LOVContextValue = {
    getOptions,
    setOptions,
    fetchOptions,
    isLoading,
    clearCache,
    clearAllCache
  }

  return <LOVContext.Provider value={value}>{children}</LOVContext.Provider>
}

export function useLOVContext() {
  const context = useContext(LOVContext)
  if (!context) {
    throw new Error('useLOVContext must be used within LOVProvider')
  }
  return context
}
