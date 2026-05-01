'use client'

import { useInfoApi } from '@/contexts/infoApiProvider'
import { useSuccessApi } from '@/contexts/successApiProvider'
import { useWarningApi } from '@/contexts/warningApiProvider'
import * as Shared from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'

const ContractorCompanyDetails = ({ scope }: ComponentGeneralProps) => {
  const [approvalNotes, setApprovalNotes] = Shared.useState<any>('')
  const [status, setStatus] = Shared.useState<any>('')

  const { user } = Shared.useSessionHandler()
  const { setWarning } = useWarningApi()

  // ✅ استخدم useMemo بدون dependencies لتجنب إعادة الإنشاء
  const createFields = Shared.useCallback(
    (currentStatus: any): Shared.DynamicFormFieldProps[] => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      },
      {
        name: 'contractor_company_name_ar',
        label: 'contractor_company_name_ar',
        type: 'text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'contractor_company_name_la',
        label: 'contractor_company_name_la',
        type: 'text',
        requiredModes: ['add', 'edit'],
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        }
      },
      {
        name: 'company_short_name',
        label: 'company_short_name',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'commercial_no',
        label: 'commercial_no',
        type: 'text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'vat_no',
        label: 'vat_no',
        type: 'text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'municipal_no',
        label: 'municipal_no',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'personal_id',
        label: 'coordinator',
        type: 'select',
        apiUrl: '/def/personal',
        labelProp: 'id',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'user') return 'show'
          return mode
        },
        displayProps: ['id_no', 'full_name_ar'],
        gridSize: 4,
        cache: false,
        viewProp: 'coordinator_name',
        defaultValue: user?.personal_id,
        disabled: scope == 'user',
        searchProps: ['id_no', 'full_name_ar', 'id']
      },
      {
        name: 'applicant_legal_status',
        label: 'applicant_legal_status',
        type: 'text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'mobile',
        label: 'mobile',
        type: 'mobile',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4,
        requiredModes: ['add', 'edit']
      },
      {
        name: 'tel',
        label: 'tel',
        type: 'mobile',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'fax',
        label: 'fax',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'email',
        label: 'email',
        type: 'email',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'address_ar',
        label: 'address_ar',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 6
      },
      {
        name: 'address_la',
        label: 'address_la',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 6
      },
      {
        name: 'x_axis',
        label: 'x_axis',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'y_axis',
        label: 'y_axis',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'status',
        label: 'status',
        type: 'select',
        options: Shared.companyContractorStatus,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'user') return 'show'
          return mode
        },
        gridSize: 4,
        defaultValue: '1',
        onChange: res => {
          if (res && res.value) {
            setStatus(res.value)
          }
        }
      },
      {
        name: 'notes',
        label: 'approval_notes',
        type: 'textarea',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'user') return 'show'
          return mode
        },
        gridSize: 12,
        // disabled: scope == 'user',
        visible: scope == 'admin',
        requiredModeCondition: (mode, values) => scope === 'admin' && Number(values.status) === 5 && mode !== 'search'
      },
      {
        name: 'remarks',
        label: 'remarks',
        type: 'rich_text',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 12
      },
      {
        name: 'files',
        label: '',
        type: 'storage',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 12,
        visibleModes: ['add', 'edit']
      },
      {
        name: 'proof_of_authority',
        label: 'proof_of_authority',
        type: 'file',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'commercial_registration',
        label: 'commercial_registration',
        type: 'file',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'chamber_of_commerce_certificate',
        label: 'chamber_of_commerce_certificate',
        type: 'file',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'zakat_income_certificate',
        label: 'zakat_income_certificate',
        type: 'file',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'vat_certificate',
        label: 'vat_certificate',
        type: 'file',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'municipality_license',
        label: 'municipality_license',
        type: 'file',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'national_address',
        label: 'national_address',
        type: 'file',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'company_profile',
        label: 'company_profile',
        type: 'file',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      },
      {
        name: 'other_attachments',
        label: 'other_attachments',
        type: 'file',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'admin') return mode
          else if ([1, 5].includes(Number(currentStatus))) {
            return mode
          } else return 'show'
        },
        gridSize: 4
      }
    ],
    [user?.personal_id, scope]
  )

  type dataModelFormData = Shared.InferFieldType<ReturnType<typeof createFields>>

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
    setDetailsData,
    detailsHandlers,
    openDocumentsDialog,
    closeDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: `/acs/${scope == 'user' ? 'my-contractor-companies' : 'contractor-companies'}`,
    routerUrl: { default: `/apps/acs/contractor-company/${scope}` },
    fields: createFields(undefined)
    // excludeFields: [
    //   { action: 'add', fields: Shared.getShowModeFields(createFields(undefined)) },
    //   { action: 'edit', fields: Shared.getShowModeFields(createFields(undefined)) }
    // ]
  })

  // ✅ استخدم watchStatus مباشرة
  const watchStatus = formMethods.watch('status')
  const watchNotes = formMethods.watch('notes')

  // ✅ أنشئ الحقول بناءً على watchStatus
  const fields = Shared.useMemo(() => createFields(watchStatus), [watchStatus, createFields])

  Shared.useEffect(() => {
    setApprovalNotes(watchNotes)
    setStatus(watchStatus)
    if (Number(watchStatus) === 5 && watchNotes && scope === 'user') {
      setWarning(String(watchNotes ?? ''))
    }
  }, [watchStatus, watchNotes, scope, setWarning])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`contractor_companies`}
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
          <Shared.FormComponent locale={locale} fields={fields.slice(0, 21)} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent
            headerConfig={{ title: 'attachments' }}
            locale={locale}
            fields={fields.slice(21)}
            mode={mode}
            screenMode={mode}
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
            mode={scope == 'admin' ? mode : ['3', '4', '2'].includes(String(watchStatus)) ? 'show' : mode}
          />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default ContractorCompanyDetails
