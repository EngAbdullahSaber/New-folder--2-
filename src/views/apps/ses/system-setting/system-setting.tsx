'use client'

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import * as Shared from '@/shared'
import { useEffect, apiClient } from '@/shared'
import { set } from 'lodash'

const SystemSetting = () => {
  const { screenData } = useScreenPermissions('*')
  const masterFields: Shared.DynamicFormFieldProps[] = [
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
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'internal_department_type_id',
      label: 'internal_department_type',
      type: 'select',
      apiUrl: '/def/department-types',
      keyProp: 'id',
      labelProp: 'department_type_name',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      viewProp: 'internal_department_type.department_type_name'
    },

    {
      name: 'seasonal_open_date',
      label: 'seasonal_open_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'seasonal_close_date',
      label: 'seasonal_close_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => mode
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      defaultValue: '1',
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => mode
    },

    {
      name: 'general_conditions',
      label: 'general_conditions',
      requiredModes: ['add', 'edit'],
      type: 'rich_text',
      gridSize: 12,
      modeCondition: (mode: Shared.Mode) => mode
    },

    {
      name: 'terms_conditions',
      label: 'terms_conditions',
      requiredModes: ['add', 'edit'],
      type: 'rich_text',
      gridSize: 12,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'privacy_policy',
      label: 'privacy_policy',
      requiredModes: ['add', 'edit'],
      type: 'rich_text',
      gridSize: 12,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'agreed_to_terms',
      label: 'agreed_to_terms',
      type: 'rich_text',
      gridSize: 12,
      modeCondition: (mode: Shared.Mode) => mode
    }
  ]

  const nationalityFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'nationality_id',
      label: 'nationality_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      // required: true,
      width: '50%',
      viewProp: 'name_ar'
    },
    {
      name: 'order_no',
      label: 'order',
      type: 'number',
      width: '20%'
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      width: '20%'
    }
  ]

  const experienceFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'job_id',
      label: 'job',
      type: 'select',
      apiUrl: '/sys/list/21',
      labelProp: 'name',
      keyProp: 'id',
      // required: true,
      width: '50%',
      apiMethod: 'GET',
      viewProp: 'name'
    },
    {
      name: 'order_no',
      label: 'order',
      type: 'number',
      width: '20%'
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      width: '20%'
    }
  ]

  const desiredJobsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'job_id',
      label: 'job',
      type: 'select',
      apiUrl: '/sys/list/21',
      labelProp: 'name',
      keyProp: 'id',
      // required: true,
      width: '50%',
      apiMethod: 'GET',
      viewProp: 'name'
    },
    {
      name: 'order_no',
      label: 'order',
      type: 'number',
      width: '20%'
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      width: '20%'
    }
  ]

  /* =======================
     DETAILS FIELDS
  ======================= */

  const notificationsFields: Shared.DynamicFormTableFieldProps[] = [
    { name: 'name', label: 'name', type: 'text', width: '30%', disabled: true, mode: 'show', align: 'start' },
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
      defaultValue: screenData?.object_id
    },
    { name: 'status', label: 'status', type: 'select', options: Shared.statusList, width: '10%' }
  ]

  type FormData = Shared.InferFieldType<typeof masterFields>

  const {
    formMethods,
    mode,
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
    router
  } = Shared.useRecordForm<FormData>({
    apiEndpoint: '/ses/settings',
    routerUrl: { default: '/apps/ses/system-setting' },
    fields: masterFields,
    tabsCount: 2,
    tabConfig: [
      { label: 'basic_information', fields: masterFields },
      { label: 'job_information', fields: [...nationalityFields, ...experienceFields, ...desiredJobsFields] },
      { label: 'notifications', fields: [] }
    ],
    saveMode: 'add',
    modeParam: 'add',
    initialDetailsData: {
      notifications: [],
      app_setting_nationalities: [],
      app_setting_experiences: [],
      app_setting_desires: []
    },
    detailsTablesConfig: {
      notifications: { fields: notificationsFields, trackIndex: true },
      app_setting_nationalities: { fields: nationalityFields, trackIndex: true },
      app_setting_experiences: { fields: experienceFields, trackIndex: true },
      app_setting_desires: { fields: desiredJobsFields, trackIndex: true }
    },
    classifiedObjects: [
      {
        objectName: 'app_settings',
        fields: [...masterFields, ...nationalityFields, ...experienceFields, ...desiredJobsFields]
      }
    ]
  })

  const { accessToken } = Shared.useSessionHandler()
  const { setValue, getValues, watch } = formMethods
  const [loading, setLoading] = Shared.useState(false)
  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true)
        const { data } = await apiClient.get('/ses/settings', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': locale
          }
        })
        setDetailsData(data.data)
        if (data?.data?.app_settings) {
          let appSettings = data?.data?.app_settings

          if (appSettings['app_setting_nationalities']) {
            setDetailsData(prev => ({
              ...prev,
              app_setting_nationalities: appSettings['app_setting_nationalities']
            }))
          }
          if (appSettings['app_setting_experiences']) {
            setDetailsData(prev => ({
              ...prev,
              app_setting_experiences: appSettings['app_setting_experiences']
            }))
          }
          if (appSettings['app_setting_nationalities']) {
            setDetailsData(prev => ({
              ...prev,
              app_setting_desires: appSettings['app_setting_desires']
            }))
          }

          setValue('id', appSettings.id)
          setValue('season', appSettings.season)
          setValue('internal_department_type_id', appSettings.internal_department_type_id)
          setValue('seasonal_open_date', appSettings.seasonal_open_date)
          ;(setValue('seasonal_close_date', appSettings.seasonal_close_date), setValue('status', appSettings.status))
          setValue('general_conditions', appSettings.general_conditions)
          setValue('terms_conditions', appSettings.terms_conditions)
          setValue('privacy_policy', appSettings.privacy_policy)
          setValue('agreed_to_terms', appSettings.agreed_to_terms)
        }
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }
    if (accessToken) getDetails()
  }, [accessToken])

  if (loading) return <LoadingSpinner />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title='system_settings'
            mode={'add'}
            locale={locale}
            onCancel={handleCancel}
            onMenuOptionClick={handleMenuOptionClick}
            showOnlyOptions={['print']}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.SharedForm
            dataObject={dataModel?.app_settings}
            allFormFields={masterFields}
            tabConfig={[
              // {
              //   label: 'general',
              //   fields: []
              // },
              {
                label: 'basic_information',
                fields: masterFields
              },
              // { label: 'conditions_policy', fields: fields.slice(6, 9) },
              {
                label: 'job_information',
                fields: [],
                tables: [
                  {
                    dataKey: 'app_setting_nationalities',
                    fields: nationalityFields,
                    title: 'job_application_nationalities',
                    apiEndPoint: `/ses/app-settings/${dataModel?.app_settings?.id}/app_setting_nationalities`,
                    rowModal: false
                  },

                  {
                    dataKey: 'app_setting_experiences',
                    fields: experienceFields,
                    title: 'jobs_application_experiences',
                    apiEndPoint: `/ses/app-settings/${dataModel?.app_settings?.id}/app_setting_experiences`,
                    rowModal: false
                  },
                  {
                    dataKey: 'app_setting_desires',
                    fields: desiredJobsFields,
                    title: 'desired_jobs',
                    apiEndPoint: `/ses/app-settings/${dataModel?.app_settings?.id}/app_setting_desires`,
                    rowModal: false
                  }
                ]
              },

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
            detailsHandlers={detailsHandlers}
            mode={'add'}
            locale={locale}
            onCancel={handleCancel}
            onSaveSuccess={onSubmit}
            handleTabChange={handleTabChange}
            handleNextTab={handleNextTab}
            hideNavigationBtns={true}
            tabValue={tabValue}
            validatedTabs={validatedTabs}
            attemptedTabs={attemptedTabs}
            setDetailsData={setDetailsData}
            getDetailsErrors={getDetailsErrors}
            detailsData={detailsData}
            recordId={dataModel?.app_settings?.id}
          />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default SystemSetting
