// =====================================================
// Updated ListOfValue.tsx with Universal Refresh
// =====================================================
'use client'

import debounce from 'lodash.debounce'
import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useSessionHandler,
  useParams,
  useRef,
  fetchRecords_GET,
  fetchRecords,
  useSearchParams
} from '@/shared'

import type { CustomAutocompleteProps, Locale, Mode, Option, SearchMode } from '@/shared'
import { buildNestedObject, useLOVContext } from '../../contexts/lovContext'
import React from 'react'

const globalResolvedValues = new Set<string>()
//
export function ListOfValue({
  field,
  row,
  rowIndex,
  handleInputChange,
  errors,
  apiUrl,
  disabled = false,
  selectFirstValue = false,
  initialData = [],
  onKeyDown,
  onFocus
}: CustomAutocompleteProps) {
  const {
    name,
    label,
    options = [],
    required = false,
    keyProp = 'value',
    labelProp = 'label',
    lovKeyName,
    queryParams = {},
    cacheWithDifferentKey,
    cache = false,
    displayProps = [],
    multiple = false,
    searchProps: incomingSearchProps = [],
    searchMode = '' as SearchMode,
    searchInBackend = true,
    apiMethod = 'POST',
    showRefreshButton = true, // ✅ New prop to control refresh button visibility
    responseDataKey,
    perPage = 50,
    skipDataSuffix,
    placeholder = ''
  } = field

  // Derive searchProps based on priority:
  // 1. Provided searchProps (incomingSearchProps)
  // 2. Any field in displayProps that contains "name"
  // 3. Fallback to labelProp
  const searchProps = useMemo(() => {
    const fields = new Set<string>()
    const addField = (v: any) => {
      if (!v) return
      if (typeof v === 'string') {
        v.split(',').forEach(part => {
          const trimmed = part.trim()
          if (trimmed && trimmed !== 'value' && trimmed !== 'label') {
            fields.add(trimmed)
          }
        })
      } else if (Array.isArray(v)) {
        v.forEach(addField)
      }
    }

    // 1. Primary search fields (provided or derived)
    if (incomingSearchProps && incomingSearchProps.length > 0) {
      addField(incomingSearchProps)
    } else {
      const nameProp = displayProps.find(prop => prop.toLowerCase().includes('name'))
      if (nameProp) addField(nameProp)
      else addField(labelProp)
    }

    // 2. Include these ONLY if explicitly provided in field configuration
    if (field.labelProp) addField(field.labelProp)
    if (field.keyProp) addField(field.keyProp)
    if (field.displayProps) addField(field.displayProps)

    return Array.from(fields)
  }, [incomingSearchProps, displayProps, labelProp, field.labelProp, field.keyProp, field.displayProps])
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') as Mode
  const initialValue = row[lovKeyName || name]
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState<Option[] | Option | null>(multiple ? [] : null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Option[]>([])
  const [localFilteredOptions, setLocalFilteredOptions] = useState<Option[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false) // ✅ New state for refresh loading

  const { accessToken } = useSessionHandler()
  const { lang: locale } = useParams()
  const { getOptions, setOptions, fetchOptions, isLoading, clearCache } = useLOVContext()
  const hasFetchedRef = useRef<Set<string>>(new Set())

  const cacheKey = useMemo(() => {
    if (!apiUrl) return ''
    const serialized = JSON.stringify({
      params: Object.keys(queryParams)
        .sort()
        .reduce(
          (acc, key) => {
            acc[key] = queryParams[key]
            return acc
          },
          {} as Record<string, any>
        ),
      responseDataKey,
      perPage
    })
    return cacheWithDifferentKey ? `${apiUrl}-${name}-${serialized}` : `${apiUrl}-${serialized}`
  }, [apiUrl, name, queryParams, cacheWithDifferentKey, responseDataKey, perPage])

  const contextOptions = getOptions(cacheKey, cache as boolean) || []
  const loading = isLoading(cacheKey)

  const baseOptions = useMemo(() => {
    const mapToOption = (item: any) => ({
      ...item,
      value: item.value ?? item[keyProp] ?? item.id,
      label: item.label ?? item[labelProp] ?? (item.name || item.title)
    })

    const merged = [...initialData.map(mapToOption), ...options.map(mapToOption), ...contextOptions.map(mapToOption)]

    return merged.filter((v, i, a) => a.findIndex(t => String(t.value) === String(v.value)) === i)
  }, [initialData, options, contextOptions, keyProp, labelProp])
  const baseOptionsRef = useRef(baseOptions)
  useEffect(() => {
    baseOptionsRef.current = baseOptions
  }, [baseOptions])

  const hasStaticOptions = options.length > 0
  const shouldSearchLocally = hasStaticOptions || !searchInBackend

  const allOptions = useMemo(() => {
    if (isSearching) {
      if (searchResults.length > 0) {
        return searchResults
      }
      return localFilteredOptions
    }
    return baseOptions
  }, [isSearching, searchResults, localFilteredOptions, baseOptions])

  const firstValueSelectedRef = useRef(false)

  // Effect for selecting first value - works with both API and static options
  useEffect(() => {
    // Reset ref when options change or component remounts
    if (allOptions.length > 0) {
      firstValueSelectedRef.current = false
    }
  }, [options, initialData])

  // Main effect for selectFirstValue
  useEffect(() => {
    // Skip if already selected or no options or not in selectFirstValue mode
    if (!selectFirstValue || allOptions.length === 0 || selectedOption) return

    // Skip in search mode
    if (initialMode === 'search') return

    // Skip if already selected
    if (firstValueSelectedRef.current) return

    firstValueSelectedRef.current = true

    if (multiple) {
      setSelectedOption([allOptions[0]])
      handleInputChange?.(rowIndex, field.name, [allOptions[0][keyProp ?? 'id']])
    } else {
      setSelectedOption(allOptions[0])
      handleInputChange?.(rowIndex, field.name, allOptions[0][keyProp ?? 'id'])
    }
  }, [
    selectFirstValue,
    allOptions,
    selectedOption,
    initialMode,
    multiple,
    handleInputChange,
    rowIndex,
    field.name,
    keyProp,
    options // Add options to ensure it works with static options
  ])

  const initialFetchDoneRef = useRef(false)

  useEffect(() => {
    if (!apiUrl || !accessToken || !cacheKey) return

    // ✅ Only run in edit mode AND when there is a value
    // if (initialMode !== 'edit') return
    // if (initialValue == null || initialValue === '') return

    const hasValue = initialValue != null && initialValue !== ''

    if (initialMode !== 'edit' && !hasValue && !selectFirstValue) return
    // ✅ Check if already fetched this cache key
    if (hasFetchedRef.current.has(cacheKey)) return

    const cached = getOptions(cacheKey, cache as boolean)

    if (cache) {
      if (!cached?.length) {
        hasFetchedRef.current.add(cacheKey)
        fetchOptions({
          cacheKey,
          apiUrl,
          accessToken,
          locale: locale as string,
          queryParams,
          keyProp,
          labelProp,
          searchInBackend,
          displayProps,
          searchProps,
          searchMode,
          cache: cache as boolean,
          apiMethod,
          responseDataKey,
          perPage,
          skipDataSuffix
        })
      }
    }

    if (!cache) {
      if (!cached?.length) {
        hasFetchedRef.current.add(cacheKey)
        fetchOptions({
          cacheKey,
          apiUrl,
          accessToken,
          locale: locale as string,
          queryParams,
          keyProp,
          labelProp,
          searchInBackend,
          displayProps,
          searchProps,
          searchMode,
          cache,
          apiMethod,
          responseDataKey,
          perPage,
          skipDataSuffix
        })
      }
    }
  }, [cacheKey, apiUrl, accessToken, initialMode, initialValue])
  // useEffect(() => {
  //   if (!apiUrl || !accessToken || !cacheKey) return

  //   // ✅ Check if already fetched this cache key
  //   if (hasFetchedRef.current.has(cacheKey)) return

  //   const cached = getOptions(cacheKey, cache as boolean)

  //   if (cache) {
  //     if (!cached?.length) {
  //       hasFetchedRef.current.add(cacheKey) // ✅ Mark as fetched
  //       fetchOptions({
  //         cacheKey,
  //         apiUrl,
  //         accessToken,
  //         locale: locale as string,
  //         queryParams,
  //         keyProp,
  //         labelProp,
  //         searchInBackend,
  //         displayProps,
  //         searchProps,
  //         searchMode,
  //         cache: cache as boolean,
  //         apiMethod
  //       })
  //     }
  //   }

  //   if (!cache) {
  //     if (!cached?.length) {
  //       hasFetchedRef.current.add(cacheKey) // ✅ Mark as fetched
  //       fetchOptions({
  //         cacheKey,
  //         apiUrl,
  //         accessToken,
  //         locale: locale as string,
  //         queryParams,
  //         keyProp,
  //         labelProp,
  //         searchInBackend,
  //         displayProps,
  //         searchProps,
  //         searchMode,
  //         cache,
  //         apiMethod
  //       })
  //     }
  //   }
  // }, [cacheKey, apiUrl, accessToken])

  const searchParamsRef = useRef<{
    apiUrl: string | undefined
    accessToken: string | undefined
    queryParams: any
    searchInBackend: boolean | undefined
    labelProp: string
    keyProp: string
    displayProps: string[]
    searchProps: string[]
    searchMode: SearchMode
    locale: any
    apiMethod: 'POST' | 'GET' | undefined
    hasStaticOptions: boolean
    shouldSearchLocally: boolean
    responseDataKey: string | string[] | undefined
    perPage: number
    skipDataSuffix: boolean | undefined
  }>({
    apiUrl,
    accessToken,
    queryParams,
    searchInBackend,
    labelProp,
    keyProp,
    displayProps,
    searchProps,
    searchMode,
    locale,
    apiMethod,
    hasStaticOptions,
    shouldSearchLocally,
    responseDataKey,
    perPage,
    skipDataSuffix
  })

  useEffect(() => {
    searchParamsRef.current = {
      apiUrl,
      accessToken,
      queryParams,
      searchInBackend,
      labelProp,
      keyProp,
      displayProps,
      searchProps,
      searchMode,
      locale,
      apiMethod,
      hasStaticOptions,
      shouldSearchLocally,
      responseDataKey,
      perPage,
      skipDataSuffix
    }
  }, [
    apiUrl,
    accessToken,
    queryParams,
    searchInBackend,
    labelProp,
    keyProp,
    displayProps,
    searchProps,
    searchMode,
    locale,
    apiMethod,
    hasStaticOptions,
    shouldSearchLocally,
    responseDataKey,
    perPage,
    skipDataSuffix
  ])

  const searchLocally = useCallback((searchTerm: string, optionsToSearch: Option[]) => {
    if (!searchTerm || !searchTerm.trim()) {
      return optionsToSearch
    }

    const params = searchParamsRef.current
    const lowerSearch = searchTerm.toLowerCase()

    const filtered = optionsToSearch.filter(option => {
      // Check label
      const label = String(option[params.labelProp] || '').toLowerCase()
      if (label.includes(lowerSearch)) return true

      // Check displayProps
      for (const prop of params.displayProps) {
        // ✅ Handle comma-separated properties
        if (prop.includes(',')) {
          const subProps = prop.split(',').map(p => p.trim())
          for (const subProp of subProps) {
            let value
            if (subProp.includes('.')) {
              value = subProp.split('.').reduce((acc: any, key: string) => acc?.[key], option)
            } else {
              value = option[subProp]
            }
            if (value && String(value).toLowerCase().includes(lowerSearch)) return true
          }
        } else {
          // ✅ Handle simple or nested properties
          let value
          if (prop.includes('.')) {
            value = prop.split('.').reduce((acc: any, key: string) => acc?.[key], option)
          } else {
            value = option[prop]
          }
          if (value && String(value).toLowerCase().includes(lowerSearch)) return true
        }
      }

      // Check searchProps
      for (const prop of params.searchProps) {
        // ✅ Handle comma-separated properties in searchProps too
        if (prop.includes(',')) {
          const subProps = prop.split(',').map(p => p.trim())
          for (const subProp of subProps) {
            let value
            if (subProp.includes('.')) {
              value = subProp.split('.').reduce((acc: any, key: string) => acc?.[key], option)
            } else {
              value = option[subProp]
            }
            if (value && String(value).toLowerCase().includes(lowerSearch)) return true
          }
        } else {
          let value
          if (prop.includes('.')) {
            value = prop.split('.').reduce((acc: any, key: string) => acc?.[key], option)
          } else {
            value = option[prop]
          }
          if (value && String(value).toLowerCase().includes(lowerSearch)) return true
        }
      }

      return false
    })

    return filtered
  }, [])

  const searchBackend = useCallback(async (search: string) => {
    const params: any = searchParamsRef.current

    if (!params.apiUrl || !params.accessToken) {
      return []
    }

    try {
      let payload: any = {}

      if (params.searchInBackend) {
        const wrappedSearch = search.includes('%') ? search : `%${search}%`

        const searchFields = new Set<string>()

        const addField = (f: string) => {
          if (!f) return

          f.split(',').forEach(part => {
            const trimmed = part.trim()
            if (trimmed && trimmed !== 'value' && trimmed !== 'label') searchFields.add(trimmed)
          })
        }

        // ✅ ONLY searchProps (NO fallback)
        if (params.searchProps?.length) {
          params.searchProps.forEach(addField)
        }

        // let any: any = {}
        // searchFields.forEach(field => {
        //   any[field] = wrappedSearch
        // })

        const any = buildNestedObject(searchFields, wrappedSearch)

        const all: Record<string, any> = {
          ...params.queryParams
        }

        payload = {
          any,
          all,
          is_granted: true
        }

        if (params.searchMode?.trim()) {
          payload.operator = params.searchMode
        }
      } else {
        payload = {
          all: { ...params.queryParams },
          is_granted: true
        }
      }

      // cleanup empty objects
      if (payload.any && !Object.keys(payload.any).length) {
        delete payload.any
      }

      if (payload.all && !Object.keys(payload.all).length) {
        delete payload.all
      }

      let response: any

      if (params.apiMethod === 'GET') {
        const serializedParams: Record<string, string> = {}

        Object.entries(payload).forEach(([key, value]) => {
          if (value == null) return

          serializedParams[key] = typeof value === 'object' ? JSON.stringify(value) : String(value)
        })

        const queryString = new URLSearchParams(serializedParams).toString()

        response = await fetchRecords_GET(
          params.apiUrl,
          0,
          params.perPage,
          queryString,
          params.accessToken,
          params.locale as Locale
        )
      } else {
        response = await fetchRecords(
          params.apiUrl,
          0,
          params.perPage,
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
      // RESPONSE HANDLING
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

      return data.map((item: any) => ({
        ...item,
        value: item.value ?? item[params.keyProp] ?? item.id,
        label: item.label ?? item[params.labelProp] ?? (item.name || item.title)
      }))
    } catch (error) {
      console.error('❌ Backend search error:', error)
      return []
    }
  }, [])

  const performSearch = useCallback(
    async (search: string) => {
      if (!search || !search.trim()) {
        setSearchResults([])
        setLocalFilteredOptions([])
        return
      }

      const params = searchParamsRef.current
      const currentOptions = baseOptionsRef.current

      const localResults = searchLocally(search, currentOptions)

      if (params.shouldSearchLocally) {
        setLocalFilteredOptions(localResults)

        if (localResults.length > 0 || !params.searchInBackend || !params.apiUrl) {
          return
        }
      }

      if (params.searchInBackend && params.apiUrl && params.accessToken) {
        const backendResults = await searchBackend(search)
        setSearchResults(backendResults)
      }
    },
    [searchLocally, searchBackend]
  )

  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null)

  useEffect(() => {
    debouncedSearchRef.current = debounce((search: string) => {
      performSearch(search)
    }, 1000)

    return () => {
      debouncedSearchRef.current?.cancel()
    }
  }, [performSearch])

  const resolveMissingValue = useCallback(
    async (value: any) => {
      if (!apiUrl || !accessToken || value == null) return

      const resolveKey = `${cacheKey}-${String(value)}`
      if (globalResolvedValues.has(resolveKey)) return
      globalResolvedValues.add(resolveKey)

      const exists = baseOptions.some(o => String(o.value) === String(value))
      if (exists) return

      try {
        let response: any

        // ✅ Handle different API methods
        if (apiMethod === 'GET') {
          const queryString = new URLSearchParams({ [keyProp]: String(value) }).toString()
          response = await fetchRecords_GET(apiUrl, 0, 1, queryString, accessToken, locale as Locale)
        } else {
          const queryObj: any = { [keyProp]: Number(value) }
          response = await fetchRecords(apiUrl, 0, 1, queryObj, accessToken, locale as Locale)
        }

        const rawResponse = response?.data
        const actualData = rawResponse?.data || rawResponse // Handle double data nesting
        let data: any[] = []

        if (responseDataKey) {
          const keys = Array.isArray(responseDataKey) ? responseDataKey : [responseDataKey]
          data = keys.flatMap((key: string) => actualData?.[key] ?? [])
        } else if (Array.isArray(actualData)) {
          data = actualData
        } else if (actualData && typeof actualData === 'object') {
          const firstArray = Object.values(actualData).find(v => Array.isArray(v))
          data = (firstArray as any[]) ?? []
        } else {
          data = actualData ?? []
        }

        if (data?.length) {
          const item = data[0]
          const option = {
            ...item,
            value: item.value ?? (keyProp ? item[keyProp] : item.id),
            label: item.label ?? (labelProp ? item[labelProp] : item.name || item.title)
          }
          const current = getOptions(cacheKey, cache as boolean) || []
          setOptions(cacheKey, [option, ...current], cache as boolean)
        }
      } catch (error) {
        console.error('Error resolving value:', error)
      }
    },
    [apiUrl, accessToken, cacheKey, keyProp, labelProp, locale, baseOptions, getOptions, setOptions, apiMethod]
  )

  useEffect(() => {
    if (initialValue == null || !initialValue) {
      if (multiple && Array.isArray(selectedOption) && selectedOption.length > 0) {
        setSelectedOption([])
      } else if (!multiple && selectedOption !== null) {
        setSelectedOption(null)
      }
      return
    }

    if (baseOptions.length === 0) return

    if (multiple) {
      const normalizeToArray = (val: any): any[] => {
        if (Array.isArray(val)) return val
        if (typeof val === 'string') return val.split(',').map(v => v.trim())
        return [val]
      }

      const initialArray = normalizeToArray(initialValue)
      const selected = baseOptions.filter(o => initialArray.some(v => String(v) === String(o.value)))

      if (selected.length !== initialArray.length) {
        initialArray.forEach(v => resolveMissingValue(v))
        return
      }

      const same =
        Array.isArray(selectedOption) &&
        selectedOption.length === selected.length &&
        selectedOption.every((o, i) => String(o.value) === String(selected[i].value))

      if (!same) setSelectedOption(selected)
    } else {
      const selected = baseOptions.find(o => String(o.value) === String(initialValue))

      if (!selected) {
        resolveMissingValue(initialValue)
        return
      }

      if (!selectedOption || String((selectedOption as Option).value) !== String(selected.value)) {
        setSelectedOption(selected)
      }
    }
  }, [initialValue, baseOptions, multiple, selectedOption, resolveMissingValue])

  // ✅ Updated: Universal refresh handler (works for both cached and non-cached)
  const handleRefresh = useCallback(async () => {
    if (!apiUrl || !accessToken || isRefreshing) return

    setIsRefreshing(true)

    try {
      // 1. If cached, clear the cache first
      if (cache) {
        clearCache(cacheKey)
      }

      // 2. Reset the fetched tracking so it can fetch again
      hasFetchedRef.current.delete(cacheKey)

      // 3. Fetch fresh data with forceRefresh flag (will be cached if cache=true)
      await fetchOptions({
        cacheKey,
        apiUrl,
        accessToken,
        locale: locale as string,
        queryParams,
        keyProp,
        labelProp,
        searchInBackend,
        displayProps,
        searchProps,
        searchMode,
        cache: cache as boolean, // ✅ Will cache if cache=true
        apiMethod,
        forceRefresh: true, // ✅ Bypass all cache checks
        responseDataKey,
        perPage,
        skipDataSuffix
      })

      // 4. Clear search state
      setIsSearching(false)
      setSearchResults([])
      setLocalFilteredOptions([])
      setInputValue('')
    } catch (error) {
      console.error('❌ Refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [
    apiUrl,
    accessToken,
    // isRefreshing,
    cache,
    cacheKey,
    clearCache,
    fetchOptions,
    locale,
    queryParams,
    keyProp,
    labelProp,
    searchInBackend,
    displayProps,
    searchProps,
    searchMode,
    apiMethod
  ])

  const handleFocus = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) onFocus(e)
      if (!apiUrl || !accessToken || isRefreshing) return

      const existingOptions = getOptions(cacheKey, cache as boolean)

      // ✅ If we already have data, do NOT fetch again
      if (existingOptions && existingOptions.length > 0) {
        return
      }

      setIsRefreshing(true)

      try {
        await fetchOptions({
          cacheKey,
          apiUrl,
          accessToken,
          locale: locale as string,
          queryParams,
          keyProp,
          labelProp,
          searchInBackend,
          displayProps,
          searchProps,
          searchMode,
          responseDataKey,
          perPage,
          skipDataSuffix,
          cache: cache as boolean,
          apiMethod,
          forceRefresh: true
        })

        setIsSearching(false)
        setSearchResults([])
        setLocalFilteredOptions([])
        setInputValue('')
      } catch (error) {
        console.error('❌ Focus fetch error:', error)
      } finally {
        setIsRefreshing(false)
      }
    },
    [
      apiUrl,
      accessToken,
      isRefreshing,
      cacheKey,
      getOptions,
      fetchOptions,
      locale,
      queryParams,
      keyProp,
      labelProp,
      searchInBackend,
      displayProps,
      searchProps,
      searchMode,
      apiMethod,
      cache,
      perPage
    ]
  )

  const handleOptionChange = useCallback(
    (newValue: Option | Option[] | null) => {
      if (multiple) {
        const values = Array.isArray(newValue) ? newValue.map(o => o.value) : []
        setSelectedOption(newValue as Option[])
        handleInputChange(rowIndex, name, values, newValue)
      } else {
        const value = (newValue as Option)?.value ?? ''
        setSelectedOption(newValue as Option | null)
        handleInputChange(rowIndex, name, value, newValue)
      }
    },
    [multiple, rowIndex, name, handleInputChange]
  )

  const handleInputValueChange = useCallback((_event: React.SyntheticEvent, value: string, reason: string) => {
    setInputValue(value)

    if (reason === 'input') {
      if (value && value.trim()) {
        setIsSearching(true)
        if (debouncedSearchRef.current) {
          debouncedSearchRef.current(value)
        }
      } else {
        setIsSearching(false)
        setSearchResults([])
        setLocalFilteredOptions([])
        debouncedSearchRef.current?.cancel()
      }
    }

    if (reason === 'reset' || reason === 'clear') {
      setIsSearching(false)
      setSearchResults([])
      setLocalFilteredOptions([])
      debouncedSearchRef.current?.cancel()
    }
  }, [])

  const errorMessage = Array.isArray(errors)
    ? errors.find((e: any) => e.rowIndex === rowIndex && e.fieldName === name)?.message
    : errors?.[rowIndex]?.[name]

  const getOptionLabel = useCallback(
    (option: any) => {
      if (typeof option === 'string') return option

      if (displayProps?.length) {
        return displayProps
          .map(prop => {
            // ✅ Handle comma-separated properties (e.g., "fir_name_ar,far_name_ar,gra_name_ar,fam_name_ar")
            if (prop.includes(',')) {
              const subProps = prop.split(',').map(p => p.trim())
              return subProps
                .map(subProp => {
                  if (subProp.includes('.')) {
                    return subProp.split('.').reduce((acc, key) => acc?.[key], option) || ''
                  }
                  return option[subProp] || ''
                })
                .filter(Boolean)
                .join(' ')
            }

            // ✅ Handle nested properties (e.g., "user.name")
            if (prop.includes('.')) {
              return prop.split('.').reduce((acc, key) => acc?.[key], option) || ''
            }

            // ✅ Handle simple properties
            return option[prop] || ''
          })
          .filter(Boolean)
          .join(' - ')
      }

      return String(option[labelProp] || '')
    },
    [displayProps, labelProp]
  )

  // ✅ Updated: Show refresh button for any field with apiUrl (cached or not)
  const showRefresh = showRefreshButton && apiUrl && !disabled

  // ✅ FIX: Memoize the refresh click handler to prevent infinite loops
  const handleRefreshClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      handleRefresh()
    },
    [handleRefresh]
  )

  const renderInputCallback = useCallback(
    (params: any) => (
      <TextField
        {...params}
        label={`${label ?? ''}${required ? '*' : ''}`}
        placeholder={placeholder}
        error={!!errorMessage}
        helperText={errorMessage}
        name={name}
        id={name}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading || isRefreshing ? <CircularProgress size={18} /> : null}

              {showRefresh && (
                <Tooltip title={cache ? 'تحديث وحفظ البيانات' : 'تحديث البيانات'} placement='top'>
                  <IconButton
                    size='small'
                    onClick={handleRefreshClick}
                    disabled={isRefreshing || loading}
                    sx={{
                      padding: '2px',
                      marginRight: '2px',
                      visibility: 'hidden',
                      transition: 'opacity 0.2s',
                      opacity: 0,
                      '.MuiAutocomplete-root:hover &': {
                        visibility: 'visible',
                        opacity: 1
                      },
                      '.MuiAutocomplete-root.Mui-focused &': {
                        visibility: 'visible',
                        opacity: 1
                      },
                      '& i': {
                        fontSize: '18px',
                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                      }
                    }}
                  >
                    <i className='ri-refresh-line' />
                  </IconButton>
                </Tooltip>
              )}

              {params.InputProps.endAdornment}
            </React.Fragment>
          )
        }}
      />
    ),
    [label, required, errorMessage, name, loading, showRefresh, cache, handleRefreshClick]
  )
  return (
    <Autocomplete
      onKeyDown={onKeyDown}
      openOnFocus
      multiple={multiple}
      options={allOptions}
      value={selectedOption as any}
      inputValue={inputValue}
      loading={loading}
      onChange={(_, v) => handleOptionChange(v)}
      onInputChange={handleInputValueChange}
      // onFocus={undefined}
      onFocus={handleFocus}
      disabled={disabled || field?.disabled}
      filterOptions={options => options}
      size='small'
      renderOption={(props, option) => (
        <li {...props} key={'opt-' + option.value}>
          {getOptionLabel(option)}
        </li>
      )}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      getOptionLabel={getOptionLabel}
      renderInput={renderInputCallback} // ✅ Use the memoized callback
      slotProps={{
        popper: {
          sx: {
            zIndex: 1500 // ✅ Ensure it appears above Dialogs (standard Dialog is 1300)
          }
        }
      }}
    />
  )
}

export default ListOfValue
