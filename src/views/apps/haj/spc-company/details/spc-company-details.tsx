'use client'

import * as Shared from '@/shared'

const SpcCompanyDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      // visibleModes: ['add', 'edit', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    // {
    //   name: 'season',
    //   label: 'season',
    //   type: 'number',
    //   visibleModes: ['add', 'edit', 'show'],
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 3
    // },
    {
      name: 'business_id',
      label: 'business_id',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'license_number',
      label: 'license_number',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'commercial_registration_number',
      label: 'commercial_registration_number',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'company_name_ar',
      label: 'company_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'company_name_en',
      label: 'company_name_en',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'short_name_ar',
      label: 'short_name_ar',
      type: 'text',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'short_name_en',
      label: 'short_name_la',
      type: 'text',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'seasonal_assigned_quota',
      label: 'seasonal_assigned_quota',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'comp_assigned_quota',
      label: 'comp_assigned_quota',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'is_servicing_local_applicant',
      label: 'is_servicing_local_applicant',
      type: 'select',
      options: Shared.otherYesNoList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'is_servicing_external_applicant',
      label: 'is_servicing_external_applicant',
      type: 'select',
      options: Shared.otherYesNoList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'phone_number',
      label: 'mobile',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'fax_number',
      label: 'fax_number',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'webpage',
      label: 'webpage',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'email_address',
      label: 'email_address',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'city_id',
      label: 'city_id',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      requiredModes: ['add', 'edit'],
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'city.name_ar'
    },
    {
      name: 'po_box',
      label: 'po_box',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'district',
      label: 'district',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'company_address1',
      label: 'company_address1',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'company_address2',
      label: 'company_address2',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'rep_full_name_ar',
      label: 'rep_full_name_ar',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'rep_full_name_en',
      label: 'rep_full_name_en',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'rep_document_number',
      label: 'rep_document_number',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'rep_phone_number',
      label: 'rep_phone_number',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'rep_email',
      label: 'rep_email',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'hc_state',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      defaultValue: '1',
      // visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      requiredModes: [],
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'reference_id',
      label: 'reference_id',
      type: 'text',
      requiredModes: [],
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    setDetailsData,
    errors,
    setOpenDocumentsDialog,
    openDocumentsDialog,
    setOpenRecordInformationDialog,
    openRecordInformationDialog,
    openRecordTrackingDialog,
    setOpenRecordTrackingDialog,

    dataModel,
    closeDocumentsDialog,
    detailsHandlers,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/spc-companies',
    routerUrl: { default: '/apps/haj/spc-company' },
    fields: fields
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'spc_company'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
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
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default SpcCompanyDetails
