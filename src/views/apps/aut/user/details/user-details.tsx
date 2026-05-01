'use client'

import * as Shared from '@/shared'
import { set } from 'lodash'
import { any, nonEmpty, nullable, number, optional, pipe, string, transform, union } from 'valibot'

const UserDetails = () => {
  const [isPersonalRequired, setIsPersonalRequired] = Shared.useState(true)
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'personal_id',
      label: 'personal_id',
      type: 'select',
      apiUrl: '/def/personal',
      labelProp: 'id',
      keyProp: 'id',
      validation: mode => {
        if (mode === 'search') return optional(any())

        if (isPersonalRequired) {
          return pipe(
            optional(nullable(union([string(), number()]))),
            transform(v => (v == null ? '' : String(v))),
            nonEmpty('هذا الحقل مطلوب')
          )
        }

        return optional(any())
      },
      modeCondition: (mode: Shared.Mode) => mode,
      displayProps: ['id_no', 'full_name_ar'],
      gridSize: 6,
      onChange: result => {
        if (mode != 'search') {
          setValue('fir_name_ar', result?.['object']?.['fir_name_ar'] || '') // Optionally update other fields dynamically
          setValue('far_name_ar', result?.['object']?.['far_name_ar'] || '') // Optionally update other fields dynamically
          setValue('gra_name_ar', result?.['object']?.['gra_name_ar'] || '') // Optionally update other fields dynamically
          setValue('fam_name_ar', result?.['object']?.['fam_name_ar'] || '') // Optionally update other fields dynamically
          setValue('fir_name_la', result?.['object']?.['fir_name_la'] || '') // Optionally update other fields dynamically
          setValue('far_name_la', result?.['object']?.['far_name_la'] || '') // Optionally update other fields dynamically
          setValue('gra_name_la', result?.['object']?.['gra_name_la'] || '') // Optionally update other fields dynamically
          setValue('fam_name_la', result?.['object']?.['fam_name_la'] || '') // Optionally update other fields dynamically
          setValue('nation_id', result?.['object']?.['nation_id'] || '') // Optionally update other fields dynamically
          setValue('birth_date', result?.['object']?.['birth_date'] || '') // Optionally update other fields dynamically
          setValue('id_no', result?.['object']?.['id_no'] || '') // Optionally update other fields dynamically
          setValue('mobile', result?.['object']?.['mobile'] || '') // Optionally update other fields dynamically,
          setValue('nation_name', result?.['object']?.['nationality']?.['name_ar'] || '') // Optionally update other fields dynamically
        }
      },
      cache: false,
      searchProps: ['id_no', 'full_name_ar', 'id']
      // modal: 'personal'
    },

    {
      name: 'fir_name_ar',
      label: 'fir_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },
    {
      name: 'far_name_ar',
      label: 'far_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },
    {
      name: 'gra_name_ar',
      label: 'gra_name_ar',
      type: 'text',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },

    {
      name: 'fam_name_ar',
      label: 'fam_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },
    {
      name: 'fir_name_la',
      label: 'fir_name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },
    {
      name: 'far_name_la',
      label: 'far_name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },
    {
      name: 'gra_name_la',
      label: 'gra_name_la',
      type: 'text',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },
    {
      name: 'fam_name_la',
      label: 'fam_name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },

    {
      name: 'nation_id',
      label: 'nation_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3,
      // modal: 'personal',
      cache: false,
      viewProp: 'personal.nationality.name_ar',
      visibleModeCondition: (mode, formValues) => {
        return !formValues['personal_id']
      }
    },

    {
      name: 'nation_name',
      label: 'nation_id',
      type: 'text',
      modeCondition: (mode: Shared.Mode, values: any) => {
        return 'show'
      },
      gridSize: 3,
      // modal: 'personal',
      visibleModeCondition: (mode, formValues) => {
        if (formValues['personal_id']) {
          return true
        } else return false
      },
      viewProp: 'personal.nationality.name_ar'
    },

    {
      name: 'id_no',
      label: 'id_no',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },

    {
      name: 'birth_date',
      label: 'birth_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },

    {
      name: 'mobile',
      label: 'mobile',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode, values: any) => {
        console.log(values['personal_id'])
        if (values['personal_id']) return 'show'
        return mode
      },
      gridSize: 3
      // modal: 'personal'
    },

    {
      name: 'password',
      label: 'password',
      type: 'password',
      visibleModes: ['add', 'edit'],
      requiredModes: ['add'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    // {
    //   name: 'reset_password',
    //   label: 'reset_password',
    //   type: 'checkbox',
    //   defaultValue: false, // Default value for checkbox
    //   options: [{ value: 'true', label: 'reset_password' }],
    //   onChange: value => console.log('Selected:', value),
    //   gridSize: 3,
    //   visibleModes: ['add', 'edit'],
    //   modeCondition: (mode: Shared.Mode) => mode
    // },

    {
      name: 'user_status',
      label: 'status',
      type: 'select',
      options: Shared.userStatusList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'expire_date',
      label: 'exp_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'historical_data_access',
      label: 'historical_data_access',
      type: 'select',
      options: Shared.yesNoList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'access_special_objects',
      label: 'access_specila_objects',
      type: 'select',
      requiredModes: ['add', 'edit'],
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'home_page',
      label: 'home_page',
      type: 'select',
      apiUrl: `/aut/objects`,
      queryParams: { object_type: '3' },
      labelProp: 'object_name_ar',
      keyProp: 'route_path',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      apiMethod: 'GET'
    },
    {
      name: 'password_changed',
      label: 'password_changed',
      type: 'select',
      options: Shared.passwordChangedList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModes: ['add', 'edit']
    },

    {
      name: 'sms_verify',
      label: 'sms_verify_code',
      type: 'select',
      options: Shared.verifyCodeList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'email_verify',
      label: 'email_verify_code',
      type: 'select',
      options: Shared.verifyCodeList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModes: ['add', 'edit']
    },
    {
      name: 'acceptance',
      label: 'acceptance',
      type: 'select',
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'acceptance_id',
      label: 'acceptance_id',
      type: 'select',
      options: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      visibleModes: ['show']
    },
    {
      name: 'acceptance_verified_at',
      label: 'acceptance_verified_at',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      visibleModes: ['show']
    },

    {
      name: 'incorrect_attempts',
      label: 'incorrect_attempts',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      visibleModes: ['show']
    }
  ]

  const rolesDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'id',
      label: 'permission_set',
      type: 'select',
      apiUrl: '/aut/roles',
      labelProp: 'name',
      keyProp: 'id',
      width: '60%',
      viewProp: 'name'
    }
  ]

  const departmentsDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'id',
      label: 'department',
      type: 'select',
      required: true,
      apiUrl: '/def/departments',
      labelProp: 'department_name_ar',
      keyProp: 'id',
      width: '40%',
      viewProp: 'department_name_ar',
      cache: false
    },
    {
      name: 'department_default',
      label: 'department_default',
      type: 'radio',
      // required: true,
      width: '15%',
      options: [{ label: 'department_default', value: '1' }]
    },
    {
      name: 'user_dept_type',
      label: 'department_type',
      type: 'select',
      options: Shared.userDepartmentTypeList,
      modeCondition: (mode: Shared.Mode) => mode,
      width: '25%'
      // defaultValue: '3'
    }
  ]

  const userCitiesFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'id',
      label: 'city',
      type: 'select',
      required: true,
      apiUrl: '/def/cities',
      labelProp: 'name_ar',
      keyProp: 'id',
      width: '40%',
      viewProp: 'name_ar',
      cache: false
    },
    {
      name: 'default_city',
      label: 'default_city',
      type: 'radio',
      width: '20%',
      options: [{ label: 'default_city', value: '1' }]
    }
  ]

  const userPassportUnitsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'id',
      label: 'passport_unit',
      type: 'select',
      required: true,
      apiUrl: '/haj/passport-units',
      labelProp: 'passport_units_name_ar',
      keyProp: 'id',
      width: '50%',
      viewProp: 'passport_units_name_ar',
      cache: false
    },
    {
      name: 'default_unit',
      label: 'default_unit',
      type: 'radio',
      width: '25%',
      options: [{ label: 'default_unit', value: '1' }]
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const personalFields = [
    'fir_name_ar',
    'far_name_ar',
    'gra_name_ar',
    'fam_name_ar',
    'fir_name_la',
    'far_name_la',
    'gra_name_la',
    'fam_name_la',
    'nation_id',
    'nation_name',
    'id_no',
    'birth_date',
    'mobile'
  ]

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    setDetailsData,
    errors,
    dataModel,
    closeDocumentsDialog,
    openDocumentsDialog,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/aut/users',
    routerUrl: { default: '/apps/aut/user' },
    fields: fields,
    initialDetailsData: { user_groups: [], user_depts: [], user_passport_units: [], user_cities: [] },
    detailsTablesConfig: {
      user_depts: { fields: departmentsDetailsFields, trackIndex: true },
      user_groups: { fields: rolesDetailsFields, trackIndex: true },
      user_cities: { fields: userCitiesFields, trackIndex: true },
      user_passport_units: { fields: userPassportUnitsFields, trackIndex: true }
    },
    classifiedObjects: [
      {
        objectName: 'personal',
        fields: personalFields
      }
    ],

    transformPayload: (payload, detailsData) => {
      if (mode === 'search') return payload

      if (payload.personal_id) {
        personalFields.forEach(field => {
          delete payload[field]
        })
      }

      return {
        ...payload
        // ...detailsData
      }
    }
  })
  const { setValue, getValues, watch } = formMethods

  const allValues: any = watch()

  Shared.useEffect(() => {
    const anyFilled = personalFields.some(key => !!(allValues as Record<string, any>)?.[key])
    setIsPersonalRequired(!anyFilled)
  }, [allValues])
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`users`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            detailsConfig={[
              { key: 'user_depts', fields: departmentsDetailsFields, title: 'departments' },
              { key: 'user_groups', fields: rolesDetailsFields, title: 'permission_set' }
            ]}
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            dataObject={dataModel}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent
            dataObject={dataModel}
            locale={locale}
            fields={fields.slice(0, 15)}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent
            locale={locale}
            fields={fields.slice(15)}
            headerConfig={{ title: 'account_information' }}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={rolesDetailsFields}
            title='permission_set'
            initialData={detailsData['user_groups']} // Pass the details data
            onDataChange={detailsHandlers.user_groups}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'user_groups')}
            locale={locale}
            dataObject={dataModel}
            detailsKey='user_groups'
            apiEndPoint={`/aut/users/${dataModel.id}/user_groups`}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={departmentsDetailsFields}
            title='departments'
            initialData={detailsData['user_depts']} // Pass the details data
            onDataChange={detailsHandlers.user_depts}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'user_depts')}
            apiEndPoint={`/aut/users/${dataModel.id}/user_depts`}
            locale={locale}
            dataObject={dataModel}
            detailsKey='user_depts'
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={userCitiesFields}
            title='cities'
            initialData={detailsData['user_cities']}
            onDataChange={detailsHandlers.user_cities}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'user_cities')}
            locale={locale}
            dataObject={dataModel}
            detailsKey='user_cities'
            apiEndPoint={`/aut/users/${dataModel.id}/user_cities`}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 6 }}>
          <Shared.DynamicFormTable
            fields={userPassportUnitsFields}
            title='passport_units'
            initialData={detailsData['user_passport_units']}
            onDataChange={detailsHandlers.user_passport_units}
            mode={mode}
            errors={errors.filter(error => error.detailsKey == 'user_passport_units')}
            locale={locale}
            dataObject={dataModel}
            detailsKey='user_passport_units'
            apiEndPoint={`/aut/users/${dataModel.id}/user_passport_units`}
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
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default UserDetails
