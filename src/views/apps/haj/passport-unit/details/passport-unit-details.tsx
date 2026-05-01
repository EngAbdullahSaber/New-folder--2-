'use client'

import * as Shared from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'

const PassportUnitDetails = ({ scope }: ComponentGeneralProps) => {
  const [selectedDepartment, setSelectedDepartment] = Shared.useState()

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
      type: 'select',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'passport_unit_type_id',
      label: 'passport_unit_type_id',
      type: 'select',
      apiUrl: '/haj/passport-unit-types',
      labelProp: 'name_ar',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (scope === 'department' ? 'show' : mode),
      keyProp: 'id',
      gridSize: 4,
      viewProp: 'passport_unit_type.name_ar'
    },
    {
      name: 'seasonal_department_id',
      label: 'seasonal_department',
      type: 'select',
      apiUrl: '/def/seasonal-departments',
      labelProp: 'department_name_ar',
      viewProp: 'seasonal_department.department_name_ar',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (scope === 'department' ? 'show' : mode),
      keyProp: 'id',
      gridSize: 4
    },

    {
      name: 'passport_units_name_ar',
      label: 'passport_unit_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (scope === 'department' ? 'show' : mode),
      gridSize: 4
    },
    {
      name: 'passport_units_name_la',
      label: 'passport_unit_name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (scope === 'department' ? 'show' : mode),
      gridSize: 4
    },
    {
      name: 'short_name_ar',
      label: 'short_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (scope === 'department' ? 'show' : mode),
      gridSize: 4
    },
    {
      name: 'short_name_la',
      label: 'short_name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (scope === 'department' ? 'show' : mode),
      gridSize: 4
    },

    {
      name: 'order_no',
      label: 'order_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => (scope === 'department' ? 'show' : mode),
      requiredModes: ['add', 'edit'],
      gridSize: 4
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      defaultValue: '1',
      modeCondition: (mode: Shared.Mode) => (scope === 'department' ? 'show' : mode),
      gridSize: 4
    }
  ]

  const userPassportUnitFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'user_id',
        label: 'user_name',
        type: 'select',
        queryParams: {
          user_depts: { id: selectedDepartment }
        },
        apiUrl: selectedDepartment ? '/aut/users' : undefined,
        labelProp: 'id',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        displayProps: ['id', 'personal.id_no', 'personal.full_name_ar'],
        gridSize: 4,
        cache: false,
        width: '75%',
        viewProp: 'user.personal.full_name_ar'
      },
      {
        name: 'default_unit',
        label: 'default_unit',
        type: 'checkbox',
        // required: true,
        width: '10%',
        options: [{ label: 'default_unit', value: '1' }]
      }
    ],
    [selectedDepartment]
  )

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
    apiEndpoint: '/haj/passport-units',
    routerUrl: { default: `/apps/haj/passport-unit/${scope}` },
    fields: fields,
    initialDetailsData: {
      user_passport_units: []
    },
    detailsTablesConfig: {
      user_passport_units: { fields: userPassportUnitFields, trackIndex: true }
    }
  })

  const { watch } = formMethods
  const department = watch('seasonal_department_id')

  Shared.useEffect(() => {
    if (department) setSelectedDepartment(department)
  }, [department])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`passport_units`}
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
            detailsConfig={[
              { key: 'user_passport_units', fields: userPassportUnitFields, title: 'user_passport_units' }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={userPassportUnitFields}
            title='user_passport_units'
            initialData={detailsData['user_passport_units']} // Pass the details data
            onDataChange={detailsHandlers?.user_passport_units}
            mode={mode}
            errors={getDetailsErrors('user_passport_units')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/haj/passport-units/${dataModel.id}/user_passport_units`}
            detailsKey='user_passport_units'
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

export default PassportUnitDetails
