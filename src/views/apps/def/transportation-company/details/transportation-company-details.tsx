'use client'

import * as Shared from '@/shared'

const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    visibleModes: ['add', 'edit', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'season',
    label: 'season',
    type: 'number',
    visibleModes: ['add', 'edit', 'show'],
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'ltc_state',
    label: 'status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  // -- Identification --
  {
    name: 'business_id',
    label: 'business_id',
    type: 'number',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'ltc_naqaba_id',
    label: 'ltc_naqaba_id',
    type: 'number',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  // -- Company Names --
  {
    name: 'ltc_name_ar',
    label: 'ltc_name_ar',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'ltc_name_la',
    label: 'ltc_name_la',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const TransportationCompanyDetails = () => {
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
    locale,
    dataModel,
    closeDocumentsDialog,
    detailsHandlers,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/def/transportation-companies',
    routerUrl: { default: '/apps/def/transportation-company' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'transportation_company'}
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

export default TransportationCompanyDetails
