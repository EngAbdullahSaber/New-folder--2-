import { useErrorApi } from '@/contexts/errorApiProvider'
import { useSuccessApi } from '@/contexts/successApiProvider'
import { usePrintMode } from '@/contexts/usePrintModeContext'
import { useTabFormContext } from '@/contexts/useTabForm'
import { InferInput } from 'valibot'
import {
  valibotResolver,
  fetchRecordById,
  handleSave,
  useNavigation,
  useParams,
  useRouter,
  useSearchParams,
  useSessionHandler,
  resetForm,
  useState,
  useEffect,
  filterObject,
  filterArray,
  formatErrors,
  getLocalizedUrl,
  getChangedRows,
  scrollToTop,
  deleteRecordById,
  generateSchemaBuilder,
  generateDefaultValues,
  adjustValidationForMode,
  mapApiFieldsToFormSchema,
  extractExtraFields,
  mergeExtraFields,
  extractExtraFieldsForSearch,
  validateTabFields,
  getTabIndexForField,
  apiClient,
  onEvent
} from '@/shared'
import type { Mode, Locale, DynamicFormFieldProps, FieldValues, SubmitHandler, OnSubmitParams } from '@/shared'
import { SyntheticEvent, useCallback, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useScreenPermissions } from './useScreenPermission'
import { getDictionary } from '@/utils/getDictionary'
import { useWarningApi } from '@/contexts/warningApiProvider'
import { useInfoApi } from '@/contexts/infoApiProvider'
import { usePathname } from 'next/navigation'
import { getOperatorConfig } from '@/configs/environment'
import { set } from 'lodash'

type ClassifiedObject = {
  objectName: string
  fields: any[]
}

type DetailsTableConfig = {
  fields?: DynamicFormFieldProps[]
  trackIndex?: boolean
}

type DetailsTablesConfigMap = {
  [key: string]: DetailsTableConfig
}

