'use client'

import CustomBadge from '@/@core/components/mui/Badge'
import * as Shared from '@/shared'

const JobCategoryDetails = () => {
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
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'job_id',
      label: 'job',
      type: 'select',
      requiredModes: ['add', 'edit'],
      apiUrl: '/sys/list/21',
      labelProp: 'name',
      keyProp: 'id',
      gridSize: 4,
      apiMethod: 'GET',
      modeCondition: (mode: Shared.Mode) => mode,
      viewProp: 'job.name',
      onChange: res => {
        if (res && res.object) {
          setValue('job_requirements', res?.object?.job_requirements)
          setValue('job_description_template', res?.object?.job_description_template)
          setValue('tasks_template', res?.object?.tasks_template)
        }
      }
    },
    {
      name: 'job_classification_type_id',
      label: 'job_classification_type',
      type: 'select',
      requiredModes: ['add', 'edit'],
      apiUrl: '/ses/job-classification-types',
      labelProp: 'name',
      keyProp: 'id',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode,
      viewProp: 'job_classification_types.name'
    },
    {
      name: 'job_level_id',
      label: 'job_level',
      type: 'select',
      requiredModes: ['add', 'edit'],
      apiUrl: '/ses/job-levels',
      labelProp: 'name',
      keyProp: 'id',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode,
      viewProp: 'job_level.name'
    },
    {
      name: 'daily_rate',
      label: 'daily_rate',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'job_requirements',
      label: 'job_requirements',
      type: 'rich_text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    {
      name: 'job_description_template',
      label: 'job_description_template',
      type: 'rich_text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },
    {
      name: 'tasks_template',
      label: 'tasks_template',
      type: 'rich_text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>

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
    apiEndpoint: '/ses/job-categories',
    routerUrl: { default: '/apps/ses/job-category' },
    fields: fields
  })

  const { setValue } = formMethods

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`job_categories`}
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

export default JobCategoryDetails
