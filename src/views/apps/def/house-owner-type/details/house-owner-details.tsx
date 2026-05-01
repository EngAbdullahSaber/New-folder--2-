'use client'

import * as Shared from '@/shared'

// Define the fields with validation and default values
const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    visibleModes: ['add', 'edit', 'show'],

    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },
  {
    name: 'description_ar',
    label: 'description_ar',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'description_la',
    label: 'description_la',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
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

type houseOwnerFormData = Shared.InferFieldType<typeof fields>

const HouseOwnerDetails = () => {
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    closeDocumentsDialog,
    openDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<houseOwnerFormData>({
    apiEndpoint: '/def/house-owner-types',
    routerUrl: { default: '/apps/def/house-owner-type' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`house_owner`}
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

export default HouseOwnerDetails
