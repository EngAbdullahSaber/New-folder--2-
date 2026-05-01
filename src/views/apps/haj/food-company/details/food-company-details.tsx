'use client'

import * as Shared from '@/shared'

const FoodCompanyDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, dictionary, user } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      // visibleModes: ['add', 'edit', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'season',
      label: 'season',
      type: 'number',
      // visibleModes: ['add', 'edit', 'show'],
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'business_id',
      label: 'business_id',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },

    // -- Company Names --
    {
      name: 'fc_name_ar',
      label: 'name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_name_la',
      label: 'name_la',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    // -- Registration Details --
    {
      name: 'fc_reg_no',
      label: 'reg_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_moh_code',
      label: 'moh_code',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_reg_date',
      label: 'reg_date_la',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'fc_reg_date_hij',
      label: 'reg_date_hij',
      type: 'hijri_date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'fc_reg_expire_date',
      label: 'reg_expire_date_la',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'fc_reg_expire_date_hij',
      label: 'reg_expire_date_hij',
      type: 'hijri_date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    // -- Contact Information --
    {
      name: 'fc_phones_no',
      label: 'mobile',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'fc_phones_free',
      label: 'home_tel_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'fc_faxes_no',
      label: 'faxes_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'fc_email',
      label: 'email',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_web_page',
      label: 'website',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    // -- Location & Address --
    {
      name: 'fc_city_id',
      label: 'city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      viewProp: 'city.name_ar'
    },
    {
      name: 'fc_zone',
      label: 'zone',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_street_name',
      label: 'street_name',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'fc_pobox',
      label: 'p_o_box',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'fc_zip',
      label: 'bin_code',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'fc_address1',
      label: 'address_1',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_address2',
      label: 'address_2',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    // -- Owner Information --
    {
      name: 'fc_owner_name',
      label: 'owner_name',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_owner_id',
      label: 'owner_id',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_owner_phones_no',
      label: 'owner_phones_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'fc_owner_mobile_no',
      label: 'owner_mobile_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    // -- Business Operations --
    {
      name: 'fc_feeding_place',
      label: 'feeding_place',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },
    {
      name: 'fc_business_desc',
      label: 'business_desc',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    // -- Audit Row --
    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      requiredModes: [],
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'reference_id',
      label: 'reference_id',
      type: 'text',
      requiredModes: [],
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'state',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      defaultValue: '1',
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'latitude',
      label: 'y_axis',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'longitude',
      label: 'x_axis',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    }
  ]

  const myCoordinateFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'my_latitude',
      label: 'latitude',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'my_longitude',
      label: 'longitude',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
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
    apiEndpoint: '/haj/food-companies',
    routerUrl: { default: '/apps/haj/food-company' },
    fields: fields
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'food_company'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
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
          <Shared.FormComponent
            headerConfig={{ title: 'our_coordinates' }}
            locale={locale}
            fields={myCoordinateFields}
            mode={mode}
            screenMode={mode}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 6 }}>
          <Shared.FormMapCard
            dictionary={dictionary}
            mode={mode}
            title={dictionary?.titles?.['location'] || 'الموقع'}
            coordinateFields={[{ name: ['latitude', 'longitude'], title: dictionary?.location || 'الموقع' }]}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 6 }}>
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormMapCard
              dictionary={dictionary}
              mode={mode}
              title={dictionary?.titles?.['our_coordinates'] || 'الاحداثيات الخاصة بنا'}
              coordinateFields={[
                {
                  name: ['my_latitude', 'my_longitude'],
                  title: dictionary?.placeholders?.['our_coordinates'] || 'الاحداثيات الخاصة بنا'
                }
              ]}
            />
          </Shared.Grid>
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

export default FoodCompanyDetails
