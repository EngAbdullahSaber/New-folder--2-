'use client'

import * as Shared from '@/shared'
import dayjs from 'dayjs'
import { useAppSettings } from '../../hooks/useAppSettings'
import { ComponentGeneralHandoverProps } from '@/types/pageModeType'
import { getDictionary } from '@/utils/getDictionary'
import { check } from 'valibot'

const HandoverBagPassportDetails = ({ scope }: ComponentGeneralHandoverProps) => {
  const { personal, status, user, accessToken } = Shared.useSessionHandler()
  const [selectedContentType, setSelectedContentType] = Shared.useState()
  const [selectedHandoverType, setSelectedHandoverType] = Shared.useState()
  const [selectedUnitId, setSelectedUnitId] = Shared.useState()

  const { userPassportUnits } = Shared.useSessionHandler()
  console.log(userPassportUnits)
  const [appSetting, setAppSetting] = Shared.useState<any>()

  // Define the fields with validation and default values
  const fields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },
      {
        name: 'season',
        label: 'season',
        type: 'select',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },

      {
        name: 'document_no',
        label: 'document_no',
        type: 'number',
        autoFill: true,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },

      {
        name: 'document_date',
        label: 'document_date',
        type: 'date',
        requiredModes: ['add', 'edit'],
        now: true,
        modeCondition: (mode: Shared.Mode) => (mode !== 'add' ? mode : 'show'),
        gridSize: 3
      },
      {
        name: 'sender_user_id',
        label: 'sender_user_id',
        type: 'text',
        visibleModes: ['add', 'edit', 'show'],
        modeCondition: (mode: Shared.Mode) => 'show',
        gridSize: 6
      },
      {
        name: 'sender_user_id',
        label: 'sender_user_id',

        type: 'select',
        apiUrl: '/aut/users',
        displayProps: ['id', 'personal.id_no', 'personal.full_name_ar'],
        // readOnly: true,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        visibleModeCondition: (mode, formValues) => {
          return mode == 'search' && user.user_groups.find((res: any) => Number(res) == 1)
        }
      },
      {
        name: 'sender_unit_id',
        label: 'sender_unit_id',
        type: 'select',
        options: userPassportUnits,
        labelProp: 'passport_units_name_ar',
        requiredModes: ['add', 'edit'],
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,

        gridSize: 6
      },

      {
        name: 'handover_type_id',
        label: 'handover_type',
        type: 'select',
        apiUrl: '/haj/handover-types',
        labelProp: 'handover_type_description',
        requiredModes: ['add', 'edit'],
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12,
        onChange(value, rowIndex, obj) {
          setSelectedContentType(value?.object?.content_type)
        }
      },

      {
        name: 'receiver_unit_id',
        label: 'receiver_unit_id',
        type: 'select',
        apiUrl: selectedHandoverType && selectedUnitId ? '/haj/passport-units/by-handover-type' : undefined,
        labelProp: 'short_name_ar',
        queryParams: {
          unit_id: selectedUnitId,
          handover_type_id: selectedHandoverType
        },
        requiredModes: ['add', 'edit'],
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },

      {
        name: 'receiver_user_id',
        label: 'receiver_user_id',
        type: 'select',
        apiUrl: '/aut/users',
        displayProps: ['id', 'personal.id_no', 'personal.full_name_ar'],
        modeCondition: (mode: Shared.Mode) => mode,
        // visibleModes: ['show', 'search'],
        visibleModeCondition: (mode, formValues) => {
          return mode == 'search' && user.user_groups.find((res: any) => Number(res) == 1)
        },
        // requiredModes: ['add', 'edit'],
        gridSize: 6
      },

      {
        name: 'reference_no',
        label: 'reference_no',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => mode,
        visibleModeCondition: (mode, formValues) => {
          if (mode === 'search' || mode === 'show') return true
          return formValues['handover_type_id'] === appSetting?.['passport_ho_type_agent']
        },
        requiredModeCondition: (mode, formValues) => {
          if (mode === 'add' || mode === 'edit') {
            return formValues['handover_type_id'] === appSetting?.['passport_ho_type_agent']
          }
          return false
        },
        // visibleModes: ['show', 'search'],
        gridSize: 3
      },
      {
        name: 'receive_name',
        label: 'receive_name',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => mode,
        visibleModeCondition: (mode, formValues) => {
          if (mode === 'search' || mode === 'show') return true
          return formValues['handover_type_id'] === appSetting?.['passport_ho_type_agent']
        },
        requiredModeCondition: (mode, formValues) => {
          if (mode === 'add' || mode === 'edit') {
            return formValues['handover_type_id'] === appSetting?.['passport_ho_type_agent']
          }
          return false
        },
        gridSize: 3
      },
      {
        name: 'receive_job',
        label: 'receive_job',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => mode,
        visibleModeCondition: (mode, formValues) => {
          if (mode === 'search' || mode === 'show') return true
          return formValues['handover_type_id'] === appSetting?.['passport_ho_type_agent']
        },
        requiredModeCondition: (mode, formValues) => {
          if (mode === 'add' || mode === 'edit') {
            return formValues['handover_type_id'] === appSetting?.['passport_ho_type_agent']
          }
          return false
        },
        gridSize: 3
      },
      {
        name: 'receive_timestamp',
        label: 'receive_timestamp',
        type: 'date',
        modeCondition: (mode: Shared.Mode) => mode,
        visibleModes: ['show', 'search'],
        gridSize: 3
      },
      {
        name: 'mission_business_id',
        label: 'mission_business_id',
        type: 'select',
        apiUrl: '/haj/provider-requests',
        displayProps: ['name_ar', 'type_name'],
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        queryParams: { type: [1] },
        visibleModeCondition: (mode, formValues) => {
          if (mode === 'search' || mode === 'show') return true
          return Number(formValues['handover_type_id']) === Number(appSetting?.['passport_ho_type_rep'])
        },
        requiredModeCondition: (mode, formValues) => {
          if (mode === 'add' || mode === 'edit') {
            return (
              Number(formValues['handover_type_id']) === Number(appSetting?.['passport_ho_type_rep']) &&
              !formValues['company_business_id']
            )
          }
          return false
        }
      },
      {
        name: 'company_business_id',
        label: 'company_business_id',
        type: 'select',
        apiUrl: '/haj/provider-requests',
        displayProps: ['name_ar', 'type_name'],
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        queryParams: { type: [3] },
        visibleModeCondition: (mode, formValues) => {
          console.log(Number(formValues['handover_type_id']), Number(appSetting?.['passport_ho_type_rep']))
          if (mode === 'search' || mode === 'show') return true
          return Number(formValues['handover_type_id']) === Number(appSetting?.['passport_ho_type_rep'])
        },
        requiredModeCondition: (mode, formValues) => {
          if (mode === 'add' || mode === 'edit') {
            return (
              Number(formValues['handover_type_id']) === Number(appSetting?.['passport_ho_type_rep']) &&
              !formValues['mission_business_id']
            )
          }
          return false
        }
      },
      {
        name: 'bag_count',
        label: 'bag_count',
        type: 'number',
        visibleModes: ['show', 'search'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },
      {
        name: 'passport_count',
        label: 'passport_count_num',
        type: 'number',
        visibleModes: ['show', 'search'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },
      {
        name: 'check_flag',
        label: 'check_flag',
        type: 'select',
        options: Shared.checkFlagList,
        // requiredModes: ['add', 'edit'],
        visibleModes: ['show', 'search'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6
      },
      {
        name: 'check_timestamp',
        label: 'check_timestamp',
        type: 'time',
        modeCondition: (mode: Shared.Mode) => mode,
        visibleModes: ['show', 'search'],
        gridSize: 6
      },

      {
        name: 'remarks',
        label: 'remarks',
        type: 'textarea',
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      }
    ],
    [appSetting, user, userPassportUnits, selectedHandoverType, selectedUnitId]
  )

  const handoverBagsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'reception_no',
      label: 'reception_no_handover',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      width: '25%'
    },
    {
      name: 'total_passports',
      label: 'passport_count_num',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      width: '25%'
    },
    {
      name: 'total_passport_photos',
      label: 'total_passport_photos',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      width: '25%'
    },
    {
      name: 'check_flag',
      label: 'check_flag',
      type: 'select',
      options: Shared.checkFlagList,
      requiredModes: ['add', 'edit'],
      mode: 'show',
      gridSize: 4
    }
  ]
  const handoverPassportFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'barcode',
      label: 'barcode',
      type: 'barcode',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      width: '20%',
      onBlur: (value, rowIndex) => {
        console.log('value', value)
        handleUpdatePassportBarcodeDetailsData(rowIndex!, value)
      }
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
      gridSize: 4,
      width: '15%'
    },
    // {
    //   name: 'passport_no',
    //   label: 'passport_detail',
    //   type: 'select',
    //   apiUrl: '/haj/applicants',
    //   // labelProp: 'name_ar',
    //   displayProps: ['ad_passport_no', 'ad_union_no', 'ad_full_name_ar'],
    //   keyProp: 'id',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   //lovKeyName: 'id',
    //   gridSize: 4,
    //   width: '20%'
    // },

    {
      name: 'passport_no',
      label: 'passport_no',
      type: 'text',
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => mode,
      width: '20%'
    },

    {
      name: 'name',
      label: 'name_hajj',
      type: 'text',
      gridSize: 4,
      modeCondition: (mode: Shared.Mode) => mode,
      mode: 'show'
    },

    {
      name: 'reception_no',
      label: 'reception_no_handover_passport',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => 'show',
      mode: 'show',
      gridSize: 4,
      width: '10%'
    },
    {
      name: 'check_flag',
      label: 'check_flag',
      type: 'select',
      options: Shared.checkFlagList,
      requiredModes: ['add', 'edit'],
      mode: 'show',
      gridSize: 4,
      width: '10%'
    }
    // {
    //   name: 'ad_union_no',
    //   label: 'ad_union_no',
    //   type: 'number',
    //   mode: 'show',
    //   width: '25%',
    //   gridSize: 4
    // }
  ]

  const selectionPassportsColumns = Shared.useMemo<Shared.GenericTableColumnConfig[]>(
    () => [
      {
        key: 'nation_id',
        label: 'nation_id',
        type: 'select',
        apiUrl: '/def/nationalities'
      },
      {
        key: 'passport_no',
        label: 'passport_detail',
        type: 'select',
        apiUrl: '/haj/applicants',
        displayProps: ['ad_passport_no', 'ad_union_no', 'ad_full_name_ar']
      },
      {
        key: 'reception_no',
        label: 'reception_no_handover'
      },
      {
        key: 'check_flag',
        label: 'check_flag',
        type: 'select',
        options: Shared.checkFlagList
      }
    ],
    [scope]
  )
  const selectionBagsColumns = Shared.useMemo<Shared.GenericTableColumnConfig[]>(
    () => [
      {
        key: 'reception_no',
        label: 'reception_no'
      },
      {
        key: 'total_passports',
        label: 'passport_count_num'
      },
      {
        key: 'total_passport_photos',
        label: 'total_passport_photos'
      },
      {
        key: 'check_flag',
        label: 'check_flag',
        type: 'select',
        options: Shared.checkFlagList
      }
    ],
    [scope]
  )

  type dataModelFormData = Shared.InferFieldType<typeof fields>
  const excludedNames = ['sender_user_id', 'document_no', 'document_date']
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    setMode,
    handleMenuOptionClick,
    locale,
    dataModel,
    openDocumentsDialog,
    updateDetailsData,

    closeDocumentsDialog,
    getDetailsErrors,
    setDetailsData,
    detailsData,
    navigateWithQuery,
    detailsHandlers,
    router,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/handover-bag-passports',
    routerUrl: { default: `/apps/haj/handover-bag-passport/${scope}` },
    fields: fields,
    onSaveSuccess: async (response, mode) => {
      if (scope === 'receiver') {
        setMode('show')
      } else {
        navigateWithQuery(`/apps/haj/handover-bag-passport/${scope}/list`, router, locale as Shared.Locale)
      }
    },
    transformPayload: (payload, detailsData) => {
      if (mode === 'search') return payload

      if (scope === 'sender') {
        const cleanedPassports = detailsData?.passports?.map((passport: any) => {
          const { barcode, ...rest } = passport
          return rest
        })

        return {
          ...payload,
          ...detailsData,
          passports: cleanedPassports
        }
      }

      if (scope === 'receiver') {
        let updatedPayload = {}

        if (detailsData?.bags.length > 0) {
          const bags = detailsData?.bags?.map((bag: any) => {
            if (bag.selected) {
              return { id: bag.id, check_flag: bag.check_flag, rowChanged: true }
            }
          })

          updatedPayload = { ...updatedPayload, bags }
        }

        if (detailsData?.passports.length > 0) {
          const passports = detailsData?.passports?.map((passport: any) => {
            if (passport.selected) {
              return { id: passport.id, check_flag: passport.check_flag, rowChanged: true }
            }
          })

          updatedPayload = { ...updatedPayload, passports }
        }

        return updatedPayload
      }
    },
    excludeFields: [
      {
        action: 'add',
        fields: fields.filter(f => excludedNames.includes(f.name))
      },
      {
        action: 'edit',
        fields: fields.filter(f => excludedNames.includes(f.name))
      }
    ],
    initialDetailsData: {
      bags: [],
      passports: []
    },
    detailsTablesConfig: {
      bags: { fields: handoverBagsFields, trackIndex: true },
      passports: { fields: handoverPassportFields, trackIndex: true }
    }
  })

  // Dictionary
  const [dictionary, setDictionary] = Shared.useState<any>(null)
  Shared.useEffect(() => {
    getDictionary(locale as Shared.Locale).then(res => setDictionary(res))
  }, [locale])

  const { setValue, watch } = formMethods

  const appSettings = useAppSettings(accessToken, mode, dataModel?.id, (locale as string) || 'ar', formMethods, false)

  const handoverType = watch('handover_type_id')
  const unitId = watch('sender_unit_id')

  Shared.useEffect(() => {
    if (handoverType) setSelectedHandoverType(handoverType)
  }, [handoverType])

  Shared.useEffect(() => {
    if (unitId) setSelectedUnitId(unitId)
  }, [unitId])

  Shared.useEffect(() => {
    setValue('receiver_unit_id', null)
  }, [handoverType, unitId])

  Shared.useEffect(() => {
    if (appSettings) {
      // City has value
      setAppSetting(appSettings)
    } else {
      // Is Transportation Center is empty - clear everything
      setAppSetting(null)
    }
  }, [appSettings, appSetting])

  Shared.useEffect(() => {
    if (user && mode === 'add') {
      setValue('sender_user_id', `(${user?.id}) ${user.full_name_ar}`)
    }
  }, [user, mode])

  Shared.useEffect(() => {
    if (mode === 'add') {
      setValue('document_date', dayjs().format('YYYY-MM-DD'))
    }
  }, [])

  const handleSelectAll = (checked: boolean, detailsKey: string) => {
    const updated = detailsData[detailsKey].map((item: any) => ({ ...item, selected: checked }))
    updateDetailsData(detailsKey, updated)
  }

  const handleUpdatePassportBarcodeDetailsData = (index: number, barcodeValue: string) => {
    // Store the raw barcode value scanned from the barcode scanner
    updateDetailsData(
      'passports',
      {
        barcode: barcodeValue
      },
      index
    )
  }

  const handleToggleRow = (index: number, checked: boolean, detailsKey: string) => {
    updateDetailsData(detailsKey, { selected: checked }, index)
    onSubmit()
  }

  const updateCheckFlagDetailsData = (checkFlag: string) => {
    let detailsKey = ''
    if (detailsData?.bags?.length > 0) {
      detailsKey = 'bags'
    }
    if (detailsData?.passports?.length > 0) {
      detailsKey = 'passports'
    }

    const updated = detailsData[detailsKey].map((item: any) => {
      if (item.selected) {
        return { ...item, check_flag: checkFlag }
      }
      return item
    })
    updateDetailsData(detailsKey, updated)
  }

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`handover_bag_passport`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            detailsConfig={[
              { key: 'bags', fields: handoverBagsFields, title: 'handover_bags' },
              { key: 'passports', fields: handoverPassportFields, title: 'handover_passports' }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={scope === 'receiver' ? 'show' : mode}
            screenMode={mode}
          />
        </Shared.Grid>

        {String(selectedContentType) === '1' && scope === 'sender' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.DynamicFormTable
              fields={handoverPassportFields}
              title='handover_passports'
              initialData={detailsData['passports']}
              onDataChange={detailsHandlers?.passports}
              mode={mode}
              errors={getDetailsErrors('passports')}
              apiEndPoint={`/haj/handover-bag-passports/${dataModel.id}/passports`}
              detailsKey='passports'
              locale={locale}
              onChangeRow={row => {
                if (row.name && row.passport_no) {
                  // Calling an api
                }
              }}
              // rowModal={true}
              dataObject={dataModel}
            />
          </Shared.Grid>
        )}

        {String(selectedContentType) === '2' && scope === 'sender' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.DynamicFormTable
              fields={handoverBagsFields}
              title='handover_bags'
              initialData={detailsData['bags']}
              onDataChange={detailsHandlers?.bags}
              mode={mode}
              errors={getDetailsErrors('bags')}
              apiEndPoint={`/haj/handover-bag-passports/${dataModel.id}/bags`}
              detailsKey='bags'
              locale={locale}
              // rowModal={true}
              dataObject={dataModel}
            />
          </Shared.Grid>
        )}

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

        {scope === 'receiver' && detailsData?.bags.length > 0 && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.GenericSelectionTable
              data={detailsData['bags'] || []}
              columns={selectionBagsColumns}
              onToggleAll={checked => {
                handleSelectAll(checked, 'bags')
              }}
              onToggleRow={(index, checked) => {
                handleToggleRow(index, checked, 'bags')
              }}
              // onUpdateRow={(index, data) => updateDetailsData('candidates', data, index)}
              dictionary={dictionary}
              locale={locale as string}
              mode={mode}
              idKey='id'
              // emptyConfig={{
              //   condition: !!selectedDepartment,
              //   message: dictionary?.messages?.please_select_department || 'يرجى اختيار الإدارة أولاً',
              //   icon: 'tabler-info-circle'
              // }}
            />
          </Shared.Grid>
        )}

        {scope === 'receiver' && detailsData?.passports.length > 0 && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.GenericSelectionTable
              data={detailsData['passports'] || []}
              columns={selectionPassportsColumns}
              onToggleAll={checked => {
                handleSelectAll(checked, 'passports')
              }}
              onToggleRow={(index, checked) => {
                handleToggleRow(index, checked, 'passports')
              }}
              dictionary={dictionary}
              locale={locale as string}
              mode={mode}
              idKey='id'
              // emptyConfig={{
              //   condition: !!selectedDepartment,
              //   message: dictionary?.messages?.please_select_department || 'يرجى اختيار الإدارة أولاً',
              //   icon: 'tabler-info-circle'
              // }}
            />
          </Shared.Grid>
        )}
        {scope === 'sender' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
          </Shared.Grid>
        )}

        {scope === 'receiver' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormActions
              saveLabelKey='receive'
              onSaveSuccess={() => {
                updateCheckFlagDetailsData('2')
              }}
              onCancel={handleCancel}
              mode={mode}
              locale={locale}
            >
              <Shared.Button
                variant='contained'
                color='error'
                onClick={() => {
                  updateCheckFlagDetailsData('3')
                }}
              >
                {dictionary?.actions?.reject_receive || 'Reject'}
              </Shared.Button>
            </Shared.FormActions>
          </Shared.Grid>
        )}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default HandoverBagPassportDetails
