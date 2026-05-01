'use client'

import * as Shared from '@/shared'

const NeqabaConfirmationDetails = () => {
  const [transportationCompanyId, setTransportationCompanyId] = Shared.useState()

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
      gridSize: 4,
      defaultValue: ''
    },
    {
      name: 'tdo_id',
      label: 'tdo_id_neqaba',
      type: 'select',
      apiUrl: '/haj/tafweej-deportation-orders',
      labelProp: 'company_name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      viewProp: 'spc_company.company_name_ar',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'naqaba_confirm_no',
      label: 'naqaba_confirm_no',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
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
      gridSize: 4,
      viewProp: 'transportation_company.ltc_name_ar',
      requiredModes: ['add', 'edit']
    },

    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show', 'search']
    },
    {
      name: 'reference_id',
      label: 'reference_id',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
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
      gridSize: 4
    }
  ]

  const naqabaConfirmationDetailsFields: Shared.DynamicFormTableFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'bus_id',
        label: 'bus_id',
        type: 'select',
        apiUrl: transportationCompanyId ? '/haj/buses' : undefined,
        queryParams: {
          transportation_company_id: transportationCompanyId
        },

        // labelProp: 'bi_plate_no',
        displayProps: ['bi_plate_no', 'bi_operating_card_no', 'lu_land_trans_company.ltc_name_ar'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'bus.bi_plate_no'
      },
      {
        name: 'driver_id',
        label: 'driver_id',
        type: 'select',
        apiUrl: transportationCompanyId ? '/haj/drivers' : undefined,
        queryParams: {
          transportation_company_id: transportationCompanyId
        },

        // labelProp: 'di_driver_name',
        displayProps: ['di_driver_name', 'di_naqaba_driver_id'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'driver.di_driver_name'
      }
    ],
    [transportationCompanyId]
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
    apiEndpoint: '/haj/naqaba-confirmations',
    routerUrl: { default: '/apps/haj/neqaba-confirmation' },
    fields: fields,
    initialDetailsData: {
      naqaba_confirmation_details: []
    },
    detailsTablesConfig: {
      naqaba_confirmation_details: { fields: naqabaConfirmationDetailsFields, trackIndex: true }
    }
  })

  const { watch } = formMethods
  const transportationCompany = watch('transportation_company_id')

  Shared.useEffect(() => {
    setTransportationCompanyId(transportationCompany)

    setDetailsData(prev => ({
      ...prev,
      naqaba_confirmation_details: []
    }))
  }, [transportationCompany])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`naqaba_confirmation`}
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
                key: 'naqaba_confirmation_details',
                fields: naqabaConfirmationDetailsFields,
                title: 'naqaba_confirmation_details'
              }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={naqabaConfirmationDetailsFields}
            title='naqaba_confirmation_details'
            initialData={detailsData['naqaba_confirmation_details']}
            onDataChange={detailsHandlers?.naqaba_confirmation_details}
            mode={mode}
            errors={getDetailsErrors('naqaba_confirmation_details')}
            apiEndPoint={`/haj/naqaba-confirmations/${dataModel.id}/naqaba_confirmation_details`}
            detailsKey='naqaba_confirmation_details'
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

export default NeqabaConfirmationDetails
