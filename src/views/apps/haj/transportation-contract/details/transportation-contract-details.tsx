// app/[lang]/(dashboard)/apps/haj/transportation-contracts/details/page.tsx
'use client'

import * as Shared from '@/shared'

const TransportationContractDetails = (props?: any) => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
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

    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'season',
      label: 'season',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'city_id',
      label: 'city_id',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      selectFirstValue: false,
      // requiredModes: ['add','edit' ],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'city.name_ar'
    },

    // {
    //   name: 'state',
    //   label: 'status',
    //   type: 'select',
    //   options: Shared.statusList,
    //   requiredModes: ['add', 'edit'],
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 4
    // },

    {
      name: 'provider_entity_id',
      label: 'transportation_contract_provider',
      type: 'select',
      apiUrl: '/haj/provider-requests',
      labelProp: 'house_commercial_name_ar',
      keyProp: 'id',
      lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'provider.name_ar',
      queryParams: { type: [7] },
      displayProps: ['name_ar', 'type_name'],
      requiredModes: ['add', 'edit']
    },

    {
      name: 'requester_entity_id',
      label: 'transportation_contract_requester',
      type: 'select',
      apiUrl: '/haj/provider-requests',
      labelProp: '',
      keyProp: 'id',
      lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'requester.name_ar',
      queryParams: { type: [1, 2, 3] },
      displayProps: ['name_ar', 'type_name'],
      requiredModes: ['add', 'edit']
    },

    {
      name: 'spc_id',
      label: 'spc_id',
      type: 'select',
      apiUrl: '/haj/spc-companies',
      labelProp: 'company_name_ar',
      keyProp: 'id',
      selectFirstValue: false,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'spc.company_name_ar'
    },

    {
      name: 'contract_start_date',
      label: 'contract_start_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'contract_end_date',
      label: 'contract_end_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'number_of_pilgrims',
      label: 'number_of_pilgrims',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'amount',
      label: 'amount',
      type: 'amount',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'vat_value',
      label: 'vat_value',
      type: 'amount',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'amount_inc_vat',
      label: 'amount_inc_vat',
      type: 'amount',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'contract_sub_type',
      label: 'contract_sub_type',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'tic_id',
      label: 'tic_id',
      type: 'number',
      modeCondition: () => 'show',
      gridSize: 4,
      visibleModes: ['show']
    },
    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show']
    },
    {
      name: 'reference_id',
      label: 'reference_id',
      type: 'number',
      modeCondition: () => 'show',
      gridSize: 4,
      visibleModes: ['show']
    }
  ]

  const detailsField: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'camp_id',
      label: 'camp_no',
      type: 'select',
      apiUrl: '/haj/camps',
      labelProp: 'id',
      keyProp: 'id',
      align: 'start',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'no_of_pilgrims',
      label: 'no_of_pilgrims',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '30%',
      gridSize: 4
    }
  ]

  const routeDetailsField: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'route_id',
      label: 'route_id',
      type: 'select',
      apiUrl: '/def/routes',
      labelProp: 'name_ar',
      keyProp: 'id',
      align: 'start',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      width: '70%',
      viewProp: 'route.name_ar'
    }
  ]

  type TransportationContractFormData = Shared.InferFieldType<typeof fields>

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

    handleTabChange,
    handleNextTab,
    tabValue,
    tabsCount,
    validatedTabs,
    attemptedTabs,
    detailsHandlers,
    dataModel,
    closeDocumentsDialog,
    detailsData,
    getDetailsErrors,
    closeRecordInformationDialog
  } = Shared.useRecordForm<TransportationContractFormData>({
    apiEndpoint: '/haj/transportation-contracts',
    routerUrl: { default: '/apps/haj/transportation-contract' },
    fields: fields,
    tabsCount: 3,
    excludeFields: [
      { action: 'add', fields: [] },
      { action: 'edit', fields: [] }
    ],
    initialDetailsData: {
      transportation_contract_camps: [],
      transportation_contract_routes: []
    },
    detailsTablesConfig: {
      transportation_contract_camps: { fields: detailsField, trackIndex: true },
      transportation_contract_routes: { fields: routeDetailsField, trackIndex: true }
    }
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title='transportation_contracts'
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={routeDetailsField}
            title='routes'
            initialData={detailsData['transportation_contract_routes']} // Pass the details data
            onDataChange={detailsHandlers?.transportation_contract_routes}
            mode={mode}
            errors={getDetailsErrors('transportation_contract_routes')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/haj/camps/${dataModel.id}/transportation_contract_routes`}
            detailsKey='transportation_contract_routes'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={detailsField}
            title='transportation_contract_camp'
            initialData={detailsData['transportation_contract_camps']} // Pass the details data
            onDataChange={detailsHandlers?.transportation_contract_camps}
            mode={mode}
            errors={getDetailsErrors('transportation_contract_camps')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/haj/camps/${dataModel.id}/transportation_contract_camps`}
            detailsKey='transportation_contract_camps'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} tabsCount={tabsCount} tabValue={tabValue} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FileUploadWithTabs
            open={openDocumentsDialog}
            onClose={() => closeDocumentsDialog()}
            locale={locale}
            attachments={dataModel?.attachments}
            recordId={dataModel?.id}
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

        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            recordInformations={[]}
            open={openRecordInformationDialog}
            onClose={() => setOpenRecordInformationDialog(false)}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordTracking
            apiEndPoint='/haj/transportation-contracts'
            columns={[]}
            open={openRecordTrackingDialog}
            onClose={() => setOpenRecordTrackingDialog(false)}
            locale={locale}
          />
        </Shared.Grid> */}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default TransportationContractDetails
