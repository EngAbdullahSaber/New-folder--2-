'use client'

import * as Shared from '@/shared'

const SeasonalJobAppSettingDetails = () => {
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
      required: true,
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
      required: true,
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
      required: true,
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

  type FormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    openDocumentsDialog,
    closeDocumentsDialog,
    getDetailsErrors,
    setDetailsData,
    tabValue,
    handleTabChange,
    handleNextTab,
    validatedTabs,
    attemptedTabs,
    detailsData,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<FormData>({
    apiEndpoint: '/ses/app-settings',
    routerUrl: { default: '/apps/ses/seasonal-job-app-setting' },
    fields,
    tabsCount: 1,
    tabConfig: [
      { label: 'basic_information', fields: fields.slice(0, 9) },
      { label: 'job_information', fields: fields.slice(33, 44) }
    ],
    initialDetailsData: {
      app_setting_nationalities: [],
      app_setting_experiences: [],
      app_setting_desires: []
    },
    detailsTablesConfig: {
      app_setting_nationalities: { fields: nationalityFields, trackIndex: true },
      app_setting_experiences: { fields: experienceFields, trackIndex: true },
      app_setting_desires: { fields: desiredJobsFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title='seasonal_jobs_app_settings'
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
        <Shared.SharedForm
            allFormFields={fields}
            tabConfig={[
              {
                label: 'basic_information',
                fields: fields.slice(0, 9)
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
                    apiEndPoint: `/ses/app-settings/${dataModel.id}/app_setting_nationalities`,
                    rowModal: false
                  },

                  {
                    dataKey: 'app_setting_experiences',
                    fields: experienceFields,
                    title: 'jobs_application_experiences',
                    apiEndPoint: `/ses/app-settings/${dataModel.id}/app_setting_experiences`,
                    rowModal: false
                  },
                  {
                    dataKey: 'app_setting_desires',
                    fields: desiredJobsFields,
                    title: 'desired_jobs',
                    apiEndPoint: `/ses/app-settings/${dataModel.id}/app_setting_desires`,
                    rowModal: false
                  }
                ]
              }
            ]}
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
            dataObject={dataModel}
            onCancel={handleCancel}
            onSaveSuccess={onSubmit}
            recordId={dataModel.id}
          />
        </Shared.Grid>

        {/* <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid> */}

        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            title='job_application_nationalities'
            fields={nationalityFields}
            initialData={detailsData['app_setting_nationalities']}
            onDataChange={data => setDetailsData(prev => ({ ...prev, app_setting_nationalities: data }))}
            mode={mode}
            errors={getDetailsErrors('app_setting_nationalities')}
            detailsKey='app_setting_nationalities'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            title='jobs_application_experiences'
            fields={experienceFields}
            initialData={detailsData['app_setting_experiences']}
            onDataChange={data => setDetailsData(prev => ({ ...prev, app_setting_experiences: data }))}
            mode={mode}
            errors={getDetailsErrors('app_setting_experiences')}
            detailsKey='app_setting_experiences'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            title='desired_jobs'
            fields={desiredJobsFields}
            initialData={detailsData['app_setting_desires']}
            onDataChange={data => setDetailsData(prev => ({ ...prev, app_setting_desires: data }))}
            mode={mode}
            errors={getDetailsErrors('app_setting_desires')}
            detailsKey='app_setting_desires'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid> */}

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FileUploadWithTabs
            open={openDocumentsDialog}
            onClose={closeDocumentsDialog}
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

export default SeasonalJobAppSettingDetails
