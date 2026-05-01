import * as Shared from '@/shared'

interface UseContractSignatureReturn {
  formMethods: any
  mode: Mode
  handleMenuOptionClick: (key: string) => void
  handleCancel: () => void
  locale: string
  onSubmit: (data: any) => Promise<void>
  detailsData: any
  updateDetailsData: (tableName: string, value: any, index: number) => void
  setDetailsData: (data: any) => void
  dataModel: any
  detailsHandlers: any
  getDetailsErrors?: (tableName: string) => any
  fields?: any[]
  userAddressFields?: any[]
  userProfessionalFields?: any[]
  nominationInfoFields?: any[]
  searchFields?: any[]
  statusFields?: any[]
  printFields?: any[]
  contractConditionFields?: any[]
  notes: string
  setNotes: (notes: string) => void
  setError?: (error: string | null) => void
  setWarning?: (warning: string | null) => void
  handleSaveWrapper?: () => Promise<void>
  handleAcceptNomination?: () => Promise<void>
  handleRejectNomination?: () => Promise<void>
  handleReturnNomination?: () => Promise<void>
  handleEmpProcess?: () => Promise<void>
  handleSignContract: () => Promise<void>
  handleRejectContract: () => Promise<void>
}

// Define proper types for better type safety
type Mode = Shared.Mode

