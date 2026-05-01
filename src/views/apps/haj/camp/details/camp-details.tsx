'use client'

import * as Shared from '@/shared'

const fields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  // -- Identification --
  {
    name: 'season',
    label: 'season',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'terminal_id',
    label: 'bussines_id',
    type: 'number',
    requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 4
  },

  {
    name: 'camp_no',
    label: 'camp_no',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  // -- Mena Site Details --
  {
    name: 'mena_camp_square_name_ar',
    label: 'mena_camp_square_name_ar',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  // -- Capacity & Area --
  {
    name: 'mena_camp_capacity',
    label: 'mena_camp_capacity',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'camp_area',
    label: 'camp_area',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  {
    name: 'mena_camp_zone_id',
    label: 'mena_camp_zone_id',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'mena_camp_gate_no',
    label: 'mena_camp_gate_no',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'mena_camp_street_no',
    label: 'mena_camp_street_no',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'mena_coordinates',
    label: 'mena_coordinates',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'mena_camp_trans_type_name_ar',
    label: 'mena_camp_trans_type_name_ar',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'mena_camp_trans_type_name_en',
    label: 'mena_camp_trans_type_name_en',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },

  // -- Arafat Site Details --
  {
    name: 'arafat_camp_id',
    label: 'arafat_camp_id',
    type: 'number',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'arafat_coordinates',
    label: 'arafat_coordinates',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 3
  },
  {
    name: 'camp_street_to_arafat',
    label: 'camp_street_to_arafat',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  },
  {
    name: 'arafat_my_coordinates',
    label: 'arafat_my_coordinates',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
  },
  {
    name: 'mena_my_coordinates',
    label: 'mena_my_coordinates',
    type: 'text',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 6
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
  }
  //   {
  //     name: 'status',
  //     label: 'status',
  //     type: 'select',
  //     options: Shared.statusList,
  //     requiredModes: ['add', 'edit'],
  //     defaultValue: '1',
  //     visibleModes: ['search', 'show'],
  //     modeCondition: (mode: Shared.Mode) => mode,
  //     gridSize: 4
  //   }
]

type dataModelFormData = Shared.InferFieldType<typeof fields>

const CampDetails = () => {
  const { dictionary } = Shared.useCityAccess()
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
    locale,
    dataModel,
    closeDocumentsDialog,
    detailsHandlers,
    getDetailsErrors,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/camps',
    routerUrl: { default: '/apps/haj/camp' },
    fields: fields
  })

  const mainFields = fields.filter(f => !['arafat_my_coordinates', 'mena_my_coordinates'].includes(f.name as string))
  const myCoordinateFields = fields.filter(f =>
    ['arafat_my_coordinates', 'mena_my_coordinates'].includes(f.name as string)
  )

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'camp'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={mainFields} mode={mode} screenMode={mode} />
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

        {/* Map Section */}
        <Shared.Grid size={{ xs: 6 }}>
          <Shared.FormMapCard
            dictionary={dictionary}
            mode={mode}
            coordinateFields={[
              { name: 'mena_coordinates', title: 'mena_coordinates' },
              { name: 'arafat_coordinates', title: 'arafat_coordinates' }
            ]}
          />
        </Shared.Grid>
        <Shared.Grid size={{ xs: 6 }}>
          <Shared.FormMapCard
            dictionary={dictionary}
            title={dictionary?.titles?.['our_coordinates'] || 'الاحداثيات الخاصة بنا'}
            mode={mode}
            coordinateFields={[
              { name: 'arafat_my_coordinates', title: 'arafat_my_coordinates' },
              { name: 'mena_my_coordinates', title: 'mena_my_coordinates' }
            ]}
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

export default CampDetails
