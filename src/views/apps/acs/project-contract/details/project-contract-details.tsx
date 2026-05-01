'use client'

import { useErrorApi } from '@/contexts/errorApiProvider'
import * as Shared from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'

const ProjectContractDetails = ({ scope }: ComponentGeneralProps) => {
  const [projectContractStatus, setProjectContractStatus] = Shared.useState<number | null>(null)
  const [shouldBlockEdit, setShouldBlockEdit] = Shared.useState(false) // ✅ New state

  const { user } = Shared.useSessionHandler()

  const fields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 4
      },

      {
        name: 'contract_type_id',
        label: 'contract_type',
        type: 'select',
        apiUrl: '/acs/contract-types',
        keyProp: 'id',
        labelProp: 'contract_type_name_ar',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 4,
        viewProp: 'contract_type.contract_type_name_ar',
        disableCondition: (mode): boolean => {
          return mode !== 'search' && scope === 'user'
        }
      },

      {
        name: 'status',
        label: 'status',
        type: 'select',
        modeCondition: (mode: Shared.Mode) => {
          // ✅ Fixed: Check if blocked for user scope
          if (shouldBlockEdit && scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 4,
        requiredModes: ['add', 'edit'],
        options: Shared.projectContractRequestStatus,
        defaultValue: '1'
      },

      {
        name: 'project_m_id',
        label: 'project_name',
        type: 'select',
        apiUrl: `/acs/projects`,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 4,
        keyProp: 'id',
        labelProp: 'project_name',
        viewProp: 'project.project_name',
        disableCondition: (mode): boolean => {
          return mode !== 'search' && scope === 'user'
        },
        onChange: res => {
          if (res && res.value) {
            setValue('contract_budget', res?.object?.project_budget)
          }
        }
      },

      {
        name: 'contractor_company_id',
        label: 'contractor_company',
        type: 'select',
        apiUrl: `/acs/contractor-companies`,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 4,
        keyProp: 'id',
        labelProp: 'contractor_company_name_ar',
        viewProp: 'contractor_company.contractor_company_name_ar',
        disableCondition: (mode): boolean => {
          return mode !== 'search' && scope === 'user'
        }
      },

      {
        name: 'contract_budget',
        label: 'contract_budget',
        type: 'amount',
        modeCondition: (mode: Shared.Mode) => {
          // if (scope === 'user') {
          //   return 'show'
          // }
          return 'show'
        },
        gridSize: 4,
        requiredModes: ['add', 'edit'],
        disableCondition: (mode): boolean => {
          return mode !== 'search' && scope === 'user'
        }
      },

      {
        name: 'contract_statment',
        label: 'contract_statment',
        type: 'rich_text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 12,
        disableCondition: (mode): boolean => {
          return mode !== 'search' && scope === 'user'
        }
      },

      {
        name: 'project_contract_desc',
        label: 'contract_desc',
        type: 'rich_text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 12,
        disableCondition: (mode): boolean => {
          return mode !== 'search' && scope === 'user'
        }
      },

      {
        name: 'remark',
        label: 'remarks',
        type: 'rich_text',
        modeCondition: (mode: Shared.Mode) => {
          if (scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 12
      },

      {
        name: 'notes',
        label: 'remarks',
        type: 'rich_text',
        modeCondition: (mode: Shared.Mode) => {
          // ✅ Fixed: Simplified logic
          if (shouldBlockEdit && scope === 'user') {
            return 'show'
          }
          return mode
        },
        gridSize: 12,
        visible: scope === 'user' // ✅ Only show for user scope
      }
    ],
    [user?.personal_id, shouldBlockEdit, scope] // ✅ Updated dependency
  )

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const contractInstalmentFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'due_date',
        label: 'due_date',
        type: 'date',
        width: '30%',
        gridSize: 6
      },
      {
        name: 'instalment_amount',
        label: 'due_amount',
        type: 'number',
        width: '30%',
        gridSize: 6
      },
      {
        name: 'remark',
        label: 'remarks',
        type: 'rich_text',
        hideInTable: true,
        gridSize: 12
      }
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
    getDetailsErrors,
    detailsData,
    loadDynamicExtraFields,
    detailsHandlers,
    setDetailsData,
    closeDocumentsDialog,
    openDocumentsDialog,
    dynamicExtraFields,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: `/acs/${scope == 'user' ? 'my-project-contracts' : 'project-contracts'}`,
    routerUrl: { default: `/apps/acs/project-contract/${scope}` },
    fields: fields,
    initialDetailsData: {
      project_contract_installments: []
    },
    detailsTablesConfig: {
      project_contract_installments: { fields: contractInstalmentFields, trackIndex: true }
    }
    // excludeFields:
    //   scope === 'user'
    //     ? [
    //         { action: 'add', fields: fields.slice(0, 9) },
    //         { action: 'edit', fields: fields.slice(0, 9) }
    //       ]
    //     : []
  })

  const { setValue, getValues } = formMethods
  const { setError } = useErrorApi()

  // ✅ Reset states when mode/recordId changes
  Shared.useEffect(() => {
    setProjectContractStatus(null)
    setShouldBlockEdit(false)
  }, [mode, dataModel?.id])

  // ✅ Handle status changes and edit blocking
  Shared.useEffect(() => {
    if (!dataModel?.status) return

    const statusValue = Number(dataModel.status)
    setProjectContractStatus(statusValue)

    // ✅ Check if edit should be blocked for user scope
    if (scope === 'user' && mode === 'edit') {
      const editableStatuses = [1, 2]

      if (!editableStatuses.includes(statusValue)) {
        setShouldBlockEdit(true)

        const statusMessage = Shared.CONTRACT_STATUS_MESSAGES[String(statusValue)] || 'في حالته الحالية'

        // ✅ Set error with a slight delay to ensure it persists
        const timer = setTimeout(() => {
          setError(`لا يمكن تعديل طلب التعاقد نظرًا لأنه ${statusMessage}`)
        }, 100)

        return () => clearTimeout(timer)
      } else {
        setShouldBlockEdit(false)
        setError(null) // ✅ Clear error if status is editable
      }
    }
  }, [dataModel?.status, mode, scope, setError])
  // ✅ Determine effective mode for table and actions
  const effectiveMode = Shared.useMemo(() => {
    if (scope === 'user' && shouldBlockEdit) {
      return 'show'
    }
    return mode
  }, [scope, shouldBlockEdit, mode])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`project_contracts`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
            showOnlyOptions={scope == 'user' ? ['edit', 'search', 'print'] : []}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            detailsConfig={[
              { key: 'project_contract_installments', fields: contractInstalmentFields, title: 'installments' }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={contractInstalmentFields}
            title='installments'
            initialData={detailsData['project_contract_installments']}
            onDataChange={detailsHandlers?.project_contract_installments}
            mode={effectiveMode} // ✅ Use effective mode
            errors={getDetailsErrors('project_contract_installments')}
            apiEndPoint={`/acs/project-contracts/${dataModel.id}/project_contract_installments`}
            detailsKey='project_contract_installments'
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
          <Shared.FormActions
            locale={locale}
            onCancel={handleCancel}
            onSaveSuccess={onSubmit}
            mode={effectiveMode} // ✅ Use effective mode
          />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default ProjectContractDetails
