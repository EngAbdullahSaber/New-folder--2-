'use client'

import * as Shared from '@/shared'

// Define the fields with validation and default values
const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },
  {
    name: 'season',
    label: 'hijri_season',
    type: 'number',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'greg_season',
    label: 'greg_season',
    type: 'number',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'start_hdate',
    label: 'start_date_hij',
    type: 'hijri_date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'end_hdate',
    label: 'end_date_hij',
    type: 'hijri_date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'season1_start',
    label: 'first_season_start_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'season1_end',
    label: 'first_season_end_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'season2_start',
    label: 'second_season_start_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },

  {
    name: 'season2_end',
    label: 'second_season_end_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
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

type ageStageFormData = Shared.InferFieldType<typeof fields>

const SeasonDetails = () => {
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    extraFields,
    dataModel,
    closeDocumentsDialog,
    openDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<ageStageFormData>({
    apiEndpoint: '/def/seasons',
    routerUrl: { default: '/apps/def/season' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`seasons`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>
        {extraFields && extraFields.length > 0 && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              headerConfig={{ title: 'extra_information' }}
              locale={locale}
              fields={extraFields}
              mode={mode}
              screenMode={mode}
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

export default SeasonDetails
