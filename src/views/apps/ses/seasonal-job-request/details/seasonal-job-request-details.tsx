'use client'

import * as Shared from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'
import {
  createFormFields,
  experienceFields,
  courseFields,
  interviewFields,
  interviewTableFields
} from './config/field-definitions'
import {
  createTabConfig,
  createPrintTabConfig,
  createDetailsConfig,
  INITIAL_DETAILS_DATA,
  createDetailsTablesConfig,
  createExcludeFields
} from './config/form-config'
import { createSharedFormTabConfig } from './config/table-config'
import { useNafathAccessControl } from './hooks/useNafathAccessControl'
import { useAppSettings } from './hooks/useAppSettings'
import { usePersonalDataAutoFill } from './hooks/usePersonalDataAutoFill'
import { useGeneralConditionsSync } from './hooks/useGeneralConditionsSync'

const SeasonalRequestDetails = ({ scope }: ComponentGeneralProps) => {
  const searchParams = Shared.useSearchParams()
  const initialMode = searchParams.get('mode') as Shared.Mode
  // Session and authentication
  const { personal, user, accessToken } = Shared.useSessionHandler()

  // Form field definitions
  const fields = Shared.useMemo(() => createFormFields(scope), [scope])

  type FormData = Shared.InferFieldType<typeof fields>

  // State for blocking access
  const [shouldBlockAccess, setShouldBlockAccess] = Shared.useState(false)
  const [hasCheckedExistingRequest, setHasCheckedExistingRequest] = Shared.useState(false)

  // const fetchConfig = Shared.useMemo(() => {
  //   return createFetchConfig('show', shouldBlockAccess)
  // }, [shouldBlockAccess])

  // Record form hook

  const {
    formMethods,
    mode,
    setMode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    tabValue,
    handleTabChange,
    handleNextTab,
    validatedTabs,
    attemptedTabs,
    detailsData,
    setDetailsData,
    getDetailsErrors,
    detailsHandlers,
    dataModel,
    setError,
    domain,
    setInfo,
    fetchRecord,
    navigateWithQuery,
    router,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<FormData>({
    apiEndpoint: '/ses/requests',
    routerUrl: { default: `/apps/ses/nafath/seasonal-job-request/${scope}` },
    fields: [...fields, ...interviewFields],
    tabsCount: scope === 'interviewer' ? 4 : 3,
    tabConfig: createTabConfig(fields),
    initialDetailsData: INITIAL_DETAILS_DATA,
    excludeFields: createExcludeFields(fields),
    detailsTablesConfig: createDetailsTablesConfig(experienceFields, courseFields),
    classifiedObjects:
      initialMode === 'search' && scope === 'department'
        ? [
            {
              objectName: 'personal',
              fields: fields.slice(
                fields.findIndex(f => f.name === 'fir_name_ar'),
                fields.findIndex(f => f.name === 'blood_type') + 1
              )
            }
          ]
        : undefined
  })

  Shared.useEffect(() => {
    const checkExistingRequest = async () => {
      // Synchronous Nafath check to prevent race condition
      const isNotLocalhost = domain !== 'localhost' && domain !== 'adilla.com.sa'
      const isNotNafathAuth = user?.authMethod !== 'nafath'
      const isNafathBlockRequired = isNotLocalhost && isNotNafathAuth

      if (hasCheckedExistingRequest || mode !== 'add' || !accessToken || shouldBlockAccess || isNafathBlockRequired) {
        return
      }

      setHasCheckedExistingRequest(true)

      const existingRequest = await fetchRecord({
        url: '/ses/requests/user',
        method: 'GET',
        shouldSetDataModel: true,
        onSuccess: data => {
          if (data?.id) {
            setInfo('لديك طلب موجود')
            setMode('show')
          }
        },
        onError: error => {
          console.log('ℹ️ No existing request found, staying in add mode')
        }
      })
    }

    checkExistingRequest()
  }, [mode, accessToken, shouldBlockAccess, hasCheckedExistingRequest, fetchRecord, setInfo, setMode, user, domain])

  const blockAccess = useNafathAccessControl(user, domain, mode, setError)

  Shared.useEffect(() => {
    setShouldBlockAccess(blockAccess)
  }, [blockAccess])

  // App settings
  const appSettings = useAppSettings(
    accessToken,
    mode,
    dataModel?.id,
    (locale as string) || 'ar',
    formMethods,
    shouldBlockAccess
  )

  // Auto-fill personal data
  usePersonalDataAutoFill(personal, mode, formMethods)

  // Sync general conditions
  useGeneralConditionsSync(mode, formMethods)

  const reviewRequest = async (data: any) => {
    try {
      const filteredArray = Shared.filterArray(detailsData?.request_desired_job_approvals ?? [])
      const changedRows = Shared.getChangedRows(filteredArray, interviewTableFields)

      const response = await Shared.handleSave(
        '/ses/request-approvals',
        locale as Shared.Locale,
        { request_desired_job_approvals: changedRows, request_id: dataModel?.id, notes: data.note },
        '',
        accessToken,
        true
      )
      navigateWithQuery(`/apps/ses/nafath/seasonal-job-request/${scope}/list`, router, locale as Shared.Locale)
    } catch (error) {
      console.error('Error reviewing request:', error)
    }
  }

  Shared.useEffect(() => {
    const getApprovalsData = async () => {
      try {
        const approvalData = await fetchRecord({
          url: `/ses/request-approvals/${dataModel?.reviewed_approval_id}`,
          method: 'GET',
          shouldSetDataModel: false,
          onSuccess: data => {
            if (data?.id) {
              if (mode === 'show') {
                formMethods.setValue('approval_personal', data?.approval_personal)
                formMethods.setValue('approval_department', data?.approval_department)
                formMethods.setValue('approval_date', data?.approval_date)
              }
              formMethods.setValue('note', data?.notes || '')
              setDetailsData(prev => ({
                ...prev,
                request_desired_job_approvals: data?.request_desired_job_approvals || []
              }))
            }
          },
          onError: error => {
            console.log('ℹ️ No existing request found, staying in add mode')
          }
        })
      } catch (err) {}
    }

    if (scope === 'interviewer' && dataModel?.reviewed_approval_id) {
      getApprovalsData()
    }
  }, [scope, dataModel?.reviewed_approval_id])

  const { isPrintMode } = Shared.usePrintMode()

  // Early return for blocked access
  if (shouldBlockAccess) {
    return null
  }

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        {/* Header */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title='seasonal_request'
            mode={mode}
            locale={locale}
            onCancel={handleCancel}
            onMenuOptionClick={handleMenuOptionClick}
            showOnlyOptions={scope === 'user' ? ['print'] : ['edit', 'print', 'search']}
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

        {/* Print View */}
        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormTabComponent
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            tabConfig={createPrintTabConfig(fields)}
            detailsConfig={createDetailsConfig(experienceFields, courseFields, appSettings)}
            showBarcode={true}
            recordId={dataModel?.request_no}
            barcodes={[{ value: dataModel?.request_no || '', label: 'رقم الطلب' }]}
          />
        </Shared.Grid>

        {/* Main Form */}
        <Shared.Grid size={{ xs: 12 }} className='previewCard' style={{ display: !isPrintMode ? 'block' : 'none' }}>
          <Shared.SharedForm
            allFormFields={fields}
            dataObject={
              scope === 'interviewer'
                ? { ...dataModel, request_desired_job_approvals: detailsData?.request_desired_job_approvals }
                : dataModel
            }
            printForm={true}
            showBarcode={true}
            recordId={dataModel?.request_no}
             tabConfig={
              createSharedFormTabConfig(
                fields,
                dataModel,
                appSettings,
                experienceFields,
                courseFields,
                scope,
                mode
              ) as unknown as Shared.TabConfig[]
            }
            mode={mode}
            locale={locale}
            handleTabChange={handleTabChange}
            handleNextTab={handleNextTab}
            tabValue={tabValue}
            validatedTabs={validatedTabs}
            attemptedTabs={attemptedTabs}
            setDetailsData={setDetailsData}
            getDetailsErrors={getDetailsErrors}
            detailsData={detailsData}
            detailsHandlers={detailsHandlers}
            onCancel={handleCancel}
            onSaveSuccess={scope === 'interviewer' && mode !== 'search' ? reviewRequest : onSubmit}
            saveLabelKey={scope === 'interviewer' ? 'review' : 'send_request_job'}
            editLabelKey={scope === 'interviewer' ? 'review' : 'edit'}
          />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default SeasonalRequestDetails
