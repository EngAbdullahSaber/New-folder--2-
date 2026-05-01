'use client'

import * as Shared from '@/shared'

// Define the fields with validation and default values

const RouteDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },
    {
      name: 'name_ar',
      label: 'name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'name_en',
      label: 'name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'from_ct_id',
      label: 'from_city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),
      defaultValue: user?.context?.city_id,
      requiredModes: ['add', 'edit'],
      labelProp: 'name_ar',
      keyProp: 'id',
      lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'fromCity.name_ar'
    },

    {
      name: 'to_ct_id',
      label: 'to_city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),
      defaultValue: user?.context?.city_id,
      requiredModes: ['add', 'edit'],
      labelProp: 'name_ar',
      keyProp: 'id',
      lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'toCity.name_ar'
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    }
  ]

  type formData = Shared.InferFieldType<typeof fields>
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
  } = Shared.useRecordForm<formData>({
    apiEndpoint: '/def/routes',
    routerUrl: { default: '/apps/def/route' },
    fields: fields
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`route`}
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

export default RouteDetails
