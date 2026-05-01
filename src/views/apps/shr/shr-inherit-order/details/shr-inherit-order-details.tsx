'use client'

import * as Shared from '@/shared'

const ShrInheritOrderDetails = () => {
  const fields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 9
    },

    {
      name: 'decision_source',
      label: 'decision_source',
      type: 'rich_text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    {
      name: 'decision_id',
      label: 'internal_descition_no',
      type: 'text',
      requiredModes: [],
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
      name: 'inherit_date',
      label: 'inherit_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    //second section

    {
      name: 'shareholder_id',
      label: 'shareholder_death_id',
      type: 'select',
      apiUrl: '/sys/list/82', //ask
      labelProp: 'sholder_id',
      keyProp: 'sholder_id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['personal_code', 'sholder_name'], //ask
      gridSize: 6,
      onChange: result => {
        setValue('death_date', result?.object?.death_date ?? '')
        setValue('death_cert_no', result?.object?.death_cert_no ?? '')
        setValue('death_cert_date', result?.object?.death_cert_date ?? '')
      },
      cache: false,
      viewProp: 'shareholder.personal.full_name_ar'
    },

    {
      name: 'death_date',
      label: 'death_date',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      viewProp: 'shareholder.death_date'
    },

    {
      name: 'death_cert_no',
      label: 'death_cert_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      viewProp: 'sholderDeath.death_cert_no'
    },

    {
      name: 'death_cert_date',
      label: 'death_cert_date',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      viewProp: 'sholderDeath.death_cert_date'
    },

    //third section

    {
      name: 'sholder_share_count',
      label: 'sholder_share_count',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'inherit_share_count',
      label: 'inherit_share_count',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'returned_shares',
      label: 'returned_shares',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'replaced_shares',
      label: 'replaced_shares',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    //fourth section

    {
      name: 'loans_amount',
      label: 'loans',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'differences_amount',
      label: 'differences_amount',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'other_differ_amount',
      label: 'other_differ_amount',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'other_differ_account_id',
      label: 'other_differ_account_id',
      type: 'select',
      apiUrl: '/sys/list/81',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['account_code', 'account_name_ar'],
      gridSize: 4
    },

    {
      name: 'bayan',
      label: 'bayan',
      type: 'rich_text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'first_check_no',
      label: 'first_check_no',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    }
  ]
  const inheritHeirFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'personal_code',
      label: 'inherit_personal_code',
      type: 'select',
      apiUrl: '/personal',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['id_no', 'full_name_ar', 'id_no'],
      width: '20%',
      cache: false,
      viewProp: 'personal.full_name_ar'
    },

    {
      name: 'relative_type_id',
      label: 'shr_relative',
      type: 'select',
      apiUrl: '/shr/shr-relativities',
      labelProp: 'relation_desc',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      // displayProps: ['id_no', 'full_name_ar'],
      width: '20%',
      viewProp: 'relativities.relation_desc'
    },

    {
      name: 'shr_relation_id',
      label: 'shr_relation',
      type: 'select',
      apiUrl: '/shr/shr-relations',
      labelProp: 'relation_desc',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      // displayProps: ['id_no', 'full_name_ar'],
      width: '20%',
      viewProp: 'relation.relation_desc'
    },

    {
      name: 'share_count',
      label: 'share_count',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '15%'
    },

    {
      name: 'current_year_amount',
      label: 'current_year_amount',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '15%'
    },

    {
      name: 'previous_year_amount',
      label: 'previous_year_amount',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '15%'
    },

    {
      name: 'savings_amount',
      label: 'savings_amount',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '15%'
    },

    {
      name: 'others_amount',
      label: 'others_amount',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '15%'
    },

    {
      name: 'others_account_id',
      label: 'other_differ_account_id',
      type: 'select',
      apiUrl: '/sys/list/81',
      labelProp: 'relation_desc',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['account_code', 'account_name_ar'],
      width: '20%'
    }
  ]
  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    detailsData,
    setDetailsData,
    dataModel,
    errors,
    closeDocumentsDialog,
    openDocumentsDialog,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/shr/inherit-order',
    routerUrl: { default: '/apps/shr/shr-inherit-order' },
    fields: fields,
    initialDetailsData: { inheritHeir: [] },
    detailsTablesConfig: { inheritHeir: { fields: inheritHeirFields, trackIndex: true } },
    excludeFields: [{ action: '*', fields: fields.slice(6, 9) }]
  })
  const { setValue } = formMethods

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'inherit_order'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.SharedForm
            dataObject={dataModel}
            allFormFields={fields}
            tabConfig={[
              { label: 'main_information', fields: fields.slice(0, 5) },
              { label: 'dead_shareholder', fields: fields.slice(5, 9) },
              { label: 'shares_information', fields: fields.slice(9, 13) },
              { label: 'differences_loans', fields: fields.slice(13) }
            ]}
            mode={mode}
            locale={locale}
            detailsHandlers={detailsHandlers}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={inheritHeirFields}
            title='inherit_legacy_persons'
            initialData={detailsData['inheritHeir']} // Pass the details data
            onDataChange={detailsHandlers?.inheritHeir}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'inheritHeir')}
            // apiEndPoint='/inheritHeir/deleteDetails'
            apiEndPoint={`/shr/inherit-orders/${dataModel.id}/inheritHeir`}
            locale={locale}
            dataObject={dataModel}
            // name='inheritHeir'
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

export default ShrInheritOrderDetails
