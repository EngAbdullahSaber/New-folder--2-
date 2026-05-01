'use client'

import * as Shared from '@/shared'

const FoodContractDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      visibleModes: ['add', 'edit', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'season',
      label: 'season',
      type: 'number',
      visibleModes: ['add', 'edit', 'show'],
      requiredModes: ['add', 'edit'],
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

    // -- Parties --
    {
      name: 'provider_entity_id',
      label: 'food_contract_provider',
      type: 'select',
      apiUrl: '/haj/provider-requests',
      labelProp: 'house_commercial_name_ar',
      keyProp: 'id',
      lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'provider.name_ar',
      queryParams: { type: [6] },
      displayProps: ['name_ar', 'type_name'],
      requiredModes: ['add', 'edit']
    },

    {
      name: 'requester_entity_id',
      label: 'food_contract_requester',
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
      name: 'contract_sub_type',
      label: 'contract_sub_type',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    // -- Dates --
    {
      name: 'contract_start_date',
      label: 'start_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'contract_end_date',
      label: 'exp_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    // -- Financials & Capacity --
    {
      name: 'number_of_pilgrims',
      label: 'number_of_pilgrims',
      type: 'amount',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      showCurrency: false
    },
    {
      name: 'amount',
      label: 'contract_amount',
      type: 'amount',
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
    // {
    //   name: 'status',
    //   label: 'status',
    //   type: 'select',
    //   options: Shared.statusList,
    //   requiredModes: ['add', 'edit'],
    //   defaultValue: '1',
    //   visibleModes: ['search', 'show'],
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 4
    // }
  ]

  const campFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'camp_id',
      label: 'camp_no',
      type: 'select',
      apiUrl: '/haj/camps',
      labelProp: 'id',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      onChange: res => {
        if (res && res.object) {
          setValue('camp_zone_id', res.object['mena_camp_zone_id'])
          setValue('camp_square_name', res.object['mena_camp_square_name_ar'])
          setValue('camp_gate_no', res.object['mena_camp_gate_no'])
          setValue('camp_street_no', res.object['mena_camp_street_no'])
        }
      }
    },

    {
      name: 'is_mashaer',
      label: 'is_mashaer',
      type: 'select',
      options: Shared.otherYesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'camp_zone_id',
      label: 'mena_camp_zone_id',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => {
        if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 6
    },

    {
      name: 'camp_square_name',
      label: 'ad_camp_square_no_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => {
        if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 6
    },

    {
      name: 'camp_gate_no',
      label: 'ad_camp_gate_no',
      type: 'select',
      modeCondition: (mode: Shared.Mode) => {
        if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 6
    },

    {
      name: 'camp_street_no',
      label: 'ad_camp_street_no',
      type: 'select',
      modeCondition: (mode: Shared.Mode) => {
        if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 6
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
    apiEndpoint: '/haj/food-contracts',
    routerUrl: { default: '/apps/haj/food-contract' },
    fields: [...fields, ...campFields],
    excludeFields: [
      { action: 'add', fields: Shared.getShowModeFields([...fields, ...campFields]) },
      { action: 'edit', fields: Shared.getShowModeFields([...fields, ...campFields]) }
    ]
  })

  const { setValue } = formMethods
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'food_contract'}
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
          <Shared.FormComponent
            headerConfig={{ title: 'camp_information' }}
            locale={locale}
            fields={campFields}
            mode={mode}
            screenMode={mode}
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

export default FoodContractDetails
