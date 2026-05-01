'use client'

import * as Shared from '@/shared'

const RoleDetails = () => {
  const [rolesUrl, setRolesUrl] = Shared.useState<any>('')
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'name',
      label: 'name',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'parent_depts_id',
      label: 'system',
      type: 'select',
      apiUrl: '/aut/objects',
      labelProp: 'object_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      lovKeyName: 'id',
      visibleModes: ['edit'],
      queryParams: { object_type: '1' },
      gridSize: 4,
      cache: false,
      onChange: result => {
        if (result && result.value) setRolesUrl(`/aut/objects/${result.value}/roles/${recordId}`)
        else setRolesUrl(``)
      }
    }
  ]

  type DepartmentTypeFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    recordId,
    locale,
    closeDocumentsDialog,
    dataModel,
    openDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<DepartmentTypeFormData>({
    apiEndpoint: '/aut/roles',
    routerUrl: { default: '/apps/aut/role' },
    fields: fields,
    // saveMode: 'edit',
    excludeFields: [{ action: '*', fields: fields.slice(2) }]
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`permission_set`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent
            headerConfig={{ title: 'main_information' }}
            fields={fields}
            mode={mode}
            screenMode={mode}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RolesTable roleId={recordId} apiUrl={rolesUrl} />
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
          <Shared.FormActions onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} locale={locale} />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default RoleDetails
