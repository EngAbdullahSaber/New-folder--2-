'use client'

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import * as Shared from '@/shared'
import { useEffect, apiClient } from '@/shared'
import { set } from 'lodash'

const SystemSetting = () => {
  const { screenData } = useScreenPermissions('*')
  /* =======================
     MASTER FIELDS
  ======================= */
  const fields: Shared.DynamicFormFieldProps[] = []

  /* =======================
     DETAILS FIELDS
  ======================= */

  const notificationsFields: Shared.DynamicFormTableFieldProps[] = [
    { name: 'name', label: 'name', type: 'text', width: '50%', disabled: true, mode: 'show', align: 'start' },
    {
      name: 'mail_templete_id',
      label: 'email',
      type: 'select',
      apiUrl: '/ntf/mail-templates',
      labelProp: 'template_name',
      keyProp: 'id',
      width: '20%'
    },
    {
      name: 'sms_templete_id',
      label: 'sms',
      type: 'select',
      apiUrl: '/ntf/sms-msg-templates',
      labelProp: 'msg_desc',
      keyProp: 'id',
      width: '20%'
    },
    {
      name: 'object_id',
      label: '',
      type: 'storage',
      defaultValue: screenData?.id
    },
    { name: 'status', label: 'status', type: 'select', options: Shared.statusList, width: '10%' }
  ]

  type FormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    tabValue,
    tabsCount,
    handleTabChange,
    handleNextTab,
    validatedTabs,
    attemptedTabs,
    detailsData,
    setDetailsData,
    getDetailsErrors,
    detailsHandlers,
    dataModel,
    router
  } = Shared.useRecordForm<FormData>({
    apiEndpoint: '/def/module-settings/bulk-update',
    routerUrl: { default: '/apps/def/system-setting' },
    fields,
    tabsCount: 0,
    tabConfig: [
      // { label: 'basic_information', fields: [] },
      { label: 'notifications', fields: [] }
    ],
    saveMode: 'add',
    modeParam: 'add',
    initialDetailsData: {
      notifications: []
    },
    detailsTablesConfig: {
      notifications: { fields: notificationsFields, trackIndex: true }
    }
  })

  const { accessToken } = Shared.useSessionHandler()

  const [loading, setLoading] = Shared.useState(false)
  useEffect(() => {
    // ✅ Wait for screenData to be fully loaded
    if (!screenData || !accessToken) {
      return
    }

    // ✅ Now check for object_id
    if (!screenData.id) {
      console.warn('⚠️ screenData loaded but object_id is missing:', screenData)
      return
    }

    const getDetails = async () => {
      try {
        setLoading(true)
        const { data } = await apiClient.post(
          '/def/module-settings/data',
          { object_id: screenData.id },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept-Language': locale
            }
          }
        )
        setDetailsData(data.data)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    getDetails()
  }, [accessToken, screenData, locale])
  if (loading) return <LoadingSpinner />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title='system_settings'
            mode={'edit'}
            locale={locale}
            onCancel={handleCancel}
            onMenuOptionClick={handleMenuOptionClick}
            showOnlyOptions={['print']}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.SharedForm
            dataObject={dataModel}
            allFormFields={fields}
            tabConfig={[
              // {
              //   label: 'general',
              //   fields: []
              // },
              {
                label: 'notifications',
                fields: [],
                tables: [
                  {
                    dataKey: 'notifications',
                    fields: notificationsFields,
                    title: 'notifications',
                    rowModal: false,
                    apiEndPoint: '/def/system-settings/notifications',
                    enableDelete: false,
                    enableEmptyRows: false
                  }
                ]
              }
            ]}
            mode={'add'}
            locale={locale}
            onCancel={handleCancel}
            onSaveSuccess={onSubmit}
            handleTabChange={handleTabChange}
            handleNextTab={handleNextTab}
            hideNavigationBtns={true}
            tabValue={'0'}
            validatedTabs={validatedTabs}
            attemptedTabs={attemptedTabs}
            setDetailsData={setDetailsData}
            getDetailsErrors={getDetailsErrors}
            detailsData={detailsData}
            detailsHandlers={detailsHandlers}
          />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default SystemSetting
