// app/[lang]/(dashboard)/apps/haj/pilgrims/details/page.tsx
'use client'

import * as Shared from '@/shared'
import { useAppSettings } from '../../hooks/useAppSettings'

// ═══════════════════════════════════════════════════════════════════
// TAB 1: BASIC INFORMATION
// ══════════════════════════════════════════════════════════════════
const ApplicantDataDetails = (props?: any) => {
  const { isPrintMode } = Shared.usePrintMode()
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = Shared.useCityAccess()
  const { accessToken, userPassportUnits, userDepartments } = Shared.useSessionHandler()
  const [appSetting, setAppSetting] = Shared.useState<any>()

  const basicInformationFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'files',
      label: '',
      type: 'storage',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12,
      visibleModes: ['add', 'edit']
    },
    {
      name: 'personal_picture',
      label: 'personal_picture',
      type: 'personal_picture',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12,
      visibleModes: ['add', 'edit', 'show']
    },
    {
      name: 'season',
      label: 'season',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_application_no',
      label: 'ad_application_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_union_no',
      label: 'ad_union_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_border_number',
      label: 'ad_border_number',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_first_name_ar',
      label: 'ad_first_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModeCondition: (mode, formValues) => {
        if (!['add', 'edit'].includes(mode)) return false
        return !formValues?.ad_first_name_en && !formValues?.ad_family_name_en
      }
    },
    {
      name: 'ad_father_name_ar',
      label: 'ad_father_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModeCondition: (mode, formValues) => {
        return false
      }
    },
    {
      name: 'ad_grand_father_name_ar',
      label: 'ad_grand_father_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_family_name_ar',
      label: 'ad_family_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModeCondition: (mode, formValues) => {
        if (!['add', 'edit'].includes(mode)) return false
        return !formValues?.ad_first_name_en && !formValues?.ad_family_name_en
      }
    },
    {
      name: 'ad_first_name_en',
      label: 'ad_first_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModeCondition: (mode, formValues) => {
        if (!['add', 'edit'].includes(mode)) return false
        return !formValues?.ad_first_name_ar && !formValues?.ad_family_name_ar
      }
    },
    {
      name: 'ad_father_name_en',
      label: 'ad_father_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModeCondition: (mode, formValues) => {
        return false

      }
    },
    {
      name: 'ad_grand_father_name_en',
      label: 'ad_grand_father_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_family_name_en',
      label: 'ad_family_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      requiredModeCondition: (mode, formValues) => {
        if (!['add', 'edit'].includes(mode)) return false
        return !formValues?.ad_first_name_ar && !formValues?.ad_family_name_ar
      }
    },
    {
      name: 'ad_full_name_ar',
      label: 'ad_full_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      visibleModes: ['search', 'show']
    },
    {
      name: 'ad_full_name_en',
      label: 'ad_full_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      visibleModes: ['search', 'show']
    },
    {
      name: 'ad_gender',
      label: 'ad_gender',
      type: 'select',
      requiredModes: ['add', 'edit'],
      options: Shared.genderOptions,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_date_of_birth',
      label: 'ad_date_of_birth',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_date_of_birth_hij',
      label: 'ad_date_of_birth_hij',
      type: 'hijri_date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_place_of_birth',
      label: 'ad_place_of_birth',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_age_stage_id',
      label: 'ad_age_stage_id',
      type: 'select',
      apiUrl: '/def/age-stages',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'age_stage.name_ar'
    },
    {
      name: 'ad_marital_status_id',
      label: 'ad_marital_status_id',
      type: 'select',
      options: Shared.maritalStatusList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'marital_status.name_ar'
    },
    {
      name: 'ad_current_nationality_id',
      label: 'ad_current_nationality_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'current_nationality.name_ar'
    },
    {
      name: 'ad_previous_nationality_id',
      label: 'ad_previous_nationality_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'previous_nationality.name_ar'
    },
    {
      name: 'ad_residence_country_id',
      label: 'ad_residence_country_id',
      type: 'select',
      apiUrl: '/def/countries',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'country.name_ar'
    },

    {
      name: 'card_status_id',
      label: 'card_status',
      type: 'select',
      options: Shared.hajjCardStatus,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      visibleModes: ['search']
    },
    {
      name: 'owner_department_id',
      label: 'heb_id',
      type: 'select',
      apiUrl: '/aut/user/departments',
      displayProps: ['id', 'department_name_ar'],
      labelProp: 'department_name_ar',
      keyProp: 'id',
      gridSize: 3,
      queryParams: { department_types: { id: appSetting?.service_department_type_id } },
      modeCondition: (mode: Shared.Mode) => mode,
      // width: '20%',
      // requiredModes: ['add', 'edit'],
      skipDataSuffix: true,
      viewProp: 'owner_department.department_name_ar',
      visibleModes: ['search', 'show']
    },

    {
      name: 'serial_no',
      label: 'serial',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      width: '10%',
      viewProp: 'companyApplicantData.serial_no',
      visibleModes: ['search', 'show']
      // mode: 'show'
    }
  ]

  const identificationDocumentsFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'ad_passport_no',
      label: 'ad_passport_no',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_passport_type_id',
      label: 'ad_passport_type_id',
      type: 'select',
      apiUrl: '/def/passport-types',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'passport_type.name_ar'
    },
    {
      name: 'ad_passport_issue_date',
      label: 'ad_passport_issue_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_passport_expiry_date',
      label: 'ad_passport_expiry_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_passport_issue_place',
      label: 'ad_passport_issue_place',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_id_no',
      label: 'ad_id_no',
      type: 'number',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_id_issue_date',
      label: 'ad_id_issue_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_id_issue_date_hij',
      label: 'ad_id_issue_date_hij',
      type: 'hijri_date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_id_expiry_date',
      label: 'ad_id_expiry_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_id_expiry_date_hij',
      label: 'ad_id_expiry_date_hij',
      type: 'hijri_date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'add_id_source',
      label: 'add_id_source',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_iqama_no',
      label: 'ad_iqama_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_iqama_issued_by',
      label: 'ad_iqama_issued_by',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_iqama_issue_date',
      label: 'ad_iqama_issue_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  const contactInformationFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'ad_email',
      label: 'ad_email',
      type: 'email',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'ad_mobile_country_code',
      label: 'ad_mobile_country_code',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_mobile_number',
      label: 'ad_mobile_number',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  const visaAndEntryExitInformationFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'ad_visa_number',
      label: 'ad_visa_number',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_haj_visa_permit_status',
      label: 'ad_haj_visa_permit_status',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_embassy_id',
      label: 'ad_embassy_id',
      type: 'select',
      apiUrl: '/def/embassies',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'embassy.name_ar'
    },
    {
      name: 'ad_permit_no',
      label: 'ad_permit_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_permit_date',
      label: 'ad_permit_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_planned_arrival_date',
      label: 'ad_planned_arrival_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_planned_departure_date',
      label: 'ad_planned_departure_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_entry_port',
      label: 'ad_entry_port',
      type: 'select',
      apiUrl: '/def/ports',
      labelProp: 'port_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'port.port_name_ar'
    },
    {
      name: 'moi_entry_date',
      label: 'moi_entry_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'moi_entry_time',
      label: 'moi_entry_time',
      type: 'date',
      showTime: true,
      showHijri: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'moi_exit_date',
      label: 'moi_exit_date',
      type: 'date',

      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'moi_exit_time',
      label: 'moi_exit_time',
      type: 'date',
      showTime: true,
      showHijri: false,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'route_id',
      label: 'route_id',
      type: 'select',
      apiUrl: '/def/routes',
      labelProp: 'route_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'route.name_ar'
    },
    {
      name: 'from_ct_id',
      label: 'from_ct_id',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'from_city.name_ar'
    },
    {
      name: 'to_ct_id',
      label: 'to_ct_id',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),

      defaultValue: user?.context?.city_id,
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'to_city.name_ar'
    }
  ]

  const accommodationCampFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'ad_camp_id',
      label: 'ad_camp_id',
      type: 'select',
      apiUrl: '/haj/camps',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'camp.name_ar'
    },
    {
      name: 'ad_camp_square_no_ar',
      label: 'ad_camp_square_no_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_camp_square_no_en',
      label: 'ad_camp_square_no_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_camp_gate_no',
      label: 'ad_camp_gate_no',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_camp_street_no',
      label: 'ad_camp_street_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  const hajjRepresentativeSpcFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'ad_entity_id',
      label: 'ad_entity_id',
      type: 'select',
      apiUrl: '/haj/provider-requests',
      displayProps: ['name_ar', 'type_name'],
      keyProp: 'id',
      queryParams: { type: [1, 2, 3] },
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'requester.name_ar'
    },
    {
      name: 'ad_agencies_id',
      label: 'ad_agencies_id',
      type: 'select',
      apiUrl: '/def/agencies',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'agency.name_ar'
    },
    {
      name: 'ad_applicant_type_id',
      label: 'ad_applicant_type_id',
      type: 'select',
      apiUrl: '/def/haj-types',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'haj_type.name_ar'
    },
    {
      name: 'ad_hm_member_types_id',
      label: 'ad_hm_member_types_id',
      type: 'select',
      apiUrl: '/def/hm-member-types',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'hm_member_type.name_ar'
    },
    {
      name: 'ad_spc_company_id_mecca',
      label: 'ad_spc_company_id_mecca',
      type: 'select',
      apiUrl: '/def/companies',
      labelProp: 'name_ar',
      keyProp: 'id',
      queryParams: { city: 'mecca' },
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'ad_spc_company_mecca.company_name_ar'
    },
    {
      name: 'makkah_service_center_business_id',
      label: 'makkah_service_center_business_id',
      type: 'select',
      apiUrl: '/def/service-centers',
      labelProp: 'name_ar',
      keyProp: 'id',
      queryParams: { city: 'makkah' },
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'makkah_service_center.name_ar'
    },
    {
      name: 'ad_spc_company_id_madina',
      label: 'ad_spc_company_id_madina',
      type: 'select',
      apiUrl: '/def/companies',
      labelProp: 'name_ar',
      keyProp: 'id',
      queryParams: { city: 'madina' },
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'ad_spc_company_madina.company_name_ar'
    },
    {
      name: 'madinah_service_center_business_id',
      label: 'madinah_service_center_business_id',
      type: 'select',
      apiUrl: '/def/service-centers',
      labelProp: 'name_ar',
      keyProp: 'id',
      queryParams: { city: 'madinah' },
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      viewProp: 'madinah_service_center.name_ar'
    },
    {
      name: 'ad_group_no',
      label: 'ad_group_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_group_name_ar',
      label: 'ad_group_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_group_name_en',
      label: 'ad_group_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_is_gcc',
      label: 'ad_is_gcc',
      type: 'select',
      options: Shared.otherYesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    },
    {
      name: 'ad_is_b2c',
      label: 'ad_is_b2c',
      type: 'select',
      options: Shared.otherYesNoList,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3
    }
  ]

  const applicantHouseFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'city_id',
      label: 'city',
      type: 'select',
      apiUrl: '/def/citites',
      displayProps: ['name_ar'],
      keyProp: 'id',
      queryParams: { type: [1, 2, 3] },
      modeCondition: (mode: Shared.Mode) => 'show',
      gridSize: 3,
      viewProp: 'city.name_ar',
      width: '12%'
    },
    {
      name: 'house.house_commercial_name_ar',
      label: 'house_contract_provider',
      type: 'select',
      apiUrl: '/haj/houses',
      labelProp: 'house_commercial_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => 'show',
      gridSize: 3,
      viewProp: 'house.house_commercial_name_ar'
    },
    {
      name: 'house_contract_id',
      label: 'house_contract_id',
      type: 'select',
      apiUrl: '/haj/house-contracts',
      labelProp: 'id',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => 'show',
      gridSize: 3,
      viewProp: 'house_contract.id',
      width: '15%'
    },

    {
      name: 'contract_start_date',
      label: 'contract_start_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => 'show',
      gridSize: 3,
      viewProp: 'house_contract.contract_start_date',
      width: '12%',
      showTime: true
    },

    {
      name: 'contract_end_date',
      label: 'contract_end_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => 'show',
      gridSize: 3,
      viewProp: 'house_contract.contract_end_date',
      width: '12%',
      showTime: true
    }
  ]
  const passportArchivingFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'owner_department_id',
      label: 'heb_id',
      type: 'select',
      apiUrl: '/aut/user/departments',
      displayProps: ['id', 'department_name_ar'],
      labelProp: 'department_name_ar',
      keyProp: 'id',
      gridSize: 3,
      queryParams: { department_types: { id: appSetting?.service_department_type_id } },
      modeCondition: (mode: Shared.Mode) => mode,
      width: '20%',
      // requiredModes: ['add', 'edit'],
      skipDataSuffix: true,
      viewProp: 'owner_department.department_name_ar',
      visibleModes: ['search', 'show']
    },
    {
      name: 'passport_unit_id',
      label: 'unit',
      type: 'select',
      labelProp: 'passport_units_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      // gridSize: 4,
      width: '20%',
      options: userPassportUnits,
      // requiredModes: ['add', 'edit'],
      viewProp: 'passport_unit.passport_units_name_ar'
    },
    {
      name: 'shelf_no',
      label: 'shelf_no',
      // requiredModes: ['add', 'edit'],
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      width: '10%',
      viewProp: 'shelf_no'
    },
    {
      name: 'cabinet_no',
      label: 'cabinet_no',
      type: 'number',
      // requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      width: '10%',
      viewProp: 'cabinet_no'
    },


  ]

  const allFields = [
    ...basicInformationFields,
    ...identificationDocumentsFields,
    ...contactInformationFields,
    ...visaAndEntryExitInformationFields,
    ...accommodationCampFields,
    ...hajjRepresentativeSpcFields
  ]

  type PilgrimsFormData = Shared.InferFieldType<typeof basicInformationFields>
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

    handleTabChange,
    handleNextTab,
    tabValue,
    validatedTabs,
    attemptedTabs,
    detailsHandlers,
    dataModel,
    closeDocumentsDialog,
    detailsData,
    getDetailsErrors,
    setDetailsData,
    closeRecordInformationDialog
  } = Shared.useRecordForm<PilgrimsFormData>({
    apiEndpoint: '/haj/applicants',
    routerUrl: { default: '/apps/haj/applicant-data' },
    fields: allFields,
    tabsCount: 4,
    excludeFields: [
      { action: 'add', fields: [] },
      { action: 'edit', fields: [] }
    ],
    tabConfig: [
      {
        label: 'basic_information',
        fields: [...basicInformationFields, ...hajjRepresentativeSpcFields]
      },

      { label: 'visa_id', fields: [...identificationDocumentsFields, ...visaAndEntryExitInformationFields] },
      { label: 'accommodation_camp', fields: accommodationCampFields },
      { label: 'contact_information', fields: contactInformationFields }
    ],
    initialDetailsData: {
      applicant_houses: [],
      passportArchiving: []
    },
    detailsTablesConfig: {
      applicant_houses: { fields: applicantHouseFields, trackIndex: true },
      passportArchiving: { fields: passportArchivingFields, trackIndex: true }
    },
    classifiedObjects: [
      {
        objectName: 'card',
        fields: ['card_status_id']
      },
      {
        objectName: 'receptedHajjes',
        fields: ['owner_department_id']
      },
      {
        objectName: 'companyApplicantData',
        fields: ['serial_no']
      }
    ]
  })


  const displayPassportArhciving = (scope?: string, tableConfigs?: any) => {
    if (mode === 'show') {
      return [
        {
          dataKey: 'passportArchiving',
          fields: passportArchivingFields,
          order: 1,
          title: 'save_locations',
          rowModal: false,
          enableEmptyRows: true,
          // mode: 'show',
          apiEndPoint: `/haj/applicants/${dataModel?.id}/passport_archiving`,

        }
      ]
    }

    return []
  }

  const appSettings = useAppSettings(accessToken, mode, dataModel?.id, (locale as string) || 'ar', formMethods, false)
  Shared.useEffect(() => {
    if (appSettings) {
      // City has value
      setAppSetting(appSettings)
    } else {
      // Is Transportation Center is empty - clear everything
      setAppSetting(null)
    }
  }, [appSettings, appSetting])

  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title='pilgrims_data'
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormTabComponent
            locale={locale}
            fields={allFields}
            mode={mode}
            screenMode={mode}
            tabConfig={[
              {
                label: 'basic_information',
                fields: [...basicInformationFields, ...hajjRepresentativeSpcFields]
              },
              { label: 'contact_information', fields: contactInformationFields }, // 3 fields: index 39-41
              { label: 'accommodation_camp', fields: accommodationCampFields } // 9 fields: index 59-67
            ]}
            detailsConfig={[
              { title: 'save_locations', fields: passportArchivingFields, key: 'passportArchiving' },
              { title: 'houses', fields: applicantHouseFields, key: 'applicant_houses' }
            ]}
            showBarcode={true}
            recordId={dataModel?.ad_union_no || '0990'}
            barcodes={[
              { value: dataModel?.ad_union_no || '', label: 'الرقم الموحد' },
              { value: dataModel?.ad_passport_no || '', label: 'رقم الجواز' },
              { value: dataModel?.ad_visa_number || '', label: 'رقم التأشيرة' }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard' style={{ display: !isPrintMode ? 'block' : 'none' }}>
          <Shared.SharedForm
            allFormFields={allFields}
            dataObject={dataModel}
            tabConfig={[
              {
                label: 'basic_information',
                fields: [...basicInformationFields],
                extraSections: [
                  // { label: 'identification_documents', fields: identificationDocumentsFields },
                  { label: 'hajj_representative_spc', fields: hajjRepresentativeSpcFields }
                  // { label: 'visa_entry_exit_information', fields: visaAndEntryExitInformationFields }
                ],
                tables: [
                  ...displayPassportArhciving()
                ]
              },

              {
                label: 'visa_id',
                fields: [],
                extraSections: [
                  { label: 'identification_documents', fields: identificationDocumentsFields },
                  // { label: 'hajj_representative_spc', fields: hajjRepresentativeSpcFields },
                  { label: 'visa_entry_exit_information', fields: visaAndEntryExitInformationFields }
                ]
              },
              // { label: 'identification_documents', fields: fields.slice(24, 39) },
              // { label: 'visa_entry_exit_information', fields: fields.slice(42, 59) },
              {
                label: 'accommodation_camp',
                fields: accommodationCampFields,
                order: 2,
                tables: [
                  {
                    dataKey: 'applicant_houses',
                    fields: applicantHouseFields,
                    order: 1,
                    title: 'houses',
                    rowModal: false,
                    enableEmptyRows: true,
                    // mode: 'show',
                    apiEndPoint: `/haj/applicants/${dataModel?.id}/applicant_houses`
                  }
                ]
              },
              { label: 'contact_information', fields: contactInformationFields }

              // { label: 'hajj_representative_spc', fields: fields.slice(69) }
            ]}
            mode={mode}
            locale={locale}
            handleTabChange={handleTabChange}
            handleNextTab={handleNextTab}
            tabValue={tabValue}
            validatedTabs={validatedTabs}
            attemptedTabs={attemptedTabs}
            detailsHandlers={detailsHandlers}
            printForm={false}
            setDetailsData={setDetailsData}
            getDetailsErrors={getDetailsErrors}
            detailsData={detailsData}
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
            attachments={dataModel?.attachments}
            recordId={dataModel?.id}
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

        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            recordInformations={[]}
            open={openRecordInformationDialog}
            onClose={() => setOpenRecordInformationDialog(false)}
            locale={locale}
          />
        </Shared.Grid> */}

        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordTracking
            apiEndPoint='/haj/pilgrims'
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

export default ApplicantDataDetails
