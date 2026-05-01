import { useErrorApi } from '@/contexts/errorApiProvider'
import { useSuccessApi } from '@/contexts/successApiProvider'
import { usePrintMode } from '@/contexts/usePrintModeContext'
import {
  deleteRecordById,
  fetchRecords,
  useNavigation,
  useParams,
  useRouter,
  useSearchParams,
  useSessionHandler,
  useState,
  useEffect,
  useCallback,
  getLocalizedUrl,
  deleteRecordsById,
  showDeleteSummaryToast,
  toast,
  parseSearchString,
  useRef
} from '@/shared'
import type { Locale } from '@/shared'
import { useScreenPermissions } from './useScreenPermission'
import { usePathname } from 'next/navigation'
import { useWarningApi } from '@/contexts/warningApiProvider'
import { useInfoApi } from '@/contexts/infoApiProvider'
import { getOperatorConfig } from '@/configs/environment'
import { PaginationState } from '@tanstack/react-table'
import { defaultPageSize } from '@/utils/constants'
import { useSettings } from '@/@core/hooks/useSettings'
import { mergeStatisticsWithDefaults } from '@/utils/statisticsHelpers' // ✅ Add import
import { StatisticsConfig } from '@/types/components/statistics'

export const useRecordList = (
  apiEndpoint: string,
  routerUrl: string,
  listView: boolean = true,
  paginationStoreKey?: string,
  extraQueryParams: Record<string, any> = {},
  deleteApiEndpoint?: string,
  // ✅ Add initialStatistics parameter
  initialStatistics?: StatisticsConfig[]
) => {
  const normalizeUrl = (url: string) => {
    if (!url) return ''
    let normalized = url.startsWith('/') ? url : `/${url}`
    if (!normalized.startsWith('/apps/') && normalized !== '/apps') {
      normalized = `/apps${normalized}`
    }
    return normalized
  }

  const normalizedRouterUrl = normalizeUrl(routerUrl)
  const { accessToken } = useSessionHandler()
  const [records, setRecords] = useState([])
  const [meta, setMeta] = useState({ total: 0, current_page: 1, per_page: 20 })
  const [statistics, setStatistics] = useState<any>(null)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [activeFilterSource, setActiveFilterSource] = useState<'url' | 'local' | 'none'>('none')
  const gotStatisticsRef = useRef(false)
  const router = useRouter()
  const { lang: locale } = useParams()
  const searchParams = useSearchParams()
  const { navigateWithQuery } = useNavigation()
  const { setPrintMode } = usePrintMode()
  const pathname = usePathname()
  const isNafathFlow = pathname.includes('nafath')
  const { setWarning } = useWarningApi()
  const { setInfo } = useInfoApi()
  const { setError } = useErrorApi()
  const { setSuccess } = useSuccessApi()
  const { domain } = getOperatorConfig()
  const { settings } = useSettings()
  const { canAdd, showAddButton, canEdit, showEditButton, canDelete, canSearch, showSearchButton, canPrint } =
    useScreenPermissions('list')
  const [sorting, setSorting] = useState<{
    sortBy?: string
    direction?: 'asc' | 'desc'
  }>({})
  const handlePrint = () => {
    setPrintMode(true)
    setTimeout(() => window.print(), 200)
    setTimeout(() => setPrintMode(false), 1000)
  }
  const isInitialLoadWithStats = !!initialStatistics

  const getStoredPagination = (): PaginationState => {
    if (!paginationStoreKey) {
      return { pageIndex: 0, pageSize: defaultPageSize }
    }

    try {
      const stored = JSON.parse(localStorage.getItem(paginationStoreKey) || '{}')

      return {
        pageIndex: isInitialLoadWithStats ? 0 : (stored.pageIndex ?? 0),
        pageSize: stored.pageSize ?? defaultPageSize
      }
    } catch {
      return { pageIndex: 0, pageSize: defaultPageSize }
    }
  }

  // Build query object from filters or URL params
  // const buildQueryObject = useCallback(
  //   (additionalParams: Record<string, any> = {}, currentFilters?: Record<string, any>): Record<string, any> | string => {
  //     const activeFilters = currentFilters ?? filters
  //     const activeSource = currentFilters ? 'local' : activeFilterSource

  //     // PRIORITY 1: Local filters → pass as plain object (no URL serialization)
  //     if (activeSource === 'local' && Object.keys(activeFilters).length > 0) {
  //       const queryObject: Record<string, any> = {}

  //       Object.entries(activeFilters).forEach(([key, value]) => {
  //         if (value !== null && value !== undefined && value !== '') {
  //           if (typeof value === 'object' && 'from' in value && 'to' in value) {
  //             // dateRange: expand to _from / _to keys
  //             if (value.from) queryObject[`${key}_from`] = value.from
  //             if (value.to) queryObject[`${key}_to`] = value.to
  //           } else {
  //             queryObject[key] = value
  //           }
  //         }
  //       })

  //       return { ...queryObject, ...additionalParams }
  //     }

  //     // PRIORITY 2: URL search params (from search/form mode)
  //     if (listView && searchParams.toString()) {
  //       return searchParams.toString()
  //     }

  //     // Extra query params only
  //     if (Object.keys(extraQueryParams).length > 0 || Object.keys(additionalParams).length > 0) {
  //       return new URLSearchParams(
  //         Object.entries({ ...extraQueryParams, ...additionalParams }).map(([k, v]) => [k, String(v)])
  //       ).toString()
  //     }

  //     return ''
  //   },
  //   [filters, searchParams, listView, extraQueryParams, activeFilterSource]
  // )

  const buildQueryObject = useCallback(
    (additionalParams: Record<string, any> = {}, currentFilters?: Record<string, any>) => {
      const urlParamsObject = Object.fromEntries(searchParams.entries())

      const activeFilters = currentFilters !== undefined ? currentFilters : filters

      const filterObject: Record<string, any> = {}

      Object.entries(activeFilters || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'object' && 'from' in value && 'to' in value) {
            if (value.from) filterObject[`${key}_from`] = value.from
            if (value.to) filterObject[`${key}_to`] = value.to
          } else {
            filterObject[key] = value
          }
        }
      })

      return {
        ...urlParamsObject,
        ...filterObject,
        ...extraQueryParams,

        // ✅ ALWAYS include sorting
        ...(sorting.sortBy && sorting.direction ? { sortBy: sorting.sortBy, direction: sorting.direction } : {}),

        ...additionalParams
      }
    },
    [filters, searchParams, extraQueryParams, sorting]
  )

  // Keep buildQueryString as a string-returning alias for backward-compat (sorts etc.)
  const buildQueryString = useCallback(
    (additionalParams: Record<string, any> = {}, currentFilters?: Record<string, any>): string => {
      const result = buildQueryObject(additionalParams, currentFilters)
      if (typeof result === 'string') return result
      // Serialize the object back to URL params for non-filter path (sorts, URL params)
      return new URLSearchParams(Object.entries(result).map(([k, v]) => [k, String(v)])).toString()
    },
    [buildQueryObject]
  )

  const buildPayload = useCallback(
    (additionalParams: Record<string, any> = {}, currentFilters?: Record<string, any>) => {
      const rawUrlParams = Object.fromEntries(searchParams.entries())

      // ✅ Parse any JSON strings back to objects
      const urlParamsObject: Record<string, any> = {}
      Object.entries(rawUrlParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value)
            urlParamsObject[key] = typeof parsed === 'object' && parsed !== null ? parsed : value
          } catch {
            urlParamsObject[key] = value
          }
        } else {
          urlParamsObject[key] = value
        }
      })

      const activeFilters = currentFilters ?? filters
      const filterObject: Record<string, any> = {}

      Object.entries(activeFilters || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'object' && 'from' in value && 'to' in value) {
            if (value.from) filterObject[`${key}_from`] = value.from
            if (value.to) filterObject[`${key}_to`] = value.to
          } else {
            filterObject[key] = value
          }
        }
      })

      const any = {
        ...urlParamsObject, // ✅ now contains { personal: { id_no: "..." } } not a string
        ...filterObject
      }

      const all = {
        ...extraQueryParams
      }

      return {
        any,
        all,
        ...(sorting.sortBy && sorting.direction ? { sortBy: sorting.sortBy, direction: sorting.direction } : {}),
        ...additionalParams
      }
    },
    [filters, searchParams, extraQueryParams, sorting]
  )

  const loadRecords = useCallback(
    async (
      pageIndex = 0,
      pageSize = defaultPageSize,
      additionalParams: Record<string, any> = {},
      currentFilters?: Record<string, any>
    ) => {
      if (!accessToken) return

      let payload: any = buildPayload(additionalParams, currentFilters)

      const isOnlyExtraQueryParams =
        Object.keys(extraQueryParams || {}).length > 0 &&
        Object.keys(filters || {}).length === 0 &&
        searchParams.toString().length === 0 &&
        Object.keys(additionalParams || {}).length === 0

      if (payload.any && Object.keys(payload.any || {}).length === 0) {
        delete payload.any
      }

      if (payload.all && Object.keys(payload.all || {}).length === 0) {
        delete payload.all
      }

      const { data, meta, statistics }: any = await fetchRecords(
        apiEndpoint,
        pageIndex,
        pageSize,
        payload,
        accessToken,
        locale as Locale,
        setError,
        setSuccess,
        isOnlyExtraQueryParams,
        false,
        mergeStatisticsWithDefaults(initialStatistics)
      )

      setRecords(data)
      setMeta(meta)

      if (!gotStatisticsRef.current) {
        setStatistics(statistics)
        gotStatisticsRef.current = true
      }
    },
    [accessToken, apiEndpoint, locale, buildPayload, setError, setSuccess]
  )

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    const newSorting = { sortBy: column, direction }

    setSorting(newSorting)
    loadRecords(0, defaultPageSize, newSorting)
  }

  // Handle filter changes from filter component
  const handleFilterChange = useCallback(
    (newFilters: Record<string, any>) => {
      setFilters(newFilters)
      setActiveFilterSource('local')
      // Reset to first page when filter changes
      const { pageSize } = getStoredPagination()
      // Pass the new filters directly to loadRecords to avoid stale state issues
      loadRecords(0, pageSize, {}, newFilters)
    },
    [loadRecords]
  )

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({})
    setActiveFilterSource('none')
    const { pageIndex, pageSize } = getStoredPagination()
    loadRecords(pageIndex, pageSize)
  }, [loadRecords])

  // Initial load and URL search params changes
  useEffect(() => {
    if (!accessToken) return

    if (activeFilterSource !== 'local' && listView) {
      const hasUrlParams = searchParams.toString().length > 0

      if (hasUrlParams) {
        setActiveFilterSource('url')
      } else if (activeFilterSource !== 'url') {
        setActiveFilterSource('none')
      }

      const { pageIndex, pageSize } = getStoredPagination()
      loadRecords(pageIndex, pageSize)
    }
  }, [accessToken, searchParams, listView]) // Only depend on searchParams changes

  const handleDelete = useCallback(
    async (id: any) => {
      if (!accessToken) return

      if (
        await deleteRecordById(
          deleteApiEndpoint ?? apiEndpoint,
          id,
          accessToken,
          settings.mode == 'dark' ? 'dark' : 'light',
          setError,
          setSuccess
        )
      ) {
        setRecords(prev => prev.filter((record: any) => record.id !== id))
        setMeta(prev => ({ ...prev, total: prev.total - 1 }))
      }
    },
    [accessToken, apiEndpoint, deleteApiEndpoint, setError, setSuccess]
  )

  const handleHeaderOptionAction = useCallback(
    (action: string) => {
      const permissionMap: Record<string, { allowed: boolean; message: string }> = {
        refresh: { allowed: true, message: '' },
        add: { allowed: canAdd, message: 'ليس لديك صلاحية الإضافة' },
        search: { allowed: canSearch, message: 'ليس لديك صلاحية البحث' },
        print: { allowed: canPrint, message: 'ليس لديك صلاحية الطباعة' }
      }

      const permission = permissionMap[action]

      if (permission && !permission.allowed) {
        toast.error(permission.message)
        return
      }

      const actions: Record<string, () => void> = {
        refresh: async () => {
          // Clear local filters and reset to URL params
          setFilters({})
          setActiveFilterSource('none')
          router.replace(getLocalizedUrl(`${normalizedRouterUrl}/list`, locale as Locale))
          const { pageIndex, pageSize } = getStoredPagination()
          loadRecords(pageIndex, pageSize)
        },
        add: () => navigateWithQuery(`${normalizedRouterUrl}/details?mode=add`, router, locale as Locale),
        search: () => {
          // Clear local filters when going to search mode
          setFilters({})
          setActiveFilterSource('none')
          navigateWithQuery(`${normalizedRouterUrl}/details?mode=search`, router, locale as Locale)
        },
        print: () => handlePrint()
      }

      actions[action]?.()
    },
    [canAdd, canSearch, canPrint, router, routerUrl, locale, loadRecords, navigateWithQuery]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault()
        handleHeaderOptionAction('add')
      } else if (event.key === 'F9') {
        event.preventDefault()
        handleHeaderOptionAction('search')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleHeaderOptionAction])

  const handleMultiDelete = useCallback(
    async (selectedIds: any[]) => {
      if (!accessToken || selectedIds.length === 0) return
      let theme = settings.mode == 'dark' ? 'dark' : 'light'
      const success: any = await deleteRecordsById(
        `${deleteApiEndpoint ?? apiEndpoint}/destroyAll`,
        selectedIds,
        accessToken,
        theme,
        setError,
        setSuccess
      )

      showDeleteSummaryToast(success?.data?.deleted?.ids, success?.data?.not_deleted?.ids)

      const { pageIndex, pageSize } = getStoredPagination()
      loadRecords(pageIndex, pageSize)
    },
    [accessToken, apiEndpoint, deleteApiEndpoint, setError, setSuccess, loadRecords]
  )

  const handleRowOptionClick = (action: string, id: any, customUrl?: string) => {
    const permissionMap: Record<string, { allowed: boolean; message: string }> = {
      show: { allowed: true, message: 'ليس لديك صلاحية العرض' },
      edit: { allowed: canEdit, message: 'ليس لديك صلاحية التعديل' },
      delete: { allowed: canDelete, message: 'ليس لديك صلاحية الحذف' }
    }

    const permission = permissionMap[action]

    if (permission && !permission.allowed) {
      toast.error(permission.message)
      return
    }

    const baseUrl = customUrl ? normalizeUrl(customUrl) : normalizedRouterUrl

    const actions: Record<string, () => void> = {
      show: () => navigateWithQuery(`${baseUrl}/details?id=${id}&mode=show`, router, locale as Locale),
      edit: () => navigateWithQuery(`${baseUrl}/details?id=${id}&mode=edit`, router, locale as Locale),
      delete: () => handleDelete(id)
    }

    actions[action]?.()
  }

  return {
    records,
    meta,
    loadRecords,
    handleDelete,
    handleHeaderOptionAction,
    handleRowOptionClick,
    handleMultiDelete,
    handleFilterChange,
    handleClearFilters,
    filters,
    statistics,
    activeFilterSource,
    locale,
    handleSort,
    isNafathFlow,
    setSuccess,
    setWarning,
    setInfo,
    setError,
    domain
  }
}
