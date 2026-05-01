'use client'

import * as Shared from '@/shared'

const AreaDetails = () => {
  const { user } = Shared.useSessionHandler()
  const { shouldBlockAccess, AccessBlockedScreen, locale } = Shared.useCityAccess()
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
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
      name: 'city_id',
      label: 'city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      requiredModes: ['add', 'edit'],
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      viewProp: 'city.name_ar',
      apiMethod: 'GET'
    },

    {
      name: 'service_type_id',
      label: 'service_type_id',
      type: 'select',
      apiUrl: '/eme/service-types',
      displayProps: ['id', 'name'],
      requiredModes: ['add', 'edit'],
      labelProp: 'name',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      viewProp: 'service_type.name'
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
      name: 'description',
      label: 'description',
      type: 'textarea',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>
  const [selectedServiceType, setSelectedServiceType] = Shared.useState()
  const [selectedCity, setSelectedCity] = Shared.useState()

  const areaMapsFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
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

        keyProp: 'reference_id',
        labelProp: 'reference_name',
        displayProps: ['register_no', 'reference_id', 'reference_name', 'service_type_name'],
        width: '50%',
        align: 'start'
        // searchMode: 'and'
      },
      {
        name: 'status',
        label: 'status',
        type: 'select',
        options: Shared.statusList,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        width: '40%'
      }
    ],
    [selectedServiceType]
  )

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    setDetailsData,
    getDetailsErrors,
    dataModel,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/eme/areas',
    routerUrl: { default: '/apps/eme/area' },
    fields: fields,
    initialDetailsData: {
      area_maps: []
    },
    detailsTablesConfig: {
      area_maps: { fields: areaMapsFields, trackIndex: true }
    }
  })

  const { watch } = formMethods
  const serviceType = watch('service_type_id')
  const city = watch('city_id')

  Shared.useEffect(() => {
    if (serviceType) {
      if (serviceType !== selectedServiceType) {
        setSelectedServiceType(serviceType)
        let base = []
        base = Array.from({ length: Math.max(3, 3) }, () => Shared.createDetailsRow(true, areaMapsFields))
        setDetailsData(details => {
          let update = { ...details }
          update['area_maps'] = base
          return update
        })
      }
    }
  }, [serviceType])

  Shared.useEffect(() => {
    if (city) {
      if (city !== selectedCity) {
        setSelectedCity(city)
        let base = []
        base = Array.from({ length: Math.max(3, 3) }, () => Shared.createDetailsRow(true, areaMapsFields))
        setDetailsData(details => {
          let update = { ...details }
          update['area_maps'] = base
          return update
        })
      }
    }
  }, [city])
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'area'}
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
            fields={areaMapsFields}
            title='area_maps'
            initialData={detailsData['area_maps']} // Pass the details data
            onDataChange={detailsHandlers?.area_maps}
            mode={mode}
            errors={getDetailsErrors('area_maps')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/eme/areas/${dataModel.id}/area_maps`}
            detailsKey='area_maps'
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

export default AreaDetails
