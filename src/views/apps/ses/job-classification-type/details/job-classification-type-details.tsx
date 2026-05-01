'use client'

import * as Shared from '@/shared'

const JobClassificationTypeDetails = () => {
  // Define the fields with validation and default values
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },
    {
      name: 'name',
      label: 'name',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 8
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
    }
  ]

  const seasonDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'season',
      label: 'season',
      type: 'select',
      apiUrl: '/def/seasons',
      keyProp: 'id',
      labelProp: 'id',
      width: '60%',
      align: 'start'
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      gridSize: 6,
      width: '20%'
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
    openDocumentsDialog,
    closeDocumentsDialog,
    getDetailsErrors,
    setDetailsData,
    detailsData,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/ses/job-classification-types',
    routerUrl: { default: '/apps/ses/job-classification-type' },
    fields: fields,
    initialDetailsData: {
      seasonal_job_class_types: []
    },
    detailsTablesConfig: {
      seasonal_job_class_types: { fields: seasonDetailsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`job_classification_types`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            detailsConfig={[{ key: 'seasonal_job_class_types', fields: seasonDetailsFields, title: 'seasons' }]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={seasonDetailsFields}
            title='seasons'
            initialData={detailsData['seasonal_job_class_types']} // Pass the details data
            onDataChange={detailsHandlers?.seasonal_job_class_types}
            mode={mode}
            errors={getDetailsErrors('seasonal_job_class_types')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/ses/job-classification-types/${dataModel.id}/seasonal_job_class_types`}
            detailsKey='seasonal_job_class_types'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
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

export default JobClassificationTypeDetails
