'use client'

import * as Shared from '@/shared'

const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },

  {
    name: 'payment_sn',
    label: 'payment_sn',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
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
    gridSize: 4,
    onChange: result => {},
    cache: false,

    modal: ''
  },

  {
    name: 'payment_date',
    label: 'due_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
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
    name: 'share_count',
    label: 'share_count',
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
    onChange: result => {},
    viewProp: 'bankAccount.iban_no'
  },

  {
    name: 'bayan',
    label: 'bayan',
    type: 'rich_text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },

  {
    name: 'additions',
    label: 'additions',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'detections',
    label: 'detections',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'loans',
    label: 'loans',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'amount_type',
    label: 'amount_type',
    type: 'select',
    options: Shared.shrAmountType,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'account_type',
    label: 'payment_method',
    type: 'select',
    options: Shared.shrPaymentMethodList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'bank_id',
    label: 'shareholders_bank',
    type: 'select',
    apiUrl: '/sys/list/62',
    labelProp: 'id',
    keyProp: 'id',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['iban_no'],
    gridSize: 4,
    onChange: result => {},
    viewProp: 'bankAccount.iban_no'
  },

  {
    name: 'sholder_id',
    label: 'shareholder_name',
    type: 'select',
    apiUrl: '/personal',
    labelProp: 'id',
    keyProp: 'id',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['id_no', 'full_name_ar'],
    gridSize: 4,
    onChange: result => {},
    cache: false,
    viewProp: 'shareholder.personal.full_name_ar',
    modal: 'shareholder'
  },

  {
    name: 'sh_bankacc_id',
    label: 'shareholder_bank',
    type: 'select',
    apiUrl: '/sys/list/63',
    labelProp: 'id',
    keyProp: 'id',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['iban_no'],
    gridSize: 4,

    viewProp: 'bankAccount.iban_no'
  },
  {
    name: 'check_no',
    label: 'check_no',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'pay_stop_flag',
    label: 'pay_stop_flag',
    type: 'select',
    options: Shared.shrPayStatus,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const ShareholderBatchDetails = () => {
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
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/shr/shr-shareholders-payment',
    routerUrl: { default: '/apps/shr/shareholder-batch' },
    fields: fields
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'shareholders_batch'}
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
              { label: 'main_information', fields: fields.slice(0, 8) },
              { label: 'additions_deductions', fields: fields.slice(8, 12) },
              { label: 'bank_informations', fields: fields.slice(12) }
            ]}
            mode={mode}
            locale={locale}
            detailsHandlers={detailsHandlers}
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

export default ShareholderBatchDetails
