'use client'

import * as Shared from '@/shared'

const UserProfileDetails = (props?: any) => {
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'personal_picture',
      label: '',
      type: 'personal_picture',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12,
      visibleModes: ['add', 'edit', 'show'],
      onChange: value => {}
    },

    {
      name: 'files',
      label: '',
      type: 'storage',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12,
      visibleModes: ['add', 'edit']
    },

    {
      name: 'id',
      label: 'id',
      gridSize: 12,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'fir_name_ar',
      label: 'fir_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'far_name_ar',
      label: 'far_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'gra_name_ar',
      label: 'gra_name_ar',
      type: 'text',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'fam_name_ar',
      label: 'fam_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'fir_name_la',
      label: 'fir_name_la',
      type: 'text',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'far_name_la',
      label: 'far_name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'gra_name_la',
      label: 'gra_name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'fam_name_la',
      label: 'fam_name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'nation_id',
      label: 'nation_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      //lovKeyName: 'id',
      gridSize: 3,
      viewProp: 'nationality.name_ar'
    },
    {
      name: 'birth_date',
      label: 'birth_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'birth_place',
      label: 'birth_place',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'gender',
      label: 'gender',
      type: 'select',
      // requiredModes: ['add', 'edit'],
      options: [
        { label: 'ذكر', value: '1' },
        { label: 'أنثى', value: '2' }
      ],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'qualification_id',
      label: 'qualification_id',
      type: 'select',
      // requiredModes: ['add', 'edit'],
      options: [
        { label: 'بدون مؤهل', value: '1' },
        { label: 'المرحلة الابتدائية', value: '2' },
        { label: 'المرحلة المتوسطة', value: '3' },
        { label: 'المرحلة الثانوية', value: '4' },
        { label: 'دبلوم', value: '5' },
        { label: 'درجة البكالوريوس', value: '6' },
        { label: 'درجة الماجستير', value: '7' },
        { label: 'درجة الدكتوراه', value: '8' },
        { label: 'أمي', value: '9' }
      ],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'specialty',
      label: 'specialty',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'qualify_date',
      label: 'qualify_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'merital_status',
      label: 'merital_status',
      type: 'select',
      // requiredModes: ['add', 'edit'],
      options: [
        { label: 'متزوج', value: '1' },
        { label: 'أعزب', value: '2' }
      ],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'current_status',
      label: 'current_status',
      type: 'select',
      // requiredModes: ['add', 'edit'],
      options: [
        { label: 'حي', value: '1' },
        { label: 'متوفى', value: '2' }
      ],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'emp_status_id',
      label: 'emp_status_id',
      type: 'select',
      apiUrl: '/def/employment-statuses',
      labelProp: 'emp_status_name',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'country_bin',
      label: 'country_bin',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'id_no',
      label: 'id_no',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'id_issue_date',
      label: 'issue_date',
      type: 'date',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'id_source',
      label: 'id_source',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'id_exp_date',
      label: 'exp_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'pass_no',
      label: 'pass_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'pass_issue_date',
      label: 'pass_issue_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'pass_source',
      label: 'pass_source',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'pass_exp_date',
      label: 'pass_exp_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'mobile',
      label: 'mobile',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModes: ['add', 'edit']
    },
    // {
    //   name: 'mobile_verified',
    //   label: 'mobile_verified',
    //   type: 'checkbox',
    //   defaultValue: false,
    //   options: [{ value: 'true', label: 'mobile_verified_label' }],
    //   onChange: value => console.log('Selected:', value.value),
    //   gridSize: 3,
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   visibleModes: ['add', 'edit']
    // },
    {
      name: 'e_mail',
      label: 'e_mail',
      type: 'email',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'home_tel_no',
      label: 'home_tel_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'home_fax_no',
      label: 'home_fax_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'p_o_box',
      label: 'p_o_box',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'bin_code',
      label: 'bin_code',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'home_address',
      label: 'home_address',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'job_destination',
      label: 'job_destination',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'occupation_title',
      label: 'occupation_title',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'job_tel_no',
      label: 'job_tel_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'job_fax_no',
      label: 'job_fax_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'job_mobile',
      label: 'job_mobile',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'off_email',
      label: 'off_email',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'job_p_o_box',
      label: 'job_p_o_box',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'job_bin_code',
      label: 'job_bin_code',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'job_address',
      label: 'job_address',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 9
    },
    {
      name: 'first_contact',
      label: 'first_contcat',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'contact_no1',
      label: 'conctat_no1',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'second_contact',
      label: 'second_contcat',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'contact_no2',
      label: 'conctat_no2',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'contact_address',
      label: 'contact_address',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  type DepartmentFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    setOpenDocumentsDialog,
    openDocumentsDialog,
    setOpenRecordInformationDialog,
    openRecordInformationDialog,
    openRecordTrackingDialog,
    setOpenRecordTrackingDialog,
    locale,
    handleTabChange, // ✅ Add
    handleNextTab, // ✅ Add
    tabValue, // ✅ Add
    validatedTabs, // ✅ Add
    attemptedTabs, // ✅ Add

    detailsHandlers,
    dataModel,
    tabsCount,
    closeRecordInformationDialog
  } = Shared.useRecordForm<DepartmentFormData>({
    apiEndpoint: '/def/personal',
    routerUrl: { default: '/apps/def/user-profile' },
    fields: fields,
    tabsCount: 2,
    excludeFields: [
      { action: 'add', fields: fields.slice(0, 0) },
      { action: 'edit', fields: fields.slice(0, 0) }
    ],
    modalRecordId: props.id,
    tabConfig: [
      { label: 'main_information', fields: fields.slice(0, 22) },
      { label: 'id_information', fields: fields.slice(22, 30) },
      { label: 'contact_information', fields: fields.slice(30) }
    ]
  })

  // //console.log(detailsData)
  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`user_profile`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.SharedForm
            allFormFields={fields}
            dataObject={dataModel}
            tabConfig={[
              { label: 'main_information', fields: fields.slice(0, 22) },
              { label: 'id_information', fields: fields.slice(22, 30) },
              { label: 'contact_information', fields: fields.slice(30) }
            ]}
            mode={mode}
            locale={locale}
            handleTabChange={handleTabChange} // ✅ Pass
            handleNextTab={handleNextTab} // ✅ Pass
            tabValue={tabValue} // ✅ Pass
            validatedTabs={validatedTabs} // ✅ Pass
            attemptedTabs={attemptedTabs} // ✅ Pass
            detailsHandlers={detailsHandlers}
            onCancel={handleCancel}
            onSaveSuccess={onSubmit}
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

        {/* Render the dynamic details section using DynamicFormTable */}

        {/* <Shared.Grid item xs={12}>
          <Shared.FileUploadWithTabs
            open={openDocumentsDialog}
            onClose={() => closeDocumentsDialog()}
            locale={locale}
          />
        </Shared.Grid> */}
        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            recordInformations={[]}
            open={openRecordInformationDialog}
            onClose={() => setOpenRecordInformationDialog(false)}
            locale={locale}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordTracking
            apiEndPoint='/def/user-profile'
            columns={[]}
            open={openRecordTrackingDialog}
            onClose={() => setOpenRecordTrackingDialog(false)}
            locale={locale}
          />
        </Shared.Grid> */}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default UserProfileDetails
