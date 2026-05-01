import { emitEvent } from '@/libs/eventBus'
import {
  apiClient,
  getLocalizedUrl,
  groupByModelName,
  handleError,
  parseSearchString,
  toast,
  transformArrayObjects
} from '@/shared'
import type { Locale } from '@/shared'
import { StatisticsConfig } from '@/types/components/statistics'
import { skip } from 'node:test'
import Swal from 'sweetalert2'

export const fetchRecordById = async (
  url: string,
  id: string,
  accessToken: string,
  locale: Locale,
  // reset: (data: Partial<any>) => void,
  setData: (data: any) => void,
  setError?: (error: string | null) => void,
  setSuccess?: (success: string | null) => void
) => {
  try {
    emitEvent('loading', { type: 'details' })
    const response = await apiClient.get(`${url}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'Accept-Language': locale }
    })

    setData(response.data.data)
    // if (setSuccess) setSuccess('تمت العملية بنجاح')
    if (setError) setError('')
    // toast.success('User data fetched successfully!') // Success notification
  } catch (error: any) {
    // console.log(error?.response?.data?.message)
    // handleError(error)
    //toast.error('حدث خطأ ما يرجي التواصل مع الدعم الفني') // Error notification
    if (setError) setError(error?.response?.data?.message)
    if (setSuccess) setSuccess('')
  } finally {
    emitEvent('loading', { type: 'details' })
  }
}

// Handle saving (for both search and add/edit modes)
export const handleSave = async (
  url: string,
  locale: Locale,
  data: any,
  recordId: string | null,
  accessToken: string,
  showToast: boolean = true,
  setError?: (error: string | null) => void,
  setSuccess?: (success: string | null) => void
) => {
  try {
    emitEvent('loading', { type: 'create' })
    let res: any
    if (recordId) {
      // Update user data if userId exists
      res = await apiClient.put(`${url}/${recordId}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': locale
        }
      })
      if (showToast) toast.success('تم حفظ السجل بنجاح!') // Success notification
      if (setSuccess) setSuccess('تمت العملية بنجاح')
      if (setError) setError('')
    } else {
      // Create a new user if no userId
      res = await apiClient.post(`${url}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': locale
        }
      })
      if (showToast) toast.success('تم حفظ السجل بنجاح!') // Success notification
      if (setSuccess) setSuccess('تمت العملية بنجاح')
      if (setError) setError('')
    }
    return res
  } catch (error: any) {
    console.log('error in handle save', error)
    // handleError(error)
    // if (showToast) toast.error('حدث خطأ ما يرجي التواصل مع الدعم الفني') // Error notification
    if (setError) setError(error?.response?.data)
    if (setSuccess) setSuccess('')
    throw error
  } finally {
    emitEvent('loading', { type: 'create' })
  }
}

// Fetch users list with pagination and search query support
export const fetchRecords_GET = async (
  url: string,
  pageIndex: number,
  pageSize: number,
  searchQuery: string,
  accessToken: string,
  locale: Locale,
  setError?: (error: string | null) => void,
  setSuccess?: (success: string | null) => void
) => {
  if (!url) return

  try {
    const fullUrl = `${url}?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery ? `&${searchQuery}` : ''}`

    const response = await apiClient.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept-Language': locale,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    // toast.success('User list fetched successfully!') // Success notification
    if (setSuccess) searchQuery ? setSuccess('تمت العملية بنجاح') : setSuccess(null)
    if (setError) setError('')
    // console.log(response)
    return {
      data: response.data.data,
      meta: response.data['meta']
    }
  } catch (error: any) {
    // handleError(error)
    //toast.error('حدث خطأ ما يرجي التواصل مع الدعم الفني') // Error notification
    if (setError) setError(error?.response?.data?.message)
    if (setSuccess) setSuccess('')

    return { data: [], meta: { total: 0, current_page: 1, last_page: 1 } } // Fallback meta on error
  }
}
export const fetchRecords = async (
  url: string,
  pageIndex: number,
  pageSize: number,
  searchQuery: string | Record<string, any>, // Accept both string and object
  accessToken: string,
  locale: Locale,
  setError?: (error: string | null) => void,
  setSuccess?: (success: string | null) => void,
  isOnlyAdditionalParams?: boolean,
  skipDataSuffix: boolean = false,
  statistics?: StatisticsConfig[] // ✅ Add statistics parameter
) => {
  if (!url) return
  try {
    emitEvent('loading', { type: 'list' })

    // Ensure searchQuery is always an object
    let queryObject: any =
      typeof searchQuery === 'string' && searchQuery ? parseSearchString(searchQuery) : searchQuery || {}

    //  Parse any fields that were stringified JSON (arrays/objects)
    Object.keys(queryObject).forEach(key => {
      const value = queryObject[key]
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          // Only replace if parsing results in object or array
          if (typeof parsed === 'object') {
            queryObject[key] = parsed
          }
        } catch {
          // Not a JSON string, leave as-is
        }
      }
    })

    queryObject = transformArrayObjects(queryObject)

    let groupedQuery = groupByModelName(queryObject)

    // ✅ Ensure nested fields inside 'any' and 'all' are also grouped (e.g., house_contract.id -> house_contract: {id: 1})
    if (groupedQuery.any && typeof groupedQuery.any === 'object' && !Array.isArray(groupedQuery.any)) {
      groupedQuery.any = groupByModelName(groupedQuery.any)
    }

    if (groupedQuery.all && typeof groupedQuery.all === 'object' && !Array.isArray(groupedQuery.all)) {
      groupedQuery.all = groupByModelName(groupedQuery.all)
    }

    const body: any = {
      page: pageIndex + 1,
      per_page: pageSize,
      ...groupedQuery
    }

    // ✅ Add statistics if provided
    if (statistics && statistics.length > 0) {
      body.statistics = statistics
    }

    // ✅ Add statistics if provided
    if (statistics && statistics.length > 0) {
      body.statistics = statistics
    }

    const finalUrl = skipDataSuffix ? url : `${url}/data`

    const response = await apiClient.post(finalUrl, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept-Language': locale
      }
    })

    const hasSearchQuery = searchQuery && typeof searchQuery === 'object' && Object.keys(searchQuery).length > 0

    if (setSuccess)
      if (hasSearchQuery && isOnlyAdditionalParams === false) {
        setSuccess('تمت العملية بنجاح')
      } else {
        setSuccess(null)
      }

    if (setError) setError(null)

    return {
      data: response.data.data,
      meta: response.data.meta,
      statistics: response.data?.statistics
    }
  } catch (error: any) {
    if (setError) setError(error?.response?.data?.message ?? null)
    if (setSuccess) setSuccess(null)

    return {
      data: [],
      meta: { total: 0, current_page: 1, last_page: 1 }
    }
  } finally {
    emitEvent('loading', { type: 'list' })
  }
}
// Delete user by ID
export const deleteRecordById = async (
  url: string,
  id: number,
  accessToken: string,
  theme?: any,
  setError?: (error: string | null) => void,
  setSuccess?: (success: string | null) => void
) => {
  // 'show' confirmation dialog
  const result = await Swal.fire({
    title: 'هل أنت متأكد ؟',
    // text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'حذف',
    cancelButtonText: 'إلغاء',

    backdrop: true,
    allowOutsideClick: false,
    customClass: {
      container: 'swal-over-modal'
    },
    theme: theme
  })

  if (result.isConfirmed) {
    try {
      // Perform the delete request
      await apiClient.delete(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'ar'
        }
      })

      // Success alert
      Swal.fire({
        title: 'تم الحذف!',
        text: 'تم حذف هذا السجل بنجاح ',
        icon: 'success',
        confirmButtonText: 'تأكيد',
        backdrop: true,
        allowOutsideClick: false,
        customClass: {
          container: 'swal-over-modal'
        },
        theme: theme
      })
      if (setSuccess) setSuccess('تمت العملية بنجاح')
      if (setError) setError('')

      return true // Return success status
    } catch (error: any) {
      // handleError(error)
      //toast.error('حدث خطأ ما يرجي التواصل مع الدعم الفني') // Error notification
      if (setError) setError(error?.response?.data?.message)
      if (setSuccess) setSuccess('')

      return false // Indicate failure
    }
  }
}

// Delete user by ID
export const deleteRecordsById = async (
  url: string,
  ids: number[],
  accessToken: string,
  theme: any,
  setError?: (error: string | null) => void,
  setSuccess?: (success: string | null) => void
) => {
  // 'show' confirmation dialog
  const result = await Swal.fire({
    title: 'هل أنت متأكد ؟',
    // text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'حذف',
    cancelButtonText: 'إلغاء',
    backdrop: true,
    allowOutsideClick: false,
    customClass: {
      container: 'swal-over-modal'
    },
    theme: theme
  })

  if (result.isConfirmed) {
    try {
      // Perform the delete request
      const res = await apiClient.post(
        `${url}`,
        { ids: ids },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': 'ar'
          }
        }
      )

      // Success alert
      Swal.fire({
        title: 'تم الحذف!',
        text: 'تم حذف هذة السجلات بنجاح ',
        icon: 'success',
        confirmButtonText: 'تأكيد',
        backdrop: true,
        allowOutsideClick: false,
        customClass: {
          container: 'swal-over-modal'
        },
        theme: theme
      })
      if (setSuccess) setSuccess('تمت العملية بنجاح')
      if (setError) setError('')

      return res // Return success status
    } catch (error: any) {
      // handleError(error)
      //toast.error('حدث خطأ ما يرجي التواصل مع الدعم الفني') // Error notification
      if (setError) setError(error?.response?.data?.message)
      if (setSuccess) setSuccess('')

      return false // Indicate failure
    }
  }
}
