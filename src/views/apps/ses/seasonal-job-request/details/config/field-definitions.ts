import * as Shared from '@/shared'
import ConfirmModal from '@/components/shared/ConfirmModal'

/**
 * Helper function to create mode condition for user scope
 */
const createScopeModeCondition =
  (scope?: string) =>
  (mode: Shared.Mode): Shared.Mode => {
    // interviewer always show

    if (mode == 'search') return 'search'

    if (scope === 'interviewer') return 'show'

    // user logic
    if (scope === 'user') {
      return 'show'
    }

    // default behavior
    return mode
  }

/**
 * Gender options
 */

// move it to common static list  camelcase
/**
 * Creates all form field definitions
 */
export const createFormFields = (scope: string): Shared.DynamicFormFieldProps[] => [
  // Personal Picture & Files
  {
    name: 'personal_picture',
    label: '',
    type: 'personal_picture',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 12,
    visibleModes: ['add', 'edit', 'show'],
    onChange: () => {}
  },
  {
    name: 'files',
    label: '',
    type: 'storage',
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 12,
    visibleModes: ['add', 'edit']
  },

  // Basic Information
  {
    name: 'season',
    label: 'season',
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'request_no',
    label: 'request_no',
    type: 'number',
    gridSize: 4,
    autoFill: true,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'personal_id',
    label: 'personal_id',
    type: 'select',
    apiUrl: '/def/personal',
    labelProp: 'id',
    keyProp: 'id',
    modeCondition: createScopeModeCondition(scope),
    displayProps: ['id_no', 'full_name_ar'],
    gridSize: 4,
    cache: false,
    viewProp: 'personal_id',
    searchProps: ['id_no', 'full_name_ar', 'id']
  },

  // Arabic Name Fields
  {
    name: 'fir_name_ar',
    label: 'fir_name_ar',
    type: 'text',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.fir_name_ar',
    editProp: 'personal.fir_name_ar'
  },
  {
    name: 'far_name_ar',
    label: 'far_name_ar',
    type: 'text',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.far_name_ar',
    editProp: 'personal.far_name_ar'
  },
  {
    name: 'gra_name_ar',
    label: 'gra_name_ar',
    type: 'text',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.gra_name_ar',
    editProp: 'personal.gra_name_ar'
  },
  {
    name: 'fam_name_ar',
    label: 'fam_name_ar',
    type: 'text',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,

    viewProp: 'personal.fam_name_ar',
    editProp: 'personal.fam_name_ar'
  },

  // Latin Name Fields
  {
    name: 'fir_name_la',
    label: 'fir_name_la',
    type: 'text',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.fir_name_la',
    editProp: 'personal.fir_name_la'
  },
  {
    name: 'far_name_la',
    label: 'far_name_la',
    type: 'text',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.far_name_la',
    editProp: 'personal.far_name_la'
  },
  {
    name: 'gra_name_la',
    label: 'gra_name_la',
    type: 'text',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.gra_name_la',
    editProp: 'personal.gra_name_la'
  },
  {
    name: 'fam_name_la',
    label: 'fam_name_la',
    type: 'text',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.fam_name_la',
    editProp: 'personal.fam_name_la'
  },

  // Nationality & Birth Information
  {
    name: 'nation_id',
    label: 'nation_id',
    type: 'select',
    apiUrl: '/def/nationalities',
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.nationality.name_ar',
    editProp: 'personal.nation_id'
  },
  {
    name: 'birth_date',
    label: 'birth_date',
    type: 'date',
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    // modal: 'personal',
    viewProp: 'personal.birth_date',
    editProp: 'personal.birth_date'
  },
  {
    name: 'birth_place',
    label: 'birth_place',
    type: 'text',
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 6,
    // modal: 'personal',
    viewProp: 'personal.birth_place',
    editProp: 'personal.birth_place'
  },

  // Qualification Information
  {
    name: 'qualification_id',
    label: 'qualification_id',
    type: 'select',
    apiUrl: '/def/qualifications',
    viewProp: 'qualification.qualification_name',
    labelProp: 'qualification_name',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 4
    // modal: 'personal'
  },
  {
    name: 'speciality',
    label: 'speciality',
    type: 'text',
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'qualify_date',
    label: 'qualify_date',
    type: 'date',
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    modal: 'personal'
  },

  // Personal Details
  {
    name: 'merital_status',
    label: 'merital_status',
    type: 'select',
    options: Shared.maritalStatusList,
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    modal: 'personal'
  },
  {
    name: 'gender',
    label: 'gender',
    type: 'select',
    options: Shared.genderOptions,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 4,
    modal: 'personal',
    viewProp: 'personal.gender',
    editProp: 'personal.gender'
  },
  {
    name: 'blood_type',
    label: 'blood_type',
    type: 'select',
    options: Shared.bloodTypeList,
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    modal: 'personal',
    viewProp: 'personal.blood_type'
  },

  // Identity Information
  {
    name: 'id_type',
    label: 'id_type',
    type: 'select',
    options: Shared.identityTypeList,
    modeCondition: createScopeModeCondition(scope),
    gridSize: 3,
    modal: 'personal'
  },
  {
    name: 'id_no',
    label: 'id_no',
    type: 'text',
    gridSize: 3,
    modeCondition: createScopeModeCondition(scope)
    // modal: 'personal'
  },
  {
    name: 'id_issue_date',
    label: 'id_issue_date',
    type: 'date',
    gridSize: 3,
    modeCondition: createScopeModeCondition(scope)
    // modal: 'personal'
  },
  {
    name: 'id_exp_date',
    label: 'id_exp_date',
    type: 'date',
    gridSize: 3,
    modeCondition: createScopeModeCondition(scope)
    // modal: 'personal'
  },
  {
    name: 'id_file',
    label: 'id_file',
    type: 'file',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    visibleModes: ['add', 'edit', 'show'],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 4
  },

  // Languages
  {
    name: 'request_languages',
    label: 'request_languages',
    type: 'select',
    multipleKeyProp: 'id',
    apiUrl: '/def/languages',
    labelProp: 'lang_name_ar',
    viewProp: 'request_languages',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    lovKeyName: 'lang_name_ar',
    multiple: true,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    keyProp: 'id',
    gridSize: 12,
    submitLovKeyProp: 'id'
  },

  // Contact Information
  {
    name: 'mobile',
    label: 'mobile',
    type: 'mobile',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 3
  },
  {
    name: 'e_mail',
    label: 'e_mail',
    type: 'email',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'mobile_verified',
    label: 'mobile',
    type: 'storage',
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'email_verified',
    label: '',
    type: 'storage',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'home_tel_no',
    label: 'home_tel_no',
    type: 'mobile',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'home_tel_fax',
    label: 'home_tel_fax',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'first_contact',
    label: 'first_contact',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'contact_no1',
    label: 'contact_no1',
    type: 'mobile',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'second_contact',
    label: 'second_contact',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'contact_no2',
    label: 'contact_no2',
    type: 'mobile',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },

  // Address Information
  {
    name: 'street_name',
    label: 'street_name',
    type: 'text',
    visible: false,
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'additional_no',
    label: 'additional_no',
    visible: false,
    type: 'number',
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'home_address',
    label: 'home_address',
    visible: false,
    type: 'text',
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'p_o_box',
    label: 'p_o_box',
    visible: false,
    type: 'text',
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'bin_code',
    label: 'bin_code_ad',
    type: 'text',
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : []
  },
  {
    name: 'short_address',
    label: 'short_address',
    type: 'text',
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : []
  },
  {
    name: 'district_name',
    label: 'district_name',
    type: 'text',
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : []
  },
  {
    name: 'building_no',
    label: 'building_no',
    type: 'number',
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : []
  },
  {
    name: 'postal_code',
    label: 'postal_code',
    type: 'text',
    gridSize: 6,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : []
  },
  {
    name: 'city_id',
    label: 'city',
    type: 'select',
    apiUrl: '/def/cities',
    labelProp: 'name_ar',
    keyProp: 'id',
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 6,
    viewProp: 'city.name_ar',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    queryParams: { country_id: '966' }
    // searchMode: 'and'
  },
  {
    name: 'national_address_file',
    label: 'national_address_file',
    visibleModes: ['add', 'edit', 'show'],
    type: 'file',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 6
  },

  // Bank Information
  {
    name: 'bank_id',
    label: 'bank_code',
    type: 'select',
    apiUrl: '/def/banks',
    labelProp: 'name_ar',
    keyProp: 'id',
    gridSize: 4,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    viewProp: 'bank.name_ar'
  },
  {
    name: 'iban_no',
    label: 'iban',
    type: 'iban',
    gridSize: 4,
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    acceptedIbans: ['SA'],
    validateIban: true
  },
  {
    name: 'bank_iban_file',
    label: 'iban_file',
    visibleModes: ['add', 'edit', 'show'],
    type: 'file',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 4
  },

  // Job Information
  {
    name: 'emp_status_id',
    label: 'emp_status_id',
    type: 'select',
    options: Shared.employmentStatusList,
    gridSize: 3,
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'job_destination',
    label: 'job_destination',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'occupation_title',
    label: 'occupation_title',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'job_address',
    label: 'job_address',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'job_mobile',
    label: 'job_mobile',
    type: 'mobile',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'job_fax_no',
    label: 'job_fax_no',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    visible: false
  },
  {
    name: 'work_ability_status',
    label: 'work_ability_status',
    type: 'select',
    options: Shared.workAbilityStatusList,
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 3
  },
  {
    name: 'off_mail',
    label: 'off_mail',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    visible: false
  },
  {
    name: 'job_p_o_box',
    label: 'job_p_o_box',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    visible: false
  },
  {
    name: 'job_bin_code',
    label: 'job_bin_code',
    type: 'text',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    visible: false
  },

  // Experience Information
  {
    name: 'is_hajj_experienced',
    label: 'is_hajj_experienced',
    type: 'select',
    options: Shared.yesNoList,
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'hajj_experience_years',
    label: 'hajj_experience_years',
    type: 'number',
    gridSize: 3,
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode)
  },
  {
    name: 'experience_certificate',
    label: 'contract_file',
    visibleModes: ['add', 'edit', 'show'],
    type: 'file',
    // requiredModes: ['add', 'edit'],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 4
  },
  {
    name: 'resume',
    label: 'resume_file',
    visibleModes: ['add', 'edit', 'show'],
    type: 'file',
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    gridSize: 4
  },

  // General Conditions
  {
    name: 'general_conditions',
    label: 'agree_general_conditions',
    modeCondition: (mode: Shared.Mode) => (scope === 'interviewer' && mode !== 'search' ? 'show' : mode),
    type: 'checkbox',
    defaultValue: null,
    options: [{ value: 'true', label: 'agree_general_conditions' }],
    requiredModes: scope !== 'interviewer' ? ['add', 'edit'] : [],
    modalConfig: {
      open: true,
      title: 'general_conditions',
      names: ['general_conditions', 'privacy_policy', 'terms_conditions'],
      description: 'general_conditions.html',
      icon: '✏️',
      confirmText: 'confirm',
      cancelText: 'cancel',
      component: ConfirmModal,
      props: { extraProp: 123 },
      onConfirm: () => console.log('Confirmed!'),
      onClose: () => console.log('Closed!')
    },
    onChange: value => console.log('Selected:', value),
    gridSize: 12,
    isStaticProp: true
  }
]

