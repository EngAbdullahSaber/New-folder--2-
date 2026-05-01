'use client'

import * as Shared from '@/shared'

// Define the fields with validation and default values

const ContractorTypeDetails = () => {
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    {
      name: 'contractor_type_name_ar',
      label: 'contractor_type_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'contractor_type_name_la',
      label: 'contractor_type_name_la',
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
      defaultValue: '1',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    }
  ]

  const contractTypesDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'season',
      label: 'season',
      type: 'number',
      maxLength: 4,
      width: '50%',
      gridSize: 6,
      align: 'start'
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      gridSize: 6,
      width: '20%'
    },
    {
      name: 'required_description',
      label: 'required_description',
      type: 'rich_text',
      gridSize: 12,
      hideInTable: true
    }
  ]

  const extraDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'type',
      label: 'type',
      type: 'select',
      options: Shared.formFieldTypes,
      width: '15%',
      gridSize: 6
    },
    {
      name: 'name',
      label: 'field_name',
      type: 'text',
      width: '30%',
      gridSize: 6,
      align: 'start'
    },
    {
      name: 'label',
      label: 'label',
      type: 'text',
      width: '40%',
      gridSize: 6,
      visible: true,
      align: 'start'
    },
    {
      name: 'placeholder',
      label: 'placeholder',
      type: 'text',
      width: '15%',
      gridSize: 6,
      hideInTable: true,
      align: 'center'
    },
    {
      name: 'options',
      label: 'options',
      type: 'text',
      width: '15%',
      gridSize: 12,
      // hideInTable: true,
      showWhen: {
        field: 'type',
        value: ['checkbox', 'select']
      }
    },

    {
      name: 'frontend_validation_rules',
      label: 'frontend_validation_rules',
      type: 'text',
      width: '15%',
      gridSize: 12,
      hideInTable: true
    },
    {
      name: 'backend_validation_rules',
      label: 'backend_validation_rules',
      type: 'text',
      width: '15%',
      gridSize: 12,
      hideInTable: true
    },
    {
      name: 'is_required',
      label: 'is_required',
      type: 'checkbox',
      // defaultValue: true, // Default value for checkbox
      options: [{ value: 'true', label: 'is_required' }],
      onChange: (value: any) => console.log('Selected:', value),
      width: '15%',
      gridSize: 12
    },
    {
      name: 'is_multiple',
      label: 'is_multiple',
      type: 'checkbox',
      // defaultValue: true, // Default value for checkbox
      options: [{ value: 'true', label: 'is_multiple' }],
      onChange: (value: any) => console.log('Selected:', value),
      width: '10%',
      gridSize: 12,
      showWhen: {
        field: 'type',
        value: 'select'
      }
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
    getDetailsErrors,
    detailsData,
    setDetailsData,
    detailsHandlers,
    openDocumentsDialog,
    closeDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/acs/contractor-types',
    routerUrl: { default: '/apps/acs/contractor-type' },
    fields: fields,
    initialDetailsData: {
      map_contractor_types: [],
      extraFields: []
    },
    detailsTablesConfig: {
      map_contractor_types: { fields: contractTypesDetailsFields, trackIndex: true },
      extraFields: { fields: extraDetailsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`contractor_types`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            detailsConfig={[
              { key: 'map_contractor_types', fields: contractTypesDetailsFields, title: 'map_contractor_types' },
              { key: 'extraFields', fields: extraDetailsFields, title: 'extra_fields' }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={contractTypesDetailsFields}
            title='map_contractor_types'
            initialData={detailsData['map_contractor_types']} // Pass the details data
            onDataChange={detailsHandlers.map_contractor_types}
            mode={mode}
            errors={getDetailsErrors('map_contractor_types')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/acs/contractor-types/${dataModel.id}/map_contractor_types`}
            detailsKey='map_contractor_types'
            locale={locale}
            rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={extraDetailsFields}
            title='extra_fields'
            initialData={detailsData['extraFields']} // Pass the details data
            onDataChange={detailsHandlers.extraFields}
            mode={mode}
            errors={getDetailsErrors('extraFields')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/acs/contractor-types/${dataModel.id}/extraFields`}
            detailsKey='extraFields'
            locale={locale}
            rowModal={true}
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

export default ContractorTypeDetails
