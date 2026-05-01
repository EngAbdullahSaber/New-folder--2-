'use client'

import * as Shared from '@/shared'

const HandoverTypeDetails = () => {
  // Define the fields with validation and default values
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'season',
      label: 'season',
      type: 'select',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      defaultValue: ''
    },
    {
      name: 'handover_business_id',
      label: 'handover_business_id',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'handover_type_description',
      label: 'name',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },
    {
      name: 'content_type',
      label: 'content_type',
      type: 'select',
      options: Shared.contentTypeList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'transaction_type_id',
      label: 'transaction_type_id',
      type: 'select',
      options: Shared.transactionTypeList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'handover_flow_type',
      label: 'handover_flow_type',
      type: 'select',
      options: Shared.handoverFlowTypeList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'handover_method',
      label: 'handover_method',
      type: 'select',
      options: Shared.handoverMethodList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'is_monitored',
      label: 'is_monitored',
      type: 'select',
      options: Shared.yesNoList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'time_unit',
      label: 'time_unit',
      type: 'select',
      options: Shared.timeUnitList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'notice_threshold_time',
      label: 'notice_threshold_time',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'violation_threshold_time',
      label: 'violation_threshold_time',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'violation_closure_time',
      label: 'violation_closure_time',
      type: 'number',
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
      defaultValue: '1',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    }
  ]

  const handoverSenderUnitsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'sender_passport_unit_id',
      label: 'sender_passport_unit',
      type: 'select',
      apiUrl: '/haj/passport-units',
      labelProp: 'short_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      // cache: false,
      width: '65%',
      viewProp: 'sender_passport_unit.passport_units_name_ar'
    }
  ]
  const handoverReceiverUnitsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'receiver_passport_unit_id',
      label: 'receiver_passport_unit',
      type: 'select',
      apiUrl: '/haj/passport-units',
      labelProp: 'short_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      // cache: false,
      width: '65%',
      viewProp: 'receiver_passport_unit.passport_units_name_ar'
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
    openDocumentsDialog,
    closeDocumentsDialog,
    getDetailsErrors,
    setDetailsData,
    detailsData,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/handover-types',
    routerUrl: { default: '/apps/haj/handover-type' },
    fields: fields,
    initialDetailsData: {
      handover_sender_units: [],
      handover_receiver_units: []
    },
    detailsTablesConfig: {
      handover_sender_units: { fields: handoverSenderUnitsFields, trackIndex: true },
      handover_receiver_units: { fields: handoverReceiverUnitsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`passport_units`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            detailsConfig={[
              { key: 'handover_sender_units', fields: handoverSenderUnitsFields, title: 'handover_sender_units' },
              { key: 'handover_receiver_units', fields: handoverReceiverUnitsFields, title: 'handover_receiver_units' }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={handoverSenderUnitsFields}
            title='handover_sender_units'
            initialData={detailsData['handover_sender_units']} // Pass the details data
            onDataChange={detailsHandlers?.handover_sender_units}
            mode={mode}
            errors={getDetailsErrors('handover_sender_units')}
            apiEndPoint={`/haj/handover-types/${dataModel.id}/handover_sender_units`}
            detailsKey='handover_sender_units'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={handoverReceiverUnitsFields}
            title='handover_receiver_units'
            initialData={detailsData['handover_receiver_units']} // Pass the details data
            onDataChange={detailsHandlers?.handover_receiver_units}
            mode={mode}
            errors={getDetailsErrors('handover_receiver_units')}
            apiEndPoint={`/haj/handover-types/${dataModel.id}/handover_receiver_units`}
            detailsKey='handover_receiver_units'
            locale={locale}
            // rowModal={true}
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

export default HandoverTypeDetails
