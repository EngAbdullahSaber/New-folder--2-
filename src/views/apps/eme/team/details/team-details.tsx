'use client'

import * as Shared from '@/shared'

const teamAssignementFormsFields: Shared.DynamicFormTableFieldProps[] = []

const TeamDetails = () => {
  const { personal, status, user, accessToken, userDepartments } = Shared.useSessionHandler()
  const [selectedDepartment, setSelectedDepartment] = Shared.useState()
  const [selectedServiceType, setSelectedServiceType] = Shared.useState()
  const { shouldBlockAccess, AccessBlockedScreen, locale } = Shared.useCityAccess()

  const departmentOptions = Shared.useMemo(() => {
    return Shared.filterAndMap(userDepartments || [], [], (item: any) => ({
      label: item?.department_name_ar,
      value: item?.id,
      color: 'info'
    }))
  }, [userDepartments])

  const fields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
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
        requiredModes: [],
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
        name: 'team_type_id',
        label: 'team_type',
        type: 'select',
        apiUrl: '/eme/team-types',
        requiredModes: [],
        displayProps: ['id', 'name'],
        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'team_type.name'
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
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'service_type.name'
      },

      {
        name: 'department_id',
        label: 'department',
        type: 'select',
        options: departmentOptions,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'department.department_name_ar'
      },

      {
        name: 'city_id',
        label: 'city',
        type: 'select',
        options: Shared.toOptions(user?.user_cities, locale as string),

        defaultValue: user?.context?.city_id,
        requiredModes: ['add', 'edit'],
        labelProp: 'name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'city.name_ar',
        apiMethod: 'GET'
      },

      {
        name: 'order_no',
        label: 'order_no',
        type: 'number',
        requiredModes: [],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      }
    ],
    [departmentOptions]
  )

  const teamMembersFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'personal_id',
        label: 'personal_id',
        type: 'select',
        queryParams: {
          user_depts: { id: selectedDepartment }
        },
        apiUrl: selectedDepartment ? '/aut/users' : undefined,
        labelProp: 'id',
        keyProp: 'personal_id',
        modeCondition: (mode: Shared.Mode) => mode,
        displayProps: ['personal.id_no', 'personal.full_name_ar'],
        gridSize: 4,
        cache: false,
        width: '25%',
        viewProp: 'personal.full_name_ar',
        searchProps: ['personal.id_no']
        // searchMode: 'and'
      },

      {
        name: 'time_period_id',
        label: 'time_period',
        type: 'select',
        apiUrl: '/ses/time-periods',
        requiredModes: [],
        displayProps: ['id', 'period_name'],

        labelProp: 'period_name',
        width: '20%',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'time_period.period_name'
      },
      {
        name: 'job_title_id',
        label: 'occupation_title',
        type: 'select',
        apiUrl: '/eme/job-titles',
        requiredModes: [],
        displayProps: ['id', 'name'],
        labelProp: 'name',
        width: '20%',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'job_title.name'
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
        name: 'status',
        label: 'status',
        type: 'select',
        options: Shared.statusList,
        requiredModes: ['add', 'edit'],
        width: '10%',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },
      {
        name: 'description',
        label: 'description',
        type: 'text',
        width: '20%',
        requiredModes: ['add', 'edit'],
        hideInTable: true,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      }
    ],
    [selectedDepartment]
  )
  const teamAssignementFormsFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'form_type_id',
        label: 'form_type_id',
        type: 'select',
        apiUrl: selectedServiceType ? '/eme/form-types' : undefined,
        queryParams: {
          service_type_id: selectedServiceType
        },
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],

        labelProp: 'name',
        width: '30%',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'form_type.name'
      },
      {
        name: 'area_id',
        label: 'area',
        type: 'select',
        apiUrl: '/eme/areas',
        requiredModes: [],
        displayProps: ['id', 'name'],
        labelProp: 'name',
        width: '30%',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'area.name'
      },
      {
        name: 'status',
        label: 'status',
        type: 'select',
        options: Shared.statusList,
        requiredModes: ['add', 'edit'],
        width: '25%',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      }
    ],
    [selectedServiceType]
  )

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,

    dataModel,
    getDetailsErrors,
    detailsData,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/eme/teams',
    routerUrl: { default: '/apps/eme/team' },
    fields: fields,

    initialDetailsData: {
      team_members: [],
      team_assignment_forms: []
    },
    detailsTablesConfig: {
      team_members: { fields: teamMembersFields, trackIndex: true },
      team_assignment_forms: { fields: teamAssignementFormsFields, trackIndex: true }
    }
  })

  const { watch } = formMethods
  const department = watch('department_id')
  const serviceType = watch('service_type_id')

  Shared.useEffect(() => {
    if (serviceType) setSelectedServiceType(serviceType)
  }, [serviceType])

  Shared.useEffect(() => {
    if (department) setSelectedDepartment(department)
  }, [department])
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'team'}
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
            fields={teamMembersFields}
            title='team_members'
            initialData={detailsData['team_members']} // Pass the details data
            onDataChange={detailsHandlers?.team_members}
            mode={mode}
            errors={getDetailsErrors('team_members')}
            apiEndPoint={`/eme/teams/${dataModel.id}/team_members`}
            detailsKey='team_members'
            locale={locale}
            rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={teamAssignementFormsFields}
            title='team_assignment_forms'
            initialData={detailsData['team_assignment_forms']} // Pass the details data
            onDataChange={detailsHandlers?.team_assignment_forms}
            mode={mode}
            errors={getDetailsErrors('team_assignment_forms')}
            apiEndPoint={`/eme/teams/${dataModel.id}/team_assignment_forms`}
            detailsKey='team_assignment_forms'
            locale={locale}
            rowModal={false}
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

export default TeamDetails
