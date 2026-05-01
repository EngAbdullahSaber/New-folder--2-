'use client'

import * as Shared from '@/shared'

const fields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'internal_descition_no',
    label: 'internal_descition_no',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6,
    mode: 'show'
  },
  {
    name: 'descion_no',
    label: 'descion_no',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'descition_date',
    label: 'descition_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'reqeust_personal_code',
    label: 'reqeust_personal_code',
    type: 'select',
    apiUrl: '/personal',
    labelProp: 'id',
    keyProp: 'id',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['id', 'full_name_ar'],
    gridSize: 4,
    viewProp: 'requestPersonal.full_name_ar'
  },

  {
    name: 'request_date',
    label: 'request_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  // list of value
  {
    name: 'shareholder_death_id',
    label: 'shareholder_death_id',
    type: 'select',
    apiUrl: '/sys/list/3', //ask
    labelProp: 'id',
    keyProp: 'id',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['id', 'full_name_ar'], //ask
    gridSize: 4,
    viewProp: 'shareholderDeathPersonal.full_name_ar' //ask
  },

  {
    name: 'internal_descition_date',
    label: 'internal_descition_date',
    type: 'date',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'descion_from',
    label: 'descion_from',
    type: 'rich_text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },

  // static list
  {
    name: 'fractions_status',
    label: 'fractions_status',
    type: 'select',
    options: Shared.shrInheritLegacyTypes,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'status',
    label: 'status',
    type: 'select',
    options: Shared.shrInheritLegacyStatus,
    requiredModes: [],
    visibleModes: ['search'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'committee_meeting_date',
    label: 'committee_meeting_date',
    type: 'date',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  }
]
const inheritLegacyPersonsFields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: 'inherit_personal_code',
    label: 'inherit_personal_code',
    type: 'select',
    apiUrl: '/personal',
    labelProp: 'id',
    keyProp: 'id',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['id_no', 'full_name_ar', 'id_no'],
    width: '20%',
    cache: false
  },

  {
    name: 'shr_relation_id',
    label: 'shr_relative',
    type: 'select',
    apiUrl: '/shr/shr-relativities',
    labelProp: 'relation_desc',
    keyProp: 'id',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    // displayProps: ['id_no', 'full_name_ar'],
    width: '20%'
  },

  {
    name: 'individual_ratio',
    label: 'individual_ratio',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    width: '15%'
  },

  {
    name: 'share_before_truncate',
    label: 'share_before_truncate',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    width: '20%'
  },
  {
    name: 'share_after_truncate',
    label: 'share_after_truncate',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    width: '20%'
  }
]
type dataModelFormData = Shared.InferFieldType<typeof fields>

const ShrInheritLegacyDetails = () => {
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    detailsData,
    setDetailsData,
    errors,
    dataModel,
    closeDocumentsDialog,
    openDocumentsDialog,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/shr/inherit-legacies',
    routerUrl: { default: '/apps/shr/shr-inherit-legacy' },
    fields: fields,
    initialDetailsData: { inheritLegacyPersons: [] },
    detailsTablesConfig: {
      inheritLegacyPersons: { fields: inheritLegacyPersonsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'inherit_legacy'}
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
          <Shared.DynamicFormTable
            fields={inheritLegacyPersonsFields}
            title='inherit_legacy_persons'
            initialData={detailsData['inheritLegacyPersons']} // Pass the details data
            onDataChange={detailsHandlers?.inheritLegacyPersons}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'inheritLegacyPersons')}
            // apiEndPoint='/inheritLegacyPersons/deleteDetails'
            apiEndPoint={`/shr/inherit-legacies/${dataModel.id}/inheritLegacyPersons`}
            locale={locale}
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

export default ShrInheritLegacyDetails
