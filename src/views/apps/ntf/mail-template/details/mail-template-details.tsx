'use client'

import CustomBadge from '@/@core/components/mui/Badge'
import * as Shared from '@/shared'

// Define the fields with validation and default values
const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'template_name',
    label: 'template_name',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'subject',
    label: 'subject',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'start_date',
    label: 'start_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'end_date',
    label: 'exp_date',
    type: 'date',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'job_hh',
    label: 'job_hh',
    type: 'time',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'sql_update',
    label: 'sql_update',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'sql_content',
    label: 'sql_content',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'from_id',
    label: 'from_id',
    type: 'text',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'type',
    label: 'type',
    type: 'select',
    options: Shared.templateTypeList,
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
  },

  {
    name: 'description',
    label: 'description',
    type: 'rich_text',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const MailTemplateDetails = () => {
  const mailTemplateLangFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
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
        gridSize: 4
      },

      {
        name: 'subject',
        label: 'subject',
        type: 'text',
        required: false,
        width: '25%',
        gridSize: 12,
        align: 'center'
      },

      {
        name: 'mail_to',
        label: 'mail_to',
        type: 'text',
        required: false,
        width: '25%',
        gridSize: 12,
        align: 'center'
      },
      {
        name: 'mail_cc',
        label: 'mail_cc',
        type: 'text',
        required: false,
        width: '25%',
        gridSize: 12,
        align: 'center'
      },
      {
        name: 'mail_bc',
        label: 'mail_bc',
        type: 'text',
        required: false,
        width: '25%',
        gridSize: 12,
        align: 'center'
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
    closeDocumentsDialog,
    openDocumentsDialog,
    detailsHandlers,
    getDetailsErrors,
    detailsData,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/ntf/mail-templates',
    routerUrl: { default: '/apps/ntf/mail-template' },
    fields: fields,
    initialDetailsData: {
      mail_template_lang: []
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`mail_templates`}
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
            fields={mailTemplateLangFields}
            title='mail_template_lang'
            initialData={detailsData['mail_template_lang']} // Pass the details data
            onDataChange={detailsHandlers?.mail_template_lang}
            mode={mode}
            errors={getDetailsErrors('mail_template_lang')}
            // apiEndPoint='/ntf/sms-template-langs'
            apiEndPoint={`/ntf/mail-templates/${dataModel.id}/mailTemplateLangs`}
            detailsKey='mail_template_lang'
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

export default MailTemplateDetails
