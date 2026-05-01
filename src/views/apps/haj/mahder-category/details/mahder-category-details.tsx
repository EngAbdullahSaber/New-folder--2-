'use client'

import * as Shared from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'

const MahderCategoryDetails = () => {
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'season',
      label: 'season',
      type: 'select',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      defaultValue: ''
    },

    {
      name: 'business_id',
      label: 'mahder_business_id',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'name',
      label: 'name',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'order_no',
      label: 'order_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,

      // requiredModes: ['add', 'edit'],
      gridSize: 6
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      defaultValue: '1',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'defualt_statement',
      label: 'default_statement',
      type: 'rich_text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },
    {
      name: 'defualt_action_taken',
      label: 'default_action_taken',
      type: 'rich_text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    }
  ]

  const mahaderCategoryDepartmentsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'department_id',
      label: 'department',
      type: 'select',
      apiUrl: '/def/seasonal-departments',
      labelProp: 'department_name_ar',
      keyProp: 'department_id',

      viewProp: 'department.department_name_ar',
      requiredModes: ['add', 'edit'],
      gridSize: 4,
      align: 'start'
    }
  ]

  const mahaderCategoryAssociatedFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'mahader_service_type_id',
      label: 'mahader_service_type_id',
      type: 'select',
      apiUrl: '/haj/mahader-service-types',
      labelProp: 'name',
      keyProp: 'id',
      gridSize: 4,
      width: '20%',
      viewProp: 'service_type.name',
      align: 'start'
    },
    {
      name: 'name',
      label: 'name',
      type: 'text',
      gridSize: 4,
      width: '20%',
      align: 'start'
    },
    {
      name: 'order_no',
      label: 'order_no',
      type: 'number',
      gridSize: 4,
      width: '20%'
    },
    {
      name: 'is_requierd',
      label: 'is_required',
      type: 'select',
      options: Shared.yesNoList,
      width: '20%',
      gridSize: 3
    }
  ]

  const mahaderCategoryParticipantFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'department_id',
      label: 'department',
      type: 'select',
      apiUrl: '/def/seasonal-departments',
      labelProp: 'department_name_ar',
      viewProp: 'department.department_name_ar',
      requiredModes: ['add', 'edit'],
      keyProp: 'department_id',
      width: '40%',
      gridSize: 4,
      align: 'start'
    },
    {
      name: 'order_no',
      label: 'order_no',
      type: 'number',
      requiredModes: ['add', 'edit'],
      gridSize: 4,
      width: '40%'
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
    apiEndpoint: '/haj/mahader-categories',
    routerUrl: { default: `/apps/haj/mahder-category` },
    fields: fields,
    initialDetailsData: {
      mahader_category_departments: [],
      mahader_category_associates: [],
      mahader_category_participants: []
    },
    detailsTablesConfig: {
      mahader_category_departments: { fields: mahaderCategoryDepartmentsFields, trackIndex: true },
      mahader_category_associates: { fields: mahaderCategoryAssociatedFields, trackIndex: true },
      mahader_category_participants: { fields: mahaderCategoryParticipantFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`mahader_categories`}
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
              {
                key: 'mahader_category_departments',
                fields: mahaderCategoryDepartmentsFields,
                title: 'mahader_category_departments'
              },
              {
                key: 'mahader_category_associates',
                fields: mahaderCategoryAssociatedFields,
                title: 'mahader_category_associates'
              },
              {
                key: 'mahader_category_participants',
                fields: mahaderCategoryParticipantFields,
                title: 'mahader_category_participants'
              }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={mahaderCategoryDepartmentsFields}
            title='mahader_category_departments'
            initialData={detailsData['mahader_category_departments']} // Pass the details data
            onDataChange={detailsHandlers?.mahader_category_departments}
            mode={mode}
            errors={getDetailsErrors('mahader_category_departments')}
            apiEndPoint={`/haj/mahader-categories/${dataModel.id}/mahader_category_departments`}
            detailsKey='mahader_category_departments'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={mahaderCategoryAssociatedFields}
            title='mahader_category_associates'
            initialData={detailsData['mahader_category_associates']} // Pass the details data
            onDataChange={detailsHandlers?.mahader_category_associates}
            mode={mode}
            errors={getDetailsErrors('mahader_category_associates')}
            apiEndPoint={`/haj/mahader-categories/${dataModel.id}/mahader_category_associates`}
            detailsKey='mahader_category_associates'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={mahaderCategoryParticipantFields}
            title='mahader_category_participants'
            initialData={detailsData['mahader_category_participants']} // Pass the details data
            onDataChange={detailsHandlers?.mahader_category_participants}
            mode={mode}
            errors={getDetailsErrors('mahader_category_participants')}
            apiEndPoint={`/haj/mahader-categories/${dataModel.id}/mahader_category_participants`}
            detailsKey='mahader_category_participants'
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

export default MahderCategoryDetails
