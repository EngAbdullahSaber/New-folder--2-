'use client'

import CustomBadge from '@/@core/components/mui/Badge'
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
    name: 'msg_desc',
    label: 'msg_desc',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'sms_account_id',
    label: 'sms_account',
    type: 'select',
    apiUrl: '/ntf/sms-accounts',
    requiredModes: ['add', 'edit'],
    labelProp: 'id',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['account_desc'],
    gridSize: 4,
    cache: false
  },
  {
    name: 'sms_key_id',
    label: 'sms_key',
    type: 'select',
    apiUrl: '/ntf/sms-keys',
    labelProp: 'id',
    requiredModes: ['add', 'edit'],
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    displayProps: ['key_desc'],
    gridSize: 4,
    cache: false
  },

  // {
  //   name: 'object_id',
  //   label: 'sms_object',
  //   type: 'select',
  //   apiUrl: '/aut/objects',
  //   labelProp: 'object_name_ar',
  //   keyProp: 'id',
  //   queryParams: { object_type: 3 },
  //   modeCondition: (mode: Shared.Mode) => mode,
  //   lovKeyName: 'id',
  //   requiredModes: ['add', 'edit'],
  //   gridSize: 4,
  //   viewProp: 'parent.object_name_ar',
  //   cache: false,
  //   displayProps: ['object_name_ar', 'parent.object_name_ar']
  // },

  {
    name: 'predefined_personals',
    label: 'predefined_personals',
    type: 'select',
    options: Shared.otherYesNoList,
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'max_run_count',
    label: 'max_run_count',
    type: 'number',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'interval',
    label: 'interval',
    type: 'number',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'start_date',
    label: 'start_date',
    type: 'date',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'end_date',
    label: 'exp_date',
    type: 'date',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'send_immediate',
    label: 'send_immediate',
    type: 'select',
    options: Shared.otherYesNoList,
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'scheduler_name',
    label: 'scheduler_name',
    type: 'text',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'running_time',
    label: 'running_time',
    type: 'time',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'status',
    label: 'status',
    type: 'select',
    requiredModes: ['add', 'edit'],
    defaultValue: 1,
    options: Shared.statusList,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  // {
  //   name: 'msg_desc',
  //   label: 'msg_desc',
  //   requiredModes: ['add', 'edit'],
  //   type: 'textarea',
  //   modeCondition: (mode: Shared.Mode) => mode,
  //   gridSize: 12
  // },
  {
    name: 'remarks',
    label: 'remarks',
    type: 'textarea',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  }

  // {
  //   name: 'command',
  //   label: 'command',
  //   type: 'text',
  //   // requiredModes: ['add', 'edit'],
  //   modeCondition: (mode: Shared.Mode) => mode,
  //   gridSize: 4
  // },
  // {
  //   name: 'version_no',
  //   label: 'version_no',
  //   type: 'number',
  //   // requiredModes: ['add', 'edit'],
  //   modeCondition: (mode: Shared.Mode) => mode,
  //   gridSize: 4
  // },

  // {
  //   name: 'send_immediate',
  //   label: '',
  //   type: 'checkbox',
  //   // defaultValue: true, // Default value for checkbox
  //   options: [{ value: 1, label: 'send_immediate' }],
  //   onChange: value => console.log('Selected:', value),
  //   gridSize: 6,
  //   modeCondition: (mode: Shared.Mode) => mode
  // },
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const SmsTemplateDetails = () => {
  const sms_template_langsFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'msg_text',
        label: 'msg_text',
        type: 'textarea',
        required: false,
        width: '70%',
        gridSize: 12,
        align: 'start'
        // hideInTable: true
      },

      {
        name: 'lang_id',
        label: 'languages',
        type: 'select',
        apiUrl: '/def/languages',
        labelProp: 'lang_name_ar',
        keyProp: 'id',
        required: true,
        multiple: false,
        width: '20%',
        gridSize: 4,
        viewProp: 'language.lang_name_ar'
      }

      // {
      //   name: 'sms_messages',
      //   label: 'sms_messages',
      //   type: 'text',
      //   required: false,
      //   width: '25%',
      //   gridSize: 4,
      //   align: 'start'
      // }
    ],
    []
  )
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    detailsData,
    closeDocumentsDialog,
    openDocumentsDialog,
    getDetailsErrors,
    detailsHandlers,
    setDetailsData,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/ntf/sms-msg-templates',
    routerUrl: { default: '/apps/ntf/sms-template' },
    fields: fields,
    initialDetailsData: {
      sms_template_langs: []
    },
    detailsTablesConfig: {
      sms_template_langs: { fields: sms_template_langsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`sms_templates`}
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
            fields={sms_template_langsFields}
            title='languages'
            initialData={detailsData['sms_template_langs']} // Pass the details data
            onDataChange={detailsHandlers?.sms_template_langs}
            mode={mode}
            errors={getDetailsErrors('sms_template_langs')}
            // apiEndPoint='/ntf/sms-template-langs'
            apiEndPoint={`/ntf/sms-msg-templates/${dataModel.id}/sms_template_langs`}
            detailsKey='sms_template_langs'
            locale={locale}
            rowModal={true}
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

export default SmsTemplateDetails
