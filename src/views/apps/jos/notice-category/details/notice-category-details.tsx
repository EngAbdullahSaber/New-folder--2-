'use client'

import { useScreenPermissions } from '@/hooks/useScreenPermission'
import * as Shared from '@/shared'

const NoticeCategoryDetails = () => {

  const { screenData } = useScreenPermissions('*')

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'season',
      label: 'season',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'business_id',
      label: 'business_id',
      type: 'number',
      // requiredModes: ['add'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'center_business_id',
      label: 'center_business_id',
      type: 'select',
      apiUrl: '/jos/notice-operation-centers',
      displayProps: ['department.department_name_ar', 'adminPersonal.full_name_ar'],
      searchProps: ['department.department_name_ar', 'adminPersonal.full_name_ar'],
      viewProp: 'noticeOperationCenter.department_name_ar',
      labelProp: 'department_name_ar',
      keyProp: 'business_id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'name',
      label: 'name',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },


    {
      name: 'parent_id',
      label: 'parent_id',
      type: 'select',
      apiUrl: '/jos/notice-categories',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'notification_setting_id',
      label: 'notification_setting_id',
      type: 'select',
      apiUrl: '/ntf/notification-settings',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      apiMethod: 'GET'
    },
    {
      name: 'order_no',
      label: 'order_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    // {
    //   name: 'reference_type_id',
    //   label: 'reference_type_id',
    //   type: 'number',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 3
    // },

    {
      name: 'conditions',
      label: 'conditions',
      type: 'textarea',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },
    {
      name: 'default_text',
      label: 'default_text',
      type: 'textarea',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    }
  ]

  const detailFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'department_id',
      label: 'department_id',
      type: 'select',
      labelProp: 'department_name_ar',
      viewProp: 'department.department_name_ar',
      keyProp: 'id',
      apiUrl: '/def/departments',
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
    detailsData,
    detailsHandlers,
    getDetailsErrors,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/jos/notice-categories',
    routerUrl: { default: '/apps/jos/notice-category' },
    fields: fields,
    initialDetailsData: {
      noticeCategoryDepartments: []
    },
    detailsTablesConfig: {
      noticeCategoryDepartments: { fields: detailFields, trackIndex: true }
    },

  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`notice_category`}
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
          <Shared.DynamicFormTable
            fields={detailFields}
            title='noticeCategoryDepartments'
            initialData={detailsData['noticeCategoryDepartments']}
            onDataChange={detailsHandlers?.noticeCategoryDepartments}
            mode={mode}
            errors={getDetailsErrors('noticeCategoryDepartments')}
            apiEndPoint={`/jos/notice-categories/${dataModel.id}/noticeCategoryDepartments`}
            detailsKey='noticeCategoryDepartments'
            locale={locale}
            dataObject={dataModel}
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

export default NoticeCategoryDetails
