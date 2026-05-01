'use client'

import * as Shared from '@/shared'

// Define the fields with validation and default values
const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },
  {
    name: 'name_ar',
    label: 'name_ar',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'name_en',
    label: 'name_en',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'airport_code',
    label: 'airport_code',
    type: 'text',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'from_prt_id',
    label: 'from_prt_id',
    type: 'select',
    apiUrl: '/def/ports',
    labelProp: 'port_name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    //lovKeyName: 'id',
    gridSize: 4,
    viewProp: 'from_prt.port_name_ar'
  },
  {
    name: 'to_prt_id',
    label: 'to_prt_id',
    type: 'select',
    apiUrl: '/def/ports',
    labelProp: 'port_name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    //lovKeyName: 'id',
    gridSize: 4,
    viewProp: 'to_prt.port_name_ar'
  },

  {
    name: 'stc_destination',
    label: 'stc_destination',
    type: 'text',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'train_station_status',
    label: 'train_station_status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'type_id',
    label: 'type',
    type: 'select',
    options: Shared.portTypeList,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'route_id',
    label: 'route',
    type: 'select',
    apiUrl: '/def/routes',
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4,
    viewProp: 'route.name_ar'
  },
  {
    name: 'data_source',
    label: 'data_source',
    type: 'select',
    options: Shared.dataSourceList,
    requiredModes: [],
    // visibleModes: ['search', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'reference_id',
    label: 'reference_id',
    type: 'text',
    requiredModes: [],
    // visibleModes: ['search', 'show'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'status',
    label: 'status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  }
]

type pathFormData = Shared.InferFieldType<typeof fields>

const PathDetails = () => {
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    openDocumentsDialog,
    closeDocumentsDialog,
    dataModel,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<pathFormData>({
    apiEndpoint: '/def/paths',
    routerUrl: { default: '/apps/def/path' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`path`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'path' }}
            fields={fields}
            mode={mode}
            screenMode={mode}
          />
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

export default PathDetails
