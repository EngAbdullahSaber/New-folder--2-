'use client'

import * as Shared from '@/shared'

const TimePeriodDetails = () => {
  // Define the fields with validation and default values
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    {
      name: 'period_name',
      label: 'name',
      type: 'text',
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
      defaultValue: '1',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'order_no',
      label: 'order_no',
      type: 'number',
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => mode,
      requiredModes: ['add', 'edit']
    },
    {
      name: 'total_hours',
      label: 'total_hours',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'start_time',
      label: 'start_time',
      type: 'time',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'end_time',
      label: 'end_time',
      type: 'time',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'is_main_period',
      label: 'is_main_period',
      type: 'select',
      options: Shared.otherYesNoList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
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
      width: '50%',
      align: 'start'
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      gridSize: 4,
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
    apiEndpoint: '/ses/time-periods',
    routerUrl: { default: '/apps/ses/time-period' },
    fields: fields,
    initialDetailsData: {
      seasonal_time_periods: []
    },
    detailsTablesConfig: {
      seasonal_time_periods: { fields: seasonDetailsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`time_periods`}
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
            detailsConfig={[{ key: 'seasonal_time_periods', fields: seasonDetailsFields, title: 'seasons' }]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={seasonDetailsFields}
            title='seasons'
            initialData={detailsData['seasonal_time_periods']} // Pass the details data
            onDataChange={detailsHandlers?.seasonal_time_periods}
            mode={mode}
            errors={getDetailsErrors('seasonal_time_periods')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/ses/time-periods/${dataModel.id}/seasonal_time_periods`}
            detailsKey='seasonal_time_periods'
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

export default TimePeriodDetails
