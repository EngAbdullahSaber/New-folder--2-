'use client'

import CustomBadge from '@/@core/components/mui/Badge'
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
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'seasonal_department_id',
    label: 'department',
    type: 'select',
    apiUrl: '/def/seasonal-departments',
    labelProp: 'department_name_ar',
    viewProp: 'department.department_name_ar',
    modeCondition: (mode: Shared.Mode) => mode,
    keyProp: 'id',
    requiredModes: ['add', 'edit'],
    gridSize: 4
  },
  {
    name: 'job_classification_type_id',
    label: 'job_classification_type',
    type: 'select',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    viewProp: 'job_classification_type.name',
    apiUrl: '/ses/job-classification-types',
    labelProp: 'name',
    keyProp: 'id',
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
    name: 'estimated_budget',
    label: 'estimated_budget',
    type: 'amount',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'allocated_budget',
    label: 'allocated_budget',
    type: 'amount',
    requiredModes: ['add', 'edit'],
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

type dataModelFormData = Shared.InferFieldType<typeof fields>

const CenterClassificationDetails = () => {
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
    apiEndpoint: '/ses/center-classifications',
    routerUrl: { default: '/apps/ses/center-classification' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`center_classifications`}
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

export default CenterClassificationDetails
