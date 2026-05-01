'use client'

import * as Shared from '@/shared'

const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',

    // visibleModes: ['add', 'edit', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'season',
    label: 'season',
    type: 'number',

    // visibleModes: ['add', 'edit', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lu_land_trans_company_id',
    label: 'ltc_id',
    type: 'select',
    apiUrl: '/def/transportation-companies',
    labelProp: 'ltc_name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'di_naqaba_driver_id',
    label: 'di_naqaba_driver_id',
    type: 'number',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  // -- Driver Details --
  {
    name: 'di_driver_name',
    label: 'di_driver_name',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'lu_nationality_id',
    label: 'nationality',
    type: 'select',
    requiredModes: ['add', 'edit'],
    apiUrl: '/def/nationalities',
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3,
    viewProp: 'lu_nationality.name_ar'
  },
  {
    name: 'di_driver_identification_id',
    label: 'di_driver_identification_id',
    type: 'number',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'di_mobile_no',
    label: 'mobile',
    type: 'number',

    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  // -- Company & Status --

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
  },
  {
    name: 'state',
    label: 'state',
    type: 'select',
    options: Shared.yesNoList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  }

  // {
  //   name: 'state',
  //   label: 'status',
  //   type: 'select',
  //   options: Shared.statusList,
  //   // requiredModes: ['add', 'edit'],
  //   defaultValue: '1',
  //   visibleModes: ['search', 'show'],
  //   modeCondition: (mode: Shared.Mode) => mode,
  //   gridSize: 3
  // }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const DriverDetails = () => {
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
    apiEndpoint: '/haj/drivers',
    routerUrl: { default: '/apps/haj/driver' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'haj_driver'}
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

export default DriverDetails
