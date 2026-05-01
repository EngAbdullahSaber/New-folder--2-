'use client'

import * as Shared from '@/shared'

const ShareholderProfileDetails = () => {
  const fields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    {
      name: 'personal_code',
      label: 'personal_id',
      type: 'select',
      apiUrl: '/personal',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['id_no', 'full_name_ar'],
      gridSize: 6,
      cache: false,
      viewProp: 'personal.full_name_ar',
      searchProps: ['id_no', 'full_name_ar', 'id']
    },

    {
      name: 'shr_relation_id',
      label: 'shr_relation',
      type: 'select',
      apiUrl: '/shr/shr-relations',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['relation_desc'],
      gridSize: 6,

      viewProp: 'relation.relation_desc'
    },

    {
      name: 'shr_status_id',
      label: 'shr_status',
      type: 'select',
      apiUrl: '/shr/shr-statuses',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['status_desc'],
      gridSize: 6,

      viewProp: 'status.status_desc'
    },

    {
      name: 'account_type',
      label: 'payment_method',
      type: 'select',
      options: Shared.shrPaymentMethodList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'parent_id',
      label: 'shareholder_parent',
      type: 'select',
      apiUrl: '/sys/list/26',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['personal_name'],
      gridSize: 6
    }
  ]

  const banksDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'bank_id',
      label: 'bank_name',
      type: 'select',
      required: true,
      apiUrl: '/banks',
      labelProp: 'name_ar',
      keyProp: 'id',
      width: '40%'
      //lovKeyName: 'id'
    },

    {
      name: 'iban_no',
      label: 'iban_no',
      type: 'text',
      required: true,
      width: '40%'
      //lovKeyName: 'id'
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.shrBankStatus,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '30%'
    }
  ]

  const dependentsDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'dependent_type',
      label: 'relation_relativity',
      type: 'select',
      apiUrl: 'shr/shr-relativities',
      labelProp: 'relation_desc',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      // displayProps: ['id_no', 'full_name_ar'],

      width: '30%'
    },

    {
      name: 'personal_code',
      label: 'name',
      type: 'select',
      apiUrl: '/personal',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['id_no', 'full_name_ar'],
      width: '40%',
      cache: false
    },

    {
      name: 'dependent_status',
      label: 'status',
      type: 'select',
      options: Shared.shrBankStatus,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '30%'
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
    errors,
    dataModel,
    closeDocumentsDialog,
    detailsHandlers,
    openDocumentsDialog,
    closeRecordInformationDialog,
    openRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/shr/shareholders',
    routerUrl: { default: '/apps/shr/shareholder-profile' },
    fields: fields,
    initialDetailsData: { banks: [], dependents: [] },
    detailsTablesConfig: {
      banks: { fields: banksDetailsFields, trackIndex: true },
      dependents: { fields: dependentsDetailsFields, trackIndex: true }
    }
  })
  const { setValue } = formMethods
  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`shareholder_profile`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={banksDetailsFields}
            title='bank_accounts'
            initialData={detailsData['banks']} // Pass the details data
            onDataChange={detailsHandlers?.banks}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'banks')}
            dataObject={dataModel}
            // apiEndPoint='/banks/deleteDetails'
            apiEndPoint={`/shr/shareholders/${dataModel.id}/banks`}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={dependentsDetailsFields}
            title='relativies'
            initialData={detailsData['dependents']} // Pass the details data
            onDataChange={detailsHandlers?.dependents}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'dependents')}
            // apiEndPoint='/dependents/deleteDetails'
            apiEndPoint={`/shr/shareholders/${dataModel.id}/dependents`}
            dataObject={dataModel}
            locale={locale}
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

export default ShareholderProfileDetails
