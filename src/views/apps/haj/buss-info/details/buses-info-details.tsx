'use client'

import * as Shared from '@/shared'

const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    visibleModes: ['add', 'edit', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'season',
    label: 'season',
    type: 'number',
    visibleModes: ['add', 'edit', 'show'],
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  // -- Identification --
  {
    name: 'plate_no',
    label: 'plate_no',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'chassis_no',
    label: 'chassis_no',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'naqaba_bus_id',
    label: 'naqaba_bus_id',
    type: 'number',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'machine_no',
    label: 'machine_no',
    type: 'text',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  // -- Technical Specifications --
  {
    name: 'operating_card_no',
    label: 'operating_card_no',
    type: 'text',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'manufacturing_year',
    label: 'manufacturing_year',
    type: 'number',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'manufacturing_comp_id',
    label: 'manufacturing_comp_id',
    type: 'number',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'bus_type',
    label: 'bus_type',
    type: 'select',
    apiUrl: '/def/bus-types',
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'capacity',
    label: 'capacity',
    type: 'number',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },

  // -- Audit Row --
  {
    name: 'data_source',
    label: 'data_source',
    type: 'select',
    options: Shared.dataSourceList,
    requiredModes: [],
    visibleModes: ['search', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'reference_id',
    label: 'reference_id',
    type: 'text',
    requiredModes: [],
    visibleModes: ['search', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'status',
    label: 'status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: ['add', 'edit'],
    defaultValue: '1',
    visibleModes: ['search', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const BusesInfoDetails = () => {
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    closeDocumentsDialog,
    openDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/buses-infos',
    routerUrl: { default: '/apps/haj/buss-info' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'buss_info'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

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
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default BusesInfoDetails
