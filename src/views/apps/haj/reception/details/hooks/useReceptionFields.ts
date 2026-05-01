'use client'

import * as Shared from '@/shared'
import { ComponentGeneralReceptionProps } from '@/types/pageModeType'

interface UseReceptionFieldsProps {
  selectedReceptionType: any
  selectedCityId: any
  appSetting: any
  user: any
  locale: string
  selectedPortId: any
  selectedPortCityId: any
  selectedPortCode: any
  selectedLandTranId: any
  selectedIsTransportationCenter: any
  mode: Shared.Mode
  setValue: (name: any, value: any) => void
  setSelectedCityId: (value: any) => void
  setSelectedPortId: (value: any) => void
  setSelectedPortCode: (value: any) => void
  setSelectedPortCityId: (value: any) => void
  setSelectedLandTranId: (value: any) => void
  scope: any
}

export const useReceptionFields = ({
  selectedReceptionType,
  selectedCityId,
  appSetting,
  user,
  locale,
  selectedPortId,
  selectedPortCityId,
  selectedPortCode,
  selectedLandTranId,
  selectedIsTransportationCenter,
  mode,
  setValue,
  setSelectedCityId,
  setSelectedPortId,
  setSelectedPortCode,
  setSelectedPortCityId,
  setSelectedLandTranId,
  scope
}: UseReceptionFieldsProps) => {
  const isReceptionScope = scope === 'reception-department'
  const isServiceScope = scope === 'service-department'

  const autoReceptionFields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'reception_type',
        label: 'reception_type',
        type: 'toggle',
        options: Shared.receptionTypeList,
        defaultValue: '1',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12,
        requiredModes: ['add', 'edit']
      },
      {
        name: 'manifest_id',
        label: 'manifest_id',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        viewProp: 'manifest.manifest_id',
        visible: selectedReceptionType == '1'
        // requiredModeCondition(mode, formValues) {
        //   return (mode === 'add' || mode === 'edit') && formValues['reception_type'] === '1'
        // }
      },
      {
        name: 'tdm_id',
        label: 'tdm_id',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        visible: selectedReceptionType == '2'
        // requiredModeCondition(mode, formValues) {
        //   return (mode === 'add' || mode === 'edit') && formValues['reception_type'] == '2'
        // }
      }
    ],
    [selectedReceptionType]
  )

  const tab1Fields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      { name: 'id', label: 'id', modeCondition: (mode: Shared.Mode) => mode, gridSize: 4 },
      { name: 'season', label: 'season', type: 'number', modeCondition: (mode: Shared.Mode) => mode, gridSize: 4 },
      {
        name: 'reception_no',
        label: 'reception_no',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        autoFill: true
        // requiredModes: ['add', 'edit']
      },
      {
        name: 'reception_date',
        label: 'reception_date',
        now: true,
        type: 'date_time',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      {
        name: 'reception_city_id',
        label: 'reception_city_id',
        type: 'select',
        options: Shared.toOptions(user?.user_cities, locale),
        defaultValue: user?.context?.city_id,
        labelProp: 'name_ar',
        keyProp: 'id',
        viewProp: 'name_ar',
        cache: false,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        clearOnParentChange: ['reception_department_id', 'service_department_id'],
        onChange: (res: any) => {
          setSelectedCityId(res?.object?.id || res?.value || undefined)
        }
      },

      {
        name: 'reception_department_id',
        label: 'reception_department_id',
        type: 'select',

        apiUrl:
          selectedCityId && appSetting?.reception_department_type_id
            ? isReceptionScope
              ? '/aut/user/departments'
              : '/def/seasonal-departments'
            : undefined,

        labelProp: 'department_name_ar',
        displayProps: ['id', 'department_name_ar'],
        keyProp: 'department_id',

        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),

        selectFirstValue: false,
        requiredModes: ['add', 'edit'],
        gridSize: 4,
        skipDataSuffix: isReceptionScope,
        viewProp: ['reception_department.id', 'reception_department.department_name_ar'],

        queryParams: {
          city_id: selectedCityId,
          ...(appSetting?.reception_department_type_id && {
            ...(isReceptionScope
              ? {
                  department_types: {
                    id: appSetting.reception_department_type_id
                  }
                }
              : {
                  seasonal_departments_types: {
                    id: appSetting.reception_department_type_id
                  }
                })
          })
        }
      },

      {
        name: 'service_department_id',
        label: 'service_department_id',
        type: 'select',
        apiUrl:
          selectedCityId && appSetting?.service_department_type_id
            ? isServiceScope
              ? '/aut/user/departments'
              : '/def/seasonal-departments'
            : undefined,

        labelProp: 'department_name_ar',
        displayProps: ['id', 'department_name_ar'],
        keyProp: 'department_id',
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        selectFirstValue: false,
        requiredModes: ['add', 'edit'],
        gridSize: 4,
        skipDataSuffix: isServiceScope,
        viewProp: ['service_department.id', 'service_department.department_name_ar'],
        queryParams: {
          city_id: selectedCityId,
          ...(appSetting?.service_department_type_id && {
            ...(isServiceScope
              ? {
                  department_types: {
                    id: appSetting.service_department_type_id
                  }
                }
              : {
                  seasonal_departments_types: {
                    id: appSetting.service_department_type_id
                  }
                })
          })
        }
      },

      {
        name: 'spc_business_id',
        label: 'spc_business_id',
        type: 'select',
        apiUrl: '/haj/spc-companies',
        labelProp: 'company_name_ar',
        displayProps: ['id', 'company_name_ar'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        viewProp: ['spc_business.id', 'spc_business.company_name_ar'],
        visibleModes: ['search', 'show']
      }
      // {
      //   name: 'guiding_m_id',
      //   label: 'guiding_m_id',
      //   type: 'select',
      //   apiUrl: '/haj/bus-guides',
      //   labelProp: 'name_ar',
      //   displayProps: ['id', 'name_ar'],
      //   keyProp: 'id',
      //   selectFirstValue: false,
      //   modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
      //   gridSize: 4,
      //   viewProp: ['bus_guide.id', 'bus_guide.name_ar']
      // }
    ],
    [selectedCityId, appSetting, user, locale]
  )

  const tab2Fields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'port_id',
        label: 'port_id',
        type: 'select',
        apiUrl: '/def/ports',
        labelProp: 'port_name_ar',
        displayProps: ['id', 'port_name_ar'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        viewProp: ['port.id', 'port.port_name_ar'],
        requiredModeCondition: (mode, formValues) => formValues['reception_type'] === '1',
        visible: selectedReceptionType == '1',
        clearOnParentChange: ['path_id', 'route_id'],
        onChange: (res: any) => {
          setSelectedPortCode(res?.object?.port_code)
          setSelectedPortCityId(res?.object?.city_id)
          setSelectedPortId(res?.value || undefined)
        }
      },
      {
        name: 'path_id',
        label: 'path_id',
        type: 'select',
        apiUrl: '/def/paths',
        labelProp: 'name_ar',
        displayProps: ['id', 'name_ar'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        viewProp: ['path.id', 'path.name_ar'],
        queryParams: { from_prt_id: selectedPortId },
        requiredModes: ['add', 'edit'],
        onChange: (res: any) => {
          setValue('path_id', res.value)
        }
      },
      {
        name: 'route_id',
        label: 'route_id',
        type: 'select',
        apiUrl: '/def/routes',
        labelProp: 'name_ar',
        displayProps: ['id', 'name_ar'],
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        viewProp: ['route.id', 'route.name_ar'],
        queryParams: { to_ct_id: selectedCityId },
        requiredModes: ['add', 'edit'],
        onChange: (res: any) => {
          setValue('route_id', res.value)
        }
      },
      {
        name: 'flight_id',
        label: 'flight_id',
        type: 'select',
        apiUrl: selectedPortCode ? '/haj/flight-details' : undefined,
        displayProps: ['air_trans_company_name_la', 'flight_no', 'flight_date'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        viewProp: [
          'fight_details.air_trans_company_name_la',
          'fight_details.id',
          'fight_details.flight_no',
          'fight_details.flight_date'
        ],
        queryParams: { airport_code: selectedPortCode },
        visible: selectedReceptionType == '1',
        valueTransform: (val: any) => (val != null ? String(val) : null),
        onChange: (res: any) => {
          setValue('flight_id', res.value ? String(res.value) : null)
        },
        requiredModes: ['add', 'edit']
      },
      {
        name: 'auto_process_type',
        label: 'auto_process_type',
        type: 'select',
        options: Shared.autoProcessTypeList,
        selectFirstValue: false,
        defaultValue: '2',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        visibleModes: ['search', 'show']
      }
    ],
    [selectedReceptionType, selectedPortId, selectedPortCityId, selectedPortCode]
  )

  const tab3Fields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'is_trasnpotation_center',
        label: 'is_transportation_center',
        type: 'select',
        options: Shared.yesNoList,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        selectFirstValue: mode === 'add',
        // When transport type changes, clear all transport-related child fields
        clearOnParentChange: [
          'ltc_id',
          'bus_id',
          'driver_id',
          'bus_type',
          'plate_no',
          'driver_name',
          'driver_identification_no'
        ],
        requiredModes: ['add', 'edit']
      },
      {
        name: 'ltc_id',
        label: 'ltc_id',
        type: 'select',
        apiUrl: '/def/transportation-companies',
        labelProp: 'ltc_name_ar',
        displayProps: ['business_id', 'ltc_name_ar'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        viewProp: ['ltc.id', 'ltc.ltc_name_ar'],
        visible: selectedIsTransportationCenter == '1',
        requiredModeCondition: (mode, formValues) => formValues['is_trasnpotation_center'] == '1',
        // Clear bus & driver when company changes (user action only)
        clearOnParentChange: ['bus_id', 'driver_id'],
        // On load (edit/show): read business_id from the nested ltc object
        syncFromDataModel: 'ltc.business_id',
        onChange: (res: any) => {
          setSelectedLandTranId(res?.object?.id)
        }
      },
      {
        name: 'bus_id',
        label: 'bus_id',
        type: 'select',
        apiUrl: selectedLandTranId ? '/haj/buses' : undefined,
        labelProp: 'bi_plate_no',
        displayProps: ['bi_operating_card_no', 'bi_plate_no'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        viewProp: ['bus.id', 'bus.bi_operating_card_no', 'bus.bi_plate_no'],
        requiredModeCondition: (mode, formValues) => formValues['is_trasnpotation_center'] == '1',
        queryParams: { lu_land_trans_company: { id: selectedLandTranId } },
        visible: selectedIsTransportationCenter == '1'
      },
      {
        name: 'bus_type',
        label: 'bus_type',
        type: 'select',
        apiUrl: '/def/bus-types',
        labelProp: 'name_ar',
        displayProps: ['id', 'name_ar'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) =>
          (mode === 'add' || mode === 'edit') && selectedIsTransportationCenter == '1' ? 'show' : mode,
        gridSize: 4,
        viewProp: ['bus_type.id', 'bus_type.name_ar'],
        visible: selectedIsTransportationCenter == '2',
        requiredModeCondition: (mode, formValues) => formValues['is_trasnpotation_center'] == '2'
      },
      {
        name: 'plate_no',
        label: 'plate_no',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        requiredModeCondition: (mode, formValues) => formValues['is_trasnpotation_center'] == '2',
        visible: selectedIsTransportationCenter == '2'
      },
      {
        name: 'driver_id',
        label: 'driver_id',
        type: 'select',
        apiUrl: selectedLandTranId ? '/haj/drivers' : undefined,
        labelProp: 'di_driver_name',
        displayProps: ['di_driver_identification_id', 'di_driver_name'],
        keyProp: 'id',
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'edit' ? 'edit' : mode),
        gridSize: 4,
        viewProp: ['driver.id', 'driver.di_driver_identification_id', 'driver.di_driver_name'],
        requiredModeCondition: (mode, formValues) => formValues['is_trasnpotation_center'] == '1',
        queryParams: { lu_land_trans_company: { id: selectedLandTranId } },
        visible: selectedIsTransportationCenter == '1'
      },
      {
        name: 'driver_name',
        label: 'driver_name',
        type: 'text',
        modeCondition: (mode: Shared.Mode) =>
          (mode === 'add' || mode === 'edit') && selectedIsTransportationCenter == '1' ? 'show' : mode,
        gridSize: 4,
        visible: selectedIsTransportationCenter == '2',
        requiredModeCondition: (mode, formValues) => formValues['is_trasnpotation_center'] == '2'
      },
      {
        name: 'driver_identification_no',
        label: 'driver_identification_no',
        type: 'number',
        modeCondition: (mode: Shared.Mode) =>
          (mode === 'add' || mode === 'edit') && selectedIsTransportationCenter == '1' ? 'show' : mode,
        gridSize: 4,
        visible: selectedIsTransportationCenter == '2',
        requiredModeCondition: (mode, formValues) => formValues['is_trasnpotation_center'] == '2'
      }
    ],
    [selectedIsTransportationCenter, selectedLandTranId]
  )

  const tab4Fields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'handover_status',
        label: 'handover_status',
        type: 'select',
        options: Shared.handoverStatusList,
        selectFirstValue: false,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },
      {
        name: 'total_hajj',
        label: 'total_hajj',
        type: 'amount',
        showCurrency: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'search' ? 'search' : 'show'),
        gridSize: 4
      },
      {
        name: 'total_passport',
        label: 'total_passport',
        type: 'amount',
        showCurrency: false,
        modeCondition: (mode: Shared.Mode) => (mode === 'search' ? 'search' : 'show'),
        gridSize: 4
      }
    ],
    []
  )

  const systemFields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'files',
        label: '',
        type: 'storage',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12,
        visibleModes: ['add', 'edit']
      }
    ],
    []
  )

  const receptionDetailsFields: Shared.DynamicFormTableFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'nation_id',
        label: 'nation_id',
        type: 'select',
        apiUrl: '/def/nationalities',
        labelProp: 'name_ar',
        displayProps: ['id', 'name_ar'],
        keyProp: 'id',
        viewProp: 'nationality.name_ar',
        width: '15%'
      },
      {
        name: 'contract_id',
        label: 'house_contract_id',
        type: 'select',
        apiUrl: '/haj/house-contracts',
        displayProps: ['id', 'requester.name_ar', 'house.house_commercial_name_ar'],
        keyProp: 'id',
        width: '25%',
        viewProp: ['contract_id', 'contract.house.business_id', 'contract.house.house_commercial_name_ar']
      },
      { name: 'hajj_count', label: 'hajj_count', type: 'number', width: '8%' },
      { name: 'passport_count', label: 'passport_count', type: 'number', width: '8%' },
      { name: 'copy_passport_count', label: 'copy_passport_count', type: 'number', width: '8%' },
      { name: 'hajj_wo_passport_count', label: 'hajj_wo_passport_count', type: 'number', width: '8%' },
      { name: 'passport_wo_hajj_count', label: 'passport_wo_hajj_count', type: 'number', width: '8%' }
    ],
    []
  )

  return {
    autoReceptionFields,
    tab1Fields,
    tab2Fields,
    tab3Fields,
    tab4Fields,
    systemFields,
    receptionDetailsFields,
    allFields: [...autoReceptionFields, ...systemFields, ...tab1Fields, ...tab2Fields, ...tab3Fields, ...tab4Fields]
  }
}
