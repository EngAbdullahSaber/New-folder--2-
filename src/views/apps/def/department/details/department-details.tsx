'use client'

import * as Shared from '@/shared'

const trackingColumns = [
  { accessorKey: 'action', header: 'process_type', icon: { color: '#FDC453', name: 'ri-edit-2-fill' } },
  { accessorKey: 'id', header: 'id' },
  {
    accessorKey: 'department_name_ar',
    header: 'name'
  }
]
const recordInformations = [
  {
    action: 1,
    user_name: 'يوسف محمد محجوب',
    date: '12-10-2024',
    time: '12:45',
    deviceIpAddress: '10.100.100.1'
  },
  {
    action: 2,
    user_name: 'يوسف محمد محجوب',
    date: '12-10-2024',
    time: '12:45',
    deviceIpAddress: '10.100.100.1'
  },
  {
    action: 3,
    user_name: 'يوسف محمد محجوب',
    date: '12-10-2024',
    time: '12:45',
    deviceIpAddress: '10.100.100.1'
  }
]

const DepartmentDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, dictionary, locale, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      gridSize: 6,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'city_id',
      label: 'city_id',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),
      defaultValue: user?.context?.city_id,
      requiredModes: ['add', 'edit'],
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      viewProp: 'city.name_ar',
      gridSize: 3,
      apiMethod: 'GET'
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      defaultValue: '1'
    },

    {
      name: 'department_name_ar',
      label: 'name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'department_name_la',
      label: 'name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'short_name_ar',
      label: 'short_name_ar',
      type: 'text',
      gridSize: 3,
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'short_name_en',
      label: 'short_name_la',
      type: 'text',
      gridSize: 3,
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'parent_depts_id',
      label: 'main_department',
      type: 'select',
      apiUrl: '/def/departments',
      labelProp: 'department_name_ar',
      keyProp: 'id',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode,
      lovKeyName: 'id',
      viewProp: 'parent.department_name_ar'
    },
    {
      name: 'personal_id',
      label: 'department_manager',
      type: 'select',
      apiUrl: '/def/personal',
      labelProp: 'id',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => {
        return mode
      },
      displayProps: ['id_no', 'full_name_ar'],
      gridSize: 3,
      cache: false,
      viewProp: 'personal.full_name_ar',
      requiredModes: ['add', 'edit']
    },

    {
      name: 'coordinator_name',
      label: 'coordinator_name',
      type: 'text',
      gridSize: 6,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'mobile',
      label: 'mobile',
      type: 'text',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'tel',
      label: 'tel',
      type: 'text',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'fax',
      label: 'fax',
      type: 'text',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode
    },

    {
      name: 'email',
      label: 'email',
      type: 'text',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode
    },

    {
      name: 'x_axis',
      label: 'x_axis',
      type: 'number',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'y_axis',
      label: 'y_axis',
      type: 'number',
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'address_ar',
      label: 'address_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'address_en',
      label: 'address_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode
    },

    {
      name: 'remarks',
      label: 'remarks',
      type: 'textarea',
      // requiredModes: ['add', 'edit'],
      // gridSize: { lg: 12, md: 12, sm: 12, xl: 12, xs: 12 },
      gridSize: 12,
      modeCondition: (mode: Shared.Mode) => mode
    }
  ]
  const detailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'id',
      label: 'type',
      type: 'select',
      required: true,
      apiUrl: '/def/department-types',
      labelProp: 'department_type_name',
      keyProp: 'id',
      width: '70%',
      align: 'start',
      viewProp: 'department_type_name'
    }
  ]
  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    setDetailsData,
    errors,
    setOpenDocumentsDialog,
    openDocumentsDialog,
    setOpenRecordInformationDialog,
    openRecordInformationDialog,
    openRecordTrackingDialog,
    setOpenRecordTrackingDialog,
    dataModel,
    closeDocumentsDialog,
    detailsHandlers
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/def/departments',
    routerUrl: { default: '/apps/def/department' },
    fields: fields,
    initialDetailsData: { department_types: [] },
    detailsTablesConfig: {
      department_types: { fields: detailsFields, trackIndex: true }
    }
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  if (!dictionary) return <Shared.LoadingSpinner type='skeleton' />
  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`department`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        {/* Render the dynamic details section using DynamicFormTable */}

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={detailsFields}
            title='department_types'
            initialData={detailsData['department_types']} // Pass the details data
            onDataChange={detailsHandlers?.department_types} // Update specific details data
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'department_types')} // Filter errors for this table
            locale={locale}
            dataObject={dataModel}
            apiEndPoint={`/def/departments/${dataModel.id}/department_types`}
            detailsKey='department_types'
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormMapCard
            dictionary={dictionary}
            mode={mode}
            coordinateFields={[{ name: ['y_axis', 'x_axis'], title: dictionary?.location || 'الموقع' }]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>

        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.FileUploadWithTabs
            open={openDocumentsDialog}
            onClose={() => closeDocumentsDialog()}
            locale={locale}
            attachments={dataModel.attachments}
            recordId={dataModel.id}
          />
        </Shared.Grid> */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            dataModel={dataModel}
            open={openRecordInformationDialog}
            onClose={() => setOpenRecordInformationDialog(false)}
            locale={locale}
          />
        </Shared.Grid>
        {/*
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordTracking
            apiEndPoint='/def/user-profile'
            columns={trackingColumns}
            open={openRecordTrackingDialog}
            onClose={() => setOpenRecordTrackingDialog(false)}
            locale={locale}
          />
        </Shared.Grid> */}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default DepartmentDetails
