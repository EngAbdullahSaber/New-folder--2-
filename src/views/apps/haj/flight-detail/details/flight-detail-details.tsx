'use client'

import * as Shared from '@/shared'
import { ComponentGeneralHajProps } from '@/types/pageModeType'

const FlightDetailDetails = ({ scope }: ComponentGeneralHajProps) => {
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'season',
      label: 'season',
      type: 'number',
      gridSize: 3
    },

    {
      name: 'airport_code',
      label: 'airport_code',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'select',
      apiUrl: '/def/ports',
      labelProp: 'port_code',
      keyProp: 'port_code',
      gridSize: 3,
      requiredModes: ['add', 'edit']
    },

    {
      name: 'flight_date',
      label: 'flight_date',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'date',
      gridSize: 3,
      requiredModes: ['add', 'edit']
    },
    {
      name: 'flight_no',
      label: 'flight_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModes: ['add', 'edit']
    },

    {
      name: 'direction',
      label: 'direction',
      type: 'select',
      options: Shared.flightDirectionList,
      modeCondition: (mode: Shared.Mode) => 'show',
      gridSize: 3,
      requiredModes: ['add', 'edit']
    },
    {
      name: 'air_trans_company_id',
      label: 'air_trans_company',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'select',
      gridSize: 3,
      apiUrl: '/def/iata-carriers',
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit']
    },
    {
      name: 'from_city_id',
      label: 'from_city',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      gridSize: 3,
      viewProp: 'from_city.name_ar',
      requiredModes: ['add', 'edit']
    },

    {
      name: 'to_city_id',
      label: 'to_city',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      modeCondition: (mode: Shared.Mode) => mode,
      labelProp: 'name_ar',
      keyProp: 'id',
      gridSize: 3,
      viewProp: 'to_city.name_ar',
      requiredModes: ['add', 'edit']
    },

    {
      name: 'flight_type',
      label: 'flight_type',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'select',
      options: Shared.flightTypeList,
      gridSize: 3
    },

    {
      name: 'terminal_code',
      label: 'terminal_code',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'select',
      apiUrl: '/def/terminals',
      labelProp: 'terminal_name_ar',
      keyProp: 'id',
      gridSize: 3,
      requiredModes: ['add', 'edit']
    },

    // {
    //   name: 'air_trans_company_name_ar',
    //   label: 'airline_name_ar',
    //   type: 'text',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 3
    // },

    // {
    //   name: 'air_trans_company_name_la',
    //   label: 'airline_name_en',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   type: 'text',
    //   gridSize: 3
    // },

    {
      name: 'aircraft_type',
      label: 'aircraft_type',
      type: 'text',
      // options: Shared.aircraftTypeList,
      gridSize: 3,
      modeCondition: (mode: Shared.Mode) => mode
    },

    {
      name: 'max_capacity',
      label: 'max_capacity',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },

    {
      name: 'hfd_reservation_no',
      label: 'reservation_number',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'text',
      gridSize: 3
    },

    {
      name: 'hfd_flight_clearance_no',
      label: 'flight_clearance_number',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'text',
      gridSize: 3
    },

    {
      name: 'state',
      label: 'flight_state',
      type: 'select',
      modeCondition: (mode: Shared.Mode) => mode,
      options: Shared.flightStateList,
      requiredModes: ['add', 'edit'],
      gridSize: 3
    },

    // {
    //   name: 'hfd_season',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   label: 'hfd_season',
    //   type: 'number',
    //   gridSize: 3
    // },
    {
      name: 'data_source',
      label: 'data_source',
      type: 'select',
      options: Shared.dataSourceList,
      // requiredModes: [],
      // visibleModes: ['search', 'show'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      visibleModes: ['search', 'show']
    },

    {
      name: 'reference_id',
      label: 'reference_id',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'number',
      gridSize: 3,
      visibleModes: ['search', 'show']
    },

    {
      name: 'timestamp',
      label: 'last_timestamp',
      modeCondition: (mode: Shared.Mode) => mode,
      type: 'date',
      gridSize: 3,
      visibleModes: ['show']
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    setDetailsData,
    errors,
    setOpenDocumentsDialog,
    openDocumentsDialog,
    setOpenRecordInformationDialog,
    openRecordInformationDialog,
    openRecordTrackingDialog,
    setOpenRecordTrackingDialog,

    dataModel,
    closeDocumentsDialog,
    detailsHandlers,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/flight-details',
    routerUrl: { default: `/apps/haj/flight-detail/${scope}` },
    fields: fields,

  })

  const { setValue } = formMethods

  Shared.useEffect(() => {
    // Only set the value if mode is NOT 'add' or 'edit'
    if (['search', 'show'].includes(mode)) return;
    // Set direction based on scope
    if (scope === 'arrival') {
      setValue('direction', 'A');
    } else {
      setValue('direction', 'D');
    }
  }, [scope, mode]);
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'flight_details'}
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

export default FlightDetailDetails
