'use client'

import * as Shared from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'
import { stat } from 'fs'
import { useAppSettings } from '../../seasonal-job-request/details/hooks'

// Define the fields with validation and default values
const staticFields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'personal_picture',
    label: 'personal_picture',
    type: 'personal_picture',
    gridSize: 12,
    modeCondition: mode => mode,
    visibleModes: ['edit', 'show']
    // requiredModes: ['add', 'edit']
  },
  {
    name: 'request_no',
    label: 'request_no',
    type: 'number',
    gridSize: 3,
    autoFill: true,
    modeCondition: (mode: Shared.Mode) => {
      return mode === 'search' ? mode : 'show'
    }
  },

  {
    name: 'id_no',
    label: 'id_no',
    type: 'number',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => {
      return mode === 'search' ? mode : 'show'
    },
    gridSize: 3
    // modal: 'personal'
  },

  {
    name: 'iban_no',
    label: 'iban',
    type: 'iban',
    visibleModes: ['search'],
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => mode,
    acceptedIbans: ['SA'],
    validateIban: true
  },

  {
    name: 'personal_id',
    label: 'personal_id',
    type: 'number',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => {
      return mode === 'search' ? mode : 'show'
    },
    width: '10%',
    viewProp: 'personal_id'
  },

  {
    name: 'gender_desc',
    label: 'gender',
    visibleModes: ['edit', 'show'],
    type: 'select',
    options: Shared.genderOptions,
    gridSize: 3,
    modal: 'personal',
    viewProp: 'personal.gender',
    modeCondition: (mode: Shared.Mode) => {
      return mode === 'search' ? mode : 'show'
    }
  },

  {
    name: 'personal_name',
    label: 'employee_name',
    type: 'text',
    gridSize: 4,

    modeCondition: (mode: Shared.Mode) => {
      return mode === 'search' ? mode : 'show'
    },
    width: '10%',
    viewProp: 'personal_name',
    searchProps: ['id_no', 'full_name_ar', 'id']
  },

  // {
  //   name: 'personal_id',
  //   label: 'employee_name',
  //   type: 'select',
  //   apiUrl: '/def/personal',
  //   labelProp: 'id',
  //   keyProp: 'id',
  //   modeCondition: (mode: Shared.Mode) => {
  //     return mode === 'search' ? mode : 'show'
  //   },
  //   displayProps: ['id', 'full_name_ar'],
  //   gridSize: 4,
  //   cache: false,
  //   width: '25%',
  //   viewProp: 'personal_name'
  // },

  // {
  //   name: 'personal_name',
  //   label: 'employee_name',
  //   type: 'text',
  //   // requiredModes: ['add', 'edit'],
  //   modeCondition: (mode: Shared.Mode) => {
  //     return mode === 'search' ? mode : 'show'
  //   },
  //   gridSize: 4,
  //   viewProp: 'personal.full_name_ar'
  // },

  {
    name: 'nation_id',
    label: 'nation_id',
    type: 'select',
    apiUrl: '/def/nationalities',
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => {
      return mode === 'search' ? mode : 'show'
    },
    //lovKeyName: 'id',
    gridSize: 4,
    viewProp: 'nation_name'
  },

  {
    name: 'elected_period_id',
    label: 'time_period',
    type: 'select',
    apiUrl: '/ses/time-periods',
    requiredModes: [],
    labelProp: 'period_name',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4,
    viewProp: 'elected_period_name'
  },

  {
    name: 'gender',
    label: 'gender',
    type: 'select',
    options: Shared.genderOptions,
    gridSize: 4,
    visibleModes: ['search'],
    modeCondition: (mode: Shared.Mode) => {
      return mode === 'search' ? mode : 'show'
    }
  },

  {
    name: 'id_file',
    label: 'file_id',
    type: 'file',
    fileableType: 'ses_requests',
    modeCondition: (mode: Shared.Mode) => {
      return mode
    },
    gridSize: 6,
    visibleModes: ['edit', 'show']
  },
  {
    name: 'experience_certificate',
    label: 'experience_certificate',
    fileableType: 'ses_requests',
    type: 'file',
    gridSize: 6,
    modeCondition: mode => mode,
    visibleModes: ['edit', 'show']
  },
  {
    name: 'resume',
    label: 'resume',
    fileableType: 'ses_requests',
    type: 'file',
    gridSize: 6,
    modeCondition: mode => mode,
    // requiredModes: ['add', 'edit'],
    visibleModes: ['edit', 'show']
  },
  {
    name: 'national_address_file',
    label: 'national_address_file',
    type: 'file',
    fileableType: 'ses_requests',
    gridSize: 6,
    modeCondition: mode => mode,
    // requiredModes: ['add', 'edit'],
    visibleModes: ['edit', 'show']
  },

  {
    name: 'bank_id',
    label: 'bank_code',
    type: 'select',
    apiUrl: '/def/banks',
    labelProp: 'name_ar',
    keyProp: 'id',
    gridSize: 4,
    visibleModes: ['search'],
    modeCondition: (mode: Shared.Mode) => mode,
    viewProp: 'bank_name'
  },

  // {
  //   name: 'account_type',
  //   label: 'payment_method',
  //   visibleModes: ['search'],
  //   type: 'select',
  //   options: Shared.shrPaymentMethodList,
  //   // requiredModes: ['add', 'edit'],
  //   modeCondition: (mode: Shared.Mode) => mode,
  //   gridSize: 4
  // },

  {
    name: 'elected_department_id',
    label: 'department',
    type: 'select',
    apiUrl: '/def/seasonal-departments',
    visibleModes: ['search'],
    labelProp: 'department_name_ar',
    // selectFirstValue: true,
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    queryParams: { internal_department: true },
    gridSize: 4,
    viewProp: 'request_status.elected_department_name',
    onChange(value: any) {}
  },

  {
    name: 'elected_job_id',
    label: 'job',
    type: 'select',
    apiUrl: '/sys/list/21',
    labelProp: 'name',
    keyProp: 'id',
    // required: true,
    visibleModes: ['search'],
    apiMethod: 'GET',
    viewProp: 'job.name',
    gridSize: 4
  }

  // {
  //   name: 'contract_type_id',
  //   label: 'contract_type',
  //   type: 'select',
  //   apiUrl: '/acs/contract-types',
  //   keyProp: 'id',
  //   labelProp: 'contract_type_name_ar',
  //   // requiredModes: ['add', 'edit'],
  //   visibleModes: ['search'],
  //   gridSize: 4,
  //   viewProp: 'contract_type.contract_type_name_ar'
  // }
]
const statusFields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'is_elected',
    label: 'is_elected_done',
    type: 'select',
    options: Shared.yesNoList,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'is_appointed',
    label: 'is_appointed_done',
    type: 'select',
    options: Shared.yesNoList,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'emp_nomination_approval_status',
    label: 'approval_electing_done',
    type: 'select',
    options: Shared.yesNoList,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'doc_verification_approval_status',
    label: 'papers_audit_done',
    type: 'select',
    options: Shared.papersAuditListStatus,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'hr_approval_status',
    label: 'hr_approval_status_done',
    type: 'select',
    options: Shared.papersAuditListStatus,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'contract_sign_approval_status',
    label: 'contract_sign_approval_status_done',
    type: 'select',
    options: Shared.yesNoList,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },
  {
    name: 'card_printing_approval_status',
    label: 'card_printing_approval_status_done',
    type: 'select',
    options: Shared.cardPrintingStatusList,
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  }
]

