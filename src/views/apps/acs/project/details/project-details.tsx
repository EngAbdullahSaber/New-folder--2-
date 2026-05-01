'use client'

import * as Shared from '@/shared'

// Define the fields with validation and default values
const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'season',
    label: 'season',
    type: 'number',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
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
    apiMethod: 'GET'
  },
  {
    name: 'project_name',
    label: 'project_name',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'project_budget',
    label: 'project_budget',
    type: 'amount',
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
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'start_date',
    label: 'start_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4,
    validation: Shared.createDateRangeValidation('end_date', 'before', 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية')
  },
  {
    name: 'end_date',
    label: 'exp_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4,
    validation: Shared.createDateRangeValidation('start_date', 'after', 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية')
  },
  {
    name: 'project_manager_id',
    label: 'project_manager',
    type: 'select',
    apiUrl: '/def/personal',
    labelProp: 'id',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['id_no', 'full_name_ar'],
    gridSize: 4,
    cache: false,
    viewProp: 'personal.full_name_ar'
    // modal: 'personal'
  },

  {
    name: 'project_desc',
    label: 'description',
    type: 'rich_text',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const ProjectDetails = () => {
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
    apiEndpoint: '/acs/projects',
    routerUrl: { default: '/apps/acs/project' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`projects`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
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

export default ProjectDetails
