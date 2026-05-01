'use client'

import * as Shared from '@/shared'

const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'season',
    label: 'season',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'name',
    label: 'name',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'form_type_id',
    label: 'form_type_id',
    type: 'select',
    apiUrl: '/eme/form-types',
    requiredModes: ['add', 'edit'],
    displayProps: ['id', 'name'],
    labelProp: 'name',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => {
      if (mode == 'edit') return 'show'
      else return mode
    },
    gridSize: 6,
    viewProp: 'form_type.name'
  },
  {
    name: 'order_no',
    label: 'order_no',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'status',
    label: 'status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  }
]

const formChecklistElementsFields: Shared.DynamicFormTableFieldProps[] = [
  {
    // name: 'CHECKLIST_ELEMENT_ID',
    name: 'checklist_element_id',
    label: 'checklist_element',
    type: 'select',
    apiUrl: '/eme/checklist-elements',

    keyProp: 'id',
    labelProp: 'name',
    displayProps: ['id', 'name', 'order_no'],
    width: '35%',
    align: 'start',
    viewProp: 'checklist_element.name',
    searchProps: ['id', 'name', 'order_no']
  },

  {
    name: 'order_no',
    label: 'order_no',
    type: 'number',
    width: '25%',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'priority_level',
    label: 'priority_level',
    type: 'select',
    options: Shared.formElementPriorityList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4,
    width: '15%'
  },
  {
    name: 'status',
    label: 'status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4,
    width: '15%'
  }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const FormGroupElementDetails = () => {
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    getDetailsErrors,
    locale,
    dataModel,
    closeDocumentsDialog,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/eme/form-group-elements',
    routerUrl: { default: '/apps/eme/form-group-element' },
    fields: fields,
    initialDetailsData: {
      form_checklist_elements: []
    },
    detailsTablesConfig: {
      form_checklist_elements: { fields: formChecklistElementsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'form_group_elements'}
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
          <Shared.DynamicFormTable
            fields={formChecklistElementsFields}
            title='form_checklist_elements'
            initialData={detailsData['form_checklist_elements']} // Pass the details data
            onDataChange={detailsHandlers?.form_checklist_elements}
            mode={mode}
            errors={getDetailsErrors('form_checklist_elements')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/eme/form-group-elements/${dataModel.id}/form_checklist_elements`}
            detailsKey='form_checklist_elements'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
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

export default FormGroupElementDetails
