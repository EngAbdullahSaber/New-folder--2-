'use client'

import { useErrorApi } from '@/contexts/errorApiProvider'
import * as Shared from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'

const CompanyContractorRequestDetails = ({ scope }: ComponentGeneralProps) => {
  const { user } = Shared.useSessionHandler()
  const [companyContractorRequestStatus, setCompanyContractorRequestStatus] = Shared.useState<any>('1')

  // ✅ Determine the effective mode based on scope and status
  const [effectiveMode, setEffectiveMode] = Shared.useState<Shared.Mode>('search')

  // ✅ Move fields inside component body so it can access effectiveMode
  const fields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        defaultValue: ''
      },
      {
        name: 'season',
        label: 'season',
        type: 'select',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        defaultValue: ''
      },
      {
        name: 'contractor_company_id',
        label: 'contractor_company',
        type: 'select',
        apiUrl: `/acs/${scope == 'user' ? 'my-contractor-companies' : 'contractor-companies'}`,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        keyProp: 'id',
        labelProp: 'contractor_company_name_ar',
        queryParams: { status: 3 },
        viewProp: 'contractor_company.contractor_company_name_ar'
      },
      {
        name: 'contractor_type_id',
        label: 'contractor_type',
        type: 'select',
        apiUrl: '/acs/contractor-types/active',
        keyProp: 'id',
        labelProp: 'contractor_type_name_ar',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'contractor_type.contractor_type_name_ar',
        onChange: result => {
          setValue('map_contractor_type_id', result?.object?.map_contractor_type_id)
        },
        apiMethod: 'GET'
      },
      {
        name: 'map_contractor_type_id',
        label: '',
        type: 'storage',
        visibleModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },
      {
        name: 'status',
        label: 'status',
        type: 'select',
        options: Shared.companyContractorRequestStatus,
        // ✅ FIXED: Proper mode condition for status field
        modeCondition: (mode: Shared.Mode) => {
          // Admin can always see/edit status based on mode
          if (scope === 'admin') {
            return mode
          }

          // User: always show (read-only) except in search mode
          if (mode === 'search') {
            return 'search' // Allow searching by status
          }

          return 'show' // All other modes: read-only for users
        },
        // visibleModes: ['search', 'show', 'edit'], // ✅ Hide in add mode
        gridSize: 4,
        defaultValue: '1'
      },
      {
        name: 'remark',
        label: 'remarks',
        type: 'rich_text',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      }
    ],
    [scope, effectiveMode] // ✅ Add effectiveMode as dependency
  )

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const companyExperiencesFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'season',
        label: 'season',
        type: 'number',
        maxLength: 4,
        width: '10%',
        gridSize: 4
      },
      {
        name: 'company_served_names',
        label: 'company_served_names',
        type: 'text',
        required: false,
        width: '25%',
        gridSize: 4,
        align: 'start'
      },
      {
        name: 'contract_type_id',
        label: 'contract_type',
        type: 'select',
        required: true,
        width: '20%',
        apiUrl: '/acs/contract-types',
        labelProp: 'contract_type_name_ar',
        keyProp: 'id',
        multiple: false,
        gridSize: 4,
        viewProp: 'contract_type.contract_type_name_ar'
      },
      {
        name: 'contract_file',
        label: 'contract_file',
        type: 'file',
        required: false,
        width: '25%',
        gridSize: 12,
        fileableType: scope == 'user' ? 'acs_my_contractor_companies_experiences' : 'acs_company_experiences'
      },
      {
        name: 'files',
        label: '',
        type: 'storage',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12,
        visibleModes: ['add', 'edit']
      }
    ],
    [scope]
  )

  const {
    formMethods,
    mode,
    setMode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    getDetailsErrors,
    detailsData,
    loadDynamicExtraFields,
    detailsHandlers,
    setDetailsData,
    closeDocumentsDialog,
    openDocumentsDialog,
    dynamicExtraFields,
    closeRecordInformationDialog,
    openRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: `/acs/${scope == 'user' ? 'my-company-contractor-requests' : 'company-contractor-requests'}`,
    routerUrl: { default: `/apps/acs/company-contractor-request/${scope}` },
    fields: fields,
    initialDetailsData: {
      company_experiences: [],
      contractor_cities: []
    },
    detailsTablesConfig: {
      company_experiences: { fields: companyExperiencesFields, trackIndex: true }
    }
  })

  const { accessToken } = Shared.useSessionHandler()
  const { setValue } = formMethods
  const contractorType = formMethods.watch('contractor_type_id')
  const watchStatus = formMethods.watch('status')
  const { setError } = useErrorApi()

  const fetchedContractorTypeRef = Shared.useRef<string | null>(null)

  // ✅ Helper: Check if user can edit
  const canUserEdit = Shared.useCallback(
    (status: string | number): boolean => {
      if (scope === 'admin') {
        return true
      }
      return String(status) === '1'
    },
    [scope]
  )

  // ✅ Calculate effective mode based on original mode, scope, and status
  Shared.useEffect(() => {
    if (mode === 'add' || mode === 'search') {
      setEffectiveMode(mode)
      return
    }

    if (mode === 'edit') {
      const status = watchStatus || dataModel?.status || '1'

      if (!canUserEdit(status)) {
        setEffectiveMode('show')

        const statusMessage = Shared.CONTRACT_STATUS_MESSAGES[String(status)] || 'في حالته الحالية'
        if (scope === 'user') {
          setError(`لا يمكن تعديل طلب التعاقد نظرًا لأنه ${statusMessage}`)
        }
      } else {
        setEffectiveMode('edit')
      }
    } else if (mode === 'show') {
      setEffectiveMode('show')
    } else {
      setEffectiveMode(mode)
    }
  }, [mode, watchStatus, dataModel?.status, scope, canUserEdit, setError])

  // ✅ Update status state and set default value in add mode
  Shared.useEffect(() => {
    if (mode === 'add') {
      setValue('status', '1', { shouldValidate: false })
      setCompanyContractorRequestStatus('1')
    } else if (watchStatus) {
      setCompanyContractorRequestStatus(String(watchStatus))
    }
  }, [watchStatus, mode, setValue])

  // ✅ Load dynamic extra fields based on contractor type
  Shared.useEffect(() => {
    if (!contractorType || fetchedContractorTypeRef.current === String(contractorType)) {
      return
    }

    fetchedContractorTypeRef.current = String(contractorType)

    Shared.fetchRecordById(
      `/acs/contractor-types`,
      contractorType,
      accessToken,
      locale as Shared.Locale,
      data => {
        loadDynamicExtraFields(data)
      },
      undefined,
      undefined
    )
  }, [contractorType, accessToken, locale, loadDynamicExtraFields])

  // ✅ Reset fetched ref when contractorType is cleared
  Shared.useEffect(() => {
    if (!contractorType) {
      fetchedContractorTypeRef.current = null
    }
  }, [contractorType])

  // ✅ Override handleMenuOptionClick to handle edit restrictions
  const handleMenuOptionClickWithPermission = Shared.useCallback(
    (action: string) => {
      if (action === 'edit') {
        const status = watchStatus || dataModel?.status || '1'

        if (!canUserEdit(status)) {
          const statusMessage = Shared.CONTRACT_STATUS_MESSAGES[String(status)] || 'في حالته الحالية'
          setError(`لا يمكن تعديل طلب التعاقد نظرًا لأنه ${statusMessage}`)
          return
        }
      }

      handleMenuOptionClick(action)
    },
    [handleMenuOptionClick, watchStatus, dataModel?.status, canUserEdit, setError]
  )

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`company_contractor_requests`}
            mode={effectiveMode}
            onMenuOptionClick={handleMenuOptionClickWithPermission}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={effectiveMode}
            screenMode={effectiveMode}
            detailsConfig={[
              { key: 'contractor_cities', fields: [], title: 'work_cities' },
              { key: 'company_experiences', fields: companyExperiencesFields, title: 'experiences' },
              { key: 'extraFields', fields: dynamicExtraFields, title: 'extra_information' }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={effectiveMode} screenMode={effectiveMode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.CheckboxRadioGrid
            title='work_cities'
            type='checkbox'
            gridSize={4}
            apiUrl='/sys/list/1'
            labelProp='name_ar'
            keyProp='id'
            mode={effectiveMode}
            locale={locale}
            name='contractor_cities'
            initialData={detailsData.contractor_cities || []}
            onDataChange={detailsHandlers?.contractor_cities}
            submitKey='id'
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={companyExperiencesFields}
            title='experiences'
            initialData={detailsData['company_experiences']}
            onDataChange={detailsHandlers?.company_experiences}
            mode={effectiveMode}
            errors={getDetailsErrors('company_experiences')}
            apiEndPoint={`/acs/${scope == 'user' ? 'my-company-contractor-requests' : 'company-contractor-requests'}/${dataModel.id}/company_experiences`}
            detailsKey='company_experiences'
            locale={locale}
            dataObject={dataModel}
          />
        </Shared.Grid>

        {dynamicExtraFields && dynamicExtraFields.length > 0 && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              headerConfig={{ title: 'extra_information' }}
              locale={locale}
              fields={dynamicExtraFields}
              mode={effectiveMode}
              screenMode={effectiveMode}
            />
          </Shared.Grid>
        )}

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FileUploadWithTabs
            open={openDocumentsDialog}
            onClose={() => closeDocumentsDialog()}
            locale={locale}
            attachments={dataModel.attachments}
            recordId={dataModel.id}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            open={openRecordInformationDialog}
            onClose={() => closeRecordInformationDialog()}
            locale={locale}
            dataModel={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={effectiveMode} />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default CompanyContractorRequestDetails
