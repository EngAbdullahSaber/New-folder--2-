'use client'

import * as Shared from '@/shared'
import { useMemo } from 'react'

// const trackingColumns = [
//   { accessorKey: 'action', header: 'process_type', icon: { color: '#FDC453', name: 'ri-edit-2-fill' } },
//   { accessorKey: 'id', header: 'id' },
//   {
//     accessorKey: 'department_name_ar',
//     header: 'name'
//   }
// ]
// const recordInformations = [
//   {
//     action: 1,
//     user_name: 'يوسف محمد محجوب',
//     date: '12-10-2024',
//     time: '12:45',
//     deviceIpAddress: '10.100.100.1'
//   },
//   {
//     action: 2,
//     user_name: 'يوسف محمد محجوب',
//     date: '12-10-2024',
//     time: '12:45',
//     deviceIpAddress: '10.100.100.1'
//   },
//   {
//     action: 3,
//     user_name: 'يوسف محمد محجوب',
//     date: '12-10-2024',
//     time: '12:45',
//     deviceIpAddress: '10.100.100.1'
//   }
// ]

const SeasonalDepartmentDetails = () => {
  const { user, accessToken } = Shared.useSessionHandler()
  const [isFetching, setIsFetching] = Shared.useState(false)
  const { shouldBlockAccess, AccessBlockedScreen, locale } = Shared.useCityAccess()

  // ✅ FIX: Memoize fields array to prevent recreation on every render
  const fields: Shared.DynamicFormFieldProps[] = useMemo(
    () => [
      {
        name: 'id',
        label: 'id',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'season',
        label: 'season',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        autoFill: true,
        gridSize: 4
      },
      {
        name: 'department_id',
        label: 'department',
        type: 'select',
        apiUrl: '/def/departments',
        labelProp: 'department_name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: ['add', 'edit'],
        gridSize: 4,
        viewProp: 'department_name_ar',
        onChange: res => {
          if (res.value) {
            Shared.fetchRecordById('/def/departments', res.value, accessToken, 'ar', (data: any) => {
              if (data?.department_types) {
                // Add rowChanged: true to each row
                const updatedTypes = data.department_types.map((row: any) => ({
                  ...row,
                  rowChanged: true
                }))

                setDetailsData(prev => ({
                  ...prev,
                  seasonal_departments_types: updatedTypes
                }))
              }
            })
          } else {
            // Clear the details when department is deselected
            setDetailsData(prev => ({
              ...prev,
              seasonal_departments_types: []
            }))
          }

          if (res.object) {
            if (res.object.short_name_ar) setValue('short_name_ar', res.object.short_name_ar)
            if (res.object.short_name_la) setValue('short_name_la', res.object.short_name_la)
          }
        }
      },

      {
        name: 'short_name_ar',
        label: 'short_name_ar',
        type: 'text',
        gridSize: 2,
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'short_name_en',
        label: 'short_name_la',
        type: 'text',
        gridSize: 2,
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode
      },

      {
        name: 'parent_department_id',
        label: 'main_department',
        type: 'select',
        apiUrl: '/def/departments',
        labelProp: 'department_name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'parent_department.department_name_ar'
      },

      {
        name: 'manger_id',
        label: 'department_manager',
        type: 'select',
        apiUrl: '/def/personal',
        labelProp: 'id',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        displayProps: ['id_no', 'full_name_ar'],
        gridSize: 4,
        cache: false,
        viewProp: 'personal.full_name_ar'
      },

      {
        name: 'location_id',
        label: 'location',
        type: 'select',
        apiUrl: '/def/locations',
        labelProp: 'name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      {
        name: 'order_no',
        label: 'order_no',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: ['add', 'edit'],
        gridSize: 4
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
        gridSize: 4,
        apiMethod: 'GET'
      },
      {
        name: 'status',
        label: 'status',
        type: 'select',
        options: Shared.statusList,
        defaultValue: '1',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      }
    ],
    []
  ) // ✅ Empty dependency array - fields definition never changes

  // ✅ FIX: Memoize detailsFields array
  const detailsFields: Shared.DynamicFormTableFieldProps[] = useMemo(
    () => [
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

        //lovKeyName: 'id'
      }
    ],
    [accessToken]
  ) // ✅ Empty dependency array - fields definition never changes

  type DepartmentFormData = Shared.InferFieldType<typeof fields>

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
    detailsHandlers,
    closeRecordInformationDialog
  } = Shared.useRecordForm<DepartmentFormData>({
    apiEndpoint: '/def/seasonal-departments',
    routerUrl: { default: '/apps/def/seasonal-department' },
    fields: fields,
    initialDetailsData: { seasonal_departments_types: [] },
    detailsTablesConfig: {
      seasonal_departments_types: { fields: detailsFields, trackIndex: true }
    }
  })

  const { setValue } = formMethods
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`seasonal_departments`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} dataObject={dataModel} />
        </Shared.Grid>

        {/* Render the dynamic details section using DynamicFormTable */}

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={detailsFields}
            title='department_types'
            initialData={detailsData['seasonal_departments_types']} // Pass the details data
            onDataChange={detailsHandlers?.seasonal_departments_types}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'seasonal_departments_types')} // Filter errors for this table
            locale={locale}
            apiEndPoint='/def/departments/deleteDetails'
            detailsKey='seasonal_departments_types'
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
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
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default SeasonalDepartmentDetails
