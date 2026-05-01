'use client'

import * as Shared from '@/shared'
import { any, optional } from 'valibot'

const TemplateDetails = () => {
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
      gridSize: 8
    }
  ]

  const departmentsDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'department_id',
      label: 'department',
      type: 'select',
      required: true,
      apiUrl: '/def/seasonal-departments',
      labelProp: 'department_name_ar',
      keyProp: 'id',
      width: '40%',
      viewProp: 'department.department_name_ar',
      cache: false
    },
    {
      name: 'max_users_count',
      label: 'max_users_count',
      type: 'number',
      width: '40%'
    }
  ]

  const groupsDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'aut_role_id',
      label: 'permission_set',
      type: 'select',
      required: true,
      apiUrl: '/aut/roles',
      labelProp: 'name',
      keyProp: 'id',
      width: '60%',
      viewProp: 'role.name',
      cache: false
    }
  ]

  const jobsDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'job_id',
      label: 'job',
      type: 'select',
      required: true,
      apiUrl: '/sys/list/21',
      labelProp: 'name',
      keyProp: 'id',
      width: '40%',
      apiMethod: 'GET',
      viewProp: 'name'
    },
    {
      name: 'after_approval_type_id',
      label: 'after_approval_type',
      type: 'number',
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
    errors,
    dataModel,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/aut/templates',
    routerUrl: { default: '/apps/aut/template' },
    fields: fields,
    initialDetailsData: {
      template_depts: [],
      template_groups: [],
      template_jobs: []
    },
    detailsTablesConfig: {
      template_depts: { fields: departmentsDetailsFields, trackIndex: true },
      template_groups: { fields: groupsDetailsFields, trackIndex: true },
      template_jobs: { fields: jobsDetailsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`templates`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent dataObject={dataModel} locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={departmentsDetailsFields}
            title='departments'
            initialData={detailsData['template_depts']}
            onDataChange={detailsHandlers.template_depts}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'template_depts')}
            locale={locale}
            dataObject={dataModel}
            detailsKey='template_depts'
            apiEndPoint={`/aut/templates/${dataModel.id}/template_depts`}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={groupsDetailsFields}
            title='permission_set'
            initialData={detailsData['template_groups']}
            onDataChange={detailsHandlers.template_groups}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'template_groups')}
            locale={locale}
            dataObject={dataModel}
            detailsKey='template_groups'
            apiEndPoint={`/aut/templates/${dataModel.id}/template_groups`}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={jobsDetailsFields}
            title='jobs'
            initialData={detailsData['template_jobs']}
            onDataChange={detailsHandlers.template_jobs}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'template_jobs')}
            locale={locale}
            dataObject={dataModel}
            detailsKey='template_jobs'
            apiEndPoint={`/aut/templates/${dataModel.id}/template_jobs`}
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

export default TemplateDetails
