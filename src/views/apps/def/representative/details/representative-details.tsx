'use client'

import * as Shared from '@/shared'

const RepresentativeDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      gridSize: 12,
      modeCondition: (mode: Shared.Mode) => mode
    },
    {
      name: 'first_name_ar',
      label: 'fir_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'father_name_ar',
      label: 'far_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'grandfather_name_ar',
      label: 'gra_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'family_name_ar',
      label: 'fam_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'first_name_la',
      label: 'fir_name_la',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'father_name_la',
      label: 'far_name_la',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'grandfather_name_la',
      label: 'gra_name_la',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'family_name_la',
      label: 'fam_name_la',
      type: 'text',
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
      modeCondition: (mode: Shared.Mode) => mode,
      //lovKeyName: 'id',
      gridSize: 3,
      viewProp: 'nationalities.name_ar'
    },
    {
      name: 'birth_date',
      label: 'birth_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'cntry_itc_code',
      label: 'country_bin',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'mobile_cntry_itc_code',
      label: 'mobile_cntry_itc_code',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'id_no',
      label: 'id_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'id_issue_date',
      label: 'issue_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'issue_date_hij',
      label: 'issue_date_hij',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'id_expiry_date',
      label: 'exp_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'id_expiry_date_hij',
      label: 'exp_date_hij',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'passport_no',
      label: 'pass_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'passport_issue_date',
      label: 'issue_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'passport_issue_date_hij',
      label: 'issue_date_hij',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'passport_issue_place',
      label: 'pass_source',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'passport_expiry_date',
      label: 'exp_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'passport_expiry_date_hij',
      label: 'exp_date_hij',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'card_id',
      label: 'card_id',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'card_date',
      label: 'issue_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'card_date_hij',
      label: 'issue_date_hij',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'card_expiry_date',
      label: 'exp_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'card_expiry_date_hij',
      label: 'exp_date_hij',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'country_id',
      label: 'country',
      type: 'select',
      apiUrl: '/def/countries',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      //lovKeyName: 'id',
      gridSize: 3,
      viewProp: 'countries.name_ar'
    },

    {
      name: 'city_id',
      label: 'city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),
      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      //lovKeyName: 'id',
      gridSize: 3,
      viewProp: 'cities.name_ar'
    },

    {
      name: 'address_1',
      label: 'address_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'address_2',
      label: 'contact_address',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'pobox',
      label: 'p_o_box',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'zip',
      label: 'bin_code',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'faxes_no',
      label: 'job_fax_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'email',
      label: 'e_mail',
      type: 'email',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'phones_no',
      label: 'home_tel_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'mobile_no',
      label: 'job_mobile',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    dataModel,
    closeDocumentsDialog,
    openDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/def/representatives',
    routerUrl: { default: '/apps/def/representative' },
    fields: fields
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`representative`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
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
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>

        {/* Render the dynamic details section using DynamicFormTable */}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default RepresentativeDetails
