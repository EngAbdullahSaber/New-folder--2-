'use client'

import * as Shared from '@/shared'

const AllowanceTypeDetails = () => {
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
      gridSize: 4
    },
    {
      name: 'allowance_scope',
      label: 'allowance_scope',
      type: 'select',
      options: Shared.allowanceScopeList,
      requiredModes: ['add', 'edit'],
      defaultValue: '1',
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
      width: '25%',
      align: 'start'
    },
    {
      name: 'allowance_calculation_type',
      label: 'allowance_calculation_type',
      type: 'select',
      options: Shared.allowanceTypeList,
      width: '30%',
      cache: false,
      gridSize: 6,
      align: 'start'
    },
    {
      name: 'allowance_value',
      label: 'allowance_value',
      type: 'number',
      gridSize: 6,
      width: '10%'
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      gridSize: 6,
      width: '10%'
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
    setDetailError,
    setDetailsData,
    detailsData,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/ses/allowance-types',
    routerUrl: { default: '/apps/ses/allowance-type' },
    fields: fields,
    initialDetailsData: {
      seasonal_allowances: []
    },
    detailsTablesConfig: {
      seasonal_allowances: { fields: seasonDetailsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`allwances`}
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
            detailsConfig={[{ key: 'seasonal_employee_allowances', fields: seasonDetailsFields, title: 'seasons' }]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={seasonDetailsFields}
            title='seasons'
            initialData={detailsData['seasonal_allowances']} // Pass the details data
            onDataChange={detailsHandlers?.seasonal_allowances}
            mode={mode}
            errors={getDetailsErrors('seasonal_allowances')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/ses/allowance-types/${dataModel.id}/seasonal_allowances`}
            detailsKey='seasonal_allowances'
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

export default AllowanceTypeDetails
