'use client'

import * as Shared from '@/shared'
import { getDictionary } from '@/utils/getDictionary'

const fields: Shared.DynamicFormFieldProps[] = []

type dataModelFormData = Shared.InferFieldType<typeof fields>

const JobVisitDetails = () => {
  const { isPrintMode } = Shared.usePrintMode()

  const { userDepartments, accessToken, user } = Shared.useSessionHandler()
  const [selectedDepartment, setSelectedDepartment] = Shared.useState()
  const [selectedFormType, setSelectedFormType] = Shared.useState()
  const [selectedServiceType, setSelectedServiceType] = Shared.useState()
  const [selectedCity, setSelectedCity] = Shared.useState()
  const [selectedTeamId, setSelectedTeamId] = Shared.useState()

  const [selectedStatus, setSelectedStatus] = Shared.useState()
  const [ratings, setRatings] = Shared.useState<any>({})
  const [fieldValues, setFieldValues] = Shared.useState({})
  const [checkListElement, setCheckListElement] = Shared.useState<any>(undefined)
  const [allChanges, setAllChanges] = Shared.useState<any[]>([])
  const [mounted, setMounted] = Shared.useState(false)
  const [jobVisitMode, setJobVisitMode] = Shared.useState<Shared.Mode>('search')

  const [dictionary, setDictionary] = Shared.useState<any>(null)
  const { shouldBlockAccess, AccessBlockedScreen, locale } = Shared.useCityAccess()
  const searchParams = Shared.useSearchParams()
  const initialMode = searchParams.get('mode') as Shared.Mode
  // ✅ Track which visit is currently being viewed (index into job_visit_details)
  const [activeVisitIndex, setActiveVisitIndex] = Shared.useState<number | null>(null)

  // ✅ Define dynamic fields
  const dynamicFields = [
    {
      name: 'files',
      label: 'files',
      type: 'storage' as const
    },
    {
      name: 'files_uploaded',
      label: 'first_support_file',
      type: 'multi_file' as const,
      gridSize: 12,
      fileableType: 'eme_job_visit_elements'
    },
    {
      name: 'note',
      label: 'ملاحظات',
      type: 'textarea' as const,
      width: '100%',
      gridSize: 12,
      required: false
    }
  ]

  const departmentOptions = Shared.useMemo(() => {
    return Shared.filterAndMap(userDepartments || [], [], (item: any) => ({
      label: item?.department_name_ar,
      value: item?.id,
      color: 'info'
    }))
  }, [userDepartments])

  const fields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      {
        name: 'action',
        label: '',
        type: 'storage',
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'team_id',
        label: 'team',
        type: 'select',
        apiUrl: '/eme/teams',
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],
        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4,
        viewProp: 'team.name',
        // queryParams: { user_depts: { personal_id: user.personal_id } }
        queryParams: {
          ...(typeof (user?.personal_id !== 'undefined') ? { team_members: { personal_id: user?.personal_id } } : {})
        },
        onChange: res => {
          if (res && res.object) {
            ; (setValue('service_type_id', res?.object?.service_type_id),
              setValue('department_id', res?.object?.department_id))
          }
        }
      },
      {
        name: 'city_id',
        label: 'city',
        type: 'select',
        options: Shared.toOptions(user?.user_cities, locale as string),

        defaultValue: user?.context?.city_id,
        requiredModes: ['add', 'edit'],
        labelProp: 'name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4,
        apiMethod: 'GET',
        viewProp: 'city.name_ar'
      },
      {
        name: 'department_id',
        label: 'department',
        type: 'select',
        options: departmentOptions,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4,
        viewProp: 'department.department_name_ar',
        visibleModes: ['search', 'show']
      },
      {
        name: 'service_type_id',
        label: 'service_type_id',
        type: 'select',
        apiUrl: '/eme/service-types',
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],
        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4,
        viewProp: 'service_type.name',
        visibleModes: ['search', 'show']
      },

      {
        name: 'form_type_id',
        label: 'form_type_id',
        viewProp: 'form_type.name',
        type: 'select',
        apiUrl: selectedServiceType && selectedTeamId ? '/eme/form-types' : undefined,
        queryParams: {
          status: '1',
          service_type_id: selectedServiceType,
          // ...(selectedDepartment ? { form_departments: { department_id: selectedDepartment } } : {}),
          ...(selectedTeamId ? { teams: { id: selectedTeamId } } : {})
        },
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],
        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4
        // searchMode: 'and'
      },
      {
        name: 'reference_id',
        label: 'reference_id',
        type: 'select',
        apiUrl: selectedServiceType && selectedCity ? '/eme/service-area-references' : undefined,
        queryParams: {
          service_type_id: selectedServiceType,
          city_id: selectedCity
        },
        // requiredModes: ['add'],
        displayProps: ['register_no', 'reference_id', 'reference_name', 'service_type_name'],
        keyProp: 'reference_id',
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4,
        viewProp: 'reference.reference_name',
        displayWithBadge: true,
        badgeColor: 'info',
        searchProps: ['reference_id', 'reference_name']
        // searchMode: 'and'
      },
      {
        name: 'visit_date',
        label: 'visit_date',
        type: 'date_time',
        now: true,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4
      },

      {
        name: 'area_id',
        label: 'area',
        type: 'select',
        viewProp: 'area.name',
        apiUrl: selectedCity ? '/eme/areas' : undefined,
        queryParams: {
          city_id: selectedCity
        },
        // requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],

        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4
      },
      {
        name: 'visit_type_id',
        label: 'visit_type',
        type: 'select',
        apiUrl: '/eme/visit-types',
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],
        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4,
        viewProp: 'visit_type.name'
      },
      {
        name: 'visit_reason_type_id',
        label: 'visit_reason_type',
        type: 'select',
        apiUrl: '/eme/visit-reason-types',
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],
        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          else return mode
        },
        gridSize: 4,
        viewProp: 'visit_reason_type.name'
      },
      {
        name: 'visit_no',
        label: 'visit_no',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => 'show',
        visibleModes: ['show', 'edit'],
        gridSize: 4
      },
      {
        name: 'status',
        label: 'status',
        type: 'toggle',
        options: Shared.jobVisitStatusList.filter(option => {
          if (initialMode === 'add' || initialMode === 'edit') {
            return option.value !== '1'
          } else return true
        }),
        // defaultValue: '2',
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12,
        visibleModes: ['show', 'search']
      },
      {
        name: 'note',
        label: 'notes',
        type: 'textarea',
        requiredModes: [],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      }
    ],
    [departmentOptions, selectedCity, selectedDepartment, selectedServiceType, initialMode, user]
  )

  const statusFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'status',
        label: 'status',
        type: 'toggle',
        options: Shared.jobVisitStatusList.filter(option => {
          if (initialMode === 'add' || initialMode === 'edit') {
            return option.value !== '1'
          } else return true
        }),
        // defaultValue: '2',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12,
        visibleModes: ['add', 'edit']
      }
    ],
    [initialMode]
  )

  const responsiblePersonFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'last_incharge_name',
        label: 'last_incharge_name',
        type: 'text',
        // requiredModes: selectedStatus !== '3' || selectedStatus !== '4' ? [] : ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        requiredModeCondition(mode, formValues) {
          if (Number(formValues['status']) == 3 || Number(formValues['status']) == 4) {
            return true
          }
          return false
        }
      },
      {
        name: 'last_incharge_id_no',
        label: 'last_incharge_id_no',
        type: 'text',
        // requiredModes: selectedStatus !== '3' || selectedStatus !== '4' ? [] : ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        requiredModeCondition(mode, formValues) {
          if (formValues['status'] == '3' || formValues['status'] == '4') {
            return true
          }
          return false
        },
        maxLength: 10,
        minLength: 10
      },
      {
        name: 'last_incharge_job_titel',
        label: 'last_incharge_job_titel',
        type: 'text',
        // requiredModes: selectedStatus !== '3' || selectedStatus !== '4' ? [] : ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        requiredModeCondition(mode, formValues) {
          if (formValues['status'] == '3' || formValues['status'] == '4') {
            return true
          }
          return false
        }
      },
      {
        name: 'last_incharge_mobile',
        label: 'last_incharge_mobile',
        type: 'mobile',
        // requiredModes: selectedStatus !== '3' || selectedStatus !== '4' ? [] : ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        requiredModeCondition(mode, formValues) {
          if (formValues['status'] == '3' || formValues['status'] == '4') {
            return true
          }
          return false
        }
      },
      {
        name: 'next_visit_date',
        label: 'next_visit_date',
        type: 'date_time',
        // requiredModes: selectedStatus === '3' ? ['add', 'edit'] : [],
        visible: selectedStatus === '3' ? true : false,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        requiredModeCondition(mode, formValues) {
          if (Number(formValues['status']) === 3) {
            return true
          }
          return false
        }
      }
    ],
    [selectedStatus]
  )

  const elementsFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'checklist_element_id',
        label: 'checklist_element_id',
        type: 'text',
        gridSize: 4
      },
      {
        name: 'form_type_status_id',
        label: 'form_type_status_id',
        type: 'text',
        gridSize: 4
      },
      {
        name: 'value',
        label: 'value',
        type: 'text',
        gridSize: 4
      },
      {
        name: 'note',
        label: 'note',
        type: 'textarea'
      },
      {
        name: 'files',
        label: 'files',
        type: 'storage'
      },
      {
        name: 'files_uploaded',
        label: 'first_support_file',
        type: 'multi_file',
        fileableType: 'eme_job_visit_elements'
      }
      //   {
      //     name: 'second-support_file',
      //     label: 'second-support_file',
      //     type: 'file'
      //   }
    ],
    []
  )

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,

    dataModel,
    detailsHandlers,
    detailsData,
    setDetailsData,
    fetchRecord,
    setError,
    setInfo,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/eme/job-visits',
    routerUrl: { default: '/apps/eme/job-visit' },
    fields: [...fields, ...responsiblePersonFields, ...statusFields],
    initialDetailsData: {
      job_visit_elements: []
    },
    detailsTablesConfig: {
      job_visit_elements: { fields: elementsFields, trackIndex: true }
    }
  })

  const { watch, setValue } = formMethods
  const department = watch('department_id')
  const serviceType = watch('service_type_id')
  const formType = watch('form_type_id')
  const city = watch('city_id')
  const status = watch('status')
  const watchedTeam = watch('team_id')
  const visitAction = searchParams.get('action')
  Shared.useEffect(() => {
    setSelectedServiceType(undefined)
    if (watchedTeam) setSelectedTeamId(watchedTeam)
  }, [watchedTeam])

  Shared.useEffect(() => {
    setMounted(true)
  }, [])

  Shared.useEffect(() => {
    if (locale) {
      getDictionary(locale as Shared.Locale).then(setDictionary)
    }
  }, [locale])
  Shared.useEffect(() => {
    setSelectedStatus(status)
  }, [status])

  Shared.useEffect(() => {
    setJobVisitMode(mode)
  }, [mode])

  Shared.useEffect(() => {
    if (formType) {
      if (formType !== selectedFormType) {
        setSelectedFormType(formType)

        // ✅ Clear error and existing ratings when form type changes
        setError('')
        setDetailsData(prev => ({ ...prev, job_visit_elements: [] }))

        const fillFormTypeDetails = async () => {
          await fetchRecord({
            url: `/eme/form-types/${formType}`,
            method: 'GET',
            shouldSetDataModel: false,
            onSuccess: data => {
              setCheckListElement(data)
            },
            onError: error => {
              console.log('ℹ️ No existing request found, staying in add mode')
            }
          })
        }

        fillFormTypeDetails()
      }
    } else {
      if (selectedFormType !== undefined) {
        setSelectedFormType(undefined)
        setCheckListElement(undefined)
        setError('')

        // ✅ Clear elements when no form type is selected
        setDetailsData(prev => ({ ...prev, job_visit_elements: [] }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType])

  Shared.useEffect(() => {
    if (serviceType !== selectedServiceType) {
      if (selectedServiceType) {
        formMethods.setValue('form_type_id', null)
        formMethods.setValue('reference_id', null)
      }
      setSelectedServiceType(serviceType)
    }
  }, [serviceType, selectedServiceType, formMethods])

  Shared.useEffect(() => {
    if (department !== selectedDepartment) {
      if (selectedDepartment) {
        formMethods.setValue('form_type_id', null)
      }
      setSelectedDepartment(department)
    }
  }, [department, selectedDepartment, formMethods])

  Shared.useEffect(() => {
    if (city !== selectedCity) {
      if (selectedCity) {
        formMethods.setValue('area_id', null)
        formMethods.setValue('reference_id', null)
      }
      setSelectedCity(city)
    }
  }, [city, selectedCity, formMethods])
  // Add this after your other useEffects
  Shared.useEffect(() => {
    if (selectedStatus === '3' || selectedStatus === '4') {
      // Reset all responsible person fields to empty
      const fieldsToReset = [
        'last_incharge_name',
        'last_incharge_id_no',
        'last_incharge_job_titel',
        'last_incharge_mobile',
        'next_visit_date'
      ]

      fieldsToReset.forEach(fieldName => {
        formMethods.setValue(fieldName as any, null, {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false
        })
      })
    }
  }, [selectedStatus, formMethods])
  Shared.useEffect(() => {
    if (status !== selectedStatus) {
      setSelectedStatus(status)
    }
  }, [status, selectedStatus])

  const groups = Shared.useMemo(() => {
    return (
      checkListElement?.form_group_elements?.map((item: any) => ({
        ...item,
        items: item?.form_checklist_elements
      })) ?? []
    )
  }, [checkListElement])

  const ratingColumns = Shared.useMemo(() => {
    return (
      checkListElement?.form_type_statuses?.map((item: any, index: number) => ({
        value: item?.value,
        label: item?.name,
        color: item.style.length > 3 ? item.style : Shared.generateColor(),
        id: item?.id,
        type: item?.type
      })) || []
    )
  }, [checkListElement])

  const handleDataChange = Shared.useCallback((data: any) => {
    console.log(detailsData)

    setDetailsData(prev => ({ ...prev, job_visit_elements: data }))
  }, [])

  // ✅ VALIDATION LOGIC: Check if all items are rated
  const totalItemsToRate = Shared.useMemo(() => {
    const uniqueIds = new Set()
    groups.forEach((group: any) => {
      group.items?.forEach((item: any) => {
        if (item.checklist_element_id) {
          uniqueIds.add(String(item.checklist_element_id))
        }
      })
    })
    return uniqueIds.size
  }, [groups])

  const ratedItemsCount = Shared.useMemo(() => {
    const elements = detailsData?.job_visit_elements || []
    if (!Array.isArray(elements)) return 0

    const ratedIds = new Set()
    elements.forEach((el: any) => {
      const statusId = el.form_type_status_id
      if (statusId !== null && statusId !== undefined && statusId !== '' && statusId !== 0) {
        ratedIds.add(String(el.checklist_element_id))
      }
    })

    // Debugging for the user to see which IDs are missing in the console
    if (ratedIds.size < totalItemsToRate && groups.length > 0) {
      const allItemIds = groups.flatMap((g: any) => g.items?.map((i: any) => String(i.id)) || [])
      const missingIds = allItemIds.filter((id: any) => id && !ratedIds.has(id))
      if (missingIds.length > 0) {
        console.warn('Checklist Validation - Missing IDs:', missingIds)
      }
    }

    return ratedIds.size
  }, [detailsData?.job_visit_elements, totalItemsToRate, groups])

  const isRatingComplete = totalItemsToRate > 0 ? ratedItemsCount >= totalItemsToRate : true

  const handleSaveWrapper = async (data: any) => {
    // ✅ Check 1
    if (!isRatingComplete && mode !== 'show') {
      const remaining = totalItemsToRate - ratedItemsCount
      const msg =
        locale === 'ar'
          ? `يرجى إكمال تقييم جميع العناصر. يتبقى ${remaining} عنصر لم يتم تقييمه.`
          : `Please complete all ratings. ${remaining} items remaining.`
      setError(msg)
      setInfo('')
      Shared.scrollToTop()
      return
    }

    // ✅ Check 2
    const elements = detailsData?.job_visit_elements || []
    const hasInvalidItems = elements.some((el: any) => {
      const selectedStatusId = el.form_type_status_id
      if (!selectedStatusId) return false
      const statusObj = ratingColumns.find((col: any) => Number(col.id) == Number(selectedStatusId))
      return Number(statusObj?.type) === 2
    })

    if (hasInvalidItems && mode !== 'show') {
      // ✅ تحقق إن status 3 مش محدد بالفعل
      const currentStatus = formMethods.getValues('status')

      if (String(currentStatus) !== '3' && String(currentStatus) !== '4') {
        formMethods.setValue('status', '3', { shouldDirty: true })

        // ✅ انتظر re-render + فعل validation
        await new Promise(resolve => setTimeout(resolve, 0))

        await formMethods.trigger([
          'last_incharge_name',
          'last_incharge_id_no',
          'last_incharge_job_titel',
          'last_incharge_mobile',
          'next_visit_date'
        ])

        const msg =
          locale === 'ar'
            ? 'نظراً لوجود بنود غير سليمة. يرجى تعبئة الحقول المطلوبة مع تحديد الحالة لإستكمال العملية'
            : 'Another visit has been scheduled due to invalid items. Please fill in the required fields to complete the process.'

        setInfo(msg)
        setError('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // ✅ status = 3 بالفعل - تحقق إن الـ required fields اتملت
      const requiredFields = [
        'last_incharge_name',
        'last_incharge_id_no',
        'last_incharge_job_titel',
        'last_incharge_mobile'
      ]

      if (String(currentStatus) === '3') requiredFields.push('next_visit_date')

      console.log('fff', formMethods.getValues('next_visit_date'))

      const missingFields = requiredFields.filter(field => {
        const val = formMethods.getValues(field as any)
        return !val || val === ''
      })

      if (missingFields.length > 0) {
        // ✅ trigger validation على الـ fields المطلوبة
        await formMethods.trigger(missingFields as any)

        const msg =
          locale === 'ar'
            ? 'يرجى تعبئة جميع الحقول المطلوبة للمسؤول قبل الحفظ'
            : 'Please fill in all required responsible person fields before saving.'

        setError(msg)
        setInfo('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return // ✅ أوقف حتى تتملى الـ fields
      }
    }
    if (visitAction) {
      setValue('action', visitAction, { shouldDirty: true, shouldValidate: true })
    }
    // ✅ كل الـ checks اجتازت - اعمل save
    await onSubmit(data)
  }

  // ===== Visit History Logic =====
  const jobVisitDetails: any[] = Shared.useMemo(() => {
    return (dataModel as any)?.job_visit_details ?? []
  }, [dataModel])

  const lastVisitIndex = jobVisitDetails.length - 1
  const visitTarget = searchParams.get('visitTarget')

  // null means "not yet overridden by user" → resolve to lastVisitIndex or last-1
  const effectiveVisitIndex: number = Shared.useMemo(() => {
    if (activeVisitIndex !== null) return activeVisitIndex
    if (visitTarget === 'previous') {
      return lastVisitIndex > 0 ? lastVisitIndex - 1 : lastVisitIndex < 0 ? 0 : lastVisitIndex
    }
    return lastVisitIndex < 0 ? 0 : lastVisitIndex
  }, [activeVisitIndex, lastVisitIndex, visitTarget])

  const activeVisit = Shared.useMemo(() => {
    if (jobVisitDetails.length === 0) return null
    return jobVisitDetails[effectiveVisitIndex] ?? null
  }, [effectiveVisitIndex, jobVisitDetails])

  const isLastVisit = effectiveVisitIndex === lastVisitIndex

  // Edit mode logic:
  // - If visitTarget is 'previous', only the penultimate visit (last-1) is editable.
  // - Otherwise, only the latest visit (last) is editable.
  const isTargetedVisit = visitTarget === 'previous' ? effectiveVisitIndex === lastVisitIndex - 1 : isLastVisit

  const visitTableMode = isTargetedVisit && mode !== 'show' ? 'edit' : 'show'

  // Server elements for the active visit
  const activeVisitElements: any[] = Shared.useMemo(() => {
    return activeVisit?.job_visit_elements ?? []
  }, [activeVisit])

  // Sync detailsData whenever the effective visit changes
  Shared.useEffect(() => {
    if (jobVisitDetails.length === 0) return
    const targetedElements = jobVisitDetails[effectiveVisitIndex]?.job_visit_elements ?? []
    setDetailsData(prev => ({ ...prev, job_visit_elements: targetedElements }))
  }, [jobVisitDetails, effectiveVisitIndex])

  const formatVisitDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return dateStr.substring(0, 10)
  }

  // Loading styles
  const loadingStyles = `
    .loading-spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #7367f0;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .visit-counter-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 14px;
      border-radius: 20px;
      background: var(--mui-palette-primary-lightOpacity, rgba(115,103,240,0.10));
      border: 1px solid var(--mui-palette-primary-main, #7367f0);
      font-size: 13px;
      font-weight: 600;
      color: var(--mui-palette-primary-main, #7367f0);
      min-width: 80px;
      justify-content: center;
    }
    .visit-counter-badge i {
      font-size: 13px;
    }
  `
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  if (!dictionary) return <Shared.LoadingSpinner type='skeleton' />
  if (!mounted) {
    return (
      <Shared.FormProvider {...formMethods}>
        <style>{loadingStyles}</style>
        <Shared.Grid container spacing={2}>
          <Shared.Grid size={{ xs: 12 }}>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className='loading-spinner' />
              <div style={{ marginTop: '16px', color: '#666' }}>جاري التحميل...</div>
            </div>
          </Shared.Grid>
        </Shared.Grid>
      </Shared.FormProvider>
    )
  }

  return (
    <Shared.FormProvider {...formMethods}>
      <style>{loadingStyles}</style>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'job_visit'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
          <Shared.Box sx={{ marginTop: '20px' }}>
            <Shared.DynamicGroupedRatingTable
              key={`visit-${activeVisit?.id ?? activeVisitIndex}`}
              title='checklist_element'
              groups={groups}
              ratingColumns={ratingColumns}
              ratingType='radio'
              mode={visitTableMode as any}
              detailsKey='job_visit_elements'
              itemIdKey='checklist_element_id'
              itemIdKeyProp='checklist_element_id'
              ratingKey='form_type_status_id'
              ratingValueKey='value'
              initialData={visitTableMode === 'show' ? activeVisitElements : (detailsData?.job_visit_elements?.length ? detailsData.job_visit_elements : activeVisitElements)}
              onDataChange={detailsHandlers?.job_visit_elements}
              dynamicFields={dynamicFields}
              enableGroupRating={true}
              enableColors={true}
              dataObject={dataModel}
              showInfoIcon={(item, group, rowData) => {
                // if (!isLastVisit || mode === 'show') return false
                const selectedStatusId = rowData?.form_type_status_id
                const statusObj = checkListElement?.form_type_statuses?.find((s: any) => s.id == selectedStatusId)
                return statusObj?.type == '2'
              }}
            />
          </Shared.Box>
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} printForm={false} />
        </Shared.Grid>

        {/* ===== Visit History Navigation Card ===== */}
        <div style={{ display: !isPrintMode ? 'block' : 'none' }} className='w-full'>
          {jobVisitDetails.length > 0 && (
            <div style={{ width: '100%' }}>
              <Shared.Card>
                <div
                  style={{
                    // borderRadius: 14,
                    overflow: 'hidden',
                    background: 'var(--mui-palette-background-paper, #ffffff)',
                    // border: '1px solid var(--mui-palette-divider, #e8eaed)',
                    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Header with navigation */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--mui-palette-divider)',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    {/* Left: title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: 'var(--mui-palette-primary-lightOpacity, rgba(115,103,240,0.08))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--mui-palette-primary-main, #7367f0)',
                          fontSize: 18
                        }}
                      >
                        <i className='ri-file-list-3-line' />
                      </div>
                      <div>
                        <Shared.Typography
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: 'var(--mui-palette-text-primary)'
                          }}
                        >
                          {dictionary?.placeholders?.visit_history || 'سجل الزيارات'}
                        </Shared.Typography>
                        <Shared.Typography
                          style={{
                            fontSize: 12,
                            color: 'var(--mui-palette-text-secondary)'
                          }}
                        >
                          {jobVisitDetails.length} {dictionary?.placeholders?.visit || 'زيارة'} ·{' '}
                          {dictionary?.placeholders?.show_visit || 'عرض الزيارة'} {effectiveVisitIndex + 1}{' '}
                          {locale === 'ar' ? 'من' : 'of'} {jobVisitDetails.length}
                        </Shared.Typography>
                      </div>
                    </div>

                    {/* Right: prev / counter / next */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Prev arrow */}
                      <Shared.Tooltip title={dictionary?.placeholders?.prev_visit || 'الزيارة السابقة'}>
                        <span>
                          <Shared.IconButton
                            size='small'
                            disabled={effectiveVisitIndex === 0}
                            onClick={() => setActiveVisitIndex(effectiveVisitIndex > 0 ? effectiveVisitIndex - 1 : 0)}
                            style={{
                              border: '1px solid var(--mui-palette-divider)',
                              borderRadius: 8
                            }}
                          >
                            <i className='ri-arrow-right-s-line' style={{ fontSize: 20 }} />
                          </Shared.IconButton>
                        </span>
                      </Shared.Tooltip>

                      {/* Counter badge - using CSS class instead of inline styles */}
                      <div className='visit-counter-badge'>
                        <i className='ri-calendar-event-line' />
                        <span>
                          {effectiveVisitIndex + 1} / {jobVisitDetails.length}
                        </span>
                      </div>

                      {/* Next arrow */}
                      <Shared.Tooltip title={dictionary?.placeholders?.next_visit || 'الزيارة التالية'}>
                        <span>
                          <Shared.IconButton
                            size='small'
                            disabled={effectiveVisitIndex === lastVisitIndex}
                            onClick={() =>
                              setActiveVisitIndex(
                                effectiveVisitIndex < lastVisitIndex ? effectiveVisitIndex + 1 : lastVisitIndex
                              )
                            }
                            style={{
                              border: '1px solid var(--mui-palette-divider)',
                              borderRadius: 8
                            }}
                          >
                            <i className='ri-arrow-left-s-line' style={{ fontSize: 20 }} />
                          </Shared.IconButton>
                        </span>
                      </Shared.Tooltip>
                    </div>
                  </div>

                  {/* Visit meta info bar */}
                  {activeVisit && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '10px 20px',
                        flexWrap: 'wrap'
                      }}
                    >
                      {activeVisit.id && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <i
                            className='ri-fingerprint-line'
                            style={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}
                          />
                          <Shared.Typography
                            style={{ fontSize: 13, fontWeight: 600, color: 'var(--mui-palette-text-secondary)' }}
                          >
                            {dictionary?.placeholders?.visit_no || 'رقم الزيارة'} :
                          </Shared.Typography>
                          <Shared.Typography style={{ fontSize: 11, fontWeight: 400 }}>
                            {activeVisit.id}
                          </Shared.Typography>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i
                          className='ri-calendar-line'
                          style={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}
                        />
                        <Shared.Typography
                          style={{ fontSize: 13, fontWeight: 600, color: 'var(--mui-palette-text-secondary)' }}
                        >
                          {dictionary?.placeholders?.visit_date || 'تاريخ الزيارة'} :
                        </Shared.Typography>
                        <Shared.Typography style={{ fontSize: 11, fontWeight: 400 }}>
                          {formatVisitDate(activeVisit.visit_date)}
                        </Shared.Typography>
                      </div>

                      {activeVisit.serial_no && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 20,
                            background: 'rgba(59,130,246,0.1)',
                            border: `1px solid rgba(59,130,246,0.3)`,
                            color: '#2563eb',
                            fontSize: 11,
                            fontWeight: 600
                          }}
                        >
                          <i
                            className='ri-hashtag'
                            style={{ fontSize: 14, color: 'var(--mui-palette-text-secondary)' }}
                          />
                          <Shared.Typography
                            style={{ fontSize: 13, fontWeight: 600, color: 'var(--mui-palette-text-secondary)' }}
                          >
                            {dictionary?.placeholders?.visit || 'الزيارة'} :
                          </Shared.Typography>
                          <Shared.Typography style={{ fontSize: 11, fontWeight: 400 }}>
                            {activeVisit.visit_no}
                          </Shared.Typography>
                        </div>
                      )}

                      <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 10 }}>
                        {activeVisit &&
                          (() => {
                            const statusObj = Shared.jobVisitStatusList.find((s: any) => s.value == activeVisit.status)
                            const colors: any = {
                              success: {
                                bg: 'rgba(34,197,94,0.1)',
                                border: 'rgba(34,197,94,0.3)',
                                text: '#16a34a',
                                icon: 'ri-checkbox-circle-line'
                              },
                              warning: {
                                bg: 'rgba(255,153,0,0.1)',
                                border: 'rgba(255,153,0,0.3)',
                                text: '#f59e0b',
                                icon: 'ri-error-warning-line'
                              },
                              error: {
                                bg: 'rgba(239,68,68,0.1)',
                                border: 'rgba(239,68,68,0.3)',
                                text: '#dc2626',
                                icon: 'ri-close-circle-line'
                              },
                              info: {
                                bg: 'rgba(59,130,246,0.1)',
                                border: 'rgba(59,130,246,0.3)',
                                text: '#2563eb',
                                icon: 'ri-information-line'
                              }
                            }
                            const config = colors[statusObj?.color as string] || colors.info

                            return (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  padding: '3px 10px',
                                  borderRadius: 20,
                                  background: config.bg,
                                  border: `1px solid ${config.border}`,
                                  color: config.text,
                                  fontSize: 11,
                                  fontWeight: 600
                                }}
                              >
                                <i className={config.icon} style={{ fontSize: 11 }} />
                                {statusObj?.label || dictionary?.placeholders?.visit_not_completed || 'لم تتم الزيارة'}
                              </span>
                            )
                          })()}
                        {visitTableMode === 'edit' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '3px 10px',
                              borderRadius: 20,
                              marginLeft: '3px',
                              marginRight: '3px',
                              background: 'rgba(34,197,94,0.1)',
                              border: '1px solid rgba(34,197,94,0.3)',
                              color: '#16a34a',
                              fontSize: 11,
                              fontWeight: 600
                            }}
                          >
                            <i className='ri-edit-line' style={{ fontSize: 11 }} />
                            {dictionary?.placeholders?.editable || 'قابل للتحرير'}
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '3px 10px',
                              borderRadius: 20,
                              marginLeft: '3px',
                              marginRight: '3px',
                              background: 'rgba(148,163,184,0.1)',
                              border: '1px solid rgba(148,163,184,0.3)',
                              color: '#64748b',
                              fontSize: 11,
                              fontWeight: 600
                            }}
                          >
                            <i className='ri-eye-line' style={{ fontSize: 11 }} />
                            {dictionary?.placeholders?.view_only || 'للعرض فقط'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Responsible Person Details Section */}
                  {activeVisit &&
                    (activeVisit.last_incharge_name ||
                      activeVisit.next_visit_date ||
                      activeVisit.last_incharge_mobile ||
                      activeVisit.last_incharge_id_no ||
                      activeVisit.last_incharge_job_titel) && (
                      <div
                        style={{
                          padding: '16px 20px',
                          borderTop: '1px dashed var(--mui-palette-divider)',
                          background: 'rgba(var(--mui-palette-primary-mainChannel) / 0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <i
                            className='ri-user-follow-line'
                            style={{ color: 'var(--mui-palette-primary-main)', fontSize: 18 }}
                          />
                          <Shared.Typography style={{ fontWeight: 600, fontSize: 14 }}>
                            {dictionary?.titles?.responsible_person_info || 'بيانات المسؤول'}
                          </Shared.Typography>
                        </div>
                        <Shared.Grid container spacing={2}>
                          {[
                            { key: 'last_incharge_name', icon: 'ri-user-line' },
                            { key: 'last_incharge_job_titel', icon: 'ri-briefcase-line' },
                            { key: 'last_incharge_id_no', icon: 'ri-id-card-line' },
                            { key: 'last_incharge_mobile', icon: 'ri-phone-line' },
                            { key: 'next_visit_date', icon: 'ri-calendar-check-line', isDate: true }
                          ].map(
                            field =>
                              activeVisit[field.key] && (
                                <Shared.Grid key={field.key} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <i
                                        className={field.icon}
                                        style={{ fontSize: 12, color: 'var(--mui-palette-text-secondary)' }}
                                      />
                                      <Shared.Typography
                                        style={{ fontSize: 11, color: 'var(--mui-palette-text-secondary)' }}
                                      >
                                        {dictionary?.placeholders?.[field.key] || field.key}
                                      </Shared.Typography>
                                    </div>
                                    <Shared.Typography
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: field.isDate ? 'var(--mui-palette-error-main)' : 'inherit'
                                      }}
                                    >
                                      {field.isDate ? formatVisitDate(activeVisit[field.key]) : activeVisit[field.key]}
                                    </Shared.Typography>
                                  </div>
                                </Shared.Grid>
                              )
                          )}
                        </Shared.Grid>
                      </div>
                    )}

                  {!activeVisit && (
                    <div
                      style={{
                        padding: '40px 24px',
                        textAlign: 'center',
                        color: 'var(--mui-palette-text-secondary)'
                      }}
                    >
                      <i className='ri-inbox-line' style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }} />
                      <div>لا توجد زيارات مسجلة</div>
                    </div>
                  )}
                </div>
              </Shared.Card>
            </div>
          )}

          {/* ===== Rating Table Card (separate from سجل الزيارات nav) ===== */}
          {jobVisitDetails.length > 0 && activeVisit && (
            <Shared.Grid size={{ xs: 12 }}>
              <Shared.DynamicGroupedRatingTable
                key={`visit-${activeVisit.id ?? activeVisitIndex}`}
                title='checklist_element'
                groups={groups}
                ratingColumns={ratingColumns}
                ratingType='radio'
                mode={visitTableMode as any}
                detailsKey='job_visit_elements'
                itemIdKey='checklist_element_id'
                itemIdKeyProp='checklist_element_id'
                ratingKey='form_type_status_id'
                ratingValueKey='value'
                initialData={
                  isLastVisit ? (detailsData?.job_visit_elements ?? activeVisitElements) : activeVisitElements
                }
                onDataChange={detailsHandlers?.job_visit_elements}
                dynamicFields={dynamicFields}
                enableGroupRating={true}
                enableColors={true}
                dataObject={dataModel}
                showInfoIcon={(item, group, rowData) => {
                  // if (!isLastVisit || mode === 'show') return false
                  const selectedStatusId = rowData?.form_type_status_id
                  const statusObj = checkListElement?.form_type_statuses?.find((s: any) => s.id == selectedStatusId)
                  return statusObj?.type == '2'
                }}
              />
            </Shared.Grid>
          )}

          {/* Fallback: original table when there are no job_visit_details (add mode) */}
          {jobVisitDetails.length === 0 && (
            <Shared.Grid size={{ xs: 12 }}>
              <div className='p-4'>
                <Shared.DynamicGroupedRatingTable
                  key={`form-type-${selectedFormType}`}
                  title='checklist_element'
                  groups={groups}
                  ratingColumns={ratingColumns}
                  ratingType='radio'
                  mode={mode as any}
                  detailsKey='job_visit_elements'
                  itemIdKey='checklist_element_id'
                  itemIdKeyProp='checklist_element_id'
                  ratingKey='form_type_status_id'
                  ratingValueKey='value'
                  initialData={[]}
                  onDataChange={handleDataChange}
                  dynamicFields={dynamicFields}
                  enableGroupRating={true}
                  enableColors={true}
                  dataObject={dataModel}
                  showInfoIcon={(item, group, rowData) => {
                    const selectedStatusId = rowData?.form_type_status_id
                    const statusObj = checkListElement?.form_type_statuses?.find((s: any) => s.id == selectedStatusId)
                    return statusObj?.type == '2'
                  }}
                />
              </div>
            </Shared.Grid>
          )}
        </div>

        {(mode === 'add' || mode === 'edit') && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={statusFields}
              headerConfig={{ title: 'status' }}
              mode={mode}
              screenMode={mode}
            />
          </Shared.Grid>
        )}

        {(selectedStatus === '3' || selectedStatus === '4') && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={responsiblePersonFields}
              headerConfig={{ title: 'responsible_person_info' }}
              mode={mode}
              screenMode={mode}
            />
          </Shared.Grid>
        )}

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            open={openRecordInformationDialog}
            onClose={() => closeRecordInformationDialog()}
            locale={locale}
            dataModel={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions
            locale={locale}
            onCancel={handleCancel}
            onSaveSuccess={handleSaveWrapper}
            mode={mode}
          // disabled={!isRatingComplete && mode !== 'show'} // Optional: keep it disabled or just show message on click
          />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default JobVisitDetails
