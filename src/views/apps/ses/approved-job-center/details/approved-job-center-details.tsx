'use client'

import CustomBadge from '@/@core/components/mui/Badge'
import * as Shared from '@/shared'

const ApprovedJobCenterDetails = () => {
  const [selectedDepartment, setSelectedDepartment] = Shared.useState<number | null>(null)
  const [selectedEmpAllowance, setSelectedEmpAllowance] = Shared.useState<Record<number, number>>({}) // Define the fields with validation and default values
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
      type: 'number',
      // requiredModes: ['add', 'edit'],
      // modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'seasonal_department_id',
      label: 'seasonal_department',
      type: 'select',
      apiUrl: '/def/seasonal-departments',
      labelProp: 'department_name_ar',
      modeCondition: (mode: Shared.Mode) => mode,
      keyProp: 'id',
      required: true,
      multiple: false,
      width: '50%',
      gridSize: 4,
      onChange: result => {
        setValue('job_id', '')
        setSelectedDepartment(null)
        if (result && result !== null) {
          setSelectedDepartment(Number(result.object['department_id']))
        }
      },
      viewProp: 'seasonal_department.department_name_ar'
    },

    // /job classification type
    {
      name: 'job_id',
      label: 'job',
      type: 'select',
      requiredModes: ['add', 'edit'],
      apiUrl: selectedDepartment ? `/ses/jobs/${selectedDepartment}` : undefined,
      modeCondition: (mode: Shared.Mode) => mode,
      labelProp: 'name',
      keyProp: 'id',
      gridSize: 4,
      apiMethod: 'GET',
      // queryParams: selectedDepartment ? { department_id: selectedDepartment } : {},
      viewProp: 'job.name',
      onChange: res => {
        if (res && res.object) {
          setValue('job_description', res?.object?.job_description_template)
          setValue('tasks', res?.object?.tasks_template)
        }
      }
    },

    {
      name: 'custom_job_name',
      label: 'custom_job_name',
      type: 'text',
      // requiredModes: ['add', 'edit'],
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
      name: 'max_employees',
      label: 'max_employees',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'max_work_days',
      label: 'max_work_days',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'max_non_saudi_percentage',
      label: 'max_non_saudi_percentage',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 2
    },

    {
      name: 'max_female_percentage',
      label: 'max_female_percentage',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 2
    },

    {
      name: 'company_approved',
      label: 'company_approved',
      type: 'select',
      options: Shared.otherYesNoList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'need_approval',
      label: 'need_approval',
      type: 'select',
      options: Shared.yesNoList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'allocated_percentage',
      label: 'allocated_percentage',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    {
      name: 'tasks',
      label: 'tasks',
      type: 'rich_text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    {
      name: 'job_description',
      label: 'job_description',
      requiredModes: ['add', 'edit'],
      type: 'rich_text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const staticJobAllowancesFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'seasonal_employee_allowances_id',
      label: 'seasonal_employee_allowances',
      type: 'select',
      apiUrl: '/ses/allowance-types-active',
      labelProp: 'name',
      keyProp: 'id',
      required: true,
      width: '50%',
      apiMethod: 'GET',
      viewProp: 'allowance_type.name'
    },
    {
      name: 'max_employees_per_day',
      label: 'max_employees_per_day',
      type: 'number',
      required: true,
      width: '25%'
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      width: '15%'
    }
  ]
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
    apiEndpoint: '/ses/approved-job-centers',
    routerUrl: { default: '/apps/ses/approved-job-center' },
    fields: fields,
    initialDetailsData: {
      job_allowances: []
    },
    detailsTablesConfig: {
      job_allowances: { fields: staticJobAllowancesFields, trackIndex: true }
    }
  })

  const jobAllowancesFields = Shared.useMemo(() => {
    return staticJobAllowancesFields.map(field => {
      if (field.name === 'seasonal_employee_allowances_id') {
        return {
          ...field,
          onChange(value: any, rowIndex: number, object: any) {
            const scope = Number(object?.allowance_scope)

            setSelectedEmpAllowance(prev => ({
              ...prev,
              [rowIndex]: scope
            }))
          }
        }
      }

      if (field.name === 'max_employees_per_day') {
        return {
          ...field,
          disableField: (_: any, rowIndex: number) => selectedEmpAllowance[rowIndex] === 1
        }
      }

      return field
    })
  }, [detailsData])

  const { setValue } = formMethods

  Shared.useEffect(() => {
    setSelectedDepartment(dataModel?.department_id)
  }, [dataModel?.department_id])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`approved_job_centers`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            detailsConfig={[{ key: 'job_allowances', fields: jobAllowancesFields as any, title: 'job_allowance' }]}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={jobAllowancesFields as any}
            title='job_allowance'
            initialData={detailsData['job_allowances']} // Pass the details data
            onDataChange={detailsHandlers?.job_allowances}
            mode={mode}
            errors={getDetailsErrors('job_allowances')}
            // apiEndPoint='/ses/job-allowances'
            apiEndPoint={`/ses/approved-job-centers/${dataModel.id}/job_allowances`}
            detailsKey='job_allowances'
            locale={locale}
            rowModal={false}
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

export default ApprovedJobCenterDetails
