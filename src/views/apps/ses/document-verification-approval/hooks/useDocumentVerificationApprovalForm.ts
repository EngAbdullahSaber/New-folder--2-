import { useState, useMemo, useEffect } from 'react'
import * as Shared from '@/shared'
import { toast } from 'react-toastify'
import { useAppSettings } from '../../seasonal-job-request/details/hooks'

export const useDocumentVerificationApprovalForm = (scope: string) => {
  const { accessToken } = Shared.useSessionHandler()

  // States
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>()
  const [notes, setNotes] = useState<string>('')
  const [appSetting, setAppSetting] = Shared.useState<any>()

  const userPersonalFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'personal_picture',
        label: 'personal_picture',
        type: 'personal_picture',
        gridSize: 4,
        modeCondition: mode => mode,
        requiredModes: ['add', 'edit']
      },
      {
        name: scope === 'user' ? 'full_name_ar' : 'personal_name',
        label: 'full_name',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show'
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
        gridSize: 3,
        modeCondition: () => 'show'
      },

      { name: 'id_no', label: 'id_no', type: 'text', gridSize: 3, modeCondition: () => 'show' },
      { name: 'id_issue_date', label: 'issue_date', type: 'date', gridSize: 3, modeCondition: () => 'show' },
      { name: 'id_exp_date', label: 'end_date', type: 'date', gridSize: 3, modeCondition: () => 'show' },
      {
        name: 'id_file',
        label: 'id_file',
        type: 'file',
        gridSize: 6,
        modeCondition: mode => 'show',
        requiredModes: scope == 'user' ? [] : ['add', 'edit']
      }
    ],
    [scope]
  )

  const userAddressFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'city_id',
        label: 'city',
        type: 'select',
        apiUrl: '/def/cities',
        labelProp: 'name_ar',
        keyProp: 'id',
        gridSize: 6,
        modeCondition: () => 'show',
        viewProp: 'city_name'
      },
      { name: 'district_name', label: 'district_name', type: 'text', gridSize: 6, modeCondition: () => 'show' },
      { name: 'building_no', label: 'building_no', type: 'text', gridSize: 6, modeCondition: () => 'show' },
      { name: 'short_address', label: 'short_address', type: 'text', gridSize: 6, modeCondition: () => 'show' },
      {
        name: 'national_address_file',
        label: 'national_address_file',
        type: 'file',
        gridSize: 6,
        modeCondition: mode => 'show',
        requiredModes: scope == 'user' ? [] : ['add', 'edit']
      }
    ],
    []
  )

  const userProfessionalFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      { name: 'occupation_title', label: 'occupation_title', type: 'text', gridSize: 4, modeCondition: () => 'show' },
      { name: 'job_destination', label: 'job_destination', type: 'text', gridSize: 4, modeCondition: () => 'show' },
      {
        name: 'hajj_experience_years',
        label: 'hajj_experience_years',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: 'experience_certificate',
        label: 'experience_certificate',
        type: 'file',
        gridSize: 6,
        modeCondition: mode => 'show'
        // requiredModes: ['add', 'edit']
      },
      {
        name: 'resume',
        label: 'resume',
        type: 'file',
        gridSize: 6,
        modeCondition: mode => 'show'
        // requiredModes: ['add', 'edit']
      }
    ],
    []
  )

  const userBankFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'bank_id',
        label: 'bank',
        type: 'select',
        apiUrl: '/def/banks',
        labelProp: 'name_ar',
        viewProp: 'bank_name',
        keyProp: 'id',
        gridSize: 4,
        modeCondition: mode => mode,
        requiredModes: ['add', 'edit']
      },
      { name: 'iban_no', label: 'iban_no', type: 'text', gridSize: 4, modeCondition: mode => mode },
      {
        name: 'bank_iban_file',
        label: 'bank_iban_file',
        type: 'file',
        gridSize: 4,
        modeCondition: mode => mode,
        requiredModes: ['add', 'edit']
      },
      {
        name: 'files',
        label: '',
        type: 'storage'
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
    [appSetting]
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

  const allFormFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      ...userPersonalFields,
      ...userAddressFields,
      ...userProfessionalFields,
      ...userBankFields,
      ...searchFields,
      ...statusFields,
      {
        name: '_submitTimestamp',
        label: '',
        type: 'storage',
        gridSize: 0,
        modeCondition: () => 'hidden'
      }
    ],
    [userPersonalFields, userAddressFields, userProfessionalFields, userBankFields, searchFields, statusFields]
  )

  // useRecordForm initialization
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    detailsData,
    setDetailsData,
    setMode,
    navigateWithQuery,
    router,
    recordId,
    setError,
    setWarning,
    submitWithParams,
    closeRecordInformationDialog,
    openRecordInformationDialog
  } = Shared.useRecordForm<Shared.InferFieldType<typeof allFormFields>>({
    apiEndpoint: scope === 'user' ? `/ses/requests` : `/ses/requests-status`,
    routerUrl: { default: `/apps/ses/document-verification-approval/${scope}` },
    fields: allFormFields,

    classifiedObjects: [
      // {
      //   objectName: 'personal',
      //   fields: [
      //     'full_name_ar',
      //     'birth_date',
      //     'id_no',
      //     'id_source',
      //     'id_type',
      //     'mobile',
      //     'e_mail',
      //     'gender',
      //     'specialty',
      //     'qualify_date'
      //   ]
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
      //     'salary'
      //   ]
      // }
    ],
    fetchConfig:
      scope === 'user'
        ? {
            enabled: true,
            url: '/ses/requests/user',
            method: 'GET',
            shouldSetDataModel: true,
            onSuccess: (data: any) => {}
          }
        : undefined,
    modeParam: scope === 'user' ? 'edit' : undefined,
    onSaveSuccess: async (response, mode) => {
      if (scope === 'user') {
        const targetData = response?.data?.data || response?.data || response
        await handleNominationProcess(1, 'user', targetData)
      }
      if (mode === 'add') {
        setMode('show')
        navigateWithQuery(`/apps/ses/document-verification-approval/${scope}/list`, router, locale as Shared.Locale)
      } else {
        setMode('show')
      }
    },
    onMenuActionClick: async (action, mode) => {
      if (action === 'edit') {
        const idToUse = recordId || dataModel?.id
        if (!idToUse && scope !== 'user') {
          setError('هذا الحقل مطلوب')

          navigateWithQuery(`/apps/ses/document-verification-approval/${scope}/list`, router, locale as Shared.Locale)
        } else {
          setMode('edit')
          navigateWithQuery(
            `/apps/ses/document-verification-approval/${scope}/details?id=${recordId}&mode=edit`,
            router,
            locale as Shared.Locale
          )
        }
      }
    },
    onBeforeSave: (data, detailsData) => {
      if (scope === 'user') return true

      const selected = detailsData['candidates']?.filter((c: any) => c.selected)

      if (mode === 'add' && (!selected || selected.length === 0)) {
        setError('يرجى اختيار موظف واحد على الأقل')

        Shared.scrollToTop()
        return false
      }

      if (scope === 'resident') {
        const missingContract = selected.some((c: any) => !c.ajeer_contract_no)
        if (missingContract) {
          setError('يرجى إضافة رقم عقد أجير لكل مرشح مختار')
          Shared.scrollToTop()
          return false
        }
      }

      return true
    },
    transformPayload: (payload, detailsData) => {
      if (mode === 'search' || scope === 'user') {
        return payload
      }

      const selected = detailsData['candidates']
        ?.filter((c: any) => c.selected)
        .map((c: any) => ({
          id: c.nomination_id,
          ...(scope === 'resident' ? { contract_no: c.ajeer_contract_no } : {})
        }))

      return { ...payload, candidates: selected }
    }
  })

  // nominationInfoFields defined after formMethods is available
  const { watch, setValue } = formMethods

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

  useEffect(() => {
    const calculatedSalary = Number(electedDays || 0) * Number(electedDailyPrice || 0)
    if (calculatedSalary > 0) {
      setValue('salary', calculatedSalary)
      setValue('request_status.salary', calculatedSalary)
      console.log(calculatedSalary)
    }
  }, [electedDays, electedDailyPrice, setValue, dataModel])

  const nominationInfoFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: scope === 'user' ? 'request_status.elected_department_name' : 'elected_department_name',
        label: 'department',
        type: 'text',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_job_name' : 'elected_job_name',
        label: 'job',
        type: 'text',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_start_date' : 'elected_start_date',
        label: 'start_date',
        type: 'date',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_end_date' : 'elected_end_date',
        label: 'end_date',
        type: 'date',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_days' : 'elected_days',
        label: 'work_days',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_daily_price' : 'elected_daily_price',
        label: 'daily_rate',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.salary' : 'salary',
        label: 'salary',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show',
        value: Number(electedDays || 0) * Number(electedDailyPrice || 0)
      }
    ],
    [scope, electedDays, electedDailyPrice]
  )
  const printFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: scope === 'user' ? 'full_name_ar' : 'personal_name',
        label: 'full_name',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show'
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
      { name: 'id_exp_date', label: 'end_date', type: 'date', gridSize: 4, modeCondition: () => 'show' },
      { name: 'mobile', label: 'mobile', type: 'text', gridSize: 4, modeCondition: () => 'show' },
      {
        name: 'bank_id',
        label: 'bank',
        type: 'text',
        gridSize: 4,
        modeCondition: () => 'show',
        viewProp: 'bank.name_ar'
      },
      { name: 'iban_no', label: 'iban', type: 'text', gridSize: 4, modeCondition: () => 'show' },
      {
        name: scope === 'user' ? 'request_status.elected_department_name' : 'elected_department_name',
        label: 'department',
        type: 'text',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_job_name' : 'elected_job_name',
        label: 'job',
        type: 'text',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_start_date' : 'elected_start_date',
        label: 'start_date',
        type: 'date',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_end_date' : 'elected_end_date',
        label: 'end_date',
        type: 'date',
        gridSize: 6,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_days' : 'elected_days',
        label: 'work_days',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.elected_daily_price' : 'elected_daily_price',
        label: 'daily_rate',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show'
      },
      {
        name: scope === 'user' ? 'request_status.salary' : 'salary',
        label: 'salary',
        type: 'number',
        gridSize: 4,
        modeCondition: () => 'show',
        value: Number(electedDays || 0) * Number(electedDailyPrice || 0)
      }
    ],
    [scope, electedDays, electedDailyPrice]
  )

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

  // Watch department field
  const department = watch('department_id')
  useEffect(() => {
    if (department) setSelectedDepartment(Number(department))
  }, [department])

  // Fetch Candidates Data for approval
  useEffect(() => {
    if (accessToken && mode === 'add' && selectedDepartment) {
      const fetchCandidates = async () => {
        try {
          const idType = scope === 'resident' ? 2 : 1
          const response: any = await Shared.apiClient.post(
            '/ses/nominations/data',
            {
              department_id: selectedDepartment || 9,
              request: { id_type: idType }
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          )

          if (response?.data?.data) {
            const processed = response.data.data.map((item: any) => {
              const startDate = item.start_date
              const endDate = item.end_date

              // Fixed: Get daily_rate from job.jobCategory
              const dailySalary = item.job?.jobCategory?.daily_rate || 0

              const calcResult = Shared.calculateWorkAndSalary({
                start_date: startDate,
                end_date: endDate,
                daily_salary: Number(dailySalary)
              })

              return {
                selected: false,
                request_no: item.request_id,
                nomination_id: item.id,
                full_name_ar: item.personal?.full_name_ar,
                job_name: item.job?.name,
                job_id: item.job_id,
                department_id: item.department_id,
                elected_period_id: item.period_id,
                contract_type_id: item.contract_type_id,
                start_date: startDate,
                end_date: endDate,
                daily_rate: dailySalary,
                salary: calcResult?.salary || 0,
                ajeer_contract_no: '',
                status: item.status,
                approval_type_id: item.approval_type_id,
                elected_personal_id: item.elected_personal_id,
                elected_department_id: item.elected_department_id,
                elected_date: item.elected_date,
                is_company_nominated: item.is_company_nominated,
                season: item.season
              }
            })
            setDetailsData({ ...detailsData, candidates: processed })
          }
        } catch (error) {
          console.error('Error fetching candidates:', error)
        }
      }
      fetchCandidates()
    }
  }, [accessToken, mode, scope, selectedDepartment])

  const handleSaveWrapper = async (data: any) => {
    await onSubmit(data)
  }

  const handleAcceptNomination = async (targetScope: string) => {
    await handleNominationProcess(1, targetScope)
  }

  const handleRejectNomination = async (targetScope: string) => {
    await handleNominationProcess(2, targetScope)
  }

  const handleReturnNomination = async (targetScope: string) => {
    await handleNominationProcess(3, targetScope)
  }

  const handleNominationProcess = async (
    status: number,
    targetScope: string,
    targetData?: any,
    explicitNotes?: string
  ) => {
    const nominationId = dataModel?.nomination_number
    const requestId = dataModel?.id
    const finalNotes = explicitNotes !== undefined ? explicitNotes : notes
    let endpoint = '/ses/nomination-approvals/emp-process'
    if (targetScope === 'hr') endpoint = '/ses/nomination-approvals/hr-process'
    if (targetScope === 'department') endpoint = '/ses/nomination-approvals/doc-process'

    try {
      if (status === 2) {
        Shared.emitEvent('loading', { type: 'delete' })
      } else {
        Shared.emitEvent('loading', { type: 'update' })
      }

      const response: any = await Shared.apiClient.post(
        endpoint,
        Shared.filterObject({
          status: status,
          request_id: requestId,
          nomination_id: nominationId,
          notes: finalNotes
        }),
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )

      if (response?.status === 200 || response?.status === 201) {
        if (status === 1) toast.success(locale === 'ar' ? 'تم قبول الترشيح بنجاح' : 'Nomination accepted successfully')
        else if (status === 2) toast.warning(locale === 'ar' ? 'تم إلغاء الترشيح' : 'Nomination cancelled')
        else if (status === 3) toast.error(locale === 'ar' ? 'تم رفض الترشيح' : 'Nomination rejected')
        else if (status === 4) toast.info(locale === 'ar' ? 'تم إرجاع الترشيح للتعديل' : 'Nomination returned for edit')
        setNotes('')
        setMode('show')
      }
    } catch (error: any) {
      console.error(`Error in ${targetScope} process:`, error)
      const serverErrors = error?.response?.data?.errors
      if (serverErrors) {
        const errorMsg = Object.values(serverErrors).flat().join(' - ')
        setError(errorMsg)
      } else {
        setError(
          error?.response?.data?.message || (locale === 'ar' ? 'فشل تنفيذ العملية' : 'Failed to process nomination')
        )
      }
      Shared.scrollToTop()
    } finally {
      Shared.emitEvent('loading', { type: 'update' })
      Shared.emitEvent('loading', { type: 'delete' })
    }
  }

  async function handleEmpProcess(status: number, targetData?: any) {
    // console.log('handle emp process')
    // return
    if (status === 1) {
      await submitWithParams({
        silentNoChanges: true
      })
    }
    // let submittedData = Shared.filterObject(targetData)
    // console.log(submittedData, targetData)
    // return
    await handleNominationProcess(status, 'user', targetData)
  }

  return {
    formMethods,
    mode,
    handleMenuOptionClick,
    handleCancel,
    locale,
    onSubmit,
    handleSaveWrapper,
    handleAcceptNomination,
    handleRejectNomination,
    handleReturnNomination,
    handleEmpProcess,
    userPersonalFields,
    userAddressFields,
    userProfessionalFields,
    userBankFields,
    nominationInfoFields,
    searchFields,
    dataModel,
    statusFields,
    setError,
    notes,
    printFields,
    setNotes,
    setWarning,
    openRecordInformationDialog,
    closeRecordInformationDialog
  }
}
