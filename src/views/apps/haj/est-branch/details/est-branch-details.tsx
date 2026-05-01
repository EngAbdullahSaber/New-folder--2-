'use client'

import * as Shared from '@/shared'

const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },

  {
    name: 'season',
    label: 'season',
    type: 'number',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'name_ar',
    label: 'name_ar',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'name_la',
    label: 'name_la',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'est_id',
    label: 'est_id',
    type: 'select',
    apiUrl: '/haj/ests',
    requiredModes: [],
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'heb_no',
    label: 'heb_no',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'haj_quota',
    label: 'haj_quota',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'branch_tel1',
    label: 'branch_tel1',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'branch_tel2',
    label: 'branch_tel2',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'branch_fax',
    label: 'branch_fax',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'branch_address',
    label: 'branch_address',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'branch_head_name',
    label: 'branch_head_name',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'status',
    label: 'status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'branch_head_id_no',
    label: 'branch_head_id_no',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'branch_head_moblie',
    label: 'branch_head_moblie',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'latitude',
    label: 'latitude',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'longitude',
    label: 'longitude',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'hc_id',
    label: 'hajj_company',
    type: 'select',
    apiUrl: '/haj/haj-companies',
    requiredModes: [],
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'heb_code',
    label: 'heb_code',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'hm_state',
    label: 'hm_state',
    type: 'select',
    options: Shared.yesNoList,
    requiredModes: [],
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

const EstBranchDetails = () => {
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
    apiEndpoint: '/haj/hajj-est-branches',
    routerUrl: { default: '/apps/haj/est-branch' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'est-branch'}
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

export default EstBranchDetails
