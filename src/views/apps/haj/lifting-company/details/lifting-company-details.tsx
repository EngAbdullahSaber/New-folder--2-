'use client'

import * as Shared from '@/shared'

const LiftingCompanyDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      visibleModes: ['add', 'edit', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'season',
      label: 'season',
      type: 'number',
      visibleModes: ['add', 'edit', 'show'],
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'name_ar',
      label: 'name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'name_la',
      label: 'name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'reg_no',
      label: 'reg_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'reg_date',
      label: 'reg_date_la',
      type: 'date',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'reg_date_hij',
      label: 'reg_date_hij',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'reg_expire_date',
      label: 'reg_expire_date_la',
      type: 'date',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'reg_expire_date_hij',
      label: 'reg_expire_date_hij',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'quota',
      label: 'quota',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'daily_quota',
      label: 'daily_quota',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'total_forklifts',
      label: 'total_forklifts',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'total_labors',
      label: 'total_labors',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'total_saudi_employees',
      label: 'total_saudi_employees',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'total_non_saudi_employees',
      label: 'total_non_saudi_employees',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'equipment_details',
      label: 'equipment_details',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 9
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
      name: 'phones_free',
      label: 'phones_free',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'faxes_no',
      label: 'faxes_no',
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
      name: 'web_page',
      label: 'web_page',
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
      gridSize: 3
    },
    {
      name: 'address_2',
      label: 'address_2',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
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
      viewProp: 'cities.name_ar'
    },
    {
      name: 'pobox',
      label: 'pobox',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'zip',
      label: 'zip',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
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
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      defaultValue: '1',
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
    apiEndpoint: '/haj/lifting-companies',
    routerUrl: { default: '/apps/HAJ/lifting-company' },
    fields: fields
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'lifting_company'}
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

export default LiftingCompanyDetails
