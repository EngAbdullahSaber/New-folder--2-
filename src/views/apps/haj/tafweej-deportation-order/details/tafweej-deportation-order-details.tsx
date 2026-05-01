'use client'

import * as Shared from '@/shared'

const TafweejDeportationOrderDetails = () => {
  const [selectedSpc, setSelectedSpc] = Shared.useState()
  const [selectedTdoType, setSelectedTdoType] = Shared.useState()
  // Define the fields with validation and default values
  const fields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: mode => (mode !== 'add' ? 4 : 3)
      },
      {
        name: 'season',
        label: 'season',
        type: 'select',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: mode => (mode !== 'add' ? 4 : 3),
        defaultValue: ''
      },
      {
        name: 'tdo_id',
        label: 'tdo_id',
        autoFill: true,
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: mode => (mode !== 'add' ? 4 : 3)
      },
      {
        name: 'tdo_type',
        label: 'tdo_type',
        type: 'select',
        options: Shared.tdoTypeList,
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: ['add'],
        gridSize: 3,
        visibleModes: ['add']
      },
      {
        name: 'tdo_spc_id',
        label: 'tdo_spc_id',
        type: 'select',
        apiUrl: '/haj/spc-companies',
        labelProp: 'company_name_ar',
        keyProp: 'id',
        requiredModes: ['add', 'edit'],
        viewProp: 'spc_company.company_name_ar',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },
      {
        name: 'tdo_service_group_id',
        label: 'tdo_service_group_id',
        type: 'select',
        apiUrl: selectedSpc ? '/def/service-centers' : undefined,
        queryParams: {
          spc_id: selectedSpc
        },
        labelProp: 'name_ar',
        keyProp: 'id',
        requiredModes: ['add', 'edit'],
        viewProp: 'service_group.name_ar',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },
      {
        name: 'path_id',
        label: 'path_id',
        type: 'select',
        apiUrl: '/def/paths',
        labelProp: 'name_ar',
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        viewProp: 'path.name_ar',
        requiredModes: ['add', 'edit']
      },

      {
        name: 'transportation_company_id',
        label: 'transportation_company_id',
        type: 'select',
        apiUrl: '/def/transportation-companies',
        labelProp: 'ltc_name_ar',

        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        viewProp: 'transportation_company.ltc_name_ar',
        requiredModes: ['add', 'edit']
      },

      {
        name: 'tdo_no_of_adult',
        label: 'tdo_no_of_adult',
        type: 'number',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },
      {
        name: 'tdo_no_of_child',
        label: 'tdo_no_of_child',
        type: 'number',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },
      {
        name: 'tdo_no_of_infant',
        label: 'tdo_no_of_infant',
        type: 'number',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },
      {
        name: 'tdo_total_passports',
        label: 'tdo_total_passports',
        type: 'number',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },

      {
        name: 'tdo_deportation_date',
        label: 'tdo_deportation_date',
        type: 'date_time',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },

      {
        name: 'data_source',
        label: 'data_source',
        type: 'select',
        options: Shared.dataSourceList,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3,
        visibleModes: ['show', 'search']
      },
      {
        name: 'reference_id',
        label: 'reference_id',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3,
        visibleModes: ['show', 'search']
      },
      {
        name: 'state',
        label: 'status',
        type: 'select',
        options: Shared.statusList,
        requiredModes: ['add', 'edit'],
        defaultValue: '1',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      }
    ],
    [selectedSpc]
  )

  const flightTripsFields: Shared.DynamicFormTableFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'transportation_contract_id',
        label: 'transportation_contract_id',
        type: 'select',
        apiUrl: selectedSpc ? '/haj/transportation-contracts' : undefined,
        queryParams: {
          spc_id: selectedSpc
        },
        displayProps: ['id', 'provider.name_ar'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: ['transportation_contract.id', 'transportation_contract.provider.name_ar'],
        searchProps: ['id', 'provider.name_ar']
      },
      {
        name: 'hajj_flight_id',
        label: 'hajj_flight_id',
        type: 'select',
        apiUrl: selectedSpc ? '/haj/flight-details' : undefined,
        queryParams: {
          spc_id: selectedSpc
        },
        displayProps: [
          'air_trans_company_name_la',
          'id',
          'flight_no',
          'from_city.name_ar',
          'to_city.name_ar',
          'flight_date'
        ],
        searchProps: [
          'air_trans_company_name_la',
          'id',
          'flight_no',
          'from_city.name_ar',
          'to_city.name_ar',
          'flight_date'
        ],
        keyProp: 'id',
        viewProp: [
          'hajj_flight.air_trans_company_name_la',
          'hajj_flight.id',
          'hajj_flight.flight_no',
          'hajj_flight.from_city.name_ar',
          'hajj_flight.to_city.name_ar',
          'hajj_flight.flight_date'
        ],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
        // cache: false,
      }
    ],
    [selectedSpc]
  )

  const clearencesFields: Shared.DynamicFormTableFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'transportation_contract_id',
        label: 'transportation_contract_id',
        type: 'select',
        apiUrl: selectedSpc ? '/haj/transportation-contracts' : undefined,
        displayProps: ['id', 'provider.name_ar'],
        queryParams: {
          spc_id: selectedSpc
        },
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: ['transportation_contract.id', 'transportation_contract.provider.name_ar'],
        searchProps: ['id', 'provider.name_ar']
      },
      {
        name: 'house_contract',
        label: 'house_contract_id',
        type: 'select',
        apiUrl: selectedSpc ? '/haj/house-contracts' : undefined,
        queryParams: {
          spc_id: selectedSpc
        },
        displayProps: ['id', 'requester.name_ar', 'house.house_commercial_name_ar'],
        searchProps: ['id', 'requester.name_ar', 'house.house_commercial_name_ar'],

        viewProp: [
          'house_contract.id',
          'house_contract.requester.name_ar',
          'house_contract.house.house_commercial_name_ar'
        ],
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        onChange: (value, rowIndex, object) => {
          console.log('value', object)

          updateHouseContractDetails(object, rowIndex!)
        }

        //   viewProp: 'house_contract.contract_number'
      }
    ],
    [selectedSpc]
  )

  type dataModelFormData = Shared.InferFieldType<typeof fields>
  const excludedNames = ['tdo_type']
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
    updateDetailsData,
    setDetailsData,
    detailsData,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/tafweej-deportation-orders',
    routerUrl: { default: '/apps/haj/tafweej-deportation-order' },
    excludeFields: [
      {
        action: '*',
        fields: fields.filter(f => excludedNames.includes(f.name))
      }
    ],
    fields: fields,
    initialDetailsData: {
      tafweej_order_details: []
    },
    detailsTablesConfig: {
      tafweej_order_details: {
        fields: String(selectedTdoType) === '1' ? flightTripsFields : clearencesFields,
        trackIndex: true
      }
    }
  })
  const { setValue, watch } = formMethods

  const spc = watch('tdo_spc_id')
  const tdoType = watch('tdo_type')

  const updateHouseContractDetails = (object: any, rowIndex: number) => {
    updateDetailsData(
      'tafweej_order_details',
      {
        ...detailsData.tafweej_order_details[rowIndex],
        house_id: object?.house_id,
        house_contract: object?.id,
        rowChanged: true
      },
      rowIndex
    )
  }
  Shared.useEffect(() => {
    setSelectedSpc(spc)
    setDetailsData(prev => ({
      ...prev,
      tafweej_order_details: []
    }))
  }, [spc])

  Shared.useEffect(() => {
    if (mode === 'edit' || mode === 'show') {
      if (detailsData?.tafweej_order_details[0]?.hajj_flight_id) {
        setValue('tdo_type', 1)
      } else {
        setValue('tdo_type', 2)
      }
    }
  }, [mode])

  Shared.useEffect(() => {
    setSelectedTdoType(tdoType)
    setDetailsData(prev => ({
      ...prev,
      tafweej_order_details: []
    }))
  }, [tdoType])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`tafweej_deportation_order`}
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
              {
                key: 'handover_sender_units',
                fields: String(selectedTdoType) === '1' ? flightTripsFields : clearencesFields,
                title: 'handover_sender_units'
              }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>
        {selectedTdoType && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.DynamicFormTable
              fields={String(selectedTdoType) === '1' ? flightTripsFields : clearencesFields}
              title={String(selectedTdoType) === '1' ? 'flight_trips' : 'clearances'}
              initialData={detailsData['tafweej_order_details']} // Pass the details data
              onDataChange={detailsHandlers?.tafweej_order_details}
              mode={mode}
              errors={getDetailsErrors('tafweej_order_details')}
              apiEndPoint={`/haj/tafweej-deportation-orders/${dataModel.id}/tafweej_order_details`}
              detailsKey='tafweej_order_details'
              locale={locale}
              // rowModal={true}
              dataObject={dataModel}
            />
          </Shared.Grid>
        )}

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

export default TafweejDeportationOrderDetails
