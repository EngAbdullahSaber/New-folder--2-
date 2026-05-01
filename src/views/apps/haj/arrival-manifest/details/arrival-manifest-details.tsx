// app/[lang]/(dashboard)/apps/haj/arrival-manifests/details/page.tsx
'use client'

import * as Shared from '@/shared'

const ArrivalManifestsDetails = (props?: any) => {
  const [selectedPortCode, setSelectedPortCode] = Shared.useState()
  const [selectdLandTranCompany, setSelectedLandTranCompany] = Shared.useState()
  const [selectedHouseId, setSelectedHouseId] = Shared.useState()
  const [selectedPortCityId, setSelectedPortCityId] = Shared.useState()
  const [selectedPortId, setSelectedPortId] = Shared.useState()

  const manifestInformation: Shared.DynamicFormFieldProps[] = [
    // ═══════════════════════════════════════════════════════════════════
    // Hidden/System Fields
    // ═══════════════════════════════════════════════════════════════════
    {
      name: 'files',
      label: '',
      type: 'storage',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12,
      visibleModes: ['add', 'edit']
    },

    // ═══════════════════════════════════════════════════════════════════
    // TAB 1: MANIFEST INFORMATION (معلومات الكشف)
    // Index: 1-10 (10 fields)
    // ═══════════════════════════════════════════════════════════════════
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
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
      //   viewProp: 'season.name_ar'
    },

    {
      name: 'manifest_id',
      label: 'manifest_id',
      type: 'number',
      autoFill: true,
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'manifest_type',
      label: 'manifest_type',
      type: 'select',
      options: Shared.manifestTypeList,
      selectFirstValue: false,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'manifest_trip_date',
      label: 'manifest_trip_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    // {
    //   name: 'manifest_trip_date_hij',
    //   label: 'manifest_trip_date_hij',
    //   type: 'hijri_date',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 4
    // },

    {
      name: 'manifest_spc_entity_id',
      label: 'manifest_spc_entity_id',
      type: 'select',
      apiUrl: '/haj/spc-companies',
      labelProp: 'company_name_ar',
      keyProp: 'id',
      selectFirstValue: false,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'spc_company.company_name_ar'
    },
    {
      name: 'bag_no',
      label: 'bag_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'manifest_passport_count',
      label: 'manifest_passport_count',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'am_close_date',
      label: 'am_close_date',
      type: 'date',
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    // {
    //   name: 'rec_no',
    //   label: 'rec_no',
    //   type: 'number',
    //   modeCondition: () => 'show',
    //   gridSize: 3,
    //   visibleModes: ['show']
    // },
    // {
    //   name: 'rec_d_serial_no',
    //   label: 'rec_d_serial_no',
    //   type: 'number',
    //   modeCondition: () => 'show',
    //   gridSize: 3,
    //   visibleModes: ['show']
    // },

    {
      name: 'state',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      // defaultValue: '1',
      // visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['search', 'show']
    },
    {
      name: 'reference_id',
      label: 'reference_id',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['search', 'show']
    }
  ]

  const portTransInformation: Shared.DynamicFormFieldProps[] = [
    {
      name: 'port_type',
      label: 'port_type',
      type: 'select',
      options: Shared.portTypeList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'port.port_type',
      visibleModes: ['show', 'search']
    },

    {
      name: 'manifest_prt_id',
      label: 'manifest_prt_id',
      type: 'select',
      apiUrl: '/def/ports',
      labelProp: 'port_name_ar',
      keyProp: 'id',
      selectFirstValue: false,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'port.port_name_ar',
      onChange: res => {
        if (res) {
          setSelectedPortCityId(res?.object?.city_id ?? undefined)
          console.log(selectedPortCityId)
          setSelectedPortCode(res?.object?.port_code ?? undefined)
        }
      }
    },

    {
      name: 'am_hfd_id',
      label: 'am_hfd_id',
      type: 'select',
      apiUrl: selectedPortCode ? '/haj/flight-details' : undefined,
      displayProps: ['air_trans_company_name_la', 'flight_no', 'flight_date'],
      keyProp: 'id',
      selectFirstValue: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: ['flight.air_trans_company_name_la', 'flight.flight_no', 'flight.flight_date'],
      queryParams: {
        ...(typeof selectedPortCode !== 'undefined' ? { airport_code: selectedPortCode } : {})
      }
    },

    {
      name: 'flight_no',
      label: 'flight_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'flight.flight_no',
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
    },

    {
      name: 'am_path_id',
      label: 'am_path_id',
      type: 'select',
      apiUrl: selectedPortId ? '/def/paths' : undefined,
      labelProp: 'name_ar',
      keyProp: 'id',
      selectFirstValue: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'path.name_ar',
      queryParams: {
        ...(typeof selectedPortId !== 'undefined' ? { from_prt_id: selectedPortId } : {})
      }
    },

    {
      name: 'am_route_id',
      label: 'am_route_id',
      type: 'select',
      apiUrl: selectedPortId ? '/def/routes' : undefined,
      labelProp: 'name_ar',
      keyProp: 'id',
      selectFirstValue: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'route.name_ar',
      queryParams: {
        ...(typeof selectedPortCityId !== 'undefined' ? { from_ct_id: selectedPortCityId } : {})
      }
    },

    {
      name: 'manifest_ltc_id',
      label: 'manifest_ltc_id',
      type: 'select',
      apiUrl: '/def/transportation-companies',
      labelProp: 'ltc_name_ar',
      keyProp: 'id',
      selectFirstValue: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'land_tran_company.ltc_name_ar',
      onChange: res => {
        if (res && res.value) {
          setSelectedLandTranCompany(res?.value)
        } else setSelectedLandTranCompany(undefined)
      }
    },
    {
      name: 'manifest_bi_id',
      label: 'manifest_bi_id',
      type: 'select',
      apiUrl: '/haj/buses',
      displayProps: ['bi_operating_card_no', 'bi_plate_no'],
      keyProp: 'id',
      queryParams: {
        ...(typeof selectdLandTranCompany !== 'undefined' ? { lu_land_trans_company_id: selectdLandTranCompany } : {})
      },
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: ['bus.bi_operating_card_no', 'bus.bi_plate_no']
    },
    {
      name: 'nationality_bus_id',
      label: 'nationality_bus_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      selectFirstValue: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'nationality_bus.name_ar',
      visibleModes: ['search', 'show']
    },
    {
      name: 'manifest_di_id',
      label: 'manifest_di_id',
      type: 'select',
      apiUrl: '/haj/drivers',
      displayProps: ['di_naqaba_driver_id', 'di_driver_name'],
      keyProp: 'id',
      queryParams: {
        ...(typeof selectdLandTranCompany !== 'undefined' ? { lu_land_trans_company_id: selectdLandTranCompany } : {})
      },
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'driver.di_driver_name'
    },

    {
      name: 'transportation_contract_id',
      label: 'transportation_contract_id',
      type: 'select',
      apiUrl: '/haj/transportation-contracts',
      displayProps: ['id', 'requester.name_ar'],
      keyProp: 'id',
      selectFirstValue: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: ['transportation_contract.id'],
      queryParams: {
        ...(typeof selectdLandTranCompany !== 'undefined' ? { provider_entity_id: selectdLandTranCompany } : {})
      }
    },
    {
      name: 'is_with_train',
      label: 'is_with_train',
      type: 'select',
      options: Shared.otherYesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'requester_entity_id',
      label: 'house_contract_requester',
      type: 'select',
      apiUrl: '/haj/provider-requests',
      displayProps: ['id', 'name_ar'],
      keyProp: 'id',
      selectFirstValue: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      visibleModes: ['search'],
      queryParams: {
        type: [1, 2, 3]
      }
    },


  ]

  const accommodationInformation: Shared.DynamicFormFieldProps[] = [
    {
      name: 'house_id',
      label: 'house_name_ar',
      type: 'select',
      apiUrl: '/haj/houses',
      labelProp: 'house_commercial_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      onChange: res => {
        if (res && res.object) {
          setSelectedHouseId(res?.object?.id)
        } else {
          setSelectedHouseId(undefined)
        }
      },
      viewProp: 'house.house_commercial_name_ar'
      //   visibleModes: ['search', 'show']
    },
    {
      name: 'house_contract_id',
      label: 'house_contract_id',
      type: 'select',
      apiUrl: '/haj/house-contracts',
      displayProps: ['id', 'requester.name_ar'],
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      queryParams: {
        ...(typeof selectedPortCityId !== 'undefined' ? { city_id: selectedPortCityId } : {}),
        ...(typeof selectedHouseId !== 'undefined' ? { house_id: selectedHouseId } : {})
      }
    }
  ]

  const fields: Shared.DynamicFormFieldProps[] = [
    ...manifestInformation,
    ...portTransInformation,
    ...accommodationInformation
  ]

  type ArrivalManifestFormData = Shared.InferFieldType<typeof fields>

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
    validatedTabs,
    attemptedTabs,
    detailsHandlers,
    dataModel,
    closeDocumentsDialog
  } = Shared.useRecordForm<ArrivalManifestFormData>({
    apiEndpoint: '/haj/arrival-manifests',
    routerUrl: { default: '/apps/haj/arrival-manifest' },
    fields: fields,
    tabsCount: 4,
    excludeFields: [
      { action: 'add', fields: [] },
      { action: 'edit', fields: [] }
    ],
    classifiedObjects: [
      {
        objectName: 'port',
        fields: ['port_type']
      },
      {
        objectName: 'house_contract',
        fields: ['requester_entity_id']
      }
    ]
  })

  const { setValue, getValues, watch } = formMethods
  const watchedPortId = watch('manifest_prt_id')

  Shared.useEffect(() => {
    if (watchedPortId) {
      // Port has value
      setSelectedPortId(watchedPortId)
    } else {
      // Port is empty - clear everything
      setSelectedPortId(undefined)

      // Clear dependent fields
      setValue('am_path_id', null)
      setValue('am_route_id', null)
    }
  }, [watchedPortId, setValue])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title='arrival_manifests'
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'manifest_information' }}
            fields={[...manifestInformation]}
            mode={mode}
            screenMode={mode}
          />
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'port_transportation' }}
            fields={[...portTransInformation]}
            mode={mode}
            screenMode={mode}
            showHeaderPrint={false}
            showTitlePrint={false}
          />
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'accommodation' }}
            fields={[...accommodationInformation]}
            mode={mode}
            screenMode={mode}
            showHeaderPrint={false}
            showTitlePrint={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'manifest_information' }}
            locale={locale}
            fields={manifestInformation}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'port_transportation' }}
            locale={locale}
            fields={portTransInformation}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'accommodation' }}
            locale={locale}
            fields={accommodationInformation}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
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

        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            recordInformations={recordInformations}
            open={openRecordInformationDialog}
            onClose={() => setOpenRecordInformationDialog(false)}
            locale={locale}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordTracking
            apiEndPoint='/def/user-profile'
            columns={trackingColumns}
            open={openRecordTrackingDialog}
            onClose={() => setOpenRecordTrackingDialog(false)}
            locale={locale}
          />
        </Shared.Grid> */}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default ArrivalManifestsDetails