export const useContractSignature = (scope: string = 'user'): UseContractSignatureReturn => {
  const { personal, accessToken } = Shared.useSessionHandler()

  const fields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
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
        viewProp: scope === 'user' ? 'request_status.nation_name' : 'nation_name'
      },

      {
        name: 'id_type',
        label: 'id_type',
        type: 'select',
        options: Shared.identityTypeList,
        gridSize: 4,
        modeCondition: () => 'show'
      },

      { name: 'id_no', label: 'id_no', type: 'text', gridSize: 4, modeCondition: () => 'show' },
      { name: 'id_issue_date', label: 'issue_date', type: 'date', gridSize: 4, modeCondition: () => 'show' },
      { name: 'id_exp_date', label: 'end_date', type: 'date', gridSize: 4, modeCondition: () => 'show' }
    ],
    [scope]
  )

  const userAddressFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'city_id',
        label: 'city',
        type: 'select',
        apiUrl: '/def/cities',
        labelProp: 'name_ar',
        keyProp: 'id',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      { name: 'district_name', label: 'district_name', type: 'text', gridSize: 4, modeCondition: () => 'show' },
      { name: 'building_no', label: 'building_no', type: 'text', gridSize: 4, modeCondition: () => 'show' },
      { name: 'short_address', label: 'short_address', type: 'text', gridSize: 4, modeCondition: () => 'show' }
    ],
    []
  )

  const contractConditionFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'order_no',
      label: 'serial_no',
      type: 'number',
      width: '10%',
      modeCondition: () => 'show'
    },
    {
      name: 'descrepition',
      label: 'contract',
      type: 'rich_text',
      align: 'start',
      width: '85%',
      modeCondition: () => 'show'
    }
  ]

  type DataModelFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    updateDetailsData,
    setDetailsData,
    getDetailsErrors,
    dataModel,
    detailsHandlers,
    setError,
    setWarning,
    locale
  } = Shared.useRecordForm<DataModelFormData>({
    apiEndpoint: '/ses/contract-signatures',
    routerUrl: { default: '/apps/ses/contract-signature' },
    fields: fields,
    initialDetailsData: { contract_conditions: [] },
    detailsTablesConfig: {
      contract_conditions: { fields: contractConditionFields, trackIndex: true }
    },
    modeParam: 'edit',
    fetchConfig: {
      enabled: true,
      url: '/ses/requests/user',
      method: 'GET',
      shouldSetDataModel: true,
      onSuccess: (data: any) => {
        fetchContractConditions()
      }
    }
  })

  const { watch, setValue } = formMethods
  const [notes, setNotes] = Shared.useState<string>('')

  const handleContractSignProcess = Shared.useCallback(
    async (status: number) => {
      const nominationId = dataModel?.nomination_number

      try {
        if (!notes?.trim()) {
          setError?.(locale === 'ar' ? 'الملاحظات مطلوبة' : 'Notes are required')
          Shared.scrollToTop()
          return
        }
        Shared.emitEvent('loading', { type: 'update' })
        const response: any = await Shared.apiClient.post(
          '/ses/nomination-approvals/contract-sign-process',
          Shared.filterObject({
            status,
            nomination_id: nominationId,
            notes: notes
          }),
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        )

        if (response?.status === 200 || response?.status === 201) {
          if (status === 1)
            Shared.toast.success(locale === 'ar' ? 'تم توقيع العقد بنجاح' : 'Contract signed successfully')
          else if (status === 2)
            Shared.toast.warning(locale === 'ar' ? 'تم رفض توقيع العقد' : 'Contract signing rejected')
          setNotes('')
          // Optionally refetch or redirect
          window.location.reload()
        }
      } catch (error: any) {
        console.error('Error in contract sign process:', error)
        const serverErrors = error?.response?.data?.errors
        if (serverErrors) {
          const errorMsg = Object.values(serverErrors).flat().join(' - ')
          setError?.(errorMsg)
        } else {
          setError?.(
            error?.response?.data?.message ||
              (locale === 'ar' ? 'فشل تنفيذ العملية' : 'Failed to process contract signature')
          )
        }
        Shared.scrollToTop()
      } finally {
        Shared.emitEvent('loading', { type: 'update' })
      }
    },
    [accessToken, dataModel?.nomination_number, notes, locale]
  )

  const handleSignContract = async () => {
    await handleContractSignProcess(1)
  }

  const handleRejectContract = async () => {
    await handleContractSignProcess(2)
  }

  const electedDays =
    watch('request_status.elected_days') ||
    watch('elected_days') ||
    dataModel?.request_status?.elected_days ||
    dataModel?.elected_days
  const electedDailyPrice =
    watch('request_status.elected_daily_price') ||
    watch('elected_daily_price') ||
    dataModel?.request_status?.elected_daily_price ||
    dataModel?.elected_daily_price

  const fetchContractConditions = Shared.useCallback(async () => {
    if (!accessToken) return

    try {
      const typeId = personal?.id_type || personal?.id
      if (!typeId) {
        console.warn('⚠️ No personal ID type found for contract conditions')
        return
      }

      const response: any = await Shared.apiClient.post(
        '/ses/contract-conditions/data',
        { all: { contract_type: typeId } },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      const responseData = response?.data?.data || response?.data
      if (Array.isArray(responseData)) {
        const processedData = responseData.map((item: any) => ({
          ...item,
          is_requested: true
        }))
        setDetailsData(prev => ({ ...prev, contract_conditions: processedData }))
      }
    } catch (error) {
      console.error('Error fetching contract conditions:', error)
      setError?.('Failed to fetch contract conditions')
    }
  }, [accessToken, personal?.id, setError, setDetailsData])

  Shared.useEffect(() => {
    const calculatedSalary = Number(electedDays || 0) * Number(electedDailyPrice || 0)
    if (calculatedSalary > 0) {
      setValue('salary', calculatedSalary)
      setValue('request_status.salary', calculatedSalary)
    }
  }, [electedDays, electedDailyPrice, setValue, dataModel])

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

  const printFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      ...fields,
      ...userAddressFields,
      { name: 'mobile', label: 'mobile', type: 'text', gridSize: 4, modeCondition: () => 'show' },
      {
        name: 'bank_id',
        label: 'bank',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'bank.name_ar'
      },
      { name: 'iban_no', label: 'iban', type: 'text', gridSize: 4, modeCondition: () => 'show' }
    ],
    [scope, fields, userAddressFields, electedDays, electedDailyPrice]
  )

  // Fetch   contract conditions
  Shared.useEffect(() => {
    if (!accessToken) return
    // console.log('🔄 Checking if ready to fetch conditions...', {
    //   personalId: personal?.id,
    //   personalIdType: personal?.id_type
    // })
    // If we have either ID or it's implicitly for the user
    fetchContractConditions()
  }, [accessToken, personal?.id, personal?.id_type, fetchContractConditions])

  return {
    formMethods,
    mode,
    handleMenuOptionClick,
    handleCancel,
    locale: (locale as string) || 'ar',
    onSubmit,

    detailsData,
    updateDetailsData,
    setDetailsData,
    getDetailsErrors,
    dataModel,
    detailsHandlers,
    setError,
    setWarning,
    fields,
    userAddressFields,
    nominationInfoFields,
    statusFields: [], // Not used currently
    printFields,
    contractConditionFields,
    handleSignContract,
    handleRejectContract,
    notes,
    setNotes
  }
}
