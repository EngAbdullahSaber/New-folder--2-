import { useState, useMemo, useEffect } from 'react'
import * as Shared from '@/shared' // adjust import according to your project
import { toast } from 'react-toastify'
import { start } from 'repl'
import { validateDatesInPeriod } from '@/shared'
import { useAppSettings } from '../../seasonal-job-request/details/hooks'

export const useNominationForm = (scope: string) => {
  const { personal, status, user, accessToken } = Shared.useSessionHandler()

  const searchParams = Shared.useSearchParams()
  const initialMode = searchParams.get('mode') as Shared.Mode

  // States
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>()
  const [centerClassification, setCenterClassification] = useState<any | undefined>()
  const [appSetting, setAppSetting] = Shared.useState<any>()

  const [approvedJobs, setApprovedJobs] = useState<any[]>([])

  // Department options
  const departmentOptions = useMemo(() => {
    return Shared.filterAndMap(
      user?.user_depts || [],
      [{ key: 'user_dept_type', value: '1', operation: '=' }],
      (item: any) => ({
        label: item?.department_name_ar,
        value: item?.id,
        color: 'info'
      })
    )
  }, [user?.user_depts])

  // Form fields
  const fields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },
      {
        name: 'season',
        label: 'season',
        type: 'select',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },
      {
        name: 'employee_name',
        label: 'current_employee',
        type: 'text',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: 'nomination_date',
        label: 'nomination_date',
        type: 'date',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: 'department_id',
        label: 'current_department',
        type: 'select',
        options: departmentOptions,
        modeCondition: (mode: Shared.Mode) => (departmentOptions.length > 1 ? mode : 'show'),
        requiredModes: ['add', 'edit'],
        visible: scope === 'department',
        gridSize: 6,
        viewProp: 'department_name_ar',

        onChange(value: any) {
          if (mode === 'edit') {
            setValue('job_id', null)
          }
        }
      },
      {
        name: 'department_id',
        label: 'hr_current_department',
        type: 'select',
        apiUrl: '/def/seasonal-departments',
        labelProp: 'department_name_ar',
        selectFirstValue: initialMode === 'add',
        keyProp: 'department_id',
        queryParams: { seasonal_departments_types: { id: appSetting?.internal_department_type_id } },
        modeCondition: (mode: Shared.Mode) => mode,
        // modeCondition: (mode: Shared.Mode) => (departmentOptions.length > 1 ? mode : 'show'),
        requiredModes: ['add', 'edit'],
        visible: scope === 'hr',
        gridSize: 6,
        viewProp: 'department.department_name_ar',
        onChange(value: any) {
          if (mode === 'edit') {
            setValue('job_id', null)
          }
        }
      }
    ],
    [departmentOptions, appSetting]
  )

  // Budget fields
  const budgetFields = useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'estimated_budget',
        label: 'estimated_budget',
        type: 'amount',
        required: false,
        modeCondition: () => 'show',
        gridSize: 3,
        align: 'start'
      },
      {
        name: 'nomination_salary',
        label: 'nomination_salary',
        type: 'amount',
        required: false,
        modeCondition: () => 'show',
        gridSize: 3,
        align: 'start'
      },
      {
        name: 'selected_salary_nomination',
        label: 'selected_salary_nomination',
        type: 'amount',
        required: false,
        modeCondition: () => 'show',
        gridSize: 3,
        align: 'start'
      },
      {
        name: 'remaining',
        label: 'remaining',
        type: 'amount',
        required: false,
        modeCondition: () => 'show',
        gridSize: 3,
        align: 'start'
      }
    ],
    []
  )

  const searchFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'request_no',
        label: 'request_no',
        type: 'number',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'id_no',
        label: 'id_no',
        type: 'number',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'personal_id',
        label: 'employee_name',
        type: 'select',
        apiUrl: '/def/personal',
        labelProp: 'id',
        keyProp: 'id',
        displayProps: ['id', 'full_name_ar'],
        gridSize: 4,
        cache: false,
        width: '25%',
        viewProp: 'personal_name',
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'nation_id',
        label: 'nation_id',
        type: 'select',
        apiUrl: '/def/nationalities',
        labelProp: 'name_ar',
        keyProp: 'id',
        gridSize: 4,
        viewProp: 'nation_name',
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'gender',
        label: 'gender',
        type: 'select',
        options: Shared.genderOptions,
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'bank_id',
        label: 'bank_code',
        type: 'select',
        apiUrl: '/def/banks',
        labelProp: 'name_ar',
        keyProp: 'id',
        gridSize: 4,
        viewProp: 'bank_name',
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'elected_department_id',
        label: 'department',
        type: 'select',
        apiUrl: '/def/seasonal-departments',
        labelProp: 'department_name_ar',
        keyProp: 'id',
        queryParams: { seasonal_departments_types: { id: appSetting?.internal_department_type_id } },
        gridSize: 4,
        viewProp: 'elected_department_name',
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'elected_period_id',
        label: 'time_period',
        type: 'select',
        apiUrl: '/ses/time-periods',
        requiredModes: [],
        labelProp: 'period_name',
        keyProp: 'id',
        gridSize: 4,
        viewProp: 'time_period.period_name',
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'elected_job_id',
        label: 'job',
        type: 'select',
        apiUrl: '/sys/list/21',
        labelProp: 'name',
        keyProp: 'id',
        apiMethod: 'GET',
        viewProp: 'job.name',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode
      }
    ],
    []
  )
  const statusFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'is_elected',
      label: 'is_elected_done',
      type: 'select',
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'is_appointed',
      label: 'is_appointed_done',
      type: 'select',
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'emp_nomination_approval_status',
      label: 'approval_electing_done',
      type: 'select',
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'doc_verification_approval_status',
      label: 'papers_audit_done',
      type: 'select',
      options: Shared.papersAuditListStatus,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'hr_approval_status',
      label: 'hr_approval_status_done',
      type: 'select',
      options: Shared.papersAuditListStatus,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'contract_sign_approval_status',
      label: 'contract_sign_approval_status_done',
      type: 'select',
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'card_printing_approval_status',
      label: 'card_printing_approval_status_done',
      type: 'select',
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    }
  ]
  // Nominating persons fields
  const nominatingPersonsFields = useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'job_id',
        label: 'job',
        type: 'select',
        options: approvedJobs.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.id
        })),
        gridSize: 4,
        requiredModes: ['edit'],
        modeCondition: (mode: Shared.Mode) => (!selectedDepartment ? 'show' : mode),
        labelProp: 'name',
        keyProp: 'id',
        required: true,
        width: '15%',
        apiMethod: 'GET',
        viewProp: 'job.name'
      },

      {
        name: 'request_id',
        label: 'employee',
        width: '22%',
        type: 'select',
        apiUrl: '/ses/requests-status',
        labelProp: 'id',
        keyProp: 'id',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => {
          if (mode == 'edit') return 'show'
          return mode
        },
        displayProps: ['id', 'id_no', 'personal_name'],
        queryParams: { nomination_number: null },
        viewProp: 'personal.full_name_ar',
        searchProps: ['id', 'id_no', 'personal_name']
      },

      {
        name: 'period_id',
        label: 'period',
        width: '10%',
        type: 'select',
        apiUrl: '/ses/time-periods',
        labelProp: 'period_name',
        keyProp: 'id',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode,
        // hideInTable: true,
        viewProp: 'period.period_name'
      },
      {
        name: 'start_date',
        label: 'nomination_start_date',
        type: 'date',
        width: '10%',
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'end_date',
        label: 'exp_date',
        type: 'date',
        width: '10%',
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },

      {
        name: 'daily_salary',
        label: 'daily_salary',
        type: 'amount',
        width: '7%',
        readOnly: true,
        // hideInTable: true,
        gridSize: 4,
        mode: 'show',
        modeCondition: mode => 'show',
        screenMode: 'show',
        visibleModes: ['add', 'edit', 'show']
      },
      {
        name: 'work_days',
        label: 'work_days',
        width: '7%',
        type: 'number',
        mode: 'show',
        // hideInTable: true,
        gridSize: 4,
        readOnly: true,
        visibleModes: ['add', 'edit', 'show'],
        modeCondition: mode => 'show'
      },
      {
        name: 'salary',
        label: 'bonus',
        width: '7%',
        // hideInTable: true,
        type: 'amount',
        mode: 'show',
        gridSize: 4,
        visibleModes: ['add', 'edit', 'show'],
        modeCondition: mode => 'show'
      },
      {
        name: 'department_id',
        label: 'department_id',
        hideInTable: true,
        type: 'storage',
        required: false,
        gridSize: 3,
        align: 'start',
        requiredModes: ['add', 'edit']
      },
      {
        name: 'is_company_nominated',
        label: 'is_company_nominated',
        hideInTable: true,
        type: 'storage',
        required: false,
        gridSize: 3,
        align: 'start'
      }
    ],
    [selectedDepartment, approvedJobs]
  )

  const allFormFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [...fields, ...budgetFields, ...nominatingPersonsFields, ...searchFields, ...statusFields],
    [fields, budgetFields, nominatingPersonsFields, searchFields, statusFields]
  )

  // -----------------------------
  // useRecordForm initialization
  // -----------------------------
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    getDetailsErrors,
    detailsData,
    detailsHandlers,
    setDetailsData,
    closeDocumentsDialog,
    openDocumentsDialog,
    updateDetailsData,
    setMode,
    navigateWithQuery,
    router,
    recordId,
    setError,
    setDetailError,
    clearDetailErrors,
    validateDetailRow,
    validateAllDetailTables,
    submitWithParams,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<Shared.InferFieldType<typeof allFormFields>>({
    apiEndpoint: `/ses/nominations`,
    routerUrl: { default: `/apps/ses/nomination/${scope}` },
    fields: allFormFields,
    initialDetailsData: { nominating_users: [] },
    excludeFields: [
      {
        action: '*',
        fields: [
          ...fields.filter(item => item.name !== 'department_id'),
          ...budgetFields,
          nominatingPersonsFields.slice(5, 8) as any
        ]
      },
      {
        action: 'add',
        fields: [...nominatingPersonsFields, ...searchFields, ...statusFields]
      }
    ],
    detailsTablesConfig: { nominating_users: { fields: nominatingPersonsFields, trackIndex: true } },

    onSaveSuccess: async (response, mode) => {
      setMode('show')
      // Your custom logic here
      if (mode === 'edit') {
        // window.location.href = Shared.getLocalizedUrl(
        //   `${`/apps/ses/nomination/${scope}`}/details?id=${recordId}&mode=show`,
        //   locale as Shared.Locale
        // )
        // router.replace(
        //   Shared.getLocalizedUrl(
        //     `${`/apps/ses/nomination/${scope}`}/details?id=${recordId}&mode=show`,
        //     locale as Shared.Locale
        //   )
        // )
        // setDataModel()
        // setMode('show')
      }
      // Optionally navigate somewhere different
      // router.push('/custom-route')
    },
    onMenuActionClick: async (action, mode) => {
      if (action === 'edit') {
        if (!recordId) {
          toast.warning('يجب الذهاب للقائمة للتعديل')

          navigateWithQuery(`/apps/ses/nomination/${scope}/list`, router, locale as Shared.Locale)
        } else {
          setMode('edit')
          navigateWithQuery(
            `/apps/ses/nomination/${scope}/details?id=${recordId}&mode=edit`,
            router,
            locale as Shared.Locale
          )
        }
      }
    },

    customDetailValidators: {
      nominating_users: (row: any, rowIndex: number) => {
        const errors: Array<{ fieldName: string; message: string }> = []

        // ✅ Validate dates within period
        const validation = validateDatesInPeriod(row, centerClassification)

        if (!validation.valid) {
          const fieldName = (validation as any).fieldName || 'start_date'
          errors.push({
            fieldName,
            message: validation.message || 'خطأ في التاريخ'
          })
        }

        // ✅ Add more custom validations here if needed
        // Example: validate daily_salary exists
        if (row.start_date && row.end_date && !row.daily_salary) {
          errors.push({
            fieldName: 'daily_salary',
            message: 'الراتب اليومي مطلوب'
          })
        }

        return {
          valid: errors.length === 0,
          errors
        }
      }
    }
  })
  const appSettings = useAppSettings(accessToken, mode, dataModel?.id, (locale as string) || 'ar', formMethods, false)

  Shared.useEffect(() => {
    if (appSettings) {
      // console.log('hla hla ')
      setAppSetting(appSettings)
    } else {
      // Is Transportation Center is empty - clear everything
      setAppSetting(null)
    }
  }, [appSettings, appSetting])

  const { setValue, getValues, watch } = formMethods

  // Watch department field
  const department = watch('department_id')
  const job = watch('job_id')
  useEffect(() => {
    if (department) setSelectedDepartment(department)
  }, [department])

  // Set default employee name and nomination date
  const formattedDate = Shared.getCurrentDateTime()
  useEffect(() => {
    if (!user?.full_name_ar) return
    setValue('employee_name', user.full_name_ar)
    setValue('nomination_date', formattedDate)
  }, [user?.full_name_ar])

  // Set default department
  useEffect(() => {
    if (departmentOptions.length > 0 && scope !== 'hr' && mode !== 'edit' && mode === 'add') {
      setValue('department_id', departmentOptions[0]?.value, { shouldDirty: true })
    }
  }, [departmentOptions])

  // Fetch department jobs & budget details
  useEffect(() => {
    if (!selectedDepartment) return

    Shared.fetchRecordById(
      `/ses/nominations/departments`,
      String(selectedDepartment),
      accessToken,
      locale as Shared.Locale,
      (data: any) => {
        const { allocated_budget, end_date, estimated_budget, start_date } = data?.center_classification ?? {}
        setCenterClassification(data?.center_classification)
        const jobs = data?.jobs ?? []

        setValue('allocated_budget', allocated_budget)
        setValue('estimated_budget', estimated_budget)
        if (mode === 'show') {
          setValue('end_date', end_date)
          setValue('start_date', start_date)
        }

        // if (mode === 'edit' && job) {
        //   setValue('job_id', null)
        // }

        setApprovedJobs(jobs)
      }
    )
  }, [selectedDepartment, accessToken, locale])

  const startDate = watch('start_date')
  const endDate = watch('end_date')
  const jobId = watch('job_id')

  useEffect(() => {
    if (!selectedDepartment || mode === 'add' || mode === 'search') return

    const job = approvedJobs?.find(item => item?.id === jobId)
    const daily_rate = job?.daily_rate

    if (daily_rate === 0) {
      setValue('daily_salary', 0)
      setValue('work_days', 0)
      setValue('salary', 0)
      return
    }

    if (!startDate || !endDate || !daily_rate) return

    setValue('daily_salary', daily_rate)

    const recalculatedData = Shared.calculateWorkAndSalary({
      daily_salary: daily_rate,
      start_date: startDate,
      end_date: endDate
    } as any)

    setValue('work_days', recalculatedData?.work_days)
    setValue('salary', recalculatedData?.salary)
  }, [startDate, endDate, jobId, selectedDepartment, approvedJobs, mode])

  useEffect(() => {
    if (mode === 'add') {
      if (department !== selectedDepartment) {
        let base = []
        base = detailsData['nominating_users'] || []
        base = Array.from({ length: Math.max(3, 3) }, () => Shared.createDetailsRow(true, nominatingPersonsFields))
        setDetailsData(prev => ({ ...prev, nominating_users: base }))
      }
    }
  }, [department])

  return {
    personal,
    status,
    user,
    accessToken,
    selectedDepartment,
    setSelectedDepartment,
    approvedJobs,
    setApprovedJobs,
    departmentOptions,
    fields,
    budgetFields,
    nominatingPersonsFields,
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    getDetailsErrors,
    detailsData,
    detailsHandlers,
    searchFields,
    statusFields,
    setDetailsData,
    closeDocumentsDialog,
    openDocumentsDialog,
    updateDetailsData,
    recordId,
    centerClassification,
    setError,
    setDetailError,
    clearDetailErrors,
    validateDetailRow,
    validateAllDetailTables,
    submitWithParams,
    openRecordInformationDialog,
    closeRecordInformationDialog,
    appSetting
  }
}
