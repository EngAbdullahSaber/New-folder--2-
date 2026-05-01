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
    name: 'lhc_lrm_id',
    label: 'lhc_lrm_id',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lifting_company_id',
    label: 'lifting_company',
    type: 'select',
    apiUrl: '/haj/lifting-companies',
    requiredModes: ['add', 'edit'],
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    //to be dynamic list
    name: 'lhc_lrm_rep_id',
    label: 'lhc_lrm_rep_id',
    type: 'select',
    apiUrl: '/def/representatives',
    requiredModes: [],
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    //to be dynamic list
    name: 'lhc_hfrm_id',
    label: 'lhc_hfrm_id',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'house_id',
    label: 'house',
    type: 'select',
    apiUrl: '/haj/houses',
    requiredModes: [],
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    //to be dynamic list
    name: 'representative_id',
    label: 'house_rep',
    type: 'select',
    apiUrl: '/def/representatives',
    requiredModes: [],
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_date',
    label: 'contract_date',
    type: 'date',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_date_hij',
    label: 'date_hij',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_contract_no',
    label: 'contract_no',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_start_date',
    label: 'start_date',
    type: 'date',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_start_date_hij',
    label: 'start_date_hij',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_end_date',
    label: 'exp_date',
    type: 'date',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_end_date_hij',
    label: 'exp_date_hij',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_pilgrim_price',
    label: 'pilgrim_price',
    type: 'number',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_total_price',
    label: 'total_price',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'lhc_total_pilgrims',
    label: 'total_haj_quota',
    type: 'number',
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

const LiftingContractDetails = () => {
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    openDocumentsDialog,
    closeDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/lifting-house-contracts',
    routerUrl: { default: '/apps/haj/lifting-contract' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'lifting_contract'}
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

export default LiftingContractDetails
