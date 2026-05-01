'use client'

import * as Shared from '@/shared'

const ShrBatchDetails = () => {
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'payment_sn',
      label: 'payment_sn',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      mode: 'show'
    },
    {
      name: 'share_type_id',
      label: 'batch_type',
      type: 'select',
      apiUrl: '/sys/list/43',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['type_desc'],
      gridSize: 6,
      cache: false,
      viewProp: 'shareType.type_desc'
    },

    {
      name: 'payment_date',
      label: 'due_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'share_amount',
      label: 'share_amount',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'check_start_sn',
      label: 'check_start_sn',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'bank_account_id',
      label: 'bank_deduction',
      type: 'select',
      apiUrl: '/sys/list/44',
      labelProp: 'id',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['iban_no'],
      gridSize: 4,
      viewProp: 'bankAccount.iban_no'
    },

    {
      name: 'bayan',
      label: 'bayan',
      type: 'rich_text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
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
    dataModel,
    closeDocumentsDialog,
    openDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/shr/shr-payment',
    routerUrl: { default: '/apps/shr/shr-batch' },
    fields: fields
  })
  const { setValue } = formMethods
  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`shr_batches`}
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

export default ShrBatchDetails
