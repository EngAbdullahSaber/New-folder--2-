'use client'

import * as Shared from '@/shared'

const HouseDetails = () => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user, dictionary } = Shared.useCityAccess()

  const fields: Shared.DynamicFormFieldProps[] = [
    //general information
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'business_id',
      label: 'house_id',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'season',
      label: 'season',
      visibleModes: ['add', 'edit', 'show'],
      type: 'number',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'renewal_season',
      label: 'renewal_season',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.statusList,
      requiredModes: ['add', 'edit'],
      defaultValue: '1',
      visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_commercial_name_ar',
      label: 'commercial_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_commercial_name_la',
      label: 'commercial_name_la',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_type',
      label: 'house_type',
      type: 'select',
      apiUrl: '/def/house-types',
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'houses_type.name_ar'
    },

    {
      name: 'house_classification',
      label: 'classification',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_guest_capacity',
      label: 'guest_capacity',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_total_rooms',
      label: 'total_rooms',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_reg_no',
      label: 'reg_no',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_city_id',
      label: 'city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'house_city.name_ar'
    },

    {
      name: 'house_street_name',
      label: 'street_name',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_haram_distance',
      label: 'haram_distance',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_reg_date_la',
      label: 'reg_date_la',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_reg_date_hij',
      label: 'reg_date_hij',
      type: 'hijri_date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_reg_expire_date_la',
      label: 'reg_expire_date_la',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_reg_expire_date_hij',
      label: 'reg_expire_date_hij',
      type: 'hijri_date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_floor_tot',
      label: 'floor_tot',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_room_area',
      label: 'room_area',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_elevator_tot',
      label: 'elevator_total',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_toilet_tot',
      label: 'toilet_tot',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_kitchen_tot',
      label: 'kitchen_tot',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_food_service_availabilt',
      label: 'food_service_availabilt',
      type: 'select',
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_food_service_mandatory',
      label: 'food_service_mandatory',
      type: 'select',
      options: Shared.yesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_municipalities_id',
      label: 'municipalities_id',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_instrument_no',
      label: 'instrument_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_instrument_date_la',
      label: 'instrument_date_la',
      type: 'date',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_instrument_date_hij',
      label: 'instrument_date_hij',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_building_licence',
      label: 'building_licence',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_building_total_area',
      label: 'building_total_area',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_license_floor',
      label: 'license_floor',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_architect_office',
      label: 'architect_office',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_electric_no_from',
      label: 'electric_no_from',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_electric_no_to',
      label: 'electric_no_to',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      requiredModes: [],
      visibleModes: ['search', 'show'],

      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'reference_id',
      label: 'reference_id',
      type: 'text',
      requiredModes: [],
      visibleModes: ['search', 'show'],

      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    //Owner Information

    {
      name: 'house_owner_hot_id',
      label: 'owner_hot_id',
      type: 'select',
      apiUrl: '/def/house-owner-types',
      labelProp: 'description_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      //lovKeyname: 'house_id',
      gridSize: 6,
      viewProp: 'house_owner_types.description_ar'
    },

    {
      name: 'house_owner_id',
      label: 'owner_id',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'house_owner_name',
      label: 'house_owner',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    {
      name: 'house_owner_mobile_no',
      label: 'owner_mobile_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'house_owner_phones_no',
      label: 'owner_phones_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_owner_agent_hat_id',
      label: 'owner_agent_hat_id',
      type: 'select',
      apiUrl: '/def/house-agent-types',
      labelProp: 'description_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      //lovKeyname: 'house_id',
      gridSize: 6,
      viewProp: 'house_owner_agent_types.description_ar'
    },

    {
      name: 'house_owner_agent_id',
      label: 'owner_agent_id',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_owner_agent_name',
      label: 'owner_agent_name',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    //Benefit Information

    {
      name: 'house_benefit_type',
      label: 'benefit_type',
      type: 'select',
      apiUrl: '/def/house-benefit-types',
      labelProp: 'description_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      //lovKeyname: 'house_id',
      gridSize: 6,
      cacheWithDifferentKey: true,
      viewProp: 'house_benefit_types.description_ar'
    },
    {
      name: 'house_benefit_id',
      label: 'benefit_id',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_benefit_name',
      label: 'benefit_name',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    {
      name: 'house_benefit_mobile_no',
      label: 'benefit_mobile_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'house_benefit_phones_no',
      label: 'benefit_phones_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_benefit_agent_hat_id',
      label: 'benefit_agent_hat_id',
      type: 'select',
      apiUrl: '/def/house-agent-types',
      labelProp: 'description_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      //lovKeyname: 'house_id',
      gridSize: 6,
      viewProp: 'house_benefit_agent_types.description_ar'
    },

    {
      name: 'house_benefit_agent_id',
      label: 'benefit_agent_id',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_benefit_agent_name',
      label: 'benefit_agent_name',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12
    },

    //Address Information

    {
      name: 'house_address_1',
      label: 'address_1',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_address_2',
      label: 'address_2',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'house_wasel_building_no',
      label: 'wasel_building_no',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_wasel_postal_code',
      label: 'wasel_postal_code',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_wasel_additional_no',
      label: 'wasel_additional_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_wasel_street',
      label: 'wasel_street',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_location_no',
      label: 'location_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_district_id',
      label: 'district_id',
      type: 'number',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_zone',
      label: 'zone',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },

    {
      name: 'house_map_address_longitude',
      label: 'x_axis',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_map_address_latitude',
      label: 'y_axis',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    // Contact Information
    {
      name: 'house_pobox',
      label: 'p_o_box',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_zip',
      label: 'bin_code',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_phones_free',
      label: 'home_tel_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_phones_no',
      label: 'mobile',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_faxes_no',
      label: 'faxes_no',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_web_page',
      label: 'website',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_email',
      label: 'email',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    // Manager Information

    {
      name: 'house_manager_name',
      label: 'manager_name',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_manager_mobile',
      label: 'manager_mobile',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'house_manager_phone',
      label: 'manager_phone',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_manager_email',
      label: 'manager_email',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'house_manager_fax',
      label: 'manager_fax',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  const myCoordinateFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'house_my_map_address_latitude',
      label: 'latitude',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'house_my_map_address_longitude',
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

    tabValue,
    dataModel,
    closeDocumentsDialog,
    detailsHandlers,
    openDocumentsDialog,
    handleTabChange,
    handleNextTab,
    validatedTabs,
    attemptedTabs,
    setDetailsData,
    getDetailsErrors,
    detailsData,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/houses',
    routerUrl: { default: '/apps/haj/house' },
    fields: fields,
    tabsCount: 3,
    tabConfig: [
      { label: 'main_information', fields: fields.slice(0, 38) },
      { label: 'benefit_owner_information', fields: fields.slice(38, 54) },
      { label: 'address_information', fields: fields.slice(54, 67) },
      { label: 'contact_information', fields: fields.slice(67) }
    ]
  })
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'house'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.SharedForm
            dataObject={dataModel}
            allFormFields={fields}
            tabConfig={[
              { label: 'main_information', fields: fields.slice(0, 38) },
              {
                label: 'benefit_owner_information',
                fieldsArray: [
                  { fields: fields.slice(38, 46), gridSize: 6, label: 'owner_information' },
                  { fields: fields.slice(46, 54), gridSize: 6, label: 'benefit_information' }
                ]
              },
              { label: 'address_information', fields: fields.slice(54, 67) },
              { label: 'contact_information', fields: fields.slice(67) }
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
            onCancel={handleCancel}
            onSaveSuccess={onSubmit}
            recordId={dataModel.id}
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

        {tabValue === '2' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.Grid container spacing={2}>
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  headerConfig={{ title: 'our_coordinates' }}
                  locale={locale}
                  fields={myCoordinateFields}
                  mode={mode}
                  screenMode={mode}
                />
              </Shared.Grid>
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.Grid container spacing={2}>
                  <Shared.Grid size={{ xs: 6 }}>
                    <Shared.FormMapCard
                      dictionary={dictionary}
                      mode={mode}
                      title={dictionary?.titles?.['location'] || 'الموقع'}
                      coordinateFields={[
                        {
                          name: ['house_map_address_latitude', 'house_map_address_longitude'],
                          title: dictionary?.placeholders?.['location'] || 'موقع السكن'
                        }
                      ]}
                    />
                  </Shared.Grid>

                  <Shared.Grid size={{ xs: 6 }}>
                    <Shared.FormMapCard
                      dictionary={dictionary}
                      mode={mode}
                      title={dictionary?.titles?.['our_coordinates'] || 'الاحداثيات الخاصة بنا'}
                      coordinateFields={[
                        {
                          name: ['house_my_map_address_latitude', 'house_my_map_address_longitude'],
                          title: dictionary?.placeholders?.['our_coordinates'] || 'الاحداثيات الخاصة بنا'
                        }
                      ]}
                    />
                  </Shared.Grid>
                </Shared.Grid>
              </Shared.Grid>
            </Shared.Grid>
          </Shared.Grid>
        )}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default HouseDetails
