import { useState, useMemo, useEffect } from 'react'
import * as Shared from '@/shared'
import { toast } from 'react-toastify'
import { ComponentGeneralProps } from '@/types/pageModeType'

export const useNominationApprovalForm = ({ scope }: ComponentGeneralProps) => {
  const { personal, status, user, accessToken } = Shared.useSessionHandler()

  // States
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>()
  const [approved_jobs, setApprovedJobs] = useState<any[]>([])
  const submissionStatus = Shared.useRef<number>(1) // 1 for save, 0 for reject

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
        name: 'season',
        label: 'season',
        type: 'select',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },

      {
        name: 'department_id',
        label: 'department',
        type: 'select',
        apiUrl:
          scope == 'citizen'
            ? '/aut/user-departments-children'
            : scope == 'resident'
              ? '/def/seasonal-departments'
              : undefined,
        labelProp: 'department_name_ar',
        keyProp: 'department_id',
        apiMethod: 'GET',
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: ['add', 'edit'],
        gridSize: 6,
        viewProp: 'seasonal_departments.department_name_ar',
        responseDataKey: scope == 'citizen' ? 'seasonal_departments' : undefined
      }
    ],
    [departmentOptions, scope]
  )

  // Budget fields
  const budgetFields = useMemo<Shared.DynamicFormFieldProps[]>(
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
  const staticFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'personal_picture',
      label: 'personal_picture',
      type: 'personal_picture',
      gridSize: 12,
      modeCondition: mode => mode,
      visibleModes: ['edit', 'show']
      // requiredModes: ['add', 'edit']
    },
    {
      name: 'season',
      label: 'season',
      type: 'select',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'department_id',
      label: 'department',
      type: 'select',
      labelProp: 'elected_department_name',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      requiredModes: ['add', 'edit'],
      gridSize: 4,
      viewProp: 'elected_department_name'
    },
    {
      name: 'personal_id',
      label: 'personal_id',
      type: 'number',
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => {
        return mode === 'search' ? mode : 'show'
      },
      width: '10%',
      viewProp: 'personal_id'
    },

    {
      name: 'request_no',
      label: 'request_no',
      type: 'number',
      gridSize: 4,
      autoFill: true,
      modeCondition: (mode: Shared.Mode) => {
        return mode === 'search' ? mode : 'show'
      }
    },

    {
      name: 'id_no',
      label: 'id_no',
      type: 'number',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        return mode === 'search' ? mode : 'show'
      },
      gridSize: 4
      // modal: 'personal'
    },

    {
      name: 'personal_name',
      label: 'employee_name',
      type: 'text',
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => {
        return mode === 'search' ? mode : 'show'
      },
      width: '10%',
      viewProp: 'personal_name'
    },

    // {
    //   name: 'personal_id',
    //   label: 'employee_name',
    //   type: 'select',
    //   apiUrl: '/def/personal',
    //   labelProp: 'id',
    //   keyProp: 'id',
    //   modeCondition: (mode: Shared.Mode) => {
    //     return mode === 'search' ? mode : 'show'
    //   },
    //   displayProps: ['id', 'full_name_ar'],
    //   gridSize: 4,
    //   cache: false,
    //   width: '25%',
    //   viewProp: 'personal_name'
    // },

    // {
    //   name: 'personal_name',
    //   label: 'employee_name',
    //   type: 'text',
    //   // requiredModes: ['add', 'edit'],
    //   modeCondition: (mode: Shared.Mode) => {
    //     return mode === 'search' ? mode : 'show'
    //   },
    //   gridSize: 4,
    //   viewProp: 'personal.full_name_ar'
    // },

    {
      name: 'nation_id',
      label: 'nation_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => {
        return mode === 'search' ? mode : 'show'
      },
      //lovKeyName: 'id',
      gridSize: 4,
      viewProp: 'nation_name'
    },

    {
      name: 'gender',
      label: 'gender',
      type: 'select',
      options: Shared.genderOptions,
      gridSize: 4,
      visibleModes: ['search'],
      modeCondition: (mode: Shared.Mode) => {
        return mode === 'search' ? mode : 'show'
      }
    },

    {
      name: 'gender_desc',
      label: 'gender',
      visibleModes: ['edit', 'show'],
      type: 'select',
      options: Shared.genderOptions,
      gridSize: 4,
      modal: 'personal',
      viewProp: 'personal.gender',
      modeCondition: (mode: Shared.Mode) => {
        return mode === 'search' ? mode : 'show'
      }
    },

    // {
    //   name: 'elected_period_id',
    //   label: 'time_period',
    //   type: 'select',
    //   apiUrl: '/ses/time-periods',
    //   requiredModes: [],
    //   labelProp: 'period_name',
    //   keyProp: 'id',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 4,
    //   viewProp: 'elected_period_name'
    // },
    {
      name: 'id_file',
      label: 'file_id',
      type: 'file',
      fileableType: 'ses_requests',
      modeCondition: (mode: Shared.Mode) => {
        return mode
      },
      gridSize: 6,
      visibleModes: ['edit', 'show']
    },
    {
      name: 'experience_certificate',
      label: 'experience_certificate',
      fileableType: 'ses_requests',
      type: 'file',
      gridSize: 6,
      modeCondition: mode => mode,
      visibleModes: ['edit', 'show']
    },
    {
      name: 'resume',
      label: 'resume',
      fileableType: 'ses_requests',
      type: 'file',
      gridSize: 6,
      modeCondition: mode => mode,
      // requiredModes: ['add', 'edit'],
      visibleModes: ['edit', 'show']
    },
    {
      name: 'national_address_file',
      label: 'national_address_file',
      type: 'file',
      fileableType: 'ses_requests',
      gridSize: 6,
      modeCondition: mode => mode,
      // requiredModes: ['add', 'edit'],
      visibleModes: ['edit', 'show']
    },

    {
      name: 'bank_id',
      label: 'bank_code',
      type: 'select',
      apiUrl: '/def/banks',
      labelProp: 'name_ar',
      keyProp: 'id',
      gridSize: 4,
      visibleModes: ['search'],
      modeCondition: (mode: Shared.Mode) => mode,
      viewProp: 'bank_name'
    },

    {
      name: 'iban_no',
      label: 'iban',
      type: 'iban',
      visibleModes: ['search'],
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => mode,
      acceptedIbans: ['SA'],
      validateIban: true
    },

    // {
    //   name: 'account_type',
    //   label: 'payment_method',
    //   visibleModes: ['search'],
    //   type: 'select',
    //   options: Shared.shrPaymentMethodList,
    //   // requiredModes: ['add', 'edit'],
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 4
    // },

    {
      name: 'department_id',
      label: 'department',
      type: 'select',
      apiUrl: '/def/seasonal-departments',
      visibleModes: ['search'],
      labelProp: 'department_name_ar',
      // selectFirstValue: true,
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      queryParams: { internal_department: true },
      gridSize: 4,
      viewProp: 'request_status.elected_department_name',
      onChange(value: any) {}
    },

    {
      name: 'elected_job_id',
      label: 'job',
      type: 'select',
      apiUrl: '/sys/list/21',
      labelProp: 'name',
      keyProp: 'id',
      // required: true,
      visibleModes: ['search'],
      apiMethod: 'GET',
      viewProp: 'job.name',
      gridSize: 4
    }

    // {
    //   name: 'contract_type_id',
    //   label: 'contract_type',
    //   type: 'select',
    //   apiUrl: '/acs/contract-types',
    //   keyProp: 'id',
    //   labelProp: 'contract_type_name_ar',
    //   // requiredModes: ['add', 'edit'],
    //   visibleModes: ['search'],
    //   gridSize: 4,
    //   viewProp: 'contract_type.contract_type_name_ar'
    // }
  ]
  const statusViewFields: Shared.DynamicFormFieldProps[] = [
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
    }
  ]
  // Nominating persons fields (for show mode)
  const nominatingApprovalsFields = useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'nomination_id',
        label: 'nomination_id',
        type: 'text',
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        width: '10%',
        viewProp: 'nomination_id'
      },
      {
        name: 'request_id',
        label: 'emplyment_request',
        width: '15%',
        type: 'select',
        apiUrl: '/ses/requests',
        labelProp: 'id',
        keyProp: 'id',
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        displayProps: ['request_no', 'personal.id_no', 'personal.full_name_ar'],
        queryParams: { nomination_number: null },
        viewProp: 'request_id'
      },
      {
        name: 'personal_id',
        label: 'personal_id',
        type: 'text',
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        width: '10%',
        viewProp: 'personal_id'
      },
      {
        name: 'personal_name',
        label: 'personal_name',
        type: 'text',
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        width: '10%',
        viewProp: 'personal_name'
      },
      {
        name: 'job_id',
        label: 'job',
        type: 'select',
        options: approved_jobs.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.id
        })),
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        labelProp: 'name',
        keyProp: 'id',
        required: true,
        width: '12%',
        viewProp: 'request_status.elected_job_name'
      },
      {
        name: 'start_date',
        label: 'start_date',
        type: 'date',
        width: '10%',
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        viewProp: 'request_status.elected_start_date'
      },
      {
        name: 'end_date',
        label: 'exp_date',
        type: 'date',
        width: '10%',
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        viewProp: 'request_status.elected_end_date'
      },
      {
        name: 'salary',
        label: 'salary',
        width: '10%',
        type: 'amount',
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        viewProp: 'request_status.elected_daily_price'
      },

      {
        name: 'status',
        label: 'status',
        type: 'select',
        options: [
          { value: 1, label: 'نشط' },
          { value: 0, label: 'غير نشط' }
        ],
        gridSize: 3,
        modeCondition: (mode: Shared.Mode) => mode,
        width: '8%',
        viewProp: 'status'
      }
    ],
    [approved_jobs]
  )

  // Candidate fields for approval list
  const candidateFields = useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'selected',
        label: 'select',
        type: 'checkbox',
        width: '5%'
      },
      {
        name: 'request_no',
        label: 'request_no',
        type: 'text',
        modeCondition: () => 'show',
        width: '10%'
      },
      {
        name: 'nomination_id',
        label: 'nomination_id',
        type: 'text',
        modeCondition: () => 'show',
        width: '10%'
      },
      {
        name: 'full_name_ar',
        label: 'full_name',
        type: 'text',
        modeCondition: () => 'show',
        width: '20%'
      },
      {
        name: 'job_name',
        label: 'job',
        type: 'text',
        modeCondition: () => 'show',
        width: '15%'
      },
      {
        name: 'start_date',
        label: 'start_date',
        type: 'date',
        modeCondition: () => 'show',
        width: '10%'
      },
      {
        name: 'end_date',
        label: 'end_date',
        type: 'date',
        modeCondition: () => 'show',
        width: '10%'
      },
      {
        name: 'salary',
        label: 'expected_salary',
        type: 'amount',
        modeCondition: () => 'show',
        width: '10%'
      },
      {
        name: 'ageer_contract_id',
        label: 'ajeer_contract_no',
        type: 'text',
        visible: scope === 'resident',
        disableField: (row: any) => !row.selected,
        width: '15%'
      }
    ],
    [scope]
  )

  // Columns for GenericSelectionTable
  const selectionColumns = useMemo<Shared.GenericTableColumnConfig[]>(
    () => [
      {
        key: 'full_name_ar',
        label: 'full_name'
        // subKey: 'nomination_id'
      },
      {
        key: 'job_name',
        label: 'job',
        type: 'chip',
        color: 'info'
      },
      {
        key: 'start_date',
        label: 'start_date',
        type: 'date'
      },
      {
        key: 'end_date',
        label: 'end_date',
        type: 'date'
      },
      {
        key: 'salary',
        label: 'expected_salary',
        type: 'amount'
      },
      {
        key: 'ajeer_contract_no',
        label: 'ajeer_contract_no',
        type: 'input',
        visible: scope === 'resident',
        placeholder: 'enter_contract_no',
        disableField: (row: any) => !row.selected,
        fieldSx: { minWidth: 30 }
      },
      {
        key: 'rejection_reason',
        label: 'notes',
        type: 'input',
        placeholder: 'rejection_reason',
        disableField: (row: any) => !row.selected,
        required: true,
        error: (row: any) => submissionStatus.current === 2 && row.selected && !row.rejection_reason,
        fieldSx: { minWidth: 80 }
      }
    ],
    [scope]
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
        name: 'department_id',
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
      },
      {
        name: 'ageer_contract_no',
        label: 'ageer_contract_no',
        type: 'text',
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

  // useRecordForm initialization
  const allFormFields = useMemo<Shared.DynamicFormFieldProps[]>(
    () => [...fields, ...budgetFields, ...searchFields, ...statusFields],
    [fields, budgetFields, searchFields, statusFields]
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
    onSaveSuccess,
    setError,
    submitWithParams,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<Shared.InferFieldType<typeof allFormFields>>({
    apiEndpoint: '/ses/requests-status',
    routerUrl: { default: `/apps/ses/nomination-approval/${scope}` },
    fields: allFormFields,
    initialDetailsData: { nominating_users: [], candidates: [] },
    excludeFields: [
      { action: 'add', fields: [...searchFields, ...statusFields] },
      { action: 'edit', fields: [...searchFields, ...statusFields] }
    ],
    detailsTablesConfig: {
      nominating_users: { fields: nominatingApprovalsFields, trackIndex: true },
      candidates: { fields: candidateFields, trackIndex: true }
    },

    onSaveSuccess: async (response, mode) => {
      if (mode === 'add') {
        setMode('show')
        navigateWithQuery(`/apps/ses/nomination-approval/${scope}/list`, router, locale as Shared.Locale)
      } else {
        setMode('show')
      }
    },
    onMenuActionClick: async (action, mode) => {
      if (action === 'edit') {
        if (!recordId) {
          setError('هذا الحقل ملطوب')

          navigateWithQuery(`/apps/ses/nomination-approval/${scope}/list`, router, locale as Shared.Locale)
        } else {
          setMode('edit')
          navigateWithQuery(
            `/apps/ses/nomination-approval/${scope}/details?id=${recordId}&mode=edit`,
            router,
            locale as Shared.Locale
          )
        }
      }
    },
    onBeforeSave: (data, detailsData) => {
      if (mode === 'search') return true

      const selected = detailsData['candidates']?.filter((c: any) => c.selected)

      if (!selected || selected.length === 0) {
        setError('يرجى اختيار موظف واحد على الأقل')

        Shared.scrollToTop()
        return false
      }

      if (scope === 'resident' && submissionStatus.current === 1) {
        const missingContract = selected.some((c: any) => !c.ajeer_contract_no)
        if (missingContract) {
          setError('يرجى إضافة رقم عقد أجير لكل مرشح مختار')
          Shared.scrollToTop()
          return false
        }
      }

      if (submissionStatus.current === 2) {
        const missingReason = selected.some((c: any) => !c.rejection_reason)
        if (missingReason) {
          setError('يرجى إضافة سبب الرفض لكل مرشح مختار')
          Shared.scrollToTop()
          return false
        }
      }

      return true
    },
    transformPayload: (payload, detailsData) => {
      if (mode === 'search') return payload

      const selectedCandidates = detailsData['candidates']?.filter((c: any) => c.selected) || []

      const selected = selectedCandidates.map((c: any) => ({
        id: c.nomination_id,
        ...(scope === 'resident' && submissionStatus.current === 1 ? { ageer_contract_no: c.ajeer_contract_no } : {})
      }))

      // Get notes from the first selected candidate to send in the master payload
      const notes = selectedCandidates.length > 0 ? selectedCandidates[0].rejection_reason : ''

      return {
        ids: selected,
        status: submissionStatus.current,
        ...(submissionStatus.current === 2 ? { notes } : {})
      }
    }
  })

  // Watch department field
  const { setValue, watch } = formMethods
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
              request: { id_type: idType, nomination_approval_number: 'null' }
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
    submissionStatus.current = 1
    await submitWithParams({
      apiEndPointModeCondition: [{ mode: 'add', apiUrl: '/ses/nomination-approvals' }]
    })
  }

  const handleSelectAll = (checked: boolean) => {
    const updated = detailsData['candidates'].map((c: any) => ({ ...c, selected: checked }))
    updateDetailsData('candidates', updated)
  }

  const handleToggleRow = (index: number, checked: boolean) => {
    updateDetailsData('candidates', { selected: checked }, index)
  }

  return {
    personal,
    status,
    user,
    accessToken,
    selectedDepartment,
    setSelectedDepartment,
    approved_jobs,
    setApprovedJobs,
    departmentOptions,
    fields,
    budgetFields,
    nominatingApprovalsFields,
    candidateFields,
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    searchFields,
    statusFields,
    dataModel,
    getDetailsErrors,
    detailsData,
    detailsHandlers,
    setDetailsData,
    closeDocumentsDialog,
    openDocumentsDialog,
    updateDetailsData,
    handleSaveWrapper,
    statusViewFields,
    staticFields,
    handleSelectAll,
    handleToggleRow,
    handleRejectCandidates: async () => {
      submissionStatus.current = 2
      await submitWithParams({
        apiEndPointModeCondition: [{ mode: 'add', apiUrl: '/ses/nomination-approvals' }]
      })
    },
    selectionColumns,
    recordId,
    onSaveSuccess,
    openRecordInformationDialog,
    closeRecordInformationDialog
  }
}