/**
 * Experience table field definitions
 */
export const experienceFields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: 'experience_season',
    label: 'exp_season',
    type: 'number',
    maxLength: 4,
    width: '20%',
    modeCondition: (mode: Shared.Mode) => mode
  },
  {
    name: 'job_title',
    label: 'occupation_title',
    type: 'text',
    width: '20%',
    modeCondition: (mode: Shared.Mode) => mode
  },
  {
    name: 'company_name',
    label: 'company_name',
    type: 'text',
    width: '50%',
    modeCondition: (mode: Shared.Mode) => mode
  }
]

/**
 * Course table field definitions
 */
export const courseFields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: 'course_year',
    label: 'course_year',
    type: 'number',
    width: '15%',
    modeCondition: (mode: Shared.Mode) => mode
  },
  {
    name: 'course_hours',
    label: 'course_hours',
    type: 'number',
    width: '15%',
    modeCondition: (mode: Shared.Mode) => mode
  },
  {
    name: 'course_name',
    label: 'course_name',
    type: 'text',
    width: '50%',
    modeCondition: (mode: Shared.Mode) => mode
  }
]

export const interviewFields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: '_department_name_ar',
    label: 'approval_department_name',
    type: 'text',
    // modeCondition: createScopeModeCondition(scope),
    modeCondition: (mode: Shared.Mode) => 'show',
    visibleModes: ['show'],
    gridSize: 4,
    modal: 'personal',
    viewProp: 'approval_department.department_name_ar'
  },
  {
    name: '_approval_personal_name',
    label: 'approval_personal_name',
    type: 'text',
    // modeCondition: createScopeModeCondition(scope),
    modeCondition: (mode: Shared.Mode) => 'show',
    visibleModes: ['show'],
    gridSize: 4,
    modal: 'personal',
    viewProp: 'approval_personal.full_name_ar'
  },
  {
    name: 'approval_date',
    label: 'approval_date',
    type: 'date',
    // modeCondition: createScopeModeCondition(scope),
    modeCondition: (mode: Shared.Mode) => 'show',
    visibleModes: ['show'],
    gridSize: 4,
    modal: 'personal'
  },
  // {
  //   name: '_approval_personal_id_no',
  //   label: 'approval_personal_id_no',
  //   type: 'text',
  //   // modeCondition: createScopeModeCondition(scope),
  //   modeCondition: (mode: Shared.Mode) => 'show',
  //   visibleModes: ['show'],
  //   gridSize: 3,
  //   modal: 'personal',
  //   viewProp: 'approval_personal.id_no'
  // },
  // {
  //   name: '_approval_personal_mobile',
  //   label: 'approval_personal_mobile',
  //   type: 'text',
  //   // modeCondition: createScopeModeCondition(scope),
  //   modeCondition: (mode: Shared.Mode) => 'show',
  //   visibleModes: ['show'],
  //   gridSize: 3,
  //   modal: 'personal',
  //   viewProp: 'approval_personal.mobile'
  // },

  {
    name: 'reviewed_approval_status',
    label: 'reviewed_approval_status',
    type: 'select',
    options: Shared.interviewerReviewedStatusList,
    gridSize: 3,
    visibleModes: ['search']
  },
  {
    name: 'note',
    label: 'notes',
    type: 'textarea',
    requiredModes: [],
    modeCondition: (mode: Shared.Mode) => mode,
    gridSize: 12
  }
]

export const interviewTableFields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: 'job_id',
    label: 'job',
    type: 'select',
    apiUrl: '/sys/list/21',
    labelProp: 'name',
    keyProp: 'job_id',
    required: true,
    width: '30%',
    apiMethod: 'GET',
    viewProp: 'name'
  },
  {
    name: 'department_id',
    label: 'hr_current_department',
    type: 'select',
    apiUrl: '/def/seasonal-departments',
    labelProp: 'department_name_ar',
    keyProp: 'department_id',
    queryParams: { internal_department: true },
    width: '30%',
    // modeCondition: (mode: Shared.Mode) => (departmentOptions.length > 1 ? mode : 'show'),
    requiredModes: ['add', 'edit'],
    gridSize: 6,
    viewProp: 'department_name_ar',
    onChange(value: any) {}
  }
]
