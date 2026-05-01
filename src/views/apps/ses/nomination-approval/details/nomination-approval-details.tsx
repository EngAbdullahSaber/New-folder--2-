'use client'

import { useState } from 'react'
import * as Shared from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'
import { getDictionary } from '@/utils/getDictionary'
import { useNominationApprovalForm } from '../hooks/useNominationApprovalForm'

const NominationApprovalDetails = ({ scope }: ComponentGeneralProps) => {
  const {
    selectedDepartment,
    setSelectedDepartment,
    approved_jobs,
    setApprovedJobs,
    user,
    accessToken,
    departmentOptions,
    personal,
    status,
    fields,
    budgetFields,
    nominatingApprovalsFields,
    candidateFields,
    formMethods,
    recordId,
    mode,
    handleMenuOptionClick,
    handleCancel,
    locale,
    updateDetailsData,
    staticFields,
    detailsData,
    statusViewFields,
    setDetailsData,
    getDetailsErrors,
    closeDocumentsDialog,
    searchFields,
    statusFields,
    onSubmit,
    handleSaveWrapper,
    handleSelectAll,
    handleToggleRow,
    handleRejectCandidates,
    selectionColumns,
    openRecordInformationDialog,
    closeRecordInformationDialog,
    dataModel
  } = useNominationApprovalForm({ scope })

  const isElectedFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'is_elected',
      label: 'is_elected',
      type: 'iconBadge',
      visibleModes: ['edit', 'show'],
      gridSize: 12,
      options: [
        {
          value: '1',
          label: 'elected',
          icon: 'ri-check-line',
          color: 'success'
        },
        {
          value: '2',
          label: 'not_elected',
          icon: 'ri-close-line',
          color: 'error'
        }
      ]
    },

    {
      name: 'job_id',
      label: 'job',
      type: 'select',
      requiredModes: ['add', 'edit'],
      showWhen: {
        field: 'is_elected',
        value: '1'
      },
      // apiUrl: '/ses/jobs',
      modeCondition: (mode: Shared.Mode) => mode,
      labelProp: 'name',
      keyProp: 'id',
      gridSize: 4,
      apiMethod: 'GET',
      viewProp: 'elected_job_name',
      visibleModes: ['show']
    },
    {
      name: 'elected_department_name',
      label: 'department',
      type: 'select',
      showWhen: {
        field: 'is_elected',
        value: '1'
      },
      apiUrl: '/def/seasonal-departments',
      labelProp: 'department_name_ar',
      selectFirstValue: true,
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      queryParams: { internal_department: true },
      requiredModes: ['add', 'edit'],
      visibleModes: ['show'],
      gridSize: 4,
      viewProp: 'elected_department_name',
      onChange(value: any) {}
    },

    {
      name: 'elected_period_name',
      label: 'period',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => 'show',
      gridSize: 4,
      visibleModes: ['show']
    },

    {
      name: 'elected_start_date',
      label: 'nomination_start_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_elected',
        value: '1'
      }
    },
    {
      name: 'elected_end_date',
      label: 'end_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_elected',
        value: '1'
      }
    },
    {
      name: 'elected_days',
      label: 'work_days',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_elected',
        value: '1'
      }
    },
    {
      name: 'elected_daily_price',
      label: 'daily_salary',
      type: 'amount',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_elected',
        value: '1'
      }
    },
    {
      name: 'elected_bonus',
      label: 'bonus',
      type: 'amount',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_elected',
        value: '1'
      }
    },
    {
      name: 'ageer_contract_no',
      label: 'ageer_contract_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_elected',
        value: '1'
      }
    }
  ]

  const contractApprovalFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'is_appointed',
      label: 'contract_sign_approval_status',
      type: 'iconBadge',
      visibleModes: ['edit', 'show'],
      gridSize: 12,
      options: [
        {
          value: '1',
          label: 'contract_sign_approval_status_approved',
          icon: 'ri-check-line',
          color: 'success'
        },
        {
          value: '2',
          label: 'contract_sign_approval_status_rejected',
          icon: 'ri-close-line',
          color: 'error'
        }
      ]
    },

    {
      name: 'appointed_job_name',
      label: 'job',
      type: 'select',
      requiredModes: ['add', 'edit'],
      apiUrl: '/ses/jobs',
      modeCondition: (mode: Shared.Mode) => mode,
      labelProp: 'name',
      keyProp: 'id',
      gridSize: 4,
      apiMethod: 'GET',
      viewProp: 'appointed_job_name',
      visibleModes: ['show'],
      showWhen: {
        field: 'is_appointed',
        value: '1'
      }
    },

    {
      name: 'appointed_department_name',
      label: 'department',
      type: 'select',
      apiUrl: '/def/seasonal-departments',
      labelProp: 'department_name_ar',
      selectFirstValue: true,
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      queryParams: { internal_department: true },
      requiredModes: ['add', 'edit'],
      visibleModes: ['show'],
      gridSize: 4,
      viewProp: 'appointed_department_name',
      onChange(value: any) {},
      showWhen: {
        field: 'is_appointed',
        value: '1'
      }
    },

    // {
    //   name: 'appointed_period_name',
    //   label: 'period',
    //   type: 'text',
    //   modeCondition: (mode: Shared.Mode) => 'show',
    //   gridSize: 4,
    //   visibleModes: ['show']
    // },

    {
      name: 'appointed_period_name',
      label: 'period',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => 'show',
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_appointed',
        value: '1'
      }
    },

    {
      name: 'appointed_start_date',
      label: 'nomination_start_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_appointed',
        value: '1'
      }
    },
    {
      name: 'appointed_end_date',
      label: 'end_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_appointed',
        value: '1'
      }
    },
    {
      name: 'appointed_days_no',
      label: 'work_days',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_appointed',
        value: '1'
      }
    },
    {
      name: 'appointed_daily_price',
      label: 'daily_salary',
      type: 'amount',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_appointed',
        value: '1'
      }
    },
    {
      name: 'appointed_bonus',
      label: 'bonus',
      type: 'amount',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['show'],
      showWhen: {
        field: 'is_appointed',
        value: '1'
      }
    }
  ]

  const [dictionary, setDictionary] = useState<any>(null)

  Shared.useEffect(() => {
    getDictionary(locale as Shared.Locale).then(res => setDictionary(res))
  }, [locale])

  // Animation for the info button
  const pulseKeyframes = `
    @keyframes pulse-info {
      0% { box-shadow: 0 0 0 0 rgba(38, 198, 249, 0.4); transform: scale(1); }
      50% { box-shadow: 0 0 0 10px rgba(38, 198, 249, 0); transform: scale(1.02); }
      100% { box-shadow: 0 0 0 0 rgba(38, 198, 249, 0); transform: scale(1); }
    }
  `

  return (
    <Shared.FormProvider {...formMethods}>
      <style>{pulseKeyframes}</style>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`nomination_season_employees`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>
        {mode !== 'search' && mode !== 'show' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
          </Shared.Grid>
        )}
        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={[...fields, ...budgetFields, ...nominatingApprovalsFields]}
            mode={mode}
            screenMode={mode}
            detailsConfig={[
              { key: 'nominating_approvals_users', fields: nominatingApprovalsFields, title: 'nominating_users' }
            ]}
          />
        </Shared.Grid>
        {mode === 'show' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={staticFields}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'personal_info' }}
            />
          </Shared.Grid>
        )}
        {mode === 'show' && (
          <>
            <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormComponent
                locale={locale}
                fields={isElectedFields}
                mode={mode}
                screenMode={mode}
                headerConfig={{ title: 'elected_info' }}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormComponent
                locale={locale}
                fields={contractApprovalFields}
                mode={mode}
                screenMode={mode}
                headerConfig={{ title: 'contract_approval_info' }}
              />
            </Shared.Grid>
            {/* <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormComponent
                locale={locale}
                fields={statusViewFields}
                mode={mode}
                screenMode={mode}
                headerConfig={{ title: 'status' }}
              />
            </Shared.Grid> */}
          </>
        )}
        {/* Search Mode Section */}
        {mode === 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={searchFields}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'personal_info' }}
            />
          </Shared.Grid>
        )}
        {mode === 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={statusFields}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'status' }}
            />
          </Shared.Grid>
        )}
        {mode === 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormActions onSaveSuccess={onSubmit} onCancel={handleCancel} mode={mode} locale={locale} />
          </Shared.Grid>
        )}
        {mode === 'add' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.GenericSelectionTable
              data={detailsData['candidates'] || []}
              columns={selectionColumns}
              onToggleAll={handleSelectAll}
              onToggleRow={handleToggleRow}
              onUpdateRow={(index, data) => updateDetailsData('candidates', data, index)}
              dictionary={dictionary}
              locale={locale as string}
              mode={mode}
              idKey='nomination_id'
              emptyConfig={{
                condition: !!selectedDepartment,
                message: dictionary?.messages?.please_select_department || 'يرجى اختيار الإدارة أولاً',
                icon: 'tabler-info-circle'
              }}
            />
          </Shared.Grid>
        )}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            open={openRecordInformationDialog}
            onClose={() => closeRecordInformationDialog()}
            locale={locale}
            dataModel={dataModel}
          />
        </Shared.Grid>
        {mode === 'add' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormActions
              saveLabelKey='approve_candidates'
              onSaveSuccess={handleSaveWrapper}
              onCancel={handleCancel}
              mode={mode}
              locale={locale}
            >
              <Shared.Button variant='contained' color='error' onClick={handleRejectCandidates}>
                {dictionary?.actions?.reject_candidates || 'Reject Candidates'}
              </Shared.Button>
            </Shared.FormActions>
          </Shared.Grid>
        )}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default NominationApprovalDetails
