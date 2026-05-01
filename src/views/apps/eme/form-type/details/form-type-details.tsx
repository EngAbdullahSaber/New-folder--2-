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
    name: 'short_name',
    label: 'short_name',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'service_type_id',
    label: 'service_type_id',
    type: 'select',
    apiUrl: '/eme/service-types',
    requiredModes: ['add', 'edit'],
    displayProps: ['id', 'name'],
    labelProp: 'name',
    keyProp: 'id',
    viewProp: 'service_type.name',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'recurrence_type',
    label: 'recurrence_type',
    type: 'select',
    options: Shared.recurrenceTypeList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'order_no',
    label: 'order_no',
    type: 'number',
    requiredModes: ['add', 'edit'],
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

const formDepartmentsFields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: 'department_id',
    label: 'department',
    type: 'select',
    apiUrl: '/def/departments',
    keyProp: 'id',
    displayProps: ['id', 'department_name_ar'],
    labelProp: 'department_name_ar',
    width: '50%',
    align: 'start',
    viewProp: 'department.department_name_ar'
  },
  {
    name: 'status',
    label: 'status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6,
    width: '40%'
  }
]
const formTypeStatusFields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: 'name',
    label: 'name',
    type: 'text',
    width: '25%',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode
  },
  {
    name: 'value',
    label: 'value',
    type: 'number',
    width: '15%',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode
  },
  {
    name: 'order_no',
    label: 'order_no',
    type: 'number',
    width: '10%',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'type',
    label: 'type',
    type: 'select',
    options: Shared.formTypesList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    width: '10%'
  },
  {
    name: 'status',
    label: 'status',
    type: 'select',
    options: Shared.statusList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    width: '10%'
  },

  {
    name: 'style',
    label: 'color',
    type: 'color_picker',
    // defaultValue: '#7367f0',
    gridSize: 4,
    width: '10%'
  }
  // {
  //   name: 'icon',
  //   label: 'icon',
  //   type: 'icon_picker',
  //   // defaultValue: '#7367f0',
  //   gridSize: 4,
  //   width: '25%'
  // }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const FormTypeDetails = () => {
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
    apiEndpoint: '/eme/form-types',
    routerUrl: { default: '/apps/eme/form-type' },
    fields: fields,
    initialDetailsData: {
      form_departments: [],
      form_type_statuses: []
    },
    detailsTablesConfig: {
      form_departments: { fields: formDepartmentsFields, trackIndex: true },
      form_type_statuses: { fields: formTypeStatusFields, trackIndex: true }
    }
  })

  const ratingGroups = Shared.useMemo(
    () =>
      dataModel?.form_group_elements?.map((group: any) => ({
        ...group,
        items: group.form_checklist_elements || []
      })) || [],
    [dataModel?.form_group_elements]
  )

  const ratingColumns = Shared.useMemo(
    () =>
      dataModel?.form_type_statuses?.map((item: any) => ({
        value: item.value,
        label: item.name,
        color: item.style || Shared.generateColor(),
        id: item.id
      })) || [],
    [dataModel?.form_type_statuses]
  )

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'form_types'}
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
            fields={formDepartmentsFields}
            title='form_departments'
            initialData={detailsData['form_departments']} // Pass the details data
            onDataChange={detailsHandlers?.form_departments}
            mode={mode}
            errors={getDetailsErrors('form_departments')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/eme/form-types/${dataModel.id}/form_departments`}
            detailsKey='form_departments'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={formTypeStatusFields}
            title='form_type_statuses'
            initialData={detailsData['form_type_statuses']} // Pass the details data
            onDataChange={detailsHandlers?.form_type_statuses}
            mode={mode}
            errors={getDetailsErrors('form_type_statuses')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/eme/form-types/${dataModel.id}/form_type_statuses`}
            detailsKey='form_type_statuses'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        {/* ===== View Elements Rating Logic (Read Only) ===== */}
        {ratingGroups.length > 0 && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.DynamicGroupedRatingTable
              title='checklist_element'
              groups={ratingGroups}
              ratingColumns={ratingColumns}
              ratingType='radio'
              mode='show' // As requested: user can only view it
              detailsKey='form_checklist_elements'
              itemIdKey='id'
              itemIdKeyProp='id'
              ratingKey='value'
              ratingValueKey='value'
              initialData={[]}
              enableGroupRating={false}
              enableColors={true}
              dataObject={dataModel}
            />
          </Shared.Grid>
        )}

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

export default FormTypeDetails
