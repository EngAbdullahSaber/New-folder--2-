import * as Shared from '@/shared'

interface useDeliverStaffUniformReturn {
  formMethods: any
  mode: Mode
  handleMenuOptionClick: (key: string) => void
  handleCancel: () => void
  locale: string
  fields: any[]
  statusFields: any[]
  statusFieldsShow: any[]
  printFields: any[]
  notes: string
  setNotes: (notes: string) => void
  handleSignContract: () => Promise<void>
  handleRejectContract: () => Promise<void>
  onSubmit: (data?: any) => Promise<void>
  statusSearchFields: any[]
  searchFields: any[]
  dataModel: any
  nominationInfoFields: any[]
  setError: (error: string | null) => void
  setWarning: (warning: string | null) => void
  setMode: (mode: Mode) => void
  openRecordInformationDialog: boolean
  closeRecordInformationDialog: () => void
  refetchRecord: () => void
}

// Define proper types for better type safety
type Mode = Shared.Mode

export const useDeliverStaffUniform = (): useDeliverStaffUniformReturn => {
  const { accessToken } = Shared.useSessionHandler()
  const searchParams = Shared.useSearchParams()
  const currentMode = searchParams?.get('mode') as Mode

  const fields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'full_name_ar',
        label: 'full_name',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal_name'
      },

      {
        name: 'nation_id',
        label: 'nation_name',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'nation_name'
      },

      {
        name: 'id_type',
        label: 'id_type',
        type: 'select',
        options: Shared.identityTypeList,
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal.id_type'
      },

      {
        name: 'id_no',
        label: 'id_no',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal.id_no'
      },
      {
        name: 'id_issue_date',
        label: 'issue_date',
        type: 'date',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal.id_issue_date'
      },
      {
        name: 'id_exp_date',
        label: 'end_date',
        type: 'date',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal.id_exp_date'
      }
    ],
    []
  )

  const searchFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
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
        modeCondition: (mode: Shared.Mode) => mode,
        searchProps: ['id_no', 'full_name_ar', 'id']
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
        queryParams: { internal_department: true },
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

  const statusSearchFields: Shared.DynamicFormFieldProps[] = [
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

  const allFormFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [...fields, ...searchFields, ...statusSearchFields],
    [fields, searchFields, statusSearchFields]
  )

  type DataModelFormData = Shared.InferFieldType<typeof allFormFields> & {
    is_card?: number | boolean
    is_cap?: number | boolean
    is_uniform?: number | boolean
  }

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    dataModel,
    setError,
    setWarning,
    locale,
    setMode,
    navigateWithQuery,
    router,
    recordId,
    openRecordInformationDialog,
    closeRecordInformationDialog,
    refetchRecord
  } = Shared.useRecordForm<DataModelFormData>({
    apiEndpoint: '/ses/requests-status',
    routerUrl: { default: '/apps/ses/deliver-staff-uniform' },
    fields: allFormFields,
    initialDetailsData: {},
    modeParam: undefined,
    excludeFields: [
      { action: 'add', fields: [...searchFields, ...statusSearchFields] },
      { action: 'edit', fields: [...searchFields, ...statusSearchFields] }
    ],
    classifiedObjects: [
      // {
      //   objectName: 'personal',
      //   fields: ['full_name_ar', 'id_no', 'id_type', 'id_issue_date', 'id_exp_date', 'nation_id', 'mobile', 'gender']
      // },
      // {
      //   objectName: 'request_status',
      //   fields: [
      //     'elected_job_name',
      //     'elected_department_name',
      //     'elected_start_date',
      //     'elected_end_date',
      //     'elected_days',
      //     'elected_daily_price',
      //     'salary',
      //     'nation_name'
      //   ]
      // }
    ],
    // fetchConfig:
    //   currentMode === 'search'
    //     ? undefined
    //     : {
    //         enabled: true,
    //         url: '/ses/requests/user',
    //         method: 'GET',
    //         shouldSetDataModel: true,

    //       },
    onSaveSuccess: async (response, mode) => {
      const id = response?.id || response?.data?.id || recordId
      if (mode === 'add' || mode === 'edit') {
        setMode('show')
        navigateWithQuery(`/apps/ses/deliver-staff-uniform/details?id=${id}&mode=show`, router, locale as Shared.Locale)
      }
    },
    onMenuActionClick: async (action, mode) => {
      if (action === 'edit') {
        setMode('edit')
        navigateWithQuery(
          `/apps/ses/deliver-staff-uniform/details?id=${recordId || dataModel?.id}&mode=edit`,
          router,
          locale as Shared.Locale
        )
      }
    },
    onBeforeSave: data => {
      if (currentMode === 'search') return true
      return true
    },
    transformPayload: payload => {
      if (currentMode === 'search') return payload
      return payload
    }
  })
  const { watch, setValue } = formMethods
  const electedDays = watch('request_status.elected_days') || watch('elected_days')
  const electedDailyPrice = watch('request_status.elected_daily_price') || watch('elected_daily_price')

  const statusFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'status',
        label: 'status',
        type: 'toggle',
        options: Shared.deliverStaffUniform || [],
        defaultValue: '1',
        requiredModes: ['add', 'edit'],
        modeCondition: (m: Shared.Mode) => m,
        gridSize: 12
      },
      {
        name: 'is_card',
        label: 'card',
        type: 'checkboxToggle',
        options: [{ label: 'card', value: 1, icon: 'ri-id-card-line' }],
        gridSize: 4,
        modeCondition: (m: Shared.Mode) => m
      },
      {
        name: 'is_uniform',
        label: 'uniform',
        type: 'checkboxToggle',
        options: [{ label: 'uniform', value: 1, icon: 'ri-shirt-line' }],
        gridSize: 4,
        modeCondition: (m: Shared.Mode) => m
      },
      {
        name: 'is_cap',
        label: 'cap',
        type: 'checkboxToggle',
        options: [{ label: 'cap', value: 1, icon: 'ri-capsule-line' }], // Using a capsule icon as a placeholder for cap or similar
        gridSize: 4,
        modeCondition: (m: Shared.Mode) => m
      }
    ],
    [mode]
  )
  const statusFieldsShow = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'card_submited_approval_status',
        label: 'card',
        type: 'toggle',
        options: Shared.deliverAllStaffUniform,
        gridSize: 4,
        modeCondition: (m: Shared.Mode) => m
      },
      {
        name: 'uniform_approval_status',
        label: 'uniform',
        type: 'toggle',
        options: Shared.deliverAllStaffUniform,
        gridSize: 4,
        modeCondition: (m: Shared.Mode) => m
      },
      {
        name: 'cap_approval_status',
        label: 'cap',
        type: 'toggle',
        options: Shared.deliverAllStaffUniform,
        gridSize: 4,
        modeCondition: (m: Shared.Mode) => m
      }
    ],
    [mode]
  )
  Shared.useEffect(() => {
    const calculatedSalary = Number(electedDays || 0) * Number(electedDailyPrice || 0)
    if (calculatedSalary > 0) {
      setValue('salary', calculatedSalary)
      setValue('request_status.salary', calculatedSalary)
    }
  }, [electedDays, electedDailyPrice, setValue])
  const nominationInfoFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'elected_department_name',
        viewProp: 'request_status.elected_department_name',
        label: 'department',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'elected_job_name',
        viewProp: 'request_status.elected_job_name',
        label: 'job',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'elected_period_name',
        viewProp: 'request_status.elected_period_name',
        label: 'period',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'elected_start_date',
        viewProp: 'request_status.elected_start_date',
        label: 'start_date',
        type: 'date',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'elected_end_date',
        viewProp: 'request_status.elected_end_date',
        label: 'end_date',
        type: 'date',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'elected_days',
        viewProp: 'request_status.elected_days',
        label: 'work_days',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'elected_daily_price',
        viewProp: 'request_status.elected_daily_price',
        label: 'daily_rate',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'salary',
        label: 'salary',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show',
        value: Number(electedDays || 0) * Number(electedDailyPrice || 0)
      }
    ],
    []
  )

  const [notes, setNotes] = Shared.useState<string>('')

  const handleUniformProcess = Shared.useCallback(
    async (status: string) => {
      const nominationId = dataModel?.nomination_id || dataModel?.nomination_number // Try both just in case
      const requestId = dataModel?.id
      const values = formMethods.getValues() as DataModelFormData

      setError('') // Clear previous errors
      try {
        Shared.emitEvent('loading', { type: 'update' })
        const response: any = await Shared.apiClient.post(
          '/ses/nomination-approvals/uniform-process',
          Shared.filterObject({
            status,
            request_id: requestId,
            nomination_id: nominationId,
            notes: notes,
            card: !!values.is_card,
            cap: !!values.is_cap,
            uniform: !!values.is_uniform
          }),
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        )

        if (response?.status === 200 || response?.status === 201) {
          if (status === '1')
            Shared.toast.success(locale === 'ar' ? 'تمت العملية بنجاح' : 'Process completed successfully')
          else if (status === '2') Shared.toast.warning(locale === 'ar' ? 'تم إلغاء العملية' : 'Process canceled')
          setNotes('')
          setMode('show')
          setTimeout(() => refetchRecord(), 100)
        }
      } catch (error: any) {
        // console.error(`Error in ${targetScope} process:`, error)
        let errorMsg =
          error?.response?.data?.message || (locale === 'ar' ? 'فشل تنفيذ العملية' : 'Failed to process nomination')
        const serverErrors = error?.response?.data?.errors
        if (serverErrors) {
          errorMsg = Object.values(serverErrors).flat().join(' - ')
        }
        setError(errorMsg)
        Shared.scrollToTop()
      } finally {
        Shared.emitEvent('loading', { type: 'update' })
      }
    },
    [accessToken, dataModel, notes, locale, formMethods, refetchRecord]
  )

  const handleSignContract = async () => {
    const status = formMethods.getValues('status') || '1'
    await handleUniformProcess(status)
  }
  const handleRejectContract = async () => handleUniformProcess('2')

  const printFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'full_name_ar',
        label: 'full_name',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal.full_name_ar'
      },
      {
        name: 'nation_id',
        label: 'nation_name',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'request_status.nation_name'
      },
      {
        name: 'id_type',
        label: 'id_type',
        type: 'select',
        options: Shared.identityTypeList,
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'id_no',
        label: 'id_no',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal.id_no'
      },
      {
        name: 'id_issue_date',
        label: 'issue_date',
        type: 'date',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal.id_issue_date'
      },
      {
        name: 'id_exp_date',
        label: 'end_date',
        type: 'date',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'personal.id_exp_date'
      },
      {
        name: 'elected_department_name',
        label: 'department',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'request_status.elected_department_name'
      },
      {
        name: 'elected_job_name',
        label: 'job',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'request_status.elected_job_name'
      },
      {
        name: 'elected_start_date',
        label: 'start_date',
        type: 'date',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'request_status.elected_start_date'
      },
      {
        name: 'elected_end_date',
        label: 'end_date',
        type: 'date',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'request_status.elected_end_date'
      },
      {
        name: 'elected_days',
        label: 'work_days',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'request_status.elected_days'
      },
      {
        name: 'elected_daily_price',
        label: 'daily_rate',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'request_status.elected_daily_price'
      },
      {
        name: 'salary',
        label: 'salary',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show',
        value: Number(electedDays || 0) * Number(electedDailyPrice || 0)
      }
    ],
    [electedDays, electedDailyPrice]
  )

  return {
    formMethods,
    openRecordInformationDialog,
    closeRecordInformationDialog,
    mode,
    handleMenuOptionClick,
    handleCancel,
    locale: (locale as string) || 'ar',
    fields,
    statusFields,
    statusFieldsShow,
    printFields,
    handleSignContract,
    handleRejectContract,
    notes,
    setNotes,
    onSubmit,
    statusSearchFields,
    searchFields,
    dataModel,
    nominationInfoFields,
    setError,
    setWarning,
    setMode,
    refetchRecord
  }
}
