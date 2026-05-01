'use client'

import * as Shared from '@/shared'

const MissionDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, dictionary, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    // {
    //   name: 'season',
    //   label: 'season',
    //   type: 'number',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 3
    // },

    {
      name: 'name_ar',
      label: 'name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'name_la',
      label: 'name_la',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'country_id',
      label: 'country',
      type: 'select',
      apiUrl: '/def/countries',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      viewProp: 'country.name_ar',
      gridSize: 3
    },

    {
      name: 'city_id',
      label: 'city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'city.name_ar'
    },
    {
      name: 'po_box',
      label: 'p_o_box',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'zip_code',
      label: 'bin_code',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'address_1',
      label: 'address_1',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'address_2',
      label: 'address_2',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'phones_no',
      label: 'phones_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'email',
      label: 'email',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'haj_mission_quota',
      label: 'haj_quota',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'member_quota',
      label: 'members_count',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    // {
    //   name: 'status',
    //   label: 'status',
    //   type: 'select',
    //   options: Shared.statusList,
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 3
    // },

    {
      name: 'hajj_company_quota',
      label: 'haj_quota_company',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'land_quota',
      label: 'land_haj_quota',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'sea_quota',
      label: 'sea_haj_quota',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'air_quota',
      label: 'air_haj_quota',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'total_quota',
      label: 'total_haj_quota',
      type: 'amount',
      showCurrency: false,
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'hm_state',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      defaultValue: '1',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'rep_document_number',
      label: 'rep_document_number',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'rep_full_name_ar',
      label: 'rep_full_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'rep_full_name_en',
      label: 'rep_full_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'rep_phone_number',
      label: 'rep_phone_number',
      type: 'mobile',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'rep_email',
      label: 'rep_email',
      type: 'email',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'total_basic_external_pilgrim',
      label: 'total_basic_external_pilgrim',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    // {
    //   name: 'country_quota',
    //   label: 'country_quota',
    //   type: 'number',
    //   requiredModes: [],
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 3
    // },

    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      requiredModes: [],
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'reference_id',
      label: 'reference_id',
      type: 'text',
      requiredModes: [],
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,

    tabValue,
    openDocumentsDialog,
    setOpenDocumentsDialog,
    dataModel,
    closeDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/missions',
    routerUrl: { default: '/apps/haj/mission' },
    fields: fields,
    tabsCount: 3
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  if (!dictionary) return <Shared.LoadingSpinner type='skeleton' />
  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'mission'}
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
          <Shared.FormActions onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} locale={locale} />
        </Shared.Grid>
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
    </Shared.FormProvider>
  )
}

export default MissionDetails
