'use client'

import * as Shared from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'
import { useAppSettings } from '../../hooks/useAppSettings'

const LinkPassportReceptionDetailsPage = ({ scope }: ComponentGeneralProps) => {
  const searchParams = Shared.useSearchParams()
  const initialMode = searchParams.get('mode') as Shared.Mode
  const { user, accessToken, userPassportUnits, userDepartments } = Shared.useSessionHandler()
  const { lang: locale } = Shared.useParams()
  const [appSetting, setAppSetting] = Shared.useState<any>()
  const [isFetchingInfo, setIsFetchingInfo] = Shared.useState(false)
  const [showReceptionData, setShowReceptionData] = Shared.useState(false)
  const [selectedNationality, setSelectedNationality] = Shared.useState()
  const [selectedCabinet, setSelectedCabinet] = Shared.useState()
  const [selectedShelf, setSelectedShelf] = Shared.useState()
  const [selectedUserDepartment, setSelectUserDepartment] = Shared.useState()
  const [selectedUserPassportUnit, setSelectedUserPassportUnit] = Shared.useState()

  const fields: Shared.DynamicFormFieldProps[] = [
    // {
    //   name: 'season',
    //   label: 'season',
    //   type: 'number',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 6
    // },

    {
      name: 'fetch_type',
      label: 'fetch_type',
      type: 'select',
      options: Shared.fetchTypeList,
      requiredModes: ['add', 'edit'],
      defaultValue: '2',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
    },
    {
      name: 'reception_no',
      label: 'reception_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6
      // requiredModes: ['add', 'edit']
    },


  ]

  const viewSectionFields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },
      {
        name: 'owner_department_id',
        label: 'heb_id',
        type: 'select',
        apiUrl: '/aut/user/departments',
        displayProps: ['id', 'department_name_ar'],
        labelProp: 'department_name_ar',
        keyProp: 'id',
        gridSize: 4,
        queryParams: { department_types: { id: appSetting?.service_department_type_id } },
        modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode == 'add' ? 'edit' : mode),
        width: '20%',
        // requiredModes: ['add', 'edit'],
        skipDataSuffix: true,
        viewProp: 'ownerDepartment.department_name_ar',
        selectFirstValue: true
      },
      {
        name: 'passport_unit_id',
        label: 'unit',
        type: 'select',
        labelProp: 'passport_units_name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode == 'add' ? 'edit' : mode),
        gridSize: 4,
        options: userPassportUnits,
        // requiredModes: ['add', 'edit'],
        viewProp: 'passportUnit.passport_units_name_ar',
        selectFirstValue: true
      },

      {
        name: 'cabinet_no',
        label: 'cabinet_no',
        type: 'text',
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'passportArchiving.cabinet_no',
        // editProp: 'passportArchiving.cabinet_no'
      },
      {
        name: 'shelf_no',
        label: 'shelf_no',
        // requiredModes: ['add', 'edit'],
        type: 'text',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'passportArchiving.shelf_no',
        // editProp: 'passportArchiving.shelf_no'
      },

      {
        name: 'serial_no',
        label: 'serial',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode === "edit" ? "show" : mode,
        gridSize: 4,
        viewProp: 'passportArchiving.serial_no',
        editProp: 'passportArchiving.serial_no'
        // mode: 'show'
      }

      // {
      //   name: 'nation_id',
      //   label: 'nation_id',
      //   type: 'select',
      //   apiUrl: '/def/nationalities',
      //   labelProp: 'name_ar',
      //   keyProp: 'id',
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   gridSize: 4,
      //   viewProp: 'nationality.name_ar'
      // }

      // {
      //   name: 'passport_no',
      //   label: 'passport_no',
      //   type: 'text',
      //   gridSize: 4,
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   onBlur: async (value, rowIndex) => {
      //     console.log('val', value)

      //     checkPassport(value, rowIndex as number)
      //   }
      // },

      // {
      //   name: 'applicant_data_id',
      //   label: 'applicant_data_name',
      //   type: 'select',
      //   apiUrl: '/haj/applicants',
      //   labelProp: 'name_ar',
      //   keyProp: 'id',
      //   displayProps: ['ad_application_no', 'ad_full_name_ar'],
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   gridSize: 4,
      //   viewProp: ['applicant_data.ad_full_name_en']
      // }
    ],
    [appSetting]
  )

  const receptionFields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'reception_date',
        label: 'reception_date',
        now: true,
        type: 'date_time',
        modeCondition: (mode: Shared.Mode) => 'show',
        gridSize: 4
      },
      {
        name: 'reception_city_id',
        label: 'reception_city_id',
        type: 'select',
        options: Shared.toOptions(user?.user_cities, locale as string),
        labelProp: 'name_ar',
        keyProp: 'id',
        viewProp: 'name_ar',
        cache: false,
        modeCondition: (mode: Shared.Mode) => 'show',
        gridSize: 4,
        clearOnParentChange: ['reception_department_id', 'service_department_id']
      },
      {
        name: 'reception_department_id',
        label: 'reception_department_id',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => 'show',
        selectFirstValue: false,
        gridSize: 4,
        viewProp: 'reception_department.department_name_ar'
      },
      {
        name: 'service_department_id',
        label: 'service_department_id',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => 'show',
        gridSize: 4,
        viewProp: 'service_department.department_name_ar',
        selectFirstValue: false
      },
      {
        name: 'port_id',
        label: 'port_id',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => 'show',
        gridSize: 4,
        clearOnParentChange: ['path_id', 'route_id']
      },
      {
        name: 'path_id',
        label: 'path_id',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => 'show',
        gridSize: 4,
        viewProp: 'path.name_ar'
      }
    ],
    []
  )
  const passportSettingsFields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'nation_id',
        label: 'nation_id',
        type: 'select',
        apiUrl: '/def/nationalities',
        labelProp: 'name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        width: '20%'
      },
      {
        name: 'cabinet_no',
        label: 'cabinet_no',
        type: 'text',
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        width: '20%'
      },
      {
        name: 'shelf_no',
        label: 'shelf_no',
        // requiredModes: ['add', 'edit'],
        type: 'text',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        width: '20%'
      },

      {
        name: 'department_id',
        label: 'heb_id',
        type: 'select',
        apiUrl: '/aut/user/departments',
        labelProp: 'department_name_ar',
        dispayProps: ['id', 'department_name_ar'],
        keyProp: 'id',
        queryParams: { department_types: { id: appSetting?.service_department_type_id } },
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        width: '20%',
        requiredModes: ['add', 'edit'],
        skipDataSuffix: true
      },
      {
        name: 'passport_unit_id',
        label: 'unit',
        type: 'select',
        labelProp: 'passport_units_name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        width: '20%',
        options: userPassportUnits,
        requiredModes: ['add', 'edit']
      }
      // {
      //   name: 'serial_no',
      //   label: 'serial',
      //   requiredModes: ['add', 'edit'],

      //   type: 'number',
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   gridSize: 3,
      //   width: '20%'
      // }
    ],
    [userDepartments, appSetting, userPassportUnits]
  )

  const passportNationFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'nation_id',
        label: 'nation_id',
        type: 'select',
        apiUrl: '/def/nationalities',
        labelProp: 'name_ar',
        disabled: selectedNationality ? true : false,
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        width: '20%'
      },
      {
        name: 'passport_no',
        label: 'passport_no',
        type: 'text',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode,
        width: '10%',
        onBlur: async (value, rowIndex) => {

          checkPassport(value, rowIndex as number)
        }
      },

      {
        name: 'applicant_data_id',
        label: 'applicant_data_name',
        type: 'select',
        apiUrl: '/haj/applicants',
        labelProp: 'name_ar',
        keyProp: 'id',
        displayProps: ['ad_application_no', 'ad_full_name_ar'],
        modeCondition: (mode: Shared.Mode) => mode,
        mode: 'show',
        gridSize: 4,
        width: '20%'
      },

      {
        name: 'ad_gender',
        label: 'ad_gender',
        type: 'select',
        requiredModes: ['add', 'edit'],
        options: Shared.genderOptions,
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3,
        width: '5%',
        mode: 'show'
      },

      {
        name: 'ad_date_of_birth',
        label: 'birth_date',
        type: 'date',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3,
        width: '10%',
        mode: 'show'
      },
      // {
      //   name: 'ad_union_no',
      //   label: 'ad_union_no',
      //   type: 'number',
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   gridSize: 3,
      //   width: '10%',
      //   mode: 'show'
      // },
      {
        name: 'cabinet_no',
        label: 'cabinet_no',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3,
        width: '7%',
        // mode: 'show'
        disabled: selectedCabinet ? true : false
      },
      {
        name: 'shelf_no',
        label: 'shelf_no',
        type: 'text',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3,
        width: '7%',
        disabled: selectedShelf ? true : false // mode: 'show'
      },
      {
        name: 'serial_no',
        label: 'serial',
        type: 'number',
        // modeCondition: (mode: Shared.Mode) => 'show',
        mode: 'show',
        gridSize: 3,
        width: '7%'
        // mode: 'show',
        // disabled: true
      }
    ],
    [selectedNationality, selectedCabinet, selectedShelf]
  )

  const basicInformationFields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'season',
      label: 'season',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3
    },
    {
      name: 'ad_application_no',
      label: 'ad_application_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_application_no'
    },
    {
      name: 'ad_union_no',
      label: 'ad_union_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_union_no'
    },
    {
      name: 'ad_border_number',
      label: 'ad_border_number',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_border_number'
    },
    {
      name: 'ad_first_name_ar',
      label: 'ad_first_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_first_name_ar'
    },
    {
      name: 'ad_father_name_ar',
      label: 'ad_father_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_father_name_ar'
    },
    {
      name: 'ad_grand_father_name_ar',
      label: 'ad_grand_father_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_grand_father_name_ar'
    },
    {
      name: 'ad_family_name_ar',
      label: 'ad_family_name_ar',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_family_name_ar'
    },
    {
      name: 'ad_first_name_en',
      label: 'ad_first_name_en',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_first_name_en'
    },
    {
      name: 'ad_father_name_en',
      label: 'ad_father_name_en',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_father_name_en'
    },
    {
      name: 'ad_grand_father_name_en',
      label: 'ad_grand_father_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_grand_father_name_en'
    },
    {
      name: 'ad_family_name_en',
      label: 'ad_family_name_en',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_family_name_en'
    },
    {
      name: 'ad_full_name_ar',
      label: 'ad_full_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 6,
      visibleModes: ['search', 'show'],
      viewProp: 'applicant_data.ad_full_name_ar'
    },
    {
      name: 'ad_full_name_en',
      label: 'ad_full_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 6,
      visibleModes: ['search', 'show'],
      viewProp: 'applicant_data.ad_full_name_en'
    },
    {
      name: 'ad_gender',
      label: 'ad_gender',
      type: 'select',
      requiredModes: ['add', 'edit'],
      options: Shared.genderOptions,
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_gender'
    },
    {
      name: 'ad_date_of_birth',
      label: 'ad_date_of_birth',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_date_of_birth'
    },
    {
      name: 'ad_date_of_birth_hij',
      label: 'ad_date_of_birth_hij',
      type: 'hijri_date',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_date_of_birth_hij'
    },
    {
      name: 'ad_place_of_birth',
      label: 'ad_place_of_birth',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_place_of_birth'
    },
    {
      name: 'ad_age_stage_id',
      label: 'ad_age_stage_id',
      type: 'select',
      apiUrl: '/def/age-stages',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.age_stage.name_ar'
    },
    {
      name: 'ad_marital_status_id',
      label: 'ad_marital_status_id',
      type: 'select',
      options: Shared.maritalStatusList,
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.marital_status.name_ar'
    },
    {
      name: 'ad_current_nationality_id',
      label: 'ad_current_nationality_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.current_nationality.name_ar'
    },
    {
      name: 'ad_previous_nationality_id',
      label: 'ad_previous_nationality_id',
      type: 'select',
      apiUrl: '/def/nationalities',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.previous_nationality.name_ar'
    },
    {
      name: 'ad_residence_country_id',
      label: 'ad_residence_country_id',
      type: 'select',
      apiUrl: '/def/countries',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.country.name_ar'
    },
    {
      name: 'ad_passport_no',
      label: 'ad_passport_no',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3
    },
    {
      name: 'ad_passport_issue_date',
      label: 'ad_passport_issue_date',
      type: 'date',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3
    },
    {
      name: 'ad_passport_expiry_date',
      label: 'ad_passport_expiry_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3
    },
    {
      name: 'ad_passport_issue_place',
      label: 'ad_passport_issue_place',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3
    },
    {
      name: 'card_status_id',
      label: 'card_status',
      type: 'select',
      options: Shared.hajjCardStatus,
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      visibleModes: ['search']
    },
    {
      name: 'reception_no',
      label: 'reception_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 3,
      visibleModes: ['search']
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
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.requester.name_ar'
    },
    {
      name: 'ad_agencies_id',
      label: 'ad_agencies_id',
      type: 'select',
      apiUrl: '/def/agencies',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.agency.name_ar'
    },
    {
      name: 'ad_applicant_type_id',
      label: 'ad_applicant_type_id',
      type: 'select',
      apiUrl: '/def/haj-types',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.haj_type.name_ar'
    },
    {
      name: 'ad_hm_member_types_id',
      label: 'ad_hm_member_types_id',
      type: 'select',
      apiUrl: '/def/hm-member-types',
      labelProp: 'name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.hm_member_type.name_ar'
    },
    {
      name: 'ad_spc_company_id_mecca',
      label: 'ad_spc_company_id_mecca',
      type: 'select',
      apiUrl: '/def/companies',
      labelProp: 'name_ar',
      keyProp: 'id',
      queryParams: { city: 'mecca' },
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_spc_company_mecca.company_name_ar'
    },
    {
      name: 'makkah_service_center_business_id',
      label: 'makkah_service_center_business_id',
      type: 'select',
      apiUrl: '/def/service-centers',
      labelProp: 'name_ar',
      keyProp: 'id',
      queryParams: { city: 'makkah' },
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.makkah_service_center.name_ar'
    },
    {
      name: 'ad_spc_company_id_madina',
      label: 'ad_spc_company_id_madina',
      type: 'select',
      apiUrl: '/def/companies',
      labelProp: 'name_ar',
      keyProp: 'id',
      queryParams: { city: 'madina' },
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_spc_company_madina.company_name_ar'
    },
    {
      name: 'madinah_service_center_business_id',
      label: 'madinah_service_center_business_id',
      type: 'select',
      apiUrl: '/def/service-centers',
      labelProp: 'name_ar',
      keyProp: 'id',
      queryParams: { city: 'madinah' },
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.madinah_service_center.name_ar'
    },
    {
      name: 'ad_group_no',
      label: 'ad_group_no',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_group_no'
    },
    {
      name: 'ad_group_name_ar',
      label: 'ad_group_name_ar',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_group_name_ar'
    },
    {
      name: 'ad_group_name_en',
      label: 'ad_group_name_en',
      type: 'text',
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_group_name_en'
    },
    {
      name: 'ad_is_gcc',
      label: 'ad_is_gcc',
      type: 'select',
      options: Shared.otherYesNoList,
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_is_gcc'
    },
    {
      name: 'ad_is_b2c',
      label: 'ad_is_b2c',
      type: 'select',
      options: Shared.otherYesNoList,
      modeCondition: (mode: Shared.Mode) => (mode === 'edit' ? 'show' : mode),
      gridSize: 3,
      viewProp: 'applicant_data.ad_is_b2c'
    }
  ]

  const searchFields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    () => [
      {
        name: 'department_id',
        label: 'heb_id',
        type: 'select',
        apiUrl: '/aut/user/departments',
        labelProp: 'department_name_ar',
        keyProp: 'id',
        gridSize: 4,
        queryParams: { department_types: { id: appSetting?.service_department_type_id } },
        modeCondition: (mode: Shared.Mode) => mode,
        width: '20%',
        requiredModes: ['add', 'edit'],
        skipDataSuffix: true,
        viewProp: 'owner_department.department_name_ar'
      },
      {
        name: 'passport_unit_id',
        label: 'unit',
        type: 'select',
        labelProp: 'passport_units_name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        options: userPassportUnits,
        requiredModes: ['add', 'edit'],
        viewProp: 'passport_unit.passport_units_name_ar'
      },
      {
        name: 'shelf_no',
        label: 'shelf_no',
        // requiredModes: ['add', 'edit'],
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'passport_archiving.shelf_no'
      },
      {
        name: 'cabinet_no',
        label: 'cabinet_no',
        type: 'number',
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'passport_archiving.cabinet_no'
      },

      {
        name: 'serial_no',
        label: 'serial',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'passport_archiving.cabinet_no'
        // mode: 'show'
      },

      {
        name: 'nation_id',
        label: 'nation_id',
        type: 'select',
        apiUrl: '/def/nationalities',
        labelProp: 'name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: 'nationality.name_ar'
      },

      {
        name: 'passport_no',
        label: 'passport_no',
        type: 'text',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode,
        onBlur: async (value, rowIndex) => {

          checkPassport(value, rowIndex as number)
        }
      },
      {
        name: 'union_no',
        label: 'ad_union_no',
        type: 'text',
        gridSize: 4,
        modeCondition: (mode: Shared.Mode) => mode,
        onBlur: async (value, rowIndex) => {

          checkPassport(value, rowIndex as number)
        }
      },

      {
        name: 'applicant_data_id',
        label: 'applicant_data_name',
        type: 'select',
        apiUrl: '/haj/applicants',
        labelProp: 'name_ar',
        keyProp: 'id',
        displayProps: ['ad_full_name_en', 'ad_union_no', 'ad_passport_no'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: ['applicant_data.ad_full_name_en']
      }
    ],
    []
  )

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const getFieldsByMode = () => {
    switch (initialMode) {
      case 'show':
        // return [...viewSectionFields, ...hajjRepresentativeSpcFields, ...basicInformationFields]
        return [...hajjRepresentativeSpcFields, ...basicInformationFields, ...viewSectionFields]

      case 'edit':
        return [...viewSectionFields]

      case 'search':
        return [...hajjRepresentativeSpcFields, ...basicInformationFields, ...viewSectionFields]

      default:
        return [...fields, ...receptionFields, ...passportSettingsFields]
    }
  }
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    dataModel,
    openDocumentsDialog,
    closeDocumentsDialog,
    getDetailsErrors,
    setDetailsData,
    detailsData,
    errors,
    detailsHandlers,
    openRecordInformationDialog,
    dictionary,
    closeRecordInformationDialog,
    setWarning,
    error,
    warning,
    setError,
    updateDetailsData,
    setDetailError,
    navigateWithQuery,
    locale: formLocale,
    router
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/recepted-hajjees',
    routerUrl: { default: `/apps/haj/link-passport-reception/${scope}` },
    fields: getFieldsByMode(),
    detailsTitles: {
      hajjees: 'passports'
    },
    onSaveSuccess: async (response, mode) => {
      if (mode === 'add')
        navigateWithQuery(`/apps/haj/link-passport-reception/${scope}/list`, router, locale as Shared.Locale)
    },
    initialDetailsData: {
      hajjees: []
    },

    detailsTablesConfig: {
      hajjees: { fields: passportNationFields, trackIndex: true }
    },
    excludeFields: [
      { action: 'add', fields: [...fields, ...searchFields, ...passportSettingsFields] }
      // { action: 'search', fields: [...fields] }
    ],
    classifiedObjects: [
      {
        objectName: 'applicantData',
        fields: [...basicInformationFields, ...hajjRepresentativeSpcFields].filter(
          f => f.name !== 'card_status_id' && f.name !== 'reception_no' && f.name !== 'serial_no'
        )
      },
      {
        objectName: 'card',
        fields: ['card_status_id']
      },
      {
        objectName: 'companyApplicantData',
        fields: ['serial_no']
      }
    ],
    customDetailValidators: {
      hajjees: (row: any, rowIndex: number) => {
        const errors = []

        const allRows = detailsData['hajjees'] || []

        if (rowIndex === 0) {
          if (!row.shelf_no) {
            errors.push({
              fieldName: 'shelf_no',
              message: 'حقل الرف مطلوب'
            })
          }

          if (!row.nation_id) {
            errors.push({
              fieldName: 'nation_id',
              message: 'حقل الجنسية مطلوب'
            })
          }

          if (!row.passport_no) {
            errors.push({
              fieldName: 'passport_no',
              message: 'حقل رقم الجواز مطلوب'
            })
          }

          if (!row.cabinet_no) {
            errors.push({
              fieldName: 'cabinet_no',
              message: 'حقل الدولاب مطلوب'
            })
          }

          if (!row.reception_no) {
            errors.push({
              fieldName: 'reception_no',
              message: 'حقل رقم كشف الاستقبال مطلوب'
            })
          }
        }

        // duplicate passport_no check
        if (row.passport_no) {
          const normalizedPassport = row.passport_no.toString().trim()

          const duplicated = allRows.some(
            (item: any, index: number) =>
              index !== rowIndex && item.passport_no && item.passport_no.toString().trim() === normalizedPassport
          )

          if (duplicated) {
            errors.push({
              fieldName: 'passport_no',
              message: 'رقم الجواز مكرر ويجب أن يكون فريدًا'
            })
          }
        }

        return {
          valid: errors.length === 0,
          errors
        }
      }
    },
    transformPayload: (payload, detailsData) => {
      if (mode === 'search') return payload

      if (mode === 'edit') {
        const { id, ...rest } = payload
        return rest
      }

      const submitPayload = {
        hajjees: detailsData['hajjees']
          .filter(
            (item: any) =>
              item &&
              Object.keys(item).length > 0 &&
              item.shelf_no &&
              item.nation_id &&
              item.passport_no &&
              item.cabinet_no &&
              // item.serial_no
              item.reception_no
          )
          .map((item: any) => {
            const { rowChanged, applicant_data_id, ad_gender, ad_date_of_birth, ...rest } = item
            return rest
          })
      }
      return submitPayload
    }
  })

  Shared.useEffect(() => {
    if (error) {
      setWarning(null)
    }
  }, [error])

  Shared.useEffect(() => {
    if (warning) {
      setError(null)
    }
  }, [warning])

  const currentLocale = ((formLocale ?? locale) as string) || 'ar'

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

  const { getValues, setValue, watch, reset } = formMethods
  const reception = watch('reception_no')
  const nationality = watch('nation_id')
  const cabinet = watch('cabinet_no')
  const shelf = watch('shelf_no')
  const passportUnit = watch('passport_unit_id')

  const ownerDepartment = watch('department_id')
  // const serial = watch('serial_no')


  // edit mode
  Shared.useEffect(() => {
    if (initialMode === "edit" && dataModel) {
      setValue("cabinet_no", dataModel?.passportArchiving?.cabinet_no)
      setValue("shelf_no", dataModel?.passportArchiving?.shelf_no)
    }
  }, [initialMode, dataModel])

  Shared.useEffect(() => {
    setSelectedNationality(nationality)
    const updated = detailsData['hajjees'].map((c: any) => ({ ...c, nation_id: nationality }))
    updateDetailsData('hajjees', updated)
  }, [nationality])

  // Shared.useEffect(() => {
  //   setSelectedCabinet(cabinet)
  //   const updated = detailsData['hajjees'].map(
  //     (c: any, index: number) => ({ ...c, cabinet_no: cabinet })
  //     // index < 3 ? { ...c, cabinet_no: cabinet } : c
  //   )
  //   updateDetailsData('hajjees', updated)
  // }, [cabinet])

  Shared.useEffect(() => {
    setSelectUserDepartment(ownerDepartment)
    const updated = detailsData['hajjees'].map((c: any) => ({ ...c, department_id: ownerDepartment }))
    updateDetailsData('hajjees', updated)
  }, [ownerDepartment])

  Shared.useEffect(() => {

    setSelectedUserPassportUnit(passportUnit)
    const updated = detailsData['hajjees'].map((c: any) => ({ ...c, passport_unit_id: passportUnit }))
    updateDetailsData('hajjees', updated)
  }, [passportUnit])

  // Shared.useEffect(() => {
  //   const updated = detailsData['hajjees'].map((c: any) => ({ ...c, serial_no: serial }))
  //   updateDetailsData('hajjees', updated)
  // }, [serial])

  // Shared.useEffect(() => {
  //   setSelectedShelf(shelf)
  //   const updated = detailsData['hajjees'].map((c: any, index: number) => ({ ...c, shelf_no: shelf }))
  //   updateDetailsData('hajjees', updated)
  // }, [shelf])


  const dynamicPassportSettingsFields = Shared.useMemo(() => {
    return passportSettingsFields.map(field => {
      if (field.name === 'shelf_no') {
        return {
          ...field,

          onBlur: (val: any) => {
            setSelectedShelf(val)
            const updated = detailsData['hajjees'].map((c: any, index: number) => ({ ...c, shelf_no: val }))
            updateDetailsData('hajjees', updated)
          }
        }
      }
      if (field.name === 'cabinet_no') {
        return {
          ...field,

          onBlur: (val: any) => {
            setSelectedCabinet(val)
            const updated = detailsData['hajjees'].map((c: any, index: number) => ({ ...c, cabinet_no: val }))
            updateDetailsData('hajjees', updated)
          }
        }
      }

      return field
    })
  }, [detailsData])
  // const updateNewRow = (row: any, rowIndex: any) => {
  //   const formValues = getValues() as any
  //   const receptionId = formValues['reception_no']

  //   updateDetailsData(
  //     'hajjees',
  //     {
  //       ...row,
  //       reception_no: receptionId,
  //       nation_id: nationality,
  //       cabinet_no: cabinet,
  //       shelf_no: shelf,
  //       department_id: ownerDepartment,
  //       passport_unit_id: passportUnit
  //       // serial_no: serial
  //     },
  //     rowIndex
  //   )
  // }

  const updateNewRow = (row: any, rowIndex: number) => {
    const formValues = getValues() as any
    const receptionId = formValues.reception_no

    return {
      ...row,
      reception_no: receptionId,
      nation_id: nationality,
      cabinet_no: cabinet,
      shelf_no: shelf,
      department_id: ownerDepartment,
      passport_unit_id: passportUnit
      // serial_no: serial
    }
  }

  Shared.useEffect(() => {
    if (mode !== 'add') return

    const formValues = getValues() as any
    setShowReceptionData(false)

    setDetailsData({
      hajjees: []
    })

    reset({
      reception_no: reception,
      fetch_type: formValues['fetch_type']
    })
  }, [reception])

  const handleGetInfo = Shared.useCallback(async () => {
    setWarning('')

    const formValues = getValues() as any

    const receptionId = formValues['reception_no']
    const fetchType = formValues['fetch_type']

    if (!fetchType) {
      setWarning('جلب البيانات مطلوب')
      return
    }
    if (!receptionId) {
      setWarning('رقم كشف الاستقبال مطلوب')
      return
    }
    setIsFetchingInfo(true)
    try {
      const { data } = await Shared.apiClient.get(`/haj/receptions/${receptionId}/by_number`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': currentLocale ?? 'ar'
        }
      })

      const info = data?.data ?? data
      if (!info) {
        setShowReceptionData(false)
        setWarning('يرجى التأكد من رقم بيان الاستقبال')
        return
      }

      // ─── Helper: only set if value is not null/undefined ──────────────────
      const setIfPresent = (field: string, value: any) => {
        if (value !== undefined && value !== null) setValue(field as any, value)
      }

      // — reception information
      setIfPresent('reception_date', info.reception_date)
      setIfPresent('reception_city_id', info.reception_city?.name_ar)
      setIfPresent('reception_department_id', info?.reception_department?.department_name_ar)
      setIfPresent('service_department_id', info.service_department?.department_name_ar)
      setIfPresent('port_id', info?.port?.port_name_ar)
      setIfPresent('path_id', info.path.name_ar)

      if (fetchType === '2') {
        // — applicant data (only for type 2)
        if (
          String(info.reception_type) === '1' &&
          info?.manifest &&
          info?.manifest?.arrivalManifestApplicant.length > 0
        ) {
          const updated = info.manifest.arrivalManifestApplicant.map((item: any) => ({
            nation_id: item.applicant?.ad_current_nationality_id,
            passport_no: item.applicant?.ad_passport_no,
            passport_unit_id: passportUnit,
            department_id: ownerDepartment,
            // applicant_data_id: item.applicant?.ad_application_no,
            applicant_data_id: item.applicant?.ad_full_name_ar ?? item.applicant?.ad_full_name_en,
            ad_gender: item.applicant?.ad_gender,
            ad_date_of_birth: item.applicant?.ad_date_of_birth,
            reception_no: receptionId
          }))
          updateDetailsData('hajjees', updated)
        } else if (
          String(info.reception_type) === '2' &&
          info?.tafweej_departure_manifest &&
          info?.tafweej_departure_manifest?.tafweej_departure_manifest_details.length > 0
        ) {
          const updated = info?.tafweej_departure_manifest?.tafweej_departure_manifest_details?.map((item: any) => ({
            nation_id: item.applicant?.ad_current_nationality_id,
            passport_no: item.applicant?.ad_passport_no,
            applicant_data_id: item.applicant?.ad_full_name_ar ?? item.applicant?.ad_full_name_en,
            ad_gender: item.applicant?.ad_gender,
            ad_date_of_birth: item.applicant?.ad_date_of_birth,
            passport_unit_id: passportUnit,
            department_id: ownerDepartment,
            reception_no: receptionId
          }))
          updateDetailsData('hajjees', updated)
        }
      }

      setTimeout(() => {
        setShowReceptionData(true)
      }, 2000)
    } catch (err: any) {
      setShowReceptionData(false)
      setWarning(err?.response.data.message ?? 'يرجى التأكد من رقم بيان الاستقبال')

      console.error('Failed to fetch reception info:', err)
    } finally {
      setIsFetchingInfo(false)
    }
  }, [getValues, accessToken, currentLocale, setValue, setDetailsData, ownerDepartment, passportUnit])

  const checkPassport = async (val: any, rowIndex: number) => {
    try {
      const { data } = await Shared.apiClient.post(
        `/haj/applicants/data`,
        {
          any: { ad_passport_no: val }
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': currentLocale ?? 'ar'
          }
        }
      )

      if (data.data.length === 0) {
        setDetailError('hajjees', rowIndex, 'passport_no', 'يرجى التأكد من رقم الجواز')
      } else {
        let result = data.data[0]
        setDetailError('hajjees', rowIndex, 'passport_no', '')
        const row = detailsData?.hajjees[rowIndex]

        updateDetailsData(
          'hajjees',
          {
            ...row,
            applicant_data_id: result['ad_full_name_ar'] ?? result['ad_full_name_en'],
            ad_date_of_birth: result['ad_date_of_birth'],
            ad_gender: result['ad_gender']
          },
          rowIndex
        )
      }
    } catch (err) {
      setDetailError('hajjees', rowIndex, 'passport_no', 'حدث خطأ أثناء التحقق')
    }
  }



  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid size={{ xs: 12 }}>
        <Shared.Header
          locale={locale}
          title={`passport_unit_type`}
          mode={mode}
          onMenuOptionClick={handleMenuOptionClick}
          onCancel={handleCancel}
          showOnlyOptions={['add', 'search', 'print',]}

        />
      </Shared.Grid>
      <Shared.Grid container spacing={2}>
        {mode === 'add' && (
          <>
            <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
              <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }} className='previewCard'>
              <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <style>{pulseKeyframes}</style>
              <Shared.Button
                color='info'
                onClick={handleGetInfo}
                disabled={isFetchingInfo}
                startIcon={
                  isFetchingInfo ? (
                    <Shared.CircularProgress size={20} color='inherit' />
                  ) : (
                    <i className='ri-information-line' />
                  )
                }
                sx={actionButtonStyles}
              >
                {dictionary?.titles?.get_info || 'جلب البيانات'}
              </Shared.Button>
            </Shared.Grid>

            {showReceptionData && (
              <>
                <Shared.Grid size={{ xs: 12 }} className='previewCard'>
                  <Shared.FormComponent
                    headerConfig={{ title: 'reception_information' }}
                    locale={currentLocale}
                    fields={receptionFields}
                    mode={mode}
                    screenMode={mode}
                  />
                </Shared.Grid>

                <Shared.Grid size={{ xs: 12 }} className='previewCard'>
                  <Shared.FormComponent
                    headerConfig={{ title: 'passports_details' }}
                    locale={currentLocale}
                    fields={dynamicPassportSettingsFields}
                    mode={mode}
                    screenMode={mode}
                  />
                </Shared.Grid>

                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.DynamicFormTable
                    fields={passportNationFields}
                    title='passports'
                    initialData={detailsData['hajjees']} // Pass the details data
                    onDataChange={detailsHandlers?.hajjees}
                    mode={mode}
                    errors={getDetailsErrors('hajjees')}
                    apiEndPoint={`/haj/handover-types/${dataModel.id}/hajjees`}
                    detailsKey='hajjees'
                    locale={locale}
                    onNewRow={updateNewRow}
                    onChangeRow={(row, rowIndex, object = {}) => {

                      const formValues = getValues() as any

                      const receptionId = formValues['reception_no']
                      if (receptionId) {
                        const updatedRow = {
                          ...row,
                          passport_unit_id: passportUnit,
                          department_id: ownerDepartment,
                          reception_no: receptionId,
                        }

                        updateDetailsData('hajjees', updatedRow, rowIndex)
                      }
                    }}
                    dataObject={dataModel}
                  />
                </Shared.Grid>
              </>
            )}
          </>
        )}

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'basic_information' }}
            fields={[...basicInformationFields]}
            mode={mode}
            screenMode={mode}
          />
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'hajj_representative_spc' }}
            fields={[...hajjRepresentativeSpcFields]}
            mode={mode}
            screenMode={mode}
            showHeaderPrint={false}
            showTitlePrint={false}
          />
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'save_locations' }}
            fields={[...viewSectionFields]}
            mode={mode}
            screenMode={mode}
            showHeaderPrint={false}
            showTitlePrint={false}
          />
        </Shared.Grid>

        {(mode === 'show' || mode === 'edit') && (
          <>
            <Shared.Grid size={{ xs: 12 }} className='previewCard'>
              <Shared.FormComponent
                locale={locale}
                headerConfig={{ title: 'basic_information' }}
                fields={basicInformationFields}
                mode={mode}
                screenMode={mode}
                printForm={false}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }} className='previewCard'>
              <Shared.FormComponent
                locale={locale}
                headerConfig={{ title: 'hajj_representative_spc' }}
                fields={hajjRepresentativeSpcFields}
                mode={mode}
                screenMode={mode}
                printForm={false}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }} className='previewCard'>
              <Shared.FormComponent
                locale={locale}
                headerConfig={{ title: 'save_locations' }} // مواقع الحفظ
                fields={viewSectionFields}
                mode={mode}
                screenMode={mode}
                printForm={false}
                dataObject={dataModel}
              />
            </Shared.Grid>
          </>
        )}

        {mode === 'search' && (
          // <Shared.Grid size={{ xs: 12 }}>
          //   <Shared.FormComponent
          //     locale={locale}
          //     fields={searchFields}
          //     mode={mode}
          //     screenMode={mode}
          //     headerConfig={{ title: 'personal_info' }}
          //   />
          // </Shared.Grid>

          <>
            <Shared.Grid size={{ xs: 12 }} className='previewCard'>
              <Shared.FormComponent
                locale={locale}
                headerConfig={{ title: 'basic_information' }}
                fields={basicInformationFields}
                mode={mode}
                screenMode={mode}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }} className='previewCard'>
              <Shared.FormComponent
                locale={locale}
                headerConfig={{ title: 'hajj_representative_spc' }}
                fields={hajjRepresentativeSpcFields}
                mode={mode}
                screenMode={mode}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }} className='previewCard'>
              <Shared.FormComponent
                locale={locale}
                headerConfig={{ title: 'save_locations' }} // مواقع الحفظ
                fields={viewSectionFields}
                mode={mode}
                screenMode={mode}
              />
            </Shared.Grid>
          </>
        )}
        {/* {mode === 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={statusFields}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'status' }}
            />
          </Shared.Grid>
        )} */}

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