export const useRecordForm = <T extends FieldValues>({
  apiEndpoint = '',
  routerUrl = '',
  fields = [],
  initialDetailsData = {},
  excludeFields = [],
  saveMode = 'show',
  tabsCount = 0,
  modalRecordId,
  classifiedObjects = [],
  tabConfig = [],
  detailsTablesConfig = {},
  modeParam = undefined,
  fetchConfig,
  onSaveSuccess,
  onSaveError,
  onMenuActionClick,
  onBeforeSave,
  transformPayload,
  fetchKeyProp = 'id',
  detailsTitles = {},
  customDetailValidators = {},
  defaultSubmitParams = {} as OnSubmitParams
}: {
  apiEndpoint: string
  routerUrl: any
  fields: DynamicFormFieldProps[]
  initialDetailsData?: { [key: string]: any[] }
  excludeFields?: { fields: DynamicFormFieldProps[]; action: Mode }[]
  saveMode?: Mode
  tabsCount?: number
  modalRecordId?: any
  classifiedObjects?: ClassifiedObject[]
  tabConfig?: Array<{ label: string; fields: DynamicFormFieldProps[] }>
  detailsTablesConfig?: DetailsTablesConfigMap
  modeParam?: Mode
  detailsTitles?: Record<string, string>
  fetchConfig?: {
    // ✅ Make it truly optional
    enabled?: boolean
    url?: string
    method?: 'GET' | 'POST' | 'PUT'
    params?: Record<string, any>
    shouldSetDataModel?: boolean
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
  }
  onSaveSuccess?: (response: any, mode: Mode) => void | Promise<void>
  onSaveError?: (error: any, mode: Mode) => void | Promise<void>
  onMenuActionClick?: (action: any, mode: Mode) => void | Promise<void>
  onBeforeSave?: (data: T, detailsData: any) => boolean | Promise<boolean>
  transformPayload?: (payload: any, detailsData: any) => any
  fetchKeyProp?: string
  customDetailValidators?: Record<
    string,
    (
      row: any,
      rowIndex: number
    ) => {
      valid: boolean
      errors: Array<{ fieldName: string; message: string }>
    }
  >
  defaultSubmitParams?: OnSubmitParams
}) => {
  const router = useRouter()
  const { accessToken } = useSessionHandler()
  const { navigateWithQuery } = useNavigation()
  const searchParams = useSearchParams()
  const urlRecordId = searchParams.get('id')
  const recordId = modalRecordId ?? urlRecordId
  const pathname = usePathname()
  const isNafathFlow = pathname.includes('nafath')
  const initialMode = searchParams.get('mode') as Mode
  const { lang: locale } = useParams()

  // ✅ State
  const [mode, setMode] = useState<Mode>(modalRecordId ? 'show' : modeParam ? modeParam : initialMode || 'search')
  const [detailsData, setDetailsData] = useState<{ [key: string]: any[] }>(initialDetailsData)
  const [errors, setErrors] = useState<any[]>([])
  const [openDocumentsDialog, setOpenDocumentsDialog] = useState(false)
  const [openRecordInformationDialog, setOpenRecordInformationDialog] = useState(false)
  const [openRecordTrackingDialog, setOpenRecordTrackingDialog] = useState(false)
  const [tabValue, setTabValue] = useState<string>('0')
  const [dataModel, setDataModel] = useState<any>({})
  const [extraFields, setExtraFields] = useState<any[]>([])
  const [dynamicExtraFields, setDynamicExtraFields] = useState<any[]>([])
  const [rawRecord, setRawRecord] = useState<any>(null)
  const [dynamicFieldsProcessed, setDynamicFieldsProcessed] = useState(false)
  const [validatedTabs, setValidatedTabs] = useState<Set<number>>(new Set([0]))
  const [attemptedTabs, setAttemptedTabs] = useState<Set<number>>(new Set())
  const [dictionary, setDictionary] = useState<any>(null)

  // ✅ Contexts
  const { tabContextValue, setTabContextValue } = useTabFormContext()
  const { triggerPrintMode } = usePrintMode()
  const { screenData, canSearch } = useScreenPermissions(mode)
  const { setWarning, warning } = useWarningApi()
  const { setInfo } = useInfoApi()
  const { setError, error } = useErrorApi()
  const { setSuccess } = useSuccessApi()
  const { domain } = getOperatorConfig()

  // ✅ Refs (stable references)
  const tabConfigRef = useRef(tabConfig)
  const fieldsRef = useRef(fields)
  const extraFieldsRef = useRef(extraFields)
  const dynamicExtraFieldsRef = useRef(dynamicExtraFields)
  const modeRef = useRef(mode)
  const rawRecordRef = useRef<any>(null)
  const isPostSaveFetchRef = useRef(false)
  const hasReset = useRef(false)
  const fetchedRecordIdRef = useRef<string | null>(null)
  const hasFetchedRef = useRef<string | null>(null)

  // ✅ Update refs
  useEffect(() => {
    tabConfigRef.current = tabConfig
  }, [tabConfig])

  useEffect(() => {
    fieldsRef.current = fields
    extraFieldsRef.current = extraFields
    dynamicExtraFieldsRef.current = dynamicExtraFields
    modeRef.current = mode
  }, [fields, extraFields, dynamicExtraFields, mode])

  useEffect(() => {
    rawRecordRef.current = rawRecord
  }, [rawRecord])

  // ✅ Load dictionary
  useEffect(() => {
    getDictionary(locale as Locale).then(setDictionary)
  }, [locale])

  // ✅ Helper مشترك
  const extractFieldName = (field: string | DynamicFormFieldProps): string => {
    return typeof field === 'string' ? field : field.name
  }

  const flattenClassifiedObjects = useCallback(
    (data: any) => {
      if (!classifiedObjects || classifiedObjects.length === 0) return data

      const flattened = { ...data }
      classifiedObjects.forEach(({ objectName, fields }) => {
        let nestedObject = data[objectName]

        // ✅ Parse if it came back as a JSON string
        if (typeof nestedObject === 'string') {
          try {
            nestedObject = JSON.parse(nestedObject)
          } catch {
            nestedObject = null
          }
        }

        if (nestedObject && typeof nestedObject === 'object') {
          fields.forEach(field => {
            const fieldName = extractFieldName(field)
            if (fieldName in nestedObject) {
              flattened[fieldName] = nestedObject[fieldName]
            }
          })
          delete flattened[objectName] // ✅ Remove the stringified key so it doesn't go back in payload
        }
      })
      return flattened
    },
    [classifiedObjects]
  )
  const nestClassifiedObjects = useCallback(
    (data: any) => {
      if (!classifiedObjects || classifiedObjects.length === 0) return data

      const nested = { ...data }
      classifiedObjects.forEach(({ objectName, fields }) => {
        const objectData: Record<string, any> = {}
        let hasData = false

        // ✅ Remove any existing stringified version first
        if (typeof nested[objectName] === 'string') {
          delete nested[objectName]
        }

        fields.forEach(field => {
          const fieldName = extractFieldName(field)
          if (fieldName in nested) {
            objectData[fieldName] = nested[fieldName]
            delete nested[fieldName]
            hasData = true
          }
        })

        if (hasData) {
          const existing = nested[objectName]
          const existingParsed =
            typeof existing === 'string'
              ? (() => {
                  try {
                    return JSON.parse(existing)
                  } catch {
                    return {}
                  }
                })()
              : existing || {}

          nested[objectName] = { ...existingParsed, ...objectData }
        }
      })
      return nested
    },
    [classifiedObjects]
  )
  // // ✅ Flatten/Nest functions (stable)
  // const flattenClassifiedObjects = useCallback(
  //   (data: any) => {
  //     if (!classifiedObjects || classifiedObjects.length === 0) return data

  //     const flattened = { ...data }
  //     classifiedObjects.forEach(({ objectName, fields }) => {
  //       const nestedObject = data[objectName]
  //       if (nestedObject && typeof nestedObject === 'object') {
  //         fields.forEach(fieldName => {
  //           if (fieldName in nestedObject) {
  //             flattened[fieldName] = nestedObject[fieldName]
  //           }
  //         })
  //         // delete flattened[objectName]
  //       }
  //     })
  //     return flattened
  //   },
  //   [classifiedObjects]
  // )

  // const nestClassifiedObjects = useCallback(
  //   (data: any) => {
  //     if (!classifiedObjects || classifiedObjects.length === 0) return data

  //     const nested = { ...data }
  //     classifiedObjects.forEach(({ objectName, fields }) => {
  //       const objectData: Record<string, any> = {}
  //       let hasData = false

  //       fields.forEach(fieldName => {
  //         if (fieldName in nested) {
  //           objectData[fieldName] = nested[fieldName]
  //           delete nested[fieldName]
  //           hasData = true
  //         }
  //       })

  //       if (hasData) {
  //         nested[objectName] = { ...(nested[objectName] || {}), ...objectData }
  //       }
  //     })
  //     return nested
  //   },
  //   [classifiedObjects]
  // )

  // ✅ Extra fields from screen permissions
  useEffect(() => {
    if (screenData && Array.isArray(screenData.extraFields) && screenData.extraFields.length > 0) {
      const mappedExtraFields = mapApiFieldsToFormSchema(screenData.extraFields)
      setExtraFields(mappedExtraFields)
    } else {
      setExtraFields([])
    }
  }, [screenData])

  // ✅ All fields combined
  const allFields = useMemo(() => {
    const combined = [...fields]
    if (extraFields.length > 0) combined.push(...extraFields)
    if (dynamicExtraFields.length > 0) combined.push(...dynamicExtraFields)
    return combined
  }, [fields, extraFields, dynamicExtraFields])

  // ✅ Default values
  const defaultValues = useMemo(() => generateDefaultValues(allFields, mode), [allFields, mode])

  // ✅ Schema
  const schema = useMemo(() => {
    const combinedFields = [...fields]
    if (extraFields.length > 0) combinedFields.push(...extraFields)
    if (dynamicExtraFields.length > 0) combinedFields.push(...dynamicExtraFields)

    const adjustedFields = adjustValidationForMode(combinedFields, mode)
    return generateSchemaBuilder(adjustedFields as DynamicFormFieldProps[], mode, {})
  }, [fields, extraFields, dynamicExtraFields, mode])

  type FormValues = InferInput<typeof schema>

  // ✅ Custom resolver
  const customResolver = useCallback((values: any, context: any, options: any) => {
    const currentFields = fieldsRef.current
    const currentExtraFields = extraFieldsRef.current
    const currentDynamicExtraFields = dynamicExtraFieldsRef.current
    const currentMode = modeRef.current

    if (!currentFields || !Array.isArray(currentFields)) {
      console.error('❌ Fields are null or not an array')
      return { values: {}, errors: {} }
    }

    const combinedFields = [...currentFields]
    if (Array.isArray(currentExtraFields) && currentExtraFields.length > 0) {
      combinedFields.push(...currentExtraFields)
    }
    if (Array.isArray(currentDynamicExtraFields) && currentDynamicExtraFields.length > 0) {
      combinedFields.push(...currentDynamicExtraFields)
    }

    if (combinedFields.length === 0) {
      console.warn('⚠️ No fields to validate')
      return { values: {}, errors: {} }
    }

    const adjustedFields = adjustValidationForMode(combinedFields, currentMode)

    if (!adjustedFields || !Array.isArray(adjustedFields) || adjustedFields.length === 0) {
      console.error('❌ adjustedFields is invalid:', adjustedFields)
      return { values: {}, errors: {} }
    }

    const dynamicSchema = generateSchemaBuilder(adjustedFields as DynamicFormFieldProps[], currentMode, values)
    return valibotResolver(dynamicSchema)(values, context, options)
  }, [])

  // ✅ Form methods
  const formMethods = useForm<FormValues>({
    resolver: customResolver,
    mode: 'onSubmit',
    defaultValues,
    shouldFocusError: false
  })

  const {
    handleSubmit,
    reset,
    setError: setFormError,
    clearErrors,
    getValues,
    setValue,
    watch,
    formState: { isDirty, dirtyFields }
  } = formMethods

  const clearMesagges = () => {
    // setInfo('')
    // setError('')
    // setWarning('')
    // setSuccess('')
  }

  // ✅ Watch form values and clear errors on change
  const watchedValues = watch()
  useEffect(() => {
    if (isDirty) {
      clearMesagges()
    }
  }, [watchedValues, isDirty])

  // ✅ Load dynamic extra fields
  const loadDynamicExtraFields = useCallback(
    (selectedObject: any) => {
      if (selectedObject && selectedObject.extraFields && Array.isArray(selectedObject.extraFields)) {
        const mappedDynamicFields = mapApiFieldsToFormSchema(selectedObject.extraFields)
        setDynamicExtraFields(mappedDynamicFields)

        const currentValues = getValues()
        mappedDynamicFields.forEach(field => {
          if (field.name in currentValues) {
            setValue(field.name, null, { shouldValidate: false })
          }
        })

        const currentRawRecord = rawRecordRef.current
        if (currentRawRecord?.extra_fields && typeof currentRawRecord.extra_fields === 'object') {
          Object.entries(currentRawRecord.extra_fields).forEach(([key, value]) => {
            const fieldExists = mappedDynamicFields.some(field => field.name === key)
            if (fieldExists) {
              setValue(key, value, { shouldValidate: false })
            }
          })
        }

        return mappedDynamicFields
      } else {
        const currentValues = getValues()
        dynamicExtraFields.forEach(field => {
          if (field.name in currentValues) {
            setValue(field.name, null, { shouldValidate: false })
          }
        })

        setDynamicExtraFields([])
        return []
      }
    },
    [dynamicExtraFields, getValues, setValue]
  )

  // ✅ HELPER FUNCTION: fetchRecord (مستقلة تمامًا)
  const fetchRecord = useCallback(
    async (config: {
      url?: string
      method?: 'GET' | 'POST' | 'PUT'
      params?: Record<string, any>
      shouldSetDataModel?: boolean
      onSuccess?: (data: any) => void
      onError?: (error: any) => void
    }) => {
      if (!accessToken) {
        console.warn('⚠️ No access token available')
        return null
      }

      const {
        url = `${apiEndpoint}/${recordId}`,
        method = 'GET',
        params = {},
        shouldSetDataModel = true,
        onSuccess,
        onError
      } = config

      try {
        let response

        if (method === 'GET') {
          response = await apiClient.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Accept-Language': locale as Locale
            },
            params
          })
        } else if (method === 'POST') {
          response = await apiClient.post(url, params, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Accept-Language': locale as Locale
            }
          })
        } else if (method === 'PUT') {
          response = await apiClient.put(url, params, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Accept-Language': locale as Locale
            }
          })
        }

        const data = response?.data?.data

        if (data) {
          const flattenedData = flattenClassifiedObjects(data)

          if (shouldSetDataModel) {
            // ✅ Reset the reset flag so the form populates with the new data
            hasReset.current = false
            setDynamicFieldsProcessed(false)
            setRawRecord(flattenedData)
            setDataModel(flattenedData)

            // ✅ Mark as processed so reset logic can run
            setDynamicFieldsProcessed(false)

            // ✅ Update details data using the keys from the initial config
            const detailKeys = Object.keys(initialDetailsData)
            const newDetailsData: Record<string, any[]> = {}

            detailKeys.forEach(key => {
              if (flattenedData[key]) {
                newDetailsData[key] = flattenedData[key]
              }
            })

            setDetailsData(prev => ({ ...prev, ...newDetailsData }))
          }

          if (onSuccess) {
            onSuccess(flattenedData)
          }

          return flattenedData
        }

        return null
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'حدث خطأ أثناء تحميل البيانات'

        if (onError) {
          onError(error)
        } else {
          setError(errorMessage)
        }

        return null
      }
    },
    [accessToken, apiEndpoint, recordId, locale, flattenClassifiedObjects, setError]
    // ✅ Note: initialDetailsData is NOT in dependencies - we use it directly
  )
  // ✅ Reset fetch guard before the main record fetch effect
  useEffect(() => {
    hasReset.current = false
    setDynamicFieldsProcessed(false)
    if (!isPostSaveFetchRef.current) {
      hasFetchedRef.current = null
    }
  }, [recordId, accessToken])

  useEffect(() => {
    if (!accessToken) return

    const fetchKey = `${mode}-${recordId || 'none'}-${accessToken ? 'auth' : 'noauth'}`

    if (hasFetchedRef.current === fetchKey) {
      if (isPostSaveFetchRef.current) {
        isPostSaveFetchRef.current = false
      }
      return
    }

    // ✅ PRIORITY 1: Custom fetch config (only if provided AND enabled)
    if (fetchConfig?.enabled && fetchConfig?.url) {
      hasFetchedRef.current = fetchKey

      fetchRecord({
        url: fetchConfig.url,
        method: fetchConfig.method || 'GET',
        params: fetchConfig.params || {},
        shouldSetDataModel: fetchConfig.shouldSetDataModel ?? true,
        onSuccess: fetchConfig.onSuccess,
        onError: fetchConfig.onError
      })
      return
    }

    // ✅ PRIORITY 2: Default behavior: clear record if mode is invalid or missing ID
    if (!(mode === 'show' || mode === 'edit') || !recordId) {
      // ✅ FIX: Don't wipe if we already have a record (e.g. from manual fetchRecord)
      if ((mode === 'show' || mode === 'edit' || mode === 'add') && rawRecordRef.current) {
        // Keep the record
      } else {
        setRawRecord(null)
      }

      setDynamicFieldsProcessed(true)
      hasFetchedRef.current = null
      return
    }

    // ✅ PRIORITY 3: Standard fetchRecordById
    hasFetchedRef.current = fetchKey

    fetchRecordById(
      apiEndpoint,
      recordId,
      accessToken,
      locale as Locale,
      data => {
        hasReset.current = false // ✅ Allow form to reset with fresh data
        const flattenedData = flattenClassifiedObjects(data)
        setRawRecord(flattenedData)
        setDataModel(flattenedData)

        setDetailsData(prev => {
          const updated = Object.keys(initialDetailsData).reduce(
            (acc, key) => {
              acc[key] = flattenedData[key] || []
              return acc
            },
            {} as Record<string, any[]>
          )
          return { ...prev, ...updated }
        })
      },
      setError,
      setSuccess
    )
  }, [
    mode,
    recordId,
    accessToken,
    apiEndpoint,
    locale,
    fetchConfig?.enabled, // ✅ Optional chaining
    fetchConfig?.url, // ✅ Optional chaining
    fetchRecord
  ])

  // ✅ REFETCH: يستخدم fetchRecordById
  const refetchRecord = useCallback(() => {
    const effectiveRecordId = recordId || dataModel?.id
    if ((mode === 'show' || mode === 'edit') && effectiveRecordId && accessToken) {
      fetchRecordById(
        apiEndpoint,
        effectiveRecordId,
        accessToken,
        locale as Locale,
        data => {
          hasReset.current = false // ✅ Allow form to reset with fresh data
          const flattenedData = flattenClassifiedObjects(data)
          setRawRecord(flattenedData)
          setDataModel(flattenedData)

          // ✅ UPDATE DETAILS DATA HERE TOO!
          setDetailsData(prev => {
            const updated = Object.keys(initialDetailsData).reduce(
              (acc, key) => {
                acc[key] = flattenedData[key] || []
                return acc
              },
              {} as Record<string, any[]>
            )
            return { ...prev, ...updated }
          })
        },
        setError,
        setSuccess
      )
    }
  }, [
    mode,
    recordId,
    accessToken,
    apiEndpoint,
    locale,
    flattenClassifiedObjects,
    setError,
    setSuccess,
    initialDetailsData
  ])
  // ✅ Load dynamic extra fields from rawRecord
  useEffect(() => {
    if (!rawRecord) {
      setDynamicFieldsProcessed(false)
      return
    }

    const currentFields = fieldsRef.current
    const fieldsToCheck = currentFields.filter(field => field.type === 'select').map(field => field.name)

    let hasLoadedDynamicFields = false

    for (const fieldName of fieldsToCheck) {
      const relatedObject = rawRecord[fieldName]
      if (relatedObject && relatedObject.extraFields && Array.isArray(relatedObject.extraFields)) {
        const mappedDynamicFields = mapApiFieldsToFormSchema(relatedObject.extraFields)
        setDynamicExtraFields(mappedDynamicFields)
        hasLoadedDynamicFields = true
        break
      }
    }

    if (!hasLoadedDynamicFields) {
      setDynamicExtraFields([])
    }

    setDynamicFieldsProcessed(true)
  }, [rawRecord])

  // ✅ Check if ready to reset form
  const isReady = useMemo(() => {
    return rawRecord !== null && allFields.length > 0 && dynamicFieldsProcessed
  }, [rawRecord, allFields, dynamicFieldsProcessed])

  // ✅ Reset form when ready
  // ✅ في useRecordForm.ts

  useEffect(() => {
    if (!isReady || hasReset.current) return
    const displayData = mergeExtraFields(rawRecord, allFields)

    reset(displayData, {
      keepDirty: false, // ✅ Always clean reset
      keepTouched: false
    })

    setDataModel(displayData)

    setDetailsData(prev => {
      const updated = Object.keys(initialDetailsData).reduce(
        (acc, key) => {
          if (rawRecord[key]) {
            acc[key] = rawRecord[key]
          }
          return acc
        },
        {} as Record<string, any[]>
      )
      return { ...prev, ...updated }
    })

    hasReset.current = true
  }, [isReady, allFields, initialDetailsData, rawRecord, reset, mode])
  // ✅ Tab validation
  const validateAllTabs = useCallback(async (): Promise<boolean> => {
    if (tabConfigRef.current.length === 0) return true

    for (let tabIndex = 0; tabIndex < tabConfigRef.current.length; tabIndex++) {
      const validation = await validateTabFields(tabIndex, tabConfigRef.current, formMethods, mode, dictionary)

      if (!validation.isValid) {
        setTabValue(tabIndex.toString())
        setAttemptedTabs(prev => new Set([...prev, tabIndex]))

        setTimeout(() => {
          const firstError = validation.errors[0]
          const errorElement = document.querySelector(`[name="${firstError.field}"]`) as HTMLElement
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            if ('focus' in errorElement) {
              ;(errorElement as HTMLInputElement).focus()
            }
          }
        }, 300)

        return false
      }
    }

    return true
  }, [formMethods, mode, dictionary])

  const handleNextTab = useCallback(async () => {
    const currentTab = Number(tabValue)
    const nextTab = currentTab + 1

    if (nextTab > tabsCount) return

    if (tabConfigRef.current.length > 0) {
      const validation = await validateTabFields(currentTab, tabConfigRef.current, formMethods, mode, dictionary)
      if (!validation.isValid) {
        setAttemptedTabs(prev => new Set([...prev, currentTab]))

        setTimeout(() => {
          const firstError = validation.errors[0]
          const errorElement = document.querySelector(`[name="${firstError.field}"]`) as HTMLElement
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            if ('focus' in errorElement) {
              ;(errorElement as HTMLInputElement).focus()
            }
          }
        }, 100)

        return
      }

      setValidatedTabs(prev => new Set([...prev, currentTab]))
    }

    setTabValue(nextTab.toString())
    setTabContextValue(nextTab.toString())
  }, [tabValue, tabsCount, formMethods, mode, setTabContextValue, dictionary])

  // ✅ Helper functions
  const RemoveSomePropertyDuringProcess = useCallback(
    (payload: any) => {
      if (!excludeFields) return payload

      const matchedExclusions = excludeFields.filter(exclusion => exclusion.action === '*' || exclusion.action === mode)
      const fieldsToExclude = matchedExclusions.flatMap(exclusion => exclusion.fields)

      fieldsToExclude.forEach(field => {
        if (field.name in payload) {
          delete payload[field.name]
        }
      })

      return payload
    },
    [excludeFields, mode]
  )

  const getExcludedFieldNames = useCallback(() => {
    if (!excludeFields) return []
    return excludeFields
      .filter(exclusion => exclusion.action === '*' || exclusion.action === mode)
      .flatMap(exclusion => exclusion.fields.map(f => f.name))
  }, [excludeFields, mode])

  const getDirtyValues = useCallback(
    (allValues: any, dirtyFields: any, recordId: any) => {
      const dirtyData: any = { id: recordId }

      if (!dirtyFields || Object.keys(dirtyFields).length === 0) {
        return dirtyData
      }

      Object.keys(dirtyFields).forEach(key => {
        const isFieldDirty = dirtyFields[key]

        if ((typeof isFieldDirty === 'object' && isFieldDirty !== null) || isFieldDirty === true) {
          let value = allValues[key]
          const originalValue = dataModel[key]

          // ✅ Type normalization
          if (typeof value === 'string' && typeof originalValue === 'number') {
            const parsed = Number(value)
            if (!isNaN(parsed)) value = parsed
          } else if (value === '' && originalValue === null) {
            value = null
          }

          dirtyData[key] = value
        }
      })

      return dirtyData
    },
    [dataModel]
  )

  const onSubmitInternal = useCallback(
    async (data: T, params: OnSubmitParams = {}) => {
      // ✅ Extract params
      const mergedParams = { ...defaultSubmitParams, ...params }

      const {
        skipChangeTracking = false,
        silentNoChanges = false,
        skipValidation = false,
        skipTabValidation = false,
        skipDetailValidation = false,
        customSuccessMessage,
        customErrorMessage,
        onBeforeSubmit,
        onAfterSubmit,
        forceSubmit = false,
        sendFullData = false,
        apiEndPointModeCondition
      } = mergedParams

      // Determine the effective API endpoint based on mode conditions
      let effectiveApiEndpoint = apiEndpoint
      if (apiEndPointModeCondition && Array.isArray(apiEndPointModeCondition)) {
        const specificCondition = apiEndPointModeCondition.find(c => c.mode === mode)
        const defaultCondition = apiEndPointModeCondition.find(c => c.mode === '*')

        if (defaultCondition?.apiUrl) {
          effectiveApiEndpoint = defaultCondition.apiUrl
        } else if (specificCondition?.apiUrl) {
          effectiveApiEndpoint = specificCondition.apiUrl
        }
      }

      // ✅ Run custom before submit callback
      if (onBeforeSubmit) {
        const canContinue = await onBeforeSubmit(data, detailsData)
        if (!canContinue) return
      }

      // ✅ STEP 1: Validate all tabs (unless skipped)
      if (!skipValidation && !skipTabValidation) {
        const allTabsValid = await validateAllTabs()
        if (!allTabsValid) {
          setError(customErrorMessage || 'يرجى تصحيح الأخطاء في النموذج قبل الحفظ')
          scrollToTop()
          return
        }
      }

      // ✅ STEP 2: Run onBeforeSave custom validation (unless skipped)
      if (!skipValidation && onBeforeSave) {
        const canContinue = await onBeforeSave(data, detailsData)
        if (!canContinue) {
          scrollToTop()
          return
        }
      }

      // ✅ STEP 3: Validate all detail tables (unless skipped)
      if (!skipValidation && !skipDetailValidation) {
        const detailValidation = validateAllDetailTables()

        if (!detailValidation.valid) {
          const errorTables = Object.entries(detailValidation.errorsByTable)
            .map(([key, count]) => {
              const titleKey = detailsTitles[key]

              const title = (titleKey && dictionary?.titles?.[titleKey]) || dictionary?.titles?.[key] || key

              return `${title}: ${count} خطأ`
            })
            .join('\n')
          setError(
            customErrorMessage ||
              `يرجى تصحيح الأخطاء في الجداول التالية قبل الحفظ:\n${errorTables}\n\nإجمالي الأخطاء: ${detailValidation.totalErrors}`
          )

          scrollToTop()
          return
        }
      }

      const checkboxRadioPayload: Record<string, any[]> = {}
      let hasTableChanges = false
      let hasCheckboxRadioChanges = false
      const changedDetails: Record<string, any[]> = {}
      const sentRowsMap: Record<string, number[]> = {}

      Object.keys(initialDetailsData).forEach(key => {
        const detailData = detailsData[key] || []
        const tableConfig = detailsTablesConfig?.[key]

        const isCheckboxRadio = !tableConfig?.fields || tableConfig.fields.length === 0

        if (isCheckboxRadio) {
          const hasChanged = JSON.stringify(detailData) !== JSON.stringify(dataModel[key])

          if (hasChanged || mode === 'add') {
            hasCheckboxRadioChanges = true
            changedDetails[key] = detailData
            checkboxRadioPayload[key] = detailData
          }
          return
        }

        if (!tableConfig || !Array.isArray(detailData)) {
          changedDetails[key] = detailData
          return
        }

        const filteredArray = filterArray(detailData)
        const changedRows = getChangedRows(filteredArray, tableConfig.fields)

        if (changedRows.length > 0) {
          hasTableChanges = true
          changedDetails[key] = changedRows

          if (tableConfig.trackIndex) {
            sentRowsMap[key] = changedRows.map((changedRow: any) => {
              let originalIndex = detailData.findIndex((row: any) => row === changedRow)
              if (originalIndex === -1 && changedRow.id != null) {
                originalIndex = detailData.findIndex((row: any) => row.id === changedRow.id)
              }
              if (originalIndex === -1 && changedRow.tempId != null) {
                originalIndex = detailData.findIndex((row: any) => row.tempId === changedRow.tempId)
              }
              if (originalIndex === -1) {
                originalIndex = detailData.findIndex((row: any) => {
                  const changedKeys = Object.keys(changedRow)
                  return changedKeys.every(k => row[k] === changedRow[k])
                })
              }
              return originalIndex
            })
          }
        }
      })

      // ✅ Check for changes (skip if sendFullData OR skipChangeTracking OR forceSubmit)
      if (!skipChangeTracking && !forceSubmit && !sendFullData) {
        if (mode === 'edit' && !isDirty && !hasTableChanges && !hasCheckboxRadioChanges) {
          if (!silentNoChanges) {
            setInfo('لم يتم إجراء أي تعديلات على البيانات، لذلك لم يتم حفظ أي تغييرات.')
            scrollToTop()
          }
          return
        }
      }

      // ✅ Build master data
      const effectiveRecordId = recordId || dataModel?.id
      let masterData: any = {}

      if (mode === 'edit') {
        if (sendFullData) {
          // ✅ Send ALL form fields (changed + unchanged)
          masterData = { id: effectiveRecordId }

          allFields.forEach(field => {
            if (field.type === 'storage' || field.name === 'id') {
              return
            }

            masterData[field.name] = data[field.name]
          })
        } else {
          // ✅ Send only dirty fields (default)
          masterData = getDirtyValues(data, dirtyFields, effectiveRecordId)
        }

        // Remove excluded fields
        const excludedNames = getExcludedFieldNames()
        Object.keys(masterData).forEach(key => {
          if (key !== 'id' && excludedNames.includes(key)) {
            delete masterData[key]
          }
        })
      } else {
        // Add mode: send all data
        masterData = data
      }

      // ✅ Build final payload
      let finalPayload: any = {}
      if (mode === 'edit') {
        finalPayload = { ...masterData, ...changedDetails }
      } else {
        finalPayload = { ...data, ...changedDetails }
      }

      const payloadAfterExclusions = RemoveSomePropertyDuringProcess(finalPayload)

      try {
        if (mode === 'search') {
          const searchPayload = extractExtraFieldsForSearch(payloadAfterExclusions, allFields)
          const filteredMainFields = filterObject(searchPayload, fields, mode)
          const nestedSearch = nestClassifiedObjects(filteredMainFields)

          const body = {
            ...nestedSearch,
            ...detailsData
          }

          if (searchPayload.extra_fields && Object.keys(searchPayload.extra_fields).length > 0) {
            body.extra_fields = searchPayload.extra_fields
          }

          navigateWithQuery(`${routerUrl.default}/list`, router, locale as Locale, body)
        } else {
          const filteredPayload = extractExtraFields(payloadAfterExclusions, allFields)
          const nestedPayload = nestClassifiedObjects(filteredPayload)

          let finalData =
            mode == 'edit'
              ? { ...nestedPayload, ...checkboxRadioPayload }
              : { ...filterObject(nestedPayload), ...checkboxRadioPayload }

          if (transformPayload) {
            finalData = transformPayload(finalData, detailsData)
          }

          if (mode === 'edit') {
            const payloadKeys = Object.keys(finalData || {})

            const isOnlyId = payloadKeys.length === 1 && payloadKeys.includes('id')
            const isEmptyPayload = payloadKeys.length === 0 || isOnlyId

            if (isEmptyPayload) {
              setInfo('لم يتم إجراء أي تعديلات على البيانات، لذلك لم يتم حفظ أي تغييرات.')
              scrollToTop()
              return
            }
          }

          const saveResponse = await handleSave(
            effectiveApiEndpoint,
            locale as Locale,
            finalData,
            recordId || dataModel?.id,

            accessToken,
            true,
            setError,
            setSuccess
          )

          if (saveResponse?.response?.data?.errors || saveResponse?.isAxiosError) {
            const formattedErrors = formatErrors(saveResponse.response?.data, sentRowsMap)
            setErrors(formattedErrors)

            const backendErrorsByTable: Record<string, number> = {}
            formattedErrors.forEach(err => {
              if (err.detailsKey !== '_master') {
                backendErrorsByTable[err.detailsKey] = (backendErrorsByTable[err.detailsKey] || 0) + 1
              }
            })

            const errorSummary = Object.entries(backendErrorsByTable)
              .map(([key, count]) => `${dictionary?.titles?.[key] || key}: ${count} خطأ`)
              .join('\n')

            setError(
              customErrorMessage ||
                `فشل حفظ البيانات. يرجى تصحيح الأخطاء التالية:\n${errorSummary || 'أخطاء في النموذج الرئيسي'}`
            )

            scrollToTop()

            if (onSaveError) {
              await onSaveError(saveResponse, mode)
            }

            return
          }

          setErrors([])

          // ✅ Run custom after submit callback
          if (onAfterSubmit) {
            await onAfterSubmit(saveResponse, mode)
          }

          // في useRecordForm.ts - في الـ onSubmitInternal بعد الـ save success
          if (!modeParam) {
            if (saveResponse?.data?.data) {
              const responseData = saveResponse?.data?.data

              setDetailsData(prev => {
                const nextDetails = { ...prev }
                Object.keys(prev).forEach(key => {
                  if (Array.isArray(responseData[key])) {
                    nextDetails[key] = responseData[key]
                  }
                })
                return nextDetails
              })
            }

            if (onSaveSuccess) {
              await onSaveSuccess(saveResponse, mode)
              return
            }

            setInfo('')
            setWarning('')

            if (customSuccessMessage) {
              setSuccess(customSuccessMessage)
            }

            const newRecordId = fetchKeyProp ? saveResponse?.data?.data?.[fetchKeyProp] : saveResponse?.data?.data?.id

            // ✅ بدل reset من save response، اعمل fetch كامل للـ record
            if (newRecordId) {
              isPostSaveFetchRef.current = true
              const freshData = await fetchRecord({
                url: `${apiEndpoint}/${newRecordId}`,
                method: 'GET',
                shouldSetDataModel: true
              })

              // ✅ Explicitly reset the form with the fresh data now
              if (freshData) {
                const displayData = mergeExtraFields(freshData, allFields)
                reset(displayData, {
                  keepDirty: false,
                  keepTouched: false
                })
                hasReset.current = true
              }
            }
            hasFetchedRef.current = `${saveMode}-${newRecordId}-auth`

            router.replace(
              getLocalizedUrl(`${routerUrl.default}/details?id=${newRecordId}&mode=${saveMode}`, locale as Locale)
            )
            setMode(saveMode)

            if (tabsCount > 0) {
              setTabValue('0')
              setTabContextValue('0')
            }
          }
        }
      } catch (error: any) {
        console.log('hola pola ', error.response?.data)
        const formattedErrors = formatErrors(error.response?.data, sentRowsMap)
        console.log('formattedErrors', formattedErrors)
        setErrors(formattedErrors)
        scrollToTop()
      }
    },
    [
      validateAllTabs,
      initialDetailsData,
      detailsData,
      detailsTablesConfig,
      mode,
      isDirty,
      dirtyFields,
      recordId,
      getDirtyValues,
      RemoveSomePropertyDuringProcess,
      allFields,
      fields,
      navigateWithQuery,
      routerUrl,
      router,
      locale,
      apiEndpoint,
      accessToken,
      setError,
      setSuccess,
      saveMode,
      nestClassifiedObjects,
      reset,
      modeParam,
      getExcludedFieldNames,
      getValues,
      flattenClassifiedObjects,
      setInfo,
      customDetailValidators,
      defaultSubmitParams,
      dataModel
    ]
  )

  const onSubmit: SubmitHandler<any> = useCallback(
    async (data: T) => {
      console.group('🔍 onSubmit Debug')
      console.log('Mode:', mode)
      console.log('isDirty:', formMethods.formState.isDirty)
      console.log('dirtyFields:', formMethods.formState.dirtyFields)
      console.log('Current data:', data)
      console.log('Original dataModel:', dataModel)

      // Check what changed
      const changes: any = {}
      Object.keys(data).forEach(key => {
        if (JSON.stringify(data[key]) !== JSON.stringify(dataModel[key])) {
          changes[key] = {
            old: dataModel[key],
            new: data[key]
          }
        }
      })
      console.log('Detected changes:', changes)
      console.groupEnd()

      return await onSubmitInternal(data, defaultSubmitParams)
    },
    [onSubmitInternal, defaultSubmitParams]
  )

  // ✅ Custom submit with dynamic params
  const submitWithParams = useCallback(
    async (customParams: OnSubmitParams = {}) => {
      // Trigger validation first
      const isValid = await formMethods.trigger()

      if (!isValid && !customParams.skipValidation) {
        return
      }

      // Get current form values
      const data: any = formMethods.getValues()

      // Call internal submit
      return await onSubmitInternal(data, customParams)
    },
    [onSubmitInternal, formMethods]
  )

  // ✅ F10 submit
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F10') {
        event.preventDefault()
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSubmit, onSubmit])

  // ✅ Enhanced error focus
  useEffect(() => {
    if (!formMethods.formState.isSubmitted) return

    const errors = formMethods.formState.errors
    const errorKeys = Object.keys(errors)

    if (errorKeys.length === 0) return

    let firstErrorField: string
    let errorTabIndex: number = 0

    if (tabConfigRef.current.length > 0) {
      const orderedFields = tabConfigRef.current.flatMap((tab: any) => tab.fields.map((f: any) => f.name))
      firstErrorField =
        orderedFields.find((fieldName: string) => (errors as Record<string, any>)[fieldName]) || errorKeys[0]
      errorTabIndex = getTabIndexForField(firstErrorField, tabConfigRef.current)
    } else {
      firstErrorField = errorKeys[0]
    }

    const focusOnError = (attempt = 0): void => {
      const maxAttempts = 15
      if (attempt >= maxAttempts) return

      let errorElement: HTMLElement | null =
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.getElementById(firstErrorField) ||
        document.querySelector(`[data-field-name="${firstErrorField}"]`) ||
        document.querySelector(`input[name="${firstErrorField}"]`) ||
        document.querySelector(`textarea[name="${firstErrorField}"]`) ||
        document.querySelector(`select[name="${firstErrorField}"]`)

      if (!errorElement) {
        const autocomplete = document.querySelector(`[id*="${firstErrorField}"]`)
        if (autocomplete) {
          const input = autocomplete.querySelector('input')
          if (input) errorElement = input
        }
      }

      if (!errorElement && tabConfigRef.current.length > 0) {
        const activePanel = document.querySelector(`[role="tabpanel"]:not([hidden]), [role="tabpanel"][hidden="false"]`)
        if (activePanel) {
          errorElement =
            activePanel.querySelector(`[name="${firstErrorField}"]`) ||
            activePanel.querySelector(`input[name="${firstErrorField}"]`) ||
            activePanel.querySelector(`[id*="${firstErrorField}"] input`)
        }
      }

      if (!errorElement) {
        try {
          formMethods.setFocus(firstErrorField as any)
          return
        } catch {
          setTimeout(() => focusOnError(attempt + 1), 100)
          return
        }
      }

      if (!errorElement) {
        setTimeout(() => focusOnError(attempt + 1), 100)
        return
      }

      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })

      setTimeout(() => {
        let focusTarget: HTMLElement | null = null
        const input = errorElement!.querySelector('input:not([type="hidden"]), textarea, select') as HTMLInputElement

        if (input && !input.disabled && !input.readOnly) {
          focusTarget = input
        } else if (
          errorElement!.tagName === 'INPUT' ||
          errorElement!.tagName === 'TEXTAREA' ||
          errorElement!.tagName === 'SELECT'
        ) {
          const el = errorElement as HTMLInputElement
          if (!el.disabled && !el.readOnly) {
            focusTarget = el
          }
        } else if (errorElement!.tabIndex >= 0) {
          focusTarget = errorElement
        }

        if (focusTarget && typeof (focusTarget as HTMLInputElement).focus === 'function') {
          ;(focusTarget as HTMLInputElement).focus()

          if (focusTarget.tagName === 'INPUT' || focusTarget.tagName === 'TEXTAREA') {
            const inputEl = focusTarget as HTMLInputElement
            if (inputEl.select && inputEl.type !== 'checkbox' && inputEl.type !== 'radio') {
              try {
                inputEl.select()
              } catch {}
            }
          }
        }
      }, 150)
    }

    if (tabConfigRef.current.length > 0) {
      if (errorTabIndex.toString() !== tabValue) {
        setTabValue(errorTabIndex.toString())
        setAttemptedTabs(prev => new Set([...prev, errorTabIndex]))
        setTimeout(() => focusOnError(), 600)
      } else {
        setTimeout(() => focusOnError(), 200)
      }
    } else {
      setTimeout(() => focusOnError(), 200)
    }
  }, [formMethods.formState.submitCount, formMethods.formState.isSubmitted, tabValue, formMethods])

  // ✅ Reset validated tabs on mode/recordId change
  useEffect(() => {
    setValidatedTabs(new Set([0]))
    setAttemptedTabs(new Set())
  }, [mode, recordId])

  // ✅ Handlers
  const handleCancel = useCallback(() => {
    if (canSearch) {
      navigateWithQuery(`${routerUrl.default}/list`, router, locale as Locale)
    }
  }, [navigateWithQuery, routerUrl, router, locale, canSearch])

  const handleMenuOptionClick = useCallback(
    async (action: string) => {
      if (action === 'reset') {
        await handleModeChange(mode, recordId)
        return
      }

      if (action === 'add' || action === 'search') {
        const emptyDetailsData = Object.keys(initialDetailsData).reduce(
          (acc, key) => {
            acc[key] = []
            return acc
          },
          {} as { [key: string]: any[] }
        )

        setDetailsData(emptyDetailsData)
        setDynamicExtraFields([])
        setDynamicFieldsProcessed(true)
        setRawRecord(null)
        setDataModel({})
        fetchedRecordIdRef.current = null // ✅ Reset fetch flag

        setMode(action as Mode)
        const fieldNames = Object.keys(defaultValues)
        resetForm(formMethods, action, fieldNames)

        if (action === 'add') {
          navigateWithQuery(`${routerUrl.default}/details?mode=add`, router, locale as Locale)
        } else if (action === 'search') {
          navigateWithQuery(`${routerUrl.default}/details?mode=search`, router, locale as Locale)
        }
      } else if (action === 'edit') {
        if (onMenuActionClick) {
          await onMenuActionClick(action, mode)
          return // ✅ Exit early if custom handler is used
        }
        setMode('edit')
        navigateWithQuery(`${routerUrl.default}/details?id=${urlRecordId}&mode=edit`, router, locale as Locale)
      } else if (action === 'show') {
        setMode('show')
        if (routerUrl.showUrl) {
          navigateWithQuery(`${routerUrl.default}/details?id=${urlRecordId}&mode=show`, router, locale as Locale)
        }
      } else if (action === 'list') {
        navigateWithQuery(`${routerUrl.default}/list`, router, locale as Locale)
      } else if (action === 'delete') {
        handleDelete()
      } else if (action === 'documents') {
        setOpenDocumentsDialog(true)
      } else if (action === 'record_info') {
        setOpenRecordInformationDialog(true)
      } else if (action === 'record_track') {
        setOpenRecordTrackingDialog(true)
      } else if (action === 'print') {
        triggerPrintMode()
      }
    },
    [
      defaultValues,
      formMethods,
      initialDetailsData,
      navigateWithQuery,
      routerUrl,
      router,
      locale,
      urlRecordId,
      triggerPrintMode
    ]
  )

  const handleModeChange = useCallback(
    async (newMode: Mode, id?: string | number | null) => {
      clearMesagges()
      setMode(newMode)

      const emptyDetailsData = Object.keys(initialDetailsData).reduce(
        (acc, key) => {
          acc[key] = []
          return acc
        },
        {} as { [key: string]: any[] }
      )

      // ✅ SEARCH MODE
      if (newMode === 'search') {
        setDetailsData(emptyDetailsData)
        setDynamicExtraFields([])
        setDynamicFieldsProcessed(true)
        setRawRecord(null)
        setDataModel({})
        fetchedRecordIdRef.current = null

        const fieldNames = Object.keys(defaultValues)
        resetForm(formMethods, 'search', fieldNames)

        return
      }

      // ✅ ADD MODE
      if (newMode === 'add') {
        setDetailsData(emptyDetailsData)
        setDynamicExtraFields([])
        setDynamicFieldsProcessed(true)
        setRawRecord(null)
        setDataModel({})
        fetchedRecordIdRef.current = null

        const fieldNames = Object.keys(defaultValues)
        resetForm(formMethods, 'add', fieldNames)

        return
      }

      // ✅ EDIT / SHOW MODE WITH ID → FETCH
      if ((newMode === 'edit' || newMode === 'show') && id) {
        await fetchRecord({
          url: `${apiEndpoint}/${id}`,
          method: 'GET'
        })

        return
      }
    },
    [initialDetailsData, defaultValues, formMethods, apiEndpoint, fetchRecord]
  )

  const handleTabChange = useCallback(
    async (event: SyntheticEvent, newValue: string) => {
      const currentTab = Number(tabValue)
      const targetTab = Number(newValue)

      if (targetTab < currentTab) {
        setTabValue(newValue)
        return
      }

      if (tabConfigRef.current.length > 0) {
        const validation = await validateTabFields(currentTab, tabConfigRef.current, formMethods, mode, dictionary)

        if (!validation.isValid) {
          setAttemptedTabs(prev => new Set([...prev, currentTab]))

          setTimeout(() => {
            const firstError = validation.errors[0]
            const errorElement = document.querySelector(`[name="${firstError.field}"]`) as HTMLElement
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
              if ('focus' in errorElement) {
                ;(errorElement as HTMLInputElement).focus()
              }
            }
          }, 100)

          return
        }

        setValidatedTabs(prev => new Set([...prev, currentTab]))
      }

      setTabValue(newValue)
    },
    [tabValue, formMethods, mode, dictionary]
  )

  const handleDelete = useCallback(async () => {
    if (!accessToken) return

    if (await deleteRecordById(apiEndpoint, Number(recordId), accessToken, setError, setSuccess)) {
      navigateWithQuery(`${routerUrl.default}/list`, router, locale as Locale)
    }
  }, [accessToken, apiEndpoint, recordId, setError, setSuccess, navigateWithQuery, routerUrl, router, locale])

  const handleAddDetail = useCallback((key: string) => {
    setDetailsData(prevDetails => {
      const updatedDetails = [...(prevDetails[key] || []), { id: Date.now() }]
      return { ...prevDetails, [key]: updatedDetails }
    })
  }, [])

  const handleRemoveDetail = useCallback((key: string, index: number) => {
    setDetailsData(prevDetails => {
      const updatedDetails = prevDetails[key].filter((_, i) => i !== index)
      return { ...prevDetails, [key]: updatedDetails }
    })
  }, [])

  const handleUpdateDetail = useCallback((key: string, index: number, updatedRow: any) => {
    setDetailsData(prevDetails => {
      const updatedDetails = prevDetails[key].map((row, i) => (i === index ? updatedRow : row))
      return { ...prevDetails, [key]: updatedDetails }
    })
  }, [])

  const createDetailHandler = useCallback((key: string) => {
    return (updatedData: any[]) => {
      setTimeout(() => {
        setDetailsData(prev => {
          const currentData = prev[key]
          if (currentData === updatedData) return prev
          if (
            currentData &&
            updatedData &&
            currentData.length === updatedData.length &&
            JSON.stringify(currentData) === JSON.stringify(updatedData)
          ) {
            return prev
          }
          return { ...prev, [key]: updatedData }
        })
      }, 0)
    }
  }, [])

  const detailsHandlers = useMemo(() => {
    const handlers: Record<string, (data: any[]) => void> = {}
    Object.keys(initialDetailsData).forEach(key => {
      handlers[key] = createDetailHandler(key)
    })
    return handlers
  }, [createDetailHandler, initialDetailsData])

  const getDetailsErrors = useCallback(
    (detailKey: string) => {
      return errors.filter((error: any) => error.detailsKey === detailKey)
    },
    [errors]
  )

  // ✅ Helper: Set error for specific detail row
  const setDetailError = useCallback((detailsKey: string, rowIndex: number, fieldName: string, message: string) => {
    setErrors(prev => {
      // Remove existing error for this field
      const filtered = prev.filter(
        err => !(err.detailsKey === detailsKey && err.rowIndex === rowIndex && err.fieldName === fieldName)
      )

      // Add new error
      return [
        ...filtered,
        {
          detailsKey,
          rowIndex,
          fieldName,
          message
        }
      ]
    })
  }, [])

  // ✅ Helper: Clear errors for specific detail row
  const clearDetailErrors = useCallback((detailsKey: string, rowIndex?: number) => {
    setErrors(prev => {
      if (rowIndex === undefined) {
        // Clear all errors for this detailsKey
        return prev.filter(err => err.detailsKey !== detailsKey)
      }

      // Clear errors for specific row
      return prev.filter(err => !(err.detailsKey === detailsKey && err.rowIndex === rowIndex))
    })
  }, [])

  useEffect(() => {
    const unsubscribe = onEvent('row_clear_errors', (event: CustomEvent) => {
      const { detailsKey, rowIndex } = event.detail
      clearDetailErrors(detailsKey, rowIndex)
    })

    return unsubscribe
  }, [])

  // ✅ Helper: Validate detail row manually
  const validateDetailRow = useCallback(
    (
      detailsKey: string,
      rowIndex: number,
      row: any,
      fields: DynamicFormFieldProps[]
    ): { valid: boolean; errors: Array<{ fieldName: string; message: string }> } => {
      if (!row.rowChanged) return { valid: true, errors: [] }

      const rowErrors: Array<{ fieldName: string; message: string }> = []

      fields.forEach(field => {
        const value = row[field.name]

        // Skip validation if field is not visible in current mode
        if (field.modeCondition) {
          const fieldMode = typeof field.modeCondition === 'function' ? field.modeCondition(mode) : field.modeCondition

          if (fieldMode === 'show' || fieldMode === 'hidden') {
            return // Skip this field
          }
        }

        // Check required
        if (field.required && (value === null || value === undefined || value === '')) {
          const label = dictionary?.placeholders?.[field.label] || field.label
          rowErrors.push({
            fieldName: field.name,
            message: dictionary?.errors?.required ? `${label} ${dictionary.errors.required}` : `${label} مطلوب`
          })
        }

        // Add more validations as needed
        // Min length
        if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
          rowErrors.push({
            fieldName: field.name,
            message: `${field.label} يجب أن يكون على الأقل ${field.minLength} أحرف`
          })
        }

        // Max length
        if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
          rowErrors.push({
            fieldName: field.name,
            message: `${field.label} يجب ألا يتجاوز ${field.maxLength} أحرف`
          })
        }
      })

      return {
        valid: rowErrors.length === 0,
        errors: rowErrors
      }
    },
    [dictionary, mode]
  )

  // ✅ Helper: Validate all detail tables before save
  const validateAllDetailTables = useCallback((): {
    valid: boolean
    totalErrors: number
    errorsByTable: Record<string, number>
  } => {
    let totalErrors = 0
    const errorsByTable: Record<string, number> = {}

    // Clear all existing detail errors
    setErrors(prev => prev.filter(err => err.detailsKey === '_master'))

    // Validate each detail table
    Object.keys(detailsTablesConfig).forEach(detailsKey => {
      const tableConfig = detailsTablesConfig[detailsKey]
      const detailRows = detailsData[detailsKey] || []

      if (!tableConfig?.fields || detailRows.length === 0) {
        return
      }

      let tableErrors = 0

      detailRows.forEach((row, rowIndex) => {
        // ✅ 1. Validate required fields
        const validation = validateDetailRow(detailsKey, rowIndex, row, tableConfig.fields!)

        if (!validation.valid) {
          tableErrors += validation.errors.length
          totalErrors += validation.errors.length

          validation.errors.forEach(err => {
            setDetailError(detailsKey, rowIndex, err.fieldName, err.message)
          })
        }

        // ✅ 2. Run custom validator if exists
        if (customDetailValidators?.[detailsKey]) {
          const customValidation = customDetailValidators[detailsKey](row, rowIndex)

          if (!customValidation.valid) {
            tableErrors += customValidation.errors.length
            totalErrors += customValidation.errors.length

            customValidation.errors.forEach(err => {
              setDetailError(detailsKey, rowIndex, err.fieldName, err.message)
            })
          }
        }
      })

      if (tableErrors > 0) {
        errorsByTable[detailsKey] = tableErrors
      }
    })

    return {
      valid: totalErrors === 0,
      totalErrors,
      errorsByTable
    }
  }, [
    detailsTablesConfig,
    detailsData,
    validateDetailRow,
    setDetailError,
    customDetailValidators // ✅ Add to dependencies
  ])

  const updateDetailsData = useCallback((key: string, value: any, rowIndex?: number) => {
    setDetailsData(prev => {
      const current = Array.isArray(prev[key]) ? prev[key] : []

      // Replace entire key if no rowIndex
      if (rowIndex === undefined) {
        return {
          ...prev,
          [key]: value
        }
      }

      // Make a shallow copy of current rows
      const updatedRows = [...current]

      // Ensure row exists
      const existingRow = updatedRows[rowIndex] || {}

      // Always merge
      if (typeof value === 'object' && value !== null) {
        updatedRows[rowIndex] = {
          ...existingRow,
          ...value
        }
      } else {
        // If value is primitive, merge it with a key of the row (or your convention)
        updatedRows[rowIndex] = {
          ...existingRow,
          [key]: value
        }
      }
      console.log(updatedRows)
      console.log(detailsData)
      console.log({
        ...prev,
        [key]: updatedRows
      })
      return {
        ...prev,
        [key]: updatedRows
      }
    })
  }, [])

  const closeRecordInformationDialog = useCallback(() => {
    setOpenRecordInformationDialog(false)
  }, [])

  const closeDocumentsDialog = useCallback(() => {
    console.log('Closing documents dialog')
    setOpenDocumentsDialog(false) // ✅ قفل الـ dialog
    setTimeout(() => refetchRecord(), 100)
  }, [refetchRecord])

  return {
    formMethods,
    mode,
    setMode,
    detailsData,
    setDetailsData,
    // onSubmit: handleSubmit(onSubmit),
    onSubmit: handleSubmit(onSubmit), // ✅ For normal form submit
    submitWithParams, // ✅ For custom params

    handleCancel,
    handleMenuOptionClick,
    handleAddDetail,
    handleRemoveDetail,
    handleUpdateDetail,
    errors,
    setOpenDocumentsDialog,
    openDocumentsDialog,
    closeDocumentsDialog,
    setOpenRecordInformationDialog,
    openRecordInformationDialog,
    setOpenRecordTrackingDialog,
    openRecordTrackingDialog,
    handleTabChange,
    tabValue,
    setTabValue,
    recordId,
    locale,
    dataModel,
    extraFields,
    dynamicExtraFields,
    loadDynamicExtraFields,
    detailsHandlers,
    getDetailsErrors,
    refetchRecord,
    handleNextTab,
    validatedTabs,
    attemptedTabs,
    isNafathFlow,
    setSuccess,
    setWarning,
    warning,
    setInfo,
    setError,
    error,
    domain,
    fetchRecord,
    updateDetailsData,
    onSaveSuccess,
    onSaveError,
    navigateWithQuery,
    router,
    getDirtyValues,
    dirtyFields,
    getExcludedFieldNames,
    setDetailError,
    clearDetailErrors,
    validateDetailRow,
    validateAllDetailTables,
    closeRecordInformationDialog,
    dictionary,
    tabsCount
  }
}
