'use client'
import * as Shared from '@/shared'

const TemplateRequestDetails = () => {
  const [selectedDepartment, setSelectedDepartment] = Shared.useState()

  const fields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },
      {
        name: 'request_date',
        label: 'request_date',
        type: 'date',
        now: true,
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: ['add', 'edit'],
        gridSize: 6
      },
      {
        name: 'status',
        label: 'status',
        type: 'select',
        visibleModes: ['show', 'search'],
        modeCondition: (mode: Shared.Mode) => mode,
        options: Shared.templateProcessStatusList,
        gridSize: 6
      },
      {
        name: 'department_id',
        label: 'department',
        required: true,
        type: 'select',
        apiUrl: '/def/seasonal-departments',
        labelProp: 'department_name_ar',
        viewProp: 'department.department_name_ar',
        keyProp: 'department_id',
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'template_id',
        label: 'template',
        type: 'select',
        apiUrl: selectedDepartment ? '/aut/templates' : undefined,
        labelProp: 'template_name',
        queryParams: {
          user_depts: { id: selectedDepartment }
        },
        viewProp: 'template.template_name',
        keyProp: 'id',
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode,
        required: true
      }
    ],
    [selectedDepartment]
  )

  const templateRequestFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'personal_id',
        label: 'employee',
        type: 'select',
        queryParams: {
          appointed_department_id: selectedDepartment,
          is_appointed: '1'
        },
        apiUrl: selectedDepartment ? '/ses/requests-status' : undefined,
        labelProp: 'name_ar',
        keyProp: 'id',
        viewProp: 'personal.full_name_ar',

        modeCondition: (mode: Shared.Mode) => mode,
        //lovKeyName: 'id',
        gridSize: 4,
        searchProps: ['id_no', 'full_name_ar', 'id']
      }
      // {
      //   name: 'process_status',
      //   label: 'status',
      //   type: 'select',
      //   options: Shared.processStatusList,
      //   requiredModes: ['add', 'edit'],
      //   gridSize: 4,
      //   width: '40%',
      //   mode: 'show'
      // }
    ],
    [selectedDepartment]
  )

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    detailsData,
    detailsHandlers,
    getDetailsErrors,
    setDetailsData,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm({
    apiEndpoint: '/aut/template-requests',
    routerUrl: { default: '/apps/aut/template-request' },
    fields: fields,

    initialDetailsData: {
      template_request_details: []
    },
    detailsTablesConfig: {
      template_request_details: { fields: templateRequestFields, trackIndex: true }
    }
  })

  const { watch } = formMethods
  const department = watch('department_id')

  Shared.useEffect(() => {
    if (department) setSelectedDepartment(department)
    if (department !== selectedDepartment)
      setDetailsData(prev => ({
        ...prev,
        template_request_details: []
      }))
  }, [department])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'requests'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent dataObject={dataModel} locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={templateRequestFields}
            title='template_requests'
            initialData={detailsData['template_request_details']}
            onDataChange={detailsHandlers?.template_request_details}
            mode={mode}
            errors={getDetailsErrors('template_request_details')}
            apiEndPoint={`/aut/template-requests/${dataModel.id}/template_request_details`}
            detailsKey='template_request_details'
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

export default TemplateRequestDetails
