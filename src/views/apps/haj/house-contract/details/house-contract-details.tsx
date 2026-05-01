'use client'

import * as Shared from '@/shared'

const HouseContractDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    // -- Contract Header --
    {
      name: 'season',
      label: 'season',
      type: 'number',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'city_id',
      label: 'city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'city.name_ar'
    },

    {
      name: 'provider_entity_id',
      label: 'house_contract_provider',
      type: 'select',
      apiUrl: '/haj/provider-requests',
      labelProp: 'house_commercial_name_ar',
      keyProp: 'id',
      lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'provider.name_ar',
      queryParams: { type: [4, 5] },
      displayProps: ['name_ar', 'type_name'],
      requiredModes: ['add', 'edit'],
      searchProps: ['name_ar']
      // searchMode: 'and'
    },
    // {
    //   name: 'house_id',
    //   label: 'house',
    //   type: 'select',
    //   apiUrl: '/haj/houses',
    //   labelProp: 'house_commercial_name_ar',
    //   keyProp: 'id',
    //   lovKeyName: 'id',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 4,
    //   viewProp: 'house.house_commercial_name_ar'
    // },
    // -- House Basic Information --

    {
      name: 'requester_entity_id',
      label: 'house_contract_requester',
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
      label: 'est',
      type: 'select',
      apiUrl: '/haj/spc-companies',
      labelProp: 'company_name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'spc_name_ar'
    },

    // -- Contract Execution & Financials --
    {
      name: 'contract_start_date',
      label: 'start_date',
      type: 'date',
      showTime: true,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'contract_end_date',
      label: 'end_date',
      type: 'date',
      showTime: true,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    // -- Capacity & Pilgrims --
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
      label: 'price',
      type: 'amount',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'amount_inc_vat',
      label: 'amount_inc_vat',
      type: 'amount',
      requiredModes: ['add', 'edit'],
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
      name: 'is_food_service_included',
      label: 'is_food_service_included',
      type: 'select',
      options: Shared.otherYesNoList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    // -- Audit Row --
    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      requiredModes: [],
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'reference_id',
      label: 'reference_id',
      type: 'text',
      requiredModes: [],
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,

    dataModel,
    closeDocumentsDialog,
    openDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/house-contracts',
    routerUrl: { default: '/apps/haj/house-contract' },
    fields: fields
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'house_contract'}
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

export default HouseContractDetails
