'use client'

import * as Shared from '@/shared'

const TeamJobOrderDetails = () => {
  const [selectedServiceType, setSelectedServiceType] = Shared.useState()
  const [selectedCity, setSelectedCity] = Shared.useState()
  const { userDepartments } = Shared.useSessionHandler()
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()

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
        name: 'form_type_id',
        label: 'form_type_id',
        type: 'select',
        apiUrl: '/eme/form-types',
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],

        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'form_type.name'
      },

      {
        name: 'order_date',
        label: 'order_date',
        type: 'date',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },
      {
        name: 'team_id',
        label: 'team',
        type: 'select',
        apiUrl: '/eme/teams',
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],

        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'team.name'
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
        apiMethod: 'GET',
        viewProp: 'city.name_ar'
      },
      {
        name: 'area_id',
        label: 'area',
        type: 'select',
        apiUrl: '/eme/areas',
        requiredModes: [],
        displayProps: ['id', 'name'],

        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'area.name'
      },
      {
        name: 'time_period_id',
        label: 'time_period',
        type: 'select',
        apiUrl: '/ses/time-periods',
        requiredModes: [],
        displayProps: ['id', 'period_name'],

        labelProp: 'period_name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'time_period.period_name'
      },
      {
        name: 'from_date',
        label: 'start_date',
        type: 'date',
        requiredModes: [],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },
      {
        name: 'to_date',
        label: 'end_date',
        type: 'date',
        requiredModes: [],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      // {
      //   name: 'visit_type_id',
      //   label: 'visit_type',
      //   type: 'number',
      //   requiredModes: ['add', 'edit'],
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   gridSize: 4
      // },
      {
        name: 'visit_type_id',
        label: 'visit_type',
        type: 'select',
        apiUrl: '/eme/visit-types',
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],

        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'visit_type.name'
      },
      {
        name: 'visit_reason_type_id',
        label: 'visit_reason_type',
        type: 'select',
        apiUrl: '/eme/visit-reason-types',
        requiredModes: ['add', 'edit'],
        displayProps: ['id', 'name'],

        labelProp: 'name',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'visit_reason_type.name'
      },
      {
        name: 'is_included_in_previous_work_orders',
        label: 'is_included_in_previous_work_orders',
        type: 'select',
        options: Shared.yesNoList,
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: ['add', 'edit']
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

      // {
      //   name: 'is_included_in_previous_work_orders',
      //   label: 'is_included_in_previous_work_orders',
      //   type: 'checkbox',
      //   defaultValue: 1, // Default value for checkbox
      //   options: [{ value: 1, label: 'is_included_in_previous_work_orders' }],
      //   requiredModes: ['add', 'edit'],
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   gridSize: 4
      // },

      {
        name: 'note',
        label: 'notes',
        type: 'textarea',
        requiredModes: [],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      }
    ],
    [departmentOptions]
  )

  const teamJobOrdersDFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'reference_id',
        label: 'reference',
        type: 'select',
        apiUrl: selectedServiceType && selectedCity ? '/eme/service-area-references' : undefined,
        queryParams: {
          service_type_id: selectedServiceType,
          city_id: selectedCity
        },
        keyProp: 'status',
        displayProps: ['register_no', 'reference_id', 'reference_name', 'service_type_name'],
        width: '40%',
        align: 'start'
        // searchMode: 'and'
      },

      {
        name: 'note',
        label: 'notes',
        type: 'text',
        width: '40%',
        requiredModes: ['add', 'edit'],
        hideInTable: true,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
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
    detailsData,
    dataModel,
    getDetailsErrors,
    detailsHandlers,
    setDetailsData,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/eme/team-job-orders',
    routerUrl: { default: '/apps/eme/team-job-order' },
    fields: fields,
    initialDetailsData: {
      team_job_orders_details: []
    },
    detailsTablesConfig: {
      team_job_orders_details: { fields: teamJobOrdersDFields, trackIndex: true }
    }
  })

  const { watch } = formMethods
  const serviceType = watch('service_type_id')
  const city = watch('city_id')

  Shared.useEffect(() => {
    if (city) setSelectedCity(city)
  }, [city])

  Shared.useEffect(() => {
    if (serviceType) {
      if (serviceType !== selectedServiceType) {
        setSelectedServiceType(serviceType)
        let base = []
        base = Array.from({ length: Math.max(3, 3) }, () => Shared.createDetailsRow(true, teamJobOrdersDFields))
        setDetailsData(details => {
          let update = { ...details }
          update['team_job_orders_details'] = base
          return update
        })
      }
    }
  }, [serviceType])
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'team_job_order'}
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
            fields={teamJobOrdersDFields}
            title='area_maps'
            initialData={detailsData['team_job_orders_details']} // Pass the details data
            onDataChange={detailsHandlers?.team_job_orders_details}
            mode={mode}
            errors={getDetailsErrors('team_job_orders_details')}
            apiEndPoint={`/eme/team-job-order/${dataModel.id}/team_job_orders_details`}
            detailsKey='team_job_orders_details'
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

export default TeamJobOrderDetails