const desireFields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'elected_period_id',
    label: 'time_period',
    type: 'select',
    apiUrl: '/ses/time-periods',
    requiredModes: [],
    labelProp: 'period_name',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4,
    viewProp: 'time_period.period_name'
  },
  {
    name: 'elected_job_id',
    label: 'job',
    type: 'select',
    apiUrl: '/sys/list/21',
    labelProp: 'name',
    keyProp: 'id',
    required: true,
    visibleModes: ['search'],
    apiMethod: 'GET',
    viewProp: 'job.name',
    gridSize: 4
  }
]
const bankFields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'bank_id',
    label: 'bank_code',
    type: 'select',
    apiUrl: '/def/banks',
    labelProp: 'name_ar',
    keyProp: 'id',
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => mode,

    viewProp: 'bank_name'
  },
  {
    name: 'iban_no',
    label: 'iban',
    type: 'iban',
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => mode,
    acceptedIbans: ['SA'],
    validateIban: true
  },
  {
    name: 'bank_iban_file',
    label: 'iban_file',
    visibleModes: ['add', 'edit', 'show'],
    type: 'file',
    fileableType: 'ses_requests',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  }
]

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
    viewProp: 'elected_bonus',
    showWhen: {
      field: 'is_elected',
      value: '1'
    }
  }
]

const electedAprovalFields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'reviewed_approval_status',
    label: 'reviewed_approval_status',
    type: 'iconBadge',
    options: [
      {
        value: '1',
        label: 'reviewed_approval_status_approved',
        icon: 'ri-check-line',
        color: 'success'
      },
      {
        value: '2',
        label: 'not_reviewed_approval_status',
        icon: 'ri-close-line',
        color: 'error'
      }
    ]
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
    viewProp: 'appointed_bonus',
    showWhen: {
      field: 'is_appointed',
      value: '1'
    }
  }
]

const allFields = [
  ...staticFields,
  ...statusFields,
  ...desireFields,
  ...isElectedFields,
  ...electedAprovalFields,
  ...contractApprovalFields,
  ...bankFields
]

type pathFormData = Shared.InferFieldType<typeof allFields>
const classifiedObjects: any[] = []
const routerUrlConfig = { default: `/apps/ses/card-printing` }

