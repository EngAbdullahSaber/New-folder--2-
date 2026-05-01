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
  const departmentTypeFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      visibleModes: ['search']
    },

    {
      name: 'reception_department_type_id',
      label: 'reception_department_type',
      type: 'select',
      apiUrl: '/def/department-types',
      keyProp: 'id',
      labelProp: 'department_type_name',
      modeCondition: (mode: Shared.Mode) => 'edit',
      gridSize: 4,
      viewProp: 'reception_department_type.department_type_name'
    },
    {
      name: 'service_department_type_id',
      label: 'service_department_type',
      type: 'select',
      apiUrl: '/def/department-types',
      keyProp: 'id',
      labelProp: 'department_type_name',
      modeCondition: (mode: Shared.Mode) => 'edit',
      gridSize: 4,
      viewProp: 'service_department_type.department_type_name'
    }
  ]

  const passportUnitFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'passport_ho_type_rep',
      label: 'passport_ho_type_rep',
      type: 'select',
      apiUrl: '/haj/handover-types',
      keyProp: 'id',
      labelProp: 'handover_type_description',
      modeCondition: (mode: Shared.Mode) => 'edit',
      gridSize: 6
    },
    {
      name: 'passport_ho_type_agent',
      label: 'passport_ho_type_agent',
      type: 'select',
      apiUrl: '/haj/handover-types',
      keyProp: 'id',
      labelProp: 'handover_type_description',
      modeCondition: (mode: Shared.Mode) => 'edit',
      gridSize: 6
    }
  ]

  const fields = [...departmentTypeFields, ...passportUnitFields]

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
    apiEndpoint: '/haj/settings',
    routerUrl: { default: '/apps/def/system-setting' },
    fields,
    tabsCount: 2,
    tabConfig: [
      { label: 'basic_information', fields: fields },
      { label: 'notifications', fields: [] }
    ],
    saveMode: 'add',
    modeParam: 'add',
    initialDetailsData: {
      notifications: []
    },
    detailsTablesConfig: {
      notifications: { fields: notificationsFields, trackIndex: true }
    },
    classifiedObjects: [
      {
        objectName: 'app_settings',
        fields: [
          'reception_department_type_id',
          'service_department_type_id',
          'id',
          'passport_ho_type_rep',
          'passport_ho_type_agent'
        ]
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
        const { data } = await apiClient.get('/haj/settings', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': locale
          }
        })
        setDetailsData(data.data)
        if (data?.data?.app_settings) {
          let appSettings = data?.data?.app_settings
          setValue('id', appSettings.id)
          setValue('reception_department_type_id', appSettings.reception_department_type_id)
          setValue('service_department_type_id', appSettings.service_department_type_id)
          setValue('passport_ho_type_rep', appSettings.passport_ho_type_rep)
          setValue('passport_ho_type_agent', appSettings.passport_ho_type_agent)
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
            dataObject={dataModel}
            allFormFields={fields}
            tabConfig={[

              {
                label: 'main_information',
                fields: [],
                extraSections: [
                  {
                    fields: departmentTypeFields,
                    label: 'department_types'
                  },
                  {
                    fields: passportUnitFields,
                    label: 'handover_types'
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
            mode={'add'}
            locale={locale}
            onCancel={handleCancel}
            onSaveSuccess={onSubmit}
            handleTabChange={handleTabChange}
            handleNextTab={handleNextTab}
            tabValue={tabValue}
            validatedTabs={validatedTabs}
            attemptedTabs={attemptedTabs}
            setDetailsData={setDetailsData}
            getDetailsErrors={getDetailsErrors}
            detailsData={detailsData}
            detailsHandlers={detailsHandlers}
            recordId={dataModel.id}
            hideNavigationBtns={true}
          />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default SystemSetting
