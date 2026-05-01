'use client'

import * as Shared from '@/shared'

const PreArrivalDataDetails = () => {
  const [selectPreArrivalEntityType, setSelectPreArrivalEntityType] = Shared.useState()
  const [selectedPortCode, setSelectedPortCode] = Shared.useState()
  const [selectedPortCityId, setSelectedPortCityId] = Shared.useState()
  const [selectedFlightDate, setSelectedFlightDate] = Shared.useState()
  const [selectedHouseId, setSelectedHouseId] = Shared.useState()

  const mainFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'files',
      label: '',
      type: 'storage',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12,
      visibleModes: ['add', 'edit']
    },

    // ═══════════════════════════════════════════════════════════════════
    // TAB 1: BASIC INFORMATION (المعلومات الأساسية)
    // Index: 1-7 (7 fields)
    // ═══════════════════════════════════════════════════════════════════
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'season',
      label: 'season',
      type: 'select',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'pai_entry_type_id',
      label: 'pai_entry_type_id',
      type: 'select',
      options: Shared.preArrivalEntryTypeList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
      //   onChange: res => {
      //     if (res.value) {
      //       setSelectPreArrivalEntityType(res.value)
      //     } else {
      //       setSelectPreArrivalEntityType(undefined)
      //     }
      //   }
    },
    {
      name: 'pai_entity_id',
      label: 'pai_entity_id',
      type: 'select',
      apiUrl: selectPreArrivalEntityType ? '/haj/provider-requests' : undefined,
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      queryParams: { type: selectPreArrivalEntityType == '1' ? [1, 2, 3] : [4] },
      viewProp: 'provider.name_ar'
    },
    {
      name: 'request_number',
      label: 'request_number',
      type: 'number',
      autoFill: true,
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'group_number',
      label: 'group_number',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'pai_no_of_pilgrims',
      label: 'pai_no_of_pilgrims',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'estimated_no_of_buses',
      label: 'estimated_no_of_buses',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  const flightInformation: Shared.DynamicFormFieldProps[] = [
    // {
    //   name: 'arrival_city',
    //   label: 'arrival_city',
    //   type: 'text',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 4,
    //   viewProp: 'fight_details.to_city.name_ar',
    //   // visibleModes: ['show', 'search']
    // },

    {
      name: 'port_id',
      label: 'port',
      type: 'select',
      apiUrl: '/def/ports',
      labelProp: 'port_name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'flight.flight_no',
      visibleModes: ['add', 'edit'],
      onChange: res => {
        if (res.object) {
          if (res?.object?.city_id) {
            setSelectedPortCityId(res?.object?.city_id)
          } else setSelectedPortCityId(undefined)
          if (res?.object?.port_code) {
            setSelectedPortCode(res?.value)
          } else setSelectedPortCode(undefined)
        }
      }
    },

    {
      name: 'port_type',
      label: 'port_type',
      type: 'select',
      options: Shared.portTypeList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'fight_details.port_type',
      visibleModes: ['show', 'search']
    },
    {
      name: 'port_name_ar',
      label: 'port_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'fight_details.port_name_ar',
      visibleModes: ['show', 'search']
    },

    {
      name: 'flight_id',
      label: 'flight_id',
      type: 'select',
      apiUrl: '/haj/flight-details',
      displayProps: ['air_trans_company_name_la', 'flight_no'],
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'flight.flight_no',
      queryParams: {
        ...(typeof selectedPortCode !== 'undefined' ? { airport_code: selectedPortCode } : {}),
        ...(typeof selectedFlightDate !== 'undefined' ? { flight_date: selectedFlightDate } : {})
      }
    },

    {
      name: 'flight_date',
      label: 'flight_date',
      type: 'date',
      showHijri: false,
      showTime: true,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'fight_details.flight_date',
      onChange: res => {
        if (res && res.date) {
          setSelectedFlightDate(res.date)
        } else {
          setSelectedFlightDate(undefined)
        }
      },
      visibleModes: ['show', 'search']
    },

    {
      name: 'flight_no',
      label: 'flight_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'fight_details.flight_no',
      visibleModes: ['show', 'search']
    },
    {
      name: 'air_transportation_name_ar',
      label: 'air_trans_company',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'fight_details.air_trans_company_name_ar',
      visibleModes: ['show', 'search']
    },

    {
      name: 'from_city',
      label: 'from_city',
      type: 'select',
      apiUrl: '/def/citites',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'fight_details.from_city.name_ar',
      visibleModes: ['show', 'search'],
      modal: 'fight_details.from_city'
    },

    {
      name: 'to_city',
      label: 'to_city',
      type: 'select',
      apiUrl: '/def/citites',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'fight_details.to_city.name_ar',
      visibleModes: ['show', 'search'],
      modal: 'fight_details.to_city'
    }
  ]

  const housingFields: Shared.DynamicFormFieldProps[] = [
    // {
    //   name: 'city_of_housing_contract',
    //   label: 'city_of_housing_contract',
    //   type: 'select',
    //   apiUrl: '/sys/list/21',
    //   labelProp: 'name_ar',
    //   keyProp: 'id',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 4,
    //   viewProp: 'house_contract.city.name_ar'
    // },

    {
      name: 'house_contract_id',
      label: 'house_contract_id',
      type: 'select',
      apiUrl: '/haj/house-contracts',
      displayProps: ['id', 'requester.name_ar'],
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      queryParams: {
        ...(typeof selectedPortCityId !== 'undefined' ? { city_id: selectedPortCityId } : {}),
        ...(typeof selectedHouseId !== 'undefined' ? { house_id: selectedHouseId } : {})
      }
      //   viewProp: 'house_contract.contract_number'
    },
    {
      name: 'house_name_ar',
      label: 'house_name_ar',
      type: 'select',
      apiUrl: '/haj/houses',
      labelProp: 'house_commercial_name_ar',
      keyProp: 'house_commercial_name_ar',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      onChange: res => {
        if (res && res.object) {
          setSelectedHouseId(res?.object?.id)
        } else {
          setSelectedHouseId(undefined)
        }
      }
      //   visibleModes: ['search', 'show']
    },

    {
      name: 'house_contract_requester',
      label: 'house_contract_requester',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      viewProp: 'house_contract.requester.name_ar',
      gridSize: 3
    },
    {
      name: 'number_of_pilgrims',
      label: 'number_of_pilgrims',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      viewProp: 'house_contract.number_of_pilgrims',
      gridSize: 3
    }
  ]

  // const transportationFields: Shared.DynamicFormFieldProps[] = [

  // ]

  const fields: Shared.DynamicFormFieldProps[] = [
    ...mainFields,
    ...flightInformation,
    ...housingFields
    // ...transportationFields
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    setOpenDocumentsDialog,
    openDocumentsDialog,
    setOpenRecordInformationDialog,
    openRecordInformationDialog,
    openRecordTrackingDialog,
    setOpenRecordTrackingDialog,
    locale,
    handleTabChange,
    handleNextTab,
    tabValue,
    tabsCount,
    validatedTabs,
    attemptedTabs,
    detailsHandlers,
    dataModel,
    closeDocumentsDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/pre-arrivals',
    routerUrl: { default: '/apps/haj/pre-arrival-data' },
    fields: fields,
    tabsCount: 4,
    excludeFields: [
      { action: 'add', fields: [] },
      { action: 'edit', fields: [] }
    ]
    //   modalRecordId: props.id,
  })

  const { setValue, getValues, watch } = formMethods

  const selectedEntityType = watch('pai_entry_type_id')
  Shared.useEffect(() => {
    // Add your effect logic here if
    // needed
    if (selectedEntityType) {
      setSelectPreArrivalEntityType(selectedEntityType)
    } else {
      setSelectPreArrivalEntityType(undefined)
    }
  }, [selectedEntityType])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'est'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'basic_information' }}
            fields={[...mainFields]}
            mode={mode}
            screenMode={mode}
          />
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'flight_information' }}
            fields={[...flightInformation]}
            mode={mode}
            screenMode={mode}
            showHeaderPrint={false}
            showTitlePrint={false}
          />
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'housingFields' }}
            fields={[...mainFields]}
            mode={mode}
            screenMode={mode}
            showHeaderPrint={false}
            showTitlePrint={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'basic_information' }}
            locale={locale}
            fields={mainFields}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'flight_information' }}
            locale={locale}
            fields={flightInformation}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'accommodation_information' }}
            locale={locale}
            fields={housingFields}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent
            headerConfig={{ title: 'transportation_information' }}
            locale={locale}
            fields={transportationFields}
            mode={mode}
            screenMode={mode}
          />
        </Shared.Grid> */}

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions
            locale={locale}
            onCancel={handleCancel}
            onSaveSuccess={onSubmit}
            mode={mode}
            tabsCount={tabsCount}
            tabValue={tabValue}
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
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default PreArrivalDataDetails