const CardPrintingDetails = () => {
  const { personal, user, accessToken } = Shared.useSessionHandler()

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    openDocumentsDialog,
    closeDocumentsDialog,
    navigateWithQuery,
    dataModel,
    router,
    getDirtyValues,
    recordId,
    dirtyFields,
    getExcludedFieldNames,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<pathFormData>({
    apiEndpoint: '/ses/requests-status',
    routerUrl: routerUrlConfig,
    fields: allFields,
    classifiedObjects
  })

  const appSettings = useAppSettings(accessToken, mode, dataModel?.id, (locale as string) || 'ar', formMethods, false)

  const onSubmitRequestStatus = async (data: any) => {
    try {
      const dirtyMasterData = mode === 'edit' ? getDirtyValues(data, dirtyFields, dataModel.id) : {}

      if (mode === 'edit') {
        const excludedNames = getExcludedFieldNames()
        Object.keys(dirtyMasterData).forEach(key => {
          if (key !== 'id' && excludedNames.includes(key)) {
            delete dirtyMasterData[key]
          }
        })
      }
      const response = await Shared.handleSave(
        '/ses/requests',
        locale as Shared.Locale,
        dirtyMasterData,
        recordId,
        accessToken,
        true
      )
      // navigateWithQuery(`/apps/ses/request-status/${scope}/list`, router, locale as Shared.Locale)
    } catch (error) {
      console.error('Error reviewing request:', error)
    }
  }

  const allFieldsMapped = Shared.useMemo(() => {
    return allFields.map(field => {
      if (field.name === 'job_id' || field.name === 'elected_job_id') {
        return {
          ...field,

          options:
            appSettings?.app_setting_desires?.map((item: any) => ({
              ...item,
              label: item.name,
              value: item.job_id
            })) ?? []
        }
      }

      return field
    })
  }, [appSettings])

  const getMapped = (fieldsArr: Shared.DynamicFormFieldProps[]) => {
    return fieldsArr.map(f => allFieldsMapped.find(am => am.name === f.name) || f)
  }

  const staticFieldsMapped = getMapped(staticFields)
  const statusFieldsMapped = getMapped(statusFields)
  const desireFieldsMapped = getMapped(desireFields)
  const isElectedFieldsMapped = getMapped(isElectedFields)
  const electedAprovalFieldsMapped = getMapped(electedAprovalFields)
  const contractApprovalFieldsMapped = getMapped(contractApprovalFields)
  const bankFieldsMapped = getMapped(bankFields)

  Shared.useEffect(() => {
    if (dataModel && (mode === 'show' || mode === 'edit')) {
      const { elected_daily_price, elected_days, appointed_daily_price, appointed_days_no } = dataModel

      const dailyPrice = Number(elected_daily_price)
      const days = Number(elected_days)

      if (!isNaN(dailyPrice) && !isNaN(days)) {
        formMethods.setValue('elected_bonus', dailyPrice * days)
      }

      const appDailyPrice = Number(appointed_daily_price)
      const appDays = Number(appointed_days_no)

      if (!isNaN(appDailyPrice) && !isNaN(appDays)) {
        formMethods.setValue('appointed_bonus', appDailyPrice * appDays)
      }
    }
  }, [mode, dataModel, formMethods])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`ses_request_status`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent locale={locale} fields={staticFieldsMapped} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={staticFieldsMapped} mode={mode} screenMode={mode} />
        </Shared.Grid>

        {mode === 'search' && (
          <>
            <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormComponent
                locale={locale}
                fields={statusFieldsMapped}
                mode={mode}
                screenMode={mode}
                headerConfig={{ title: 'status' }}
              />
            </Shared.Grid>

            {/* <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormComponent
                locale={locale}
                fields={desireFieldsMapped}
                mode={mode}
                screenMode={mode}
                headerConfig={{ title: 'desires' }}
              />
            </Shared.Grid> */}
          </>
        )}

        {mode !== 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={isElectedFieldsMapped}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'elected_info' }}
            />
          </Shared.Grid>
        )}

        {mode !== 'search' && mode !== 'show' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={electedAprovalFieldsMapped}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'elected_approval_info' }}
            />
          </Shared.Grid>
        )}

        {mode !== 'search' && (
          <>
            <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormComponent
                locale={locale}
                fields={contractApprovalFieldsMapped}
                mode={mode}
                screenMode={mode}
                headerConfig={{ title: 'contract_approval_info' }}
              />
            </Shared.Grid>
          </>
        )}

        {(mode === 'edit' || mode === 'show') && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={bankFieldsMapped}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'bank_info' }}
            />
          </Shared.Grid>
        )}

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
            onSaveSuccess={mode === 'search' ? onSubmit : onSubmitRequestStatus}
            mode={mode}
          />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default CardPrintingDetails