const pulseKeyframes = `
  @keyframes pulse-info {
    0%   { box-shadow: 0 0 0 0 rgba(38, 198, 249, 0.4); transform: scale(1); }
    50%  { box-shadow: 0 0 0 10px rgba(38, 198, 249, 0); transform: scale(1.02); }
    100% { box-shadow: 0 0 0 0 rgba(38, 198, 249, 0); transform: scale(1); }
  }
`

const actionButtonStyles = {
  px: 6,
  py: 2,
  borderRadius: 'var(--mui-shape-customBorderRadius-md)',
  fontWeight: 300,
  fontSize: '0.95rem',
  textTransform: 'none',
  letterSpacing: '0.02em',
  background: (theme: any) =>
    `linear-gradient(135deg, ${theme.palette.info.main}15 0%, ${theme.palette.info.main}05 100%)`,
  border: (theme: any) => `1px solid ${theme.palette.info.main}30`,
  animation: 'pulse-info 2.5s infinite ease-in-out',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: (theme: any) => `${theme.palette.info.main}25`,
    borderColor: 'info.main',
    transform: 'translateY(-2px)',
    boxShadow: (theme: any) => `0 6px 20px -5px ${theme.palette.info.main}40`
  },
  '&:active': { transform: 'translateY(0)' }
}

export default LinkPassportReceptionDetailsPage
